/**
 * ═══════════════════════════════════════════════════
 * SMART RENTAL - MASTER SCRIPT (Google Apps Script)
 * ═══════════════════════════════════════════════════
 * 
 * HƯỚNG DẪN DEPLOY:
 * 1. Mở https://script.google.com
 * 2. Tạo project mới, paste code này vào
 * 3. Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy URL → paste vào AdminSettings trong app
 * 
 * CHỨC NĂNG:
 * - POST: Tạo mới / Cập nhật / Xóa dữ liệu trên Google Sheet
 * - GET:  Lấy toàn bộ dữ liệu / Lấy ảnh CCCD
 * 
 * ACTIONS (GET):
 *   getAllData      — Trả về toàn bộ data của Host từ Sheet
 *   getCustomerImages — Lấy ảnh CCCD/avatar 1 khách
 * 
 * ACTIONS (POST):
 *   createSheet     — Tạo Google Sheet mới cho Host
 *   upsertRow       — Thêm hoặc cập nhật 1 dòng trong tab
 *   deleteRow       — Xóa 1 dòng theo ID
 *   batchSync       — Đồng bộ hàng loạt (toàn bộ data)
 *   uploadImage     — Upload ảnh base64 lên Google Drive
 */

// ═══ CONFIG ═══
var MASTER_FOLDER_NAME = 'SmartRental_HostData';
var IMAGE_FOLDER_NAME = 'SmartRental_Images';
var BACKUP_FOLDER_NAME = 'SmartRental_Backups';
var DAILY_BACKUP_HANDLER = 'runDailyBackupJob';
var DAILY_BACKUP_CONFIG_KEY = 'SMART_RENTAL_DAILY_BACKUP_CONFIG';
var DAILY_BACKUP_LAST_RESULT_KEY = 'SMART_RENTAL_DAILY_BACKUP_LAST_RESULT';
var DEFAULT_BACKUP_HOUR = 2;
var DEFAULT_BACKUP_RETENTION_DAYS = 0;
var PAYMENT_GATEWAY_CONFIG_PREFIX = 'SMART_RENTAL_PAYMENT_GATEWAY_';
var PAYMENT_NOTIFICATION_QUEUE_PREFIX = 'SMART_RENTAL_PAYMENT_NOTIFICATIONS_';
var PAYMENT_NOTIFICATION_LIMIT = 50;

// Tab names mapping
var TAB_CONFIG = {
  buildings: { name: 'Tài sản nhà', headers: ['ID', 'TÊN', 'ĐỊA CHỈ', 'LOẠI HÌNH', 'SỐ TẦNG', 'CHI PHÍ THUÊ', 'NGÀY BĐ THUÊ', 'NGÀY KT THUÊ', 'HOST_ID', 'CREATED_AT'] },
  rooms: { name: 'Phòng trọ', headers: ['ID', 'TÊN', 'GIÁ THUÊ', 'TẦNG', 'TRẠNG THÁI', 'MÃ TÒA NHÀ', 'POS_X', 'POS_Y', 'HOST_ID', 'CREATED_AT'] },
  customers: { name: 'Khách thuê', headers: ['ID', 'HỌ TÊN', 'SỐ ĐT', 'EMAIL', 'ZALO', 'SỐ CCCD', 'NGÀY CẤP', 'NƠI CẤP', 'ẢNH MẶT TRƯỚC', 'ẢNH MẶT SAU', 'ẢNH CÁ NHÂN', 'NGÀY SINH', 'GIỚI TÍNH', 'QUỐC TỊCH', 'NGUYÊN QUÁN', 'ĐỊA CHỈ THƯỜNG TRÚ', 'ĐỊA CHỈ TẠM TRÚ', 'NGHỀ NGHIỆP', 'QR_CODE_DATA', 'GHI CHÚ', 'HOST_ID', 'CREATED_AT'] },
  contracts: { name: 'Hợp đồng', headers: ['ID', 'MÃ PHÒNG', 'MÃ KH', 'NGÀY BĐ', 'THỜI HẠN', 'GIÁ THUÊ', 'GIÁ ĐIỆN', 'GIÁ NƯỚC', 'GIÁ INTERNET', 'DỊCH VỤ THÊM', 'CÒN HIỆU LỰC', 'NGÀY KẾT THÚC', 'HOST_ID', 'CREATED_AT'] },
  payments: { name: 'Thanh toán', headers: ['ID', 'MÃ HĐ', 'SỐ TIỀN', 'LOẠI', 'KỲ', 'HẠN ĐÓNG', 'TRẠNG THÁI', 'NGÀY ĐÓNG', 'MÔ TẢ', 'NHÓM', 'LUỒNG TIỀN', 'NGÀY HẠCH TOÁN', 'ĐÃ THU', 'CÒN LẠI', 'THU LẦN CUỐI'] },
  equipment: { name: 'Trang thiết bị', headers: ['ID', 'TÊN', 'TRẠNG THÁI', 'MÃ TÒA NHÀ', 'MÃ PHÒNG', 'NGÀY MUA', 'GIÁ TIỀN', 'GHI CHÚ', 'THỜI GIAN KHẤU HAO', 'GIÁ TRỊ THU HỒI', 'GIÁ TRỊ HIỆN TẠI', 'NGÀY ĐỊNH GIÁ', 'LỊCH SỬ BẢO TRÌ', 'HOST_ID', 'CREATED_AT'] },
  serviceRecords: { name: 'Chỉ số dịch vụ', headers: ['ID', 'ROOM_ID', 'PERIOD', 'ELECTRIC_OLD', 'ELECTRIC_NEW', 'ELECTRIC_USAGE', 'WATER_OLD', 'WATER_NEW', 'WATER_USAGE', 'INTERNET', 'OTHER', 'TOTAL', 'RECORDED_AT'] }
};

var EXTRA_TAB_HEADERS = {
  customers: ['RESIDENCE_ADDRESS', 'DECLARATION_CREATED', 'DECLARATION_CREATED_AT', 'DECLARATION_STATUS'],
  payments: ['BILL_ID', 'BILL_STATUS', 'PAYMENT_METHOD', 'GATEWAY_TRANSACTION_ID'],
  serviceRecords: ['ELECTRIC_RECORDED_AT', 'WATER_RECORDED_AT', 'NOTE']
};

function getTabHeaders_(tabKey) {
  var config = TAB_CONFIG[tabKey];
  if (!config) return [];
  var extra = EXTRA_TAB_HEADERS[tabKey] || [];
  return config.headers.concat(extra);
}

function getMasterFolder() {
  var folders = DriveApp.getFoldersByName(MASTER_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(MASTER_FOLDER_NAME);
}

function getImageFolder() {
  var master = getMasterFolder();
  var folders = master.getFoldersByName(IMAGE_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return master.createFolder(IMAGE_FOLDER_NAME);
}

function getBackupRootFolder() {
  var master = getMasterFolder();
  var folders = master.getFoldersByName(BACKUP_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return master.createFolder(BACKUP_FOLDER_NAME);
}

// ═══════════════════════════════════════
// GET HANDLER
// ═══════════════════════════════════════
function doGet(e) {
  try {
    var action = e.parameter.action;

    if (action === 'getAllData') {
      return handleGetAllData(e.parameter.sheetId);
    }

    if (action === 'getCustomerImages') {
      return handleGetCustomerImages(e.parameter.sheetId, e.parameter.customerId);
    }

    if (action === 'findSheet') {
      return handleFindSheet(e.parameter.hostId);
    }

    if (action === 'backupStatus') {
      return handleBackupStatus();
    }

    if (action === 'getPaymentNotifications') {
      return handleGetPaymentNotifications(e.parameter.hostId, e.parameter.token);
    }

    // Default: health check
    return jsonResponse({ success: true, message: 'SmartRental MasterScript v2 is running.', timestamp: new Date().toISOString() });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// ═══════════════════════════════════════
// POST HANDLER
// ═══════════════════════════════════════
function doPost(e) {
  try {
    if (e && e.parameter && e.parameter.action === 'paymentWebhook') {
      return handlePaymentWebhook(e);
    }

    var rawBody = (e && e.postData && e.postData.contents) || '{}';
    var data = JSON.parse(rawBody);
    var action = data.action || 'createSheet';

    switch (action) {
      case 'createSheet':
        return handleCreateSheet(data);
      case 'upsertRow':
        return handleUpsertRow(data);
      case 'deleteRow':
        return handleDeleteRow(data);
      case 'batchSync':
        return handleBatchSync(data);
      case 'uploadImage':
        return handleUploadImage(data);
      case 'setupDailyBackup':
        return handleSetupDailyBackup(data);
      case 'runBackupNow':
        return handleRunBackupNow(data);
      case 'registerPaymentGateway':
        return handleRegisterPaymentGateway(data);
      default:
        return jsonResponse({ success: false, error: 'Unknown action: ' + action });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// ═══════════════════════════════════════
// ACTION: getAllData — Trả toàn bộ data từ Sheet
// ═══════════════════════════════════════
function handleGetAllData(sheetId) {
  if (!sheetId) return jsonResponse({ success: false, error: 'Missing sheetId' });

  try {
    ensureDailyBackupBootstrap_();
  } catch (backupErr) {
    Logger.log('Daily backup bootstrap failed during getAllData: ' + backupErr);
  }

  var ss = SpreadsheetApp.openById(sheetId);
  var result = { success: true, data: {}, timestamp: new Date().toISOString() };

  // Parse each tab
  var tabMap = {
    buildings: 'Tài sản nhà',
    rooms: 'Phòng trọ',
    customers: 'Khách thuê',
    contracts: 'Hợp đồng',
    payments: 'Thanh toán',
    equipment: 'Trang thiết bị',
    serviceRecords: 'Chỉ số dịch vụ'
  };

  for (var key in tabMap) {
    var sheet = ss.getSheetByName(tabMap[key]);
    if (sheet && sheet.getLastRow() > 1) {
      result.data[key] = sheetToArray(sheet);
    } else {
      result.data[key] = [];
    }
  }

  return jsonResponse(result);
}

// Convert a sheet tab (with header row) to array of objects
function sheetToArray(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    rows.push(row);
  }
  return rows;
}

// ═══════════════════════════════════════
// ACTION: getCustomerImages
// ═══════════════════════════════════════
function handleGetCustomerImages(sheetId, customerId) {
  if (!sheetId || !customerId) return jsonResponse({ success: false, error: 'Missing params' });

  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName('Khách thuê');
  if (!sheet) return jsonResponse({ success: false, error: 'Sheet "Khách thuê" not found' });

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === customerId) {
      return jsonResponse({
        success: true,
        customerId: customerId,
        name: data[i][1],
        idFrontImage: data[i][8] || '',
        idBackImage: data[i][9] || '',
        avatarImage: data[i][10] || ''
      });
    }
  }
  return jsonResponse({ success: false, error: 'Customer not found: ' + customerId });
}

// ═══════════════════════════════════════
// ACTION: findSheet — Tìm sheet theo hostId
// ═══════════════════════════════════════
function handleFindSheet(hostId) {
  if (!hostId) return jsonResponse({ success: false, error: 'Missing hostId' });
  var folder = getMasterFolder();
  var files = folder.searchFiles("title contains '" + hostId + "'");
  if (files.hasNext()) {
    var file = files.next();
    return jsonResponse({ success: true, spreadsheetId: file.getId(), spreadsheetUrl: file.getUrl() });
  }
  return jsonResponse({ success: false, error: 'Sheet not found for host: ' + hostId });
}

// ═══════════════════════════════════════
// ACTION: createSheet — Tạo mới Sheet cho Host
// ═══════════════════════════════════════
function handleCreateSheet(data) {
  var hostId = data.hostId;
  var hostName = data.hostName;

  var ss = SpreadsheetApp.create('[SmartRental] ' + hostName + ' - ' + hostId);
  var file = DriveApp.getFileById(ss.getId());
  var folder = getMasterFolder();
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);

  // Create all tabs with headers
  var first = true;
  for (var key in TAB_CONFIG) {
    var config = TAB_CONFIG[key];
    var sheet;
    if (first) {
      sheet = ss.getSheets()[0];
      sheet.setName(config.name);
      first = false;
    } else {
      sheet = ss.insertSheet(config.name);
    }
    sheet.appendRow(getTabHeaders_(key));
    formatHeader(sheet, getTabHeaders_(key).length);
  }

  // Write initial data if provided
  if (data.buildings) writeArrayToTab(ss, 'Tài sản nhà', data.buildings, buildingToRow);
  if (data.rooms) writeArrayToTab(ss, 'Phòng trọ', data.rooms, roomToRow);
  if (data.customers) writeArrayToTab(ss, 'Khách thuê', data.customers, customerToRow);
  if (data.contracts) writeArrayToTab(ss, 'Hợp đồng', data.contracts, contractToRow);
  if (data.payments) writeArrayToTab(ss, 'Thanh toán', data.payments, paymentToRow);
  if (data.equipment) writeArrayToTab(ss, 'Trang thiết bị', data.equipment, equipmentToRow);
  if (data.serviceRecords) writeArrayToTab(ss, 'Chỉ số dịch vụ', data.serviceRecords, serviceRecordToRow);

  // Subscription info tab
  var subSheet = ss.insertSheet('Gói dịch vụ');
  subSheet.appendRow(['THÔNG TIN GÓI DỊCH VỤ']);
  if (data.pricingTier) {
    subSheet.appendRow(['Tên gói', data.pricingTier.name]);
    subSheet.appendRow(['Giá/tháng', data.pricingTier.price]);
    subSheet.appendRow(['Max tòa nhà', data.pricingTier.maxBuildings]);
    subSheet.appendRow(['Max phòng', data.pricingTier.maxRooms]);
  }
  if (data.hostPayments && data.hostPayments.length > 0) {
    subSheet.appendRow(['']);
    subSheet.appendRow(['MÃ', 'KỲ', 'SỐ TIỀN', 'HẠN ĐÓNG', 'TRẠNG THÁI', 'NGÀY ĐÓNG']);
    formatHeader(subSheet, 6, subSheet.getLastRow());
    data.hostPayments.forEach(function(hp) {
      subSheet.appendRow([hp.id, hp.period, hp.amount, hp.dueDate, hp.status, hp.paidDate || '']);
    });
  }

  writeSubscriptionSnapshot_(ss, data);

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  try {
    ensureDailyBackupBootstrap_();
  } catch (backupErr) {
    Logger.log('Daily backup bootstrap failed after createSheet: ' + backupErr);
  }

  return jsonResponse({
    success: true,
    spreadsheetId: ss.getId(),
    spreadsheetUrl: ss.getUrl(),
    message: 'Tạo thành công Google Sheet cho ' + hostName
  });
}

// ═══════════════════════════════════════
// ACTION: upsertRow — Thêm hoặc cập nhật 1 dòng
// ═══════════════════════════════════════
function handleUpsertRow(data) {
  var sheetId = data.sheetId;
  var tabName = data.tab; // e.g. 'buildings', 'rooms', ...
  var record = data.record;

  if (!sheetId || !tabName || !record || !record.id) {
    return jsonResponse({ success: false, error: 'Missing sheetId, tab, or record.id' });
  }

  var config = TAB_CONFIG[tabName];
  if (!config) return jsonResponse({ success: false, error: 'Unknown tab: ' + tabName });

  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName(config.name);
  if (!sheet) return jsonResponse({ success: false, error: 'Tab not found: ' + config.name });
  ensureTabHeaders_(sheet, getTabHeaders_(tabName));

  var rowConverter = getRowConverter(tabName);
  var rowData = rowConverter(record);

  // Find existing row by ID (column 1)
  var dataRange = sheet.getDataRange().getValues();
  var found = false;
  for (var i = 1; i < dataRange.length; i++) {
    if (String(dataRange[i][0]) === String(record.id)) {
      // Update existing row
      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
      found = true;
      break;
    }
  }

  if (!found) {
    // Append new row
    sheet.appendRow(rowData);
  }

  return jsonResponse({ success: true, action: found ? 'updated' : 'inserted', id: record.id });
}

// ═══════════════════════════════════════
// ACTION: deleteRow — Xóa 1 dòng theo ID
// ═══════════════════════════════════════
function handleDeleteRow(data) {
  var sheetId = data.sheetId;
  var tabName = data.tab;
  var recordId = data.recordId;

  if (!sheetId || !tabName || !recordId) {
    return jsonResponse({ success: false, error: 'Missing sheetId, tab, or recordId' });
  }

  var config = TAB_CONFIG[tabName];
  if (!config) return jsonResponse({ success: false, error: 'Unknown tab: ' + tabName });

  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName(config.name);
  if (!sheet) return jsonResponse({ success: false, error: 'Tab not found: ' + config.name });

  var dataRange = sheet.getDataRange().getValues();
  for (var i = 1; i < dataRange.length; i++) {
    if (String(dataRange[i][0]) === String(recordId)) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ success: true, action: 'deleted', id: recordId });
    }
  }

  return jsonResponse({ success: false, error: 'Row not found: ' + recordId });
}

// ═══════════════════════════════════════
// ACTION: batchSync — Đồng bộ toàn bộ data
// ═══════════════════════════════════════
function handleBatchSync(data) {
  var sheetId = data.sheetId;
  if (!sheetId) return jsonResponse({ success: false, error: 'Missing sheetId' });

  var ss = SpreadsheetApp.openById(sheetId);
  var stats = {};

  var tabDataMap = {
    buildings: { items: data.buildings, converter: buildingToRow },
    rooms: { items: data.rooms, converter: roomToRow },
    customers: { items: data.customers, converter: customerToRow },
    contracts: { items: data.contracts, converter: contractToRow },
    payments: { items: data.payments, converter: paymentToRow },
    equipment: { items: data.equipment, converter: equipmentToRow },
    serviceRecords: { items: data.serviceRecords, converter: serviceRecordToRow }
  };

  for (var tabName in tabDataMap) {
    var items = tabDataMap[tabName].items;
    if (!items) { stats[tabName] = 'skipped'; continue; }

    var config = TAB_CONFIG[tabName];
    var sheet = ss.getSheetByName(config.name);
    if (!sheet) {
      sheet = ss.insertSheet(config.name);
      sheet.appendRow(getTabHeaders_(tabName));
      formatHeader(sheet, getTabHeaders_(tabName).length);
    }
    ensureTabHeaders_(sheet, getTabHeaders_(tabName));

    // Clear data rows (keep header)
    if (sheet.getLastRow() > 1) {
      sheet.deleteRows(2, sheet.getLastRow() - 1);
    }

    // Write all items
    var converter = tabDataMap[tabName].converter;
    var rows = items.map(converter);
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    }

    stats[tabName] = rows.length + ' rows';
  }

  if (data.subscriptionSnapshot || data.pricingTier || data.hostPayments) {
    writeSubscriptionSnapshot_(ss, data);
    stats.subscriptionSnapshot = 'updated';
  }

  try {
    ensureDailyBackupBootstrap_();
  } catch (backupErr) {
    Logger.log('Daily backup bootstrap failed after batchSync: ' + backupErr);
  }

  return jsonResponse({ success: true, action: 'batchSync', stats: stats, timestamp: new Date().toISOString() });
}

// ═══════════════════════════════════════
// ACTION: uploadImage — Lưu ảnh lên Google Drive
// ═══════════════════════════════════════
function handleUploadImage(data) {
  var base64 = data.base64;
  var filename = data.filename || ('img_' + Date.now() + '.jpg');
  var mimeType = data.mimeType || 'image/jpeg';

  if (!base64) return jsonResponse({ success: false, error: 'Missing base64 data' });

  // Remove data URI prefix if present
  if (base64.indexOf(',') > -1) {
    base64 = base64.split(',')[1];
  }

  var blob = Utilities.newBlob(Utilities.base64Decode(base64), mimeType, filename);
  var imgFolder = getImageFolder();

  // Organize by host if available
  if (data.hostId) {
    var hostFolders = imgFolder.getFoldersByName(data.hostId);
    if (hostFolders.hasNext()) {
      imgFolder = hostFolders.next();
    } else {
      imgFolder = imgFolder.createFolder(data.hostId);
    }
  }

  var file = imgFolder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // Get direct viewable URL
  var fileId = file.getId();
  var viewUrl = 'https://drive.google.com/uc?id=' + fileId;

  // Also update Sheet if sheetId and customerId provided
  if (data.sheetId && data.customerId && data.imageField) {
    try {
      var ss = SpreadsheetApp.openById(data.sheetId);
      var sheet = ss.getSheetByName('Khách thuê');
      if (sheet) {
        var colMap = { idFrontImage: 9, idBackImage: 10, avatarImage: 11 };
        var col = colMap[data.imageField];
        if (col) {
          var vals = sheet.getDataRange().getValues();
          for (var i = 1; i < vals.length; i++) {
            if (String(vals[i][0]) === String(data.customerId)) {
              sheet.getRange(i + 1, col).setValue(viewUrl);
              break;
            }
          }
        }
      }
    } catch (ignore) { /* best effort */ }
  }

  return jsonResponse({ success: true, fileId: fileId, url: viewUrl, filename: filename });
}

// ═══════════════════════════════════════
// TIME-DRIVEN TRIGGER: Install this manually
// In Script Editor: Edit → Triggers → Add Trigger
//   Function: dailyBatchReconcile
//   Event source: Time-driven → Day timer → 11pm to midnight
// ═══════════════════════════════════════
function handleBackupStatus() {
  return jsonResponse({ success: true, status: getDailyBackupStatus_() });
}

function handleSetupDailyBackup(data) {
  var config = getDailyBackupConfig_();

  if (data && data.enabled === false) {
    removeTriggersByHandler_(DAILY_BACKUP_HANDLER);
    config.enabled = false;
    config.updatedAt = new Date().toISOString();
    config.timezone = Session.getScriptTimeZone();
    saveDailyBackupConfig_(config);
    return jsonResponse({
      success: true,
      message: 'Daily backup disabled',
      status: getDailyBackupStatus_()
    });
  }

  config.enabled = true;
  if (data && data.hour !== undefined) config.hour = normalizeBackupHour_(data.hour);
  if (data && data.retentionDays !== undefined) config.retentionDays = normalizeRetentionDays_(data.retentionDays);
  config.updatedAt = new Date().toISOString();
  config.timezone = Session.getScriptTimeZone();

  ensureDailyBackupTrigger_(config.hour);
  saveDailyBackupConfig_(config);

  return jsonResponse({
    success: true,
    message: 'Daily backup configured',
    status: getDailyBackupStatus_()
  });
}

function handleRunBackupNow(data) {
  var summary = performDailyBackup_({
    source: 'manual',
    force: !!(data && data.force)
  });

  return jsonResponse({
    success: summary.success,
    message: summary.message || (summary.success ? 'Backup completed' : 'Backup completed with errors'),
    summary: summary
  });
}

function setupDefaultDailyBackup() {
  ensureDailyBackupBootstrap_();
  Logger.log(JSON.stringify(getDailyBackupStatus_()));
}

function runDailyBackupJob() {
  var summary = performDailyBackup_({
    source: 'trigger',
    force: false
  });

  if (!summary.success) {
    throw new Error(summary.errors.join(' | '));
  }
}

function performDailyBackup_(options) {
  options = options || {};

  var config = getDailyBackupConfig_();
  var timezone = Session.getScriptTimeZone();
  var dateKey = Utilities.formatDate(new Date(), timezone, 'yyyy-MM-dd');
  var timestampKey = Utilities.formatDate(new Date(), timezone, 'yyyy-MM-dd_HH-mm-ss');
  var masterFolder = getMasterFolder();
  var backupRoot = getBackupRootFolder();
  var files = masterFolder.getFilesByType(MimeType.GOOGLE_SHEETS);
  var retentionDays = normalizeRetentionDays_(config.retentionDays);

  var summary = {
    success: true,
    source: options.source || 'manual',
    timestamp: new Date().toISOString(),
    timezone: timezone,
    dateKey: dateKey,
    scanned: 0,
    copied: 0,
    skipped: 0,
    cleaned: 0,
    errors: [],
    backups: [],
    backupFolderId: backupRoot.getId(),
    backupFolderUrl: backupRoot.getUrl()
  };

  if (options.source === 'trigger' && config.enabled === false) {
    summary.message = 'Daily backup is disabled';
    saveLastBackupSummary_(summary);
    return summary;
  }

  while (files.hasNext()) {
    var file = files.next();
    summary.scanned += 1;

    try {
      var hostFolder = getBackupFolderForSheet_(backupRoot, file);
      var backupName = buildBackupFileName_(file.getName(), dateKey, timestampKey, !!options.force);

      if (!options.force && hostFolder.getFilesByName(backupName).hasNext()) {
        summary.skipped += 1;
        summary.backups.push({
          sourceFileId: file.getId(),
          sourceName: file.getName(),
          status: 'skipped'
        });
        continue;
      }

      var copy = file.makeCopy(backupName, hostFolder);
      summary.copied += 1;
      summary.backups.push({
        sourceFileId: file.getId(),
        sourceName: file.getName(),
        backupFileId: copy.getId(),
        backupName: copy.getName(),
        status: 'copied'
      });

      if (retentionDays > 0) {
        summary.cleaned += cleanupOldBackups_(hostFolder, retentionDays);
      }
    } catch (err) {
      summary.success = false;
      summary.errors.push('[' + file.getName() + '] ' + err.toString());
      summary.backups.push({
        sourceFileId: file.getId(),
        sourceName: file.getName(),
        status: 'error',
        error: err.toString()
      });
    }
  }

  if (summary.scanned === 0) {
    summary.message = 'No host spreadsheets found in master folder';
  }

  saveLastBackupSummary_(summary);
  Logger.log(JSON.stringify(summary));
  return summary;
}

function ensureDailyBackupBootstrap_() {
  var rawConfig = getScriptProperties_().getProperty(DAILY_BACKUP_CONFIG_KEY);
  var config = getDailyBackupConfig_();
  var existingTrigger = getTriggerByHandler_(DAILY_BACKUP_HANDLER);

  if (!rawConfig) {
    config.enabled = true;
    config.hour = normalizeBackupHour_(config.hour);
    config.retentionDays = normalizeRetentionDays_(config.retentionDays);
    config.updatedAt = new Date().toISOString();
    config.timezone = Session.getScriptTimeZone();
    ensureDailyBackupTrigger_(config.hour);
    saveDailyBackupConfig_(config);
    return config;
  }

  if (config.enabled && !existingTrigger) {
    ensureDailyBackupTrigger_(config.hour);
    config.updatedAt = new Date().toISOString();
    config.timezone = Session.getScriptTimeZone();
    saveDailyBackupConfig_(config);
  }

  return config;
}

function getDailyBackupStatus_() {
  var config = getDailyBackupConfig_();
  var backupRoot = getBackupRootFolder();
  var lastRun = getLastBackupSummary_();
  var trigger = getTriggerByHandler_(DAILY_BACKUP_HANDLER);

  return {
    enabled: !!config.enabled,
    hour: normalizeBackupHour_(config.hour),
    retentionDays: normalizeRetentionDays_(config.retentionDays),
    timezone: Session.getScriptTimeZone(),
    triggerInstalled: !!trigger,
    backupFolderId: backupRoot.getId(),
    backupFolderUrl: backupRoot.getUrl(),
    lastRun: lastRun
  };
}

function getDailyBackupConfig_() {
  var raw = getScriptProperties_().getProperty(DAILY_BACKUP_CONFIG_KEY);
  if (!raw) {
    return {
      enabled: false,
      hour: DEFAULT_BACKUP_HOUR,
      retentionDays: DEFAULT_BACKUP_RETENTION_DAYS,
      timezone: Session.getScriptTimeZone()
    };
  }

  try {
    var parsed = JSON.parse(raw);
    return {
      enabled: parsed.enabled !== false,
      hour: normalizeBackupHour_(parsed.hour),
      retentionDays: normalizeRetentionDays_(parsed.retentionDays),
      timezone: parsed.timezone || Session.getScriptTimeZone(),
      updatedAt: parsed.updatedAt || ''
    };
  } catch (err) {
    return {
      enabled: false,
      hour: DEFAULT_BACKUP_HOUR,
      retentionDays: DEFAULT_BACKUP_RETENTION_DAYS,
      timezone: Session.getScriptTimeZone()
    };
  }
}

function saveDailyBackupConfig_(config) {
  getScriptProperties_().setProperty(DAILY_BACKUP_CONFIG_KEY, JSON.stringify({
    enabled: !!config.enabled,
    hour: normalizeBackupHour_(config.hour),
    retentionDays: normalizeRetentionDays_(config.retentionDays),
    timezone: config.timezone || Session.getScriptTimeZone(),
    updatedAt: config.updatedAt || new Date().toISOString()
  }));
}

function getLastBackupSummary_() {
  var raw = getScriptProperties_().getProperty(DAILY_BACKUP_LAST_RESULT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function saveLastBackupSummary_(summary) {
  getScriptProperties_().setProperty(DAILY_BACKUP_LAST_RESULT_KEY, JSON.stringify({
    success: summary.success,
    source: summary.source,
    timestamp: summary.timestamp,
    timezone: summary.timezone,
    dateKey: summary.dateKey,
    scanned: summary.scanned,
    copied: summary.copied,
    skipped: summary.skipped,
    cleaned: summary.cleaned,
    errorCount: summary.errors.length,
    errors: summary.errors.slice(0, 5),
    message: summary.message || ''
  }));
}

function ensureDailyBackupTrigger_(hour) {
  removeTriggersByHandler_(DAILY_BACKUP_HANDLER);
  return ScriptApp.newTrigger(DAILY_BACKUP_HANDLER)
    .timeBased()
    .everyDays(1)
    .atHour(normalizeBackupHour_(hour))
    .create();
}

function removeTriggersByHandler_(handlerName) {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === handlerName) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

function getTriggerByHandler_(handlerName) {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === handlerName) {
      return triggers[i];
    }
  }
  return null;
}

function getScriptProperties_() {
  return PropertiesService.getScriptProperties();
}

function getBackupFolderForSheet_(backupRoot, file) {
  var folderName = sanitizeDriveName_(file.getName()) + ' [' + file.getId() + ']';
  var folders = backupRoot.getFoldersByName(folderName);
  if (folders.hasNext()) return folders.next();
  return backupRoot.createFolder(folderName);
}

function buildBackupFileName_(sourceName, dateKey, timestampKey, force) {
  var safeName = sanitizeDriveName_(sourceName);
  if (force) {
    return safeName + ' - backup ' + timestampKey;
  }
  return safeName + ' - backup ' + dateKey;
}

function sanitizeDriveName_(value) {
  return String(value || 'HostSheet')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/^\s+|\s+$/g, '');
}

function cleanupOldBackups_(folder, retentionDays) {
  var removed = 0;
  var cutoffTime = new Date().getTime() - (retentionDays * 24 * 60 * 60 * 1000);
  var files = folder.getFiles();

  while (files.hasNext()) {
    var file = files.next();
    if (file.getDateCreated().getTime() < cutoffTime) {
      file.setTrashed(true);
      removed += 1;
    }
  }

  return removed;
}

function normalizeBackupHour_(hour) {
  var value = Number(hour);
  if (isNaN(value) || value < 0 || value > 23) return DEFAULT_BACKUP_HOUR;
  return Math.floor(value);
}

function normalizeRetentionDays_(days) {
  var value = Number(days);
  if (isNaN(value) || value < 0) return DEFAULT_BACKUP_RETENTION_DAYS;
  return Math.floor(value);
}

function dailyBatchReconcile() {
  runDailyBackupJob();
}

// ═══════════════════════════════════════
// PAYMENT GATEWAY WEBHOOKS & NOTIFICATIONS
// ═══════════════════════════════════════
function handleGetPaymentNotifications(hostId, token) {
  if (!hostId) return jsonResponse({ success: false, error: 'Missing hostId' });

  var gatewayConfig = getStoredPaymentGatewayConfig_(hostId);
  if (gatewayConfig && String(gatewayConfig.webhookToken || '') !== String(token || '')) {
    return jsonResponse({ success: false, error: 'Invalid token' });
  }
  return jsonResponse({
    success: true,
    notifications: getStoredPaymentNotifications_(hostId),
    gatewayConfig: gatewayConfig ? sanitizeGatewayStatus_(gatewayConfig) : null
  });
}

function handleRegisterPaymentGateway(data) {
  if (!data || !data.hostId || !data.sheetId || !data.config) {
    return jsonResponse({ success: false, error: 'Missing hostId, sheetId or config' });
  }

  var existing = getStoredPaymentGatewayConfig_(data.hostId) || {};
  var config = data.config || {};
  var nextConfig = {
    hostId: data.hostId,
    sheetId: data.sheetId,
    provider: config.provider || existing.provider || 'manual',
    providerLabel: config.providerLabel || existing.providerLabel || '',
    enabled: config.enabled !== undefined ? config.enabled !== false : existing.enabled !== false,
    webhookToken: config.webhookToken || existing.webhookToken || '',
    autoMarkPaid: config.autoMarkPaid !== undefined ? config.autoMarkPaid !== false : existing.autoMarkPaid !== false,
    matchMode: config.matchMode || existing.matchMode || 'bill_id',
    bankName: config.bankName || existing.bankName || '',
    accountNumber: config.accountNumber || existing.accountNumber || '',
    accountName: config.accountName || existing.accountName || '',
    note: config.note || existing.note || '',
    generatedWebhookUrl: config.generatedWebhookUrl || existing.generatedWebhookUrl || '',
    updatedAt: new Date().toISOString(),
    lastWebhookAt: config.lastWebhookAt || existing.lastWebhookAt || '',
    lastWebhookStatus: config.lastWebhookStatus || existing.lastWebhookStatus || '',
    lastWebhookMessage: config.lastWebhookMessage || existing.lastWebhookMessage || ''
  };

  saveStoredPaymentGatewayConfig_(data.hostId, nextConfig);
  return jsonResponse({
    success: true,
    message: 'Payment gateway registered',
    gatewayConfig: sanitizeGatewayStatus_(nextConfig)
  });
}

function handlePaymentWebhook(e) {
  var hostId = (e && e.parameter && e.parameter.hostId) || '';
  var urlToken = (e && e.parameter && e.parameter.token) || '';
  if (!hostId || !urlToken) {
    return jsonResponse({ success: false, error: 'Missing hostId or token' });
  }

  var gatewayConfig = getStoredPaymentGatewayConfig_(hostId);
  if (!gatewayConfig) {
    return jsonResponse({ success: false, error: 'Gateway config not found' });
  }
  if (!gatewayConfig.enabled) {
    return jsonResponse({ success: false, error: 'Gateway is disabled' });
  }
  if (String(gatewayConfig.webhookToken || '') !== String(urlToken)) {
    return jsonResponse({ success: false, error: 'Invalid webhook token' });
  }

  var rawBody = (e && e.postData && e.postData.contents) || '{}';
  var incoming = normalizeIncomingPaymentWebhook_(rawBody);
  gatewayConfig.lastWebhookAt = new Date().toISOString();

  if (!incoming.success) {
    gatewayConfig.lastWebhookStatus = 'ignored';
    gatewayConfig.lastWebhookMessage = incoming.message || 'Ignored non-paid notification';
    saveStoredPaymentGatewayConfig_(hostId, gatewayConfig);
    return jsonResponse({ success: true, message: gatewayConfig.lastWebhookMessage });
  }

  if (!gatewayConfig.sheetId) {
    gatewayConfig.lastWebhookStatus = 'error';
    gatewayConfig.lastWebhookMessage = 'Missing sheetId for host gateway';
    saveStoredPaymentGatewayConfig_(hostId, gatewayConfig);
    return jsonResponse({ success: false, error: gatewayConfig.lastWebhookMessage });
  }

  var ss = SpreadsheetApp.openById(gatewayConfig.sheetId);
  var matched = matchPaymentsFromWebhook_(ss, gatewayConfig, incoming);
  if (matched.rows.length === 0) {
    gatewayConfig.lastWebhookStatus = 'unmatched';
    gatewayConfig.lastWebhookMessage = 'Received payment but no bill/payment code matched';
    saveStoredPaymentGatewayConfig_(hostId, gatewayConfig);

    pushStoredPaymentNotification_(hostId, {
      id: buildRemoteNotificationId_(hostId, incoming.externalId || 'unmatched', matched.billId || 'none'),
      hostId: hostId,
      type: 'gateway_payment_received',
      severity: 'warning',
      title: 'Có tiền vào nhưng chưa gạch phiếu',
      message: 'Đã nhận giao dịch ' + formatMoneyVnd_(incoming.amount) + ' nhưng chưa tìm thấy mã bill hoặc mã phiếu để đối soát.',
      createdAt: new Date().toISOString(),
      actionPath: '/app/payments',
      amount: incoming.amount,
      metadata: {
        provider: gatewayConfig.provider || '',
        transactionId: incoming.externalId || '',
        matched: false
      }
    });

    return jsonResponse({ success: true, matchedCount: 0, message: gatewayConfig.lastWebhookMessage });
  }

  if (gatewayConfig.autoMarkPaid === false) {
    gatewayConfig.lastWebhookStatus = 'pending_review';
    gatewayConfig.lastWebhookMessage = 'Received payment and found matching bill, waiting for host confirmation';
    saveStoredPaymentGatewayConfig_(hostId, gatewayConfig);

    pushStoredPaymentNotification_(hostId, {
      id: buildRemoteNotificationId_(hostId, incoming.externalId || 'review', matched.billId || 'bill'),
      hostId: hostId,
      type: 'gateway_payment_received',
      severity: 'info',
      title: 'Đã nhận tiền, chờ host xác nhận',
      message: 'Đã tìm thấy bill phù hợp cho giao dịch ' + formatMoneyVnd_(incoming.amount) + ', nhưng chế độ auto gạch đang tắt.',
      createdAt: new Date().toISOString(),
      actionPath: '/app/payments',
      paymentIds: matched.rows.map(function(row) { return row.paymentId; }),
      billId: matched.billId || '',
      amount: incoming.amount,
      metadata: {
        provider: gatewayConfig.provider || '',
        transactionId: incoming.externalId || '',
        matched: true,
        autoMarked: false
      }
    });

    return jsonResponse({
      success: true,
      matchedCount: matched.rows.length,
      matchedPaymentIds: matched.rows.map(function(row) { return row.paymentId; }),
      billId: matched.billId || '',
      message: gatewayConfig.lastWebhookMessage
    });
  }

  var paidPaymentIds = updatePaymentsInSheet_(ss, matched.rows, incoming.paidDate || new Date().toISOString().split('T')[0]);
  var notificationMessage = 'Đã nhận ' + formatMoneyVnd_(incoming.amount) + ' và gạch ' + paidPaymentIds.length + ' phiếu';
  if (matched.billId) notificationMessage += ' cho ' + matched.billId;

  gatewayConfig.lastWebhookStatus = 'matched';
  gatewayConfig.lastWebhookMessage = notificationMessage;
  saveStoredPaymentGatewayConfig_(hostId, gatewayConfig);

  pushStoredPaymentNotification_(hostId, {
    id: buildRemoteNotificationId_(hostId, incoming.externalId || 'paid', matched.billId || 'bill'),
    hostId: hostId,
    type: 'gateway_payment_received',
    severity: 'success',
    title: 'Đã gạch thanh toán tự động',
    message: notificationMessage + '.',
    createdAt: new Date().toISOString(),
    actionPath: '/app/payments',
    paymentIds: paidPaymentIds,
    billId: matched.billId || '',
    amount: incoming.amount,
    metadata: {
      provider: gatewayConfig.provider || '',
      transactionId: incoming.externalId || '',
      matched: true
    }
  });

  return jsonResponse({
    success: true,
    matchedCount: paidPaymentIds.length,
    matchedPaymentIds: paidPaymentIds,
    billId: matched.billId || ''
  });
}

function getStoredPaymentGatewayConfig_(hostId) {
  var raw = getScriptProperties_().getProperty(PAYMENT_GATEWAY_CONFIG_PREFIX + hostId);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    Logger.log('Failed to parse payment gateway config: ' + err);
    return null;
  }
}

function saveStoredPaymentGatewayConfig_(hostId, config) {
  getScriptProperties_().setProperty(PAYMENT_GATEWAY_CONFIG_PREFIX + hostId, JSON.stringify(config || {}));
}

function getStoredPaymentNotifications_(hostId) {
  var raw = getScriptProperties_().getProperty(PAYMENT_NOTIFICATION_QUEUE_PREFIX + hostId);
  if (!raw) return [];
  try {
    var parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    Logger.log('Failed to parse payment notifications: ' + err);
    return [];
  }
}

function saveStoredPaymentNotifications_(hostId, notifications) {
  getScriptProperties_().setProperty(
    PAYMENT_NOTIFICATION_QUEUE_PREFIX + hostId,
    JSON.stringify((notifications || []).slice(0, PAYMENT_NOTIFICATION_LIMIT))
  );
}

function pushStoredPaymentNotification_(hostId, notification) {
  var notifications = getStoredPaymentNotifications_(hostId);
  var seen = {};
  var next = [notification];

  notifications.forEach(function(item) {
    if (!item || !item.id || item.id === notification.id || seen[item.id]) return;
    seen[item.id] = true;
    next.push(item);
  });

  next.sort(function(left, right) {
    return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
  });

  saveStoredPaymentNotifications_(hostId, next);
}

function sanitizeGatewayStatus_(config) {
  if (!config) return null;
  return {
    provider: config.provider || 'manual',
    enabled: config.enabled !== false,
    lastWebhookAt: config.lastWebhookAt || '',
    lastWebhookStatus: config.lastWebhookStatus || '',
    lastWebhookMessage: config.lastWebhookMessage || ''
  };
}

function normalizeIncomingPaymentWebhook_(rawBody) {
  var payload = tryParseJson_(rawBody) || {};
  var order = payload.order || {};
  var transaction = payload.transaction || {};
  var notificationType = String(payload.notification_type || payload.type || payload.event || '').toUpperCase();
  var status = String(transaction.transaction_status || order.order_status || payload.status || payload.transactionStatus || '').toUpperCase();
  var amount = normalizeMoneyValue_(transaction.transaction_amount || order.order_amount || payload.amount || payload.transferAmount || payload.money || payload.total_amount);
  var content = String(
    payload.content ||
    payload.description ||
    payload.transferContent ||
    payload.transaction_content ||
    payload.reference ||
    order.order_invoice_number ||
    order.order_description ||
    ''
  );
  var externalId = String(transaction.transaction_id || transaction.id || payload.transactionId || payload.transaction_id || payload.id || '');
  var paidDate = String(transaction.transaction_date || payload.transactionDate || payload.paidAt || new Date().toISOString().split('T')[0]);
  var success = false;

  if (notificationType === 'ORDER_PAID') success = true;
  if (!success && ['PAID', 'APPROVED', 'CAPTURED', 'SUCCESS', 'COMPLETED'].indexOf(status) > -1) success = true;
  if (!success && amount > 0 && content && !status && !notificationType) success = true;

  return {
    raw: payload,
    success: success,
    message: success ? 'Payment received' : 'Ignored notification',
    amount: amount,
    content: content,
    externalId: externalId,
    invoiceNumber: String(order.order_invoice_number || ''),
    orderDescription: String(order.order_description || ''),
    paidDate: paidDate
  };
}

function matchPaymentsFromWebhook_(ss, gatewayConfig, incoming) {
  var lookup = buildPaymentBillLookup_(ss);
  var texts = [
    incoming.content,
    incoming.invoiceNumber,
    incoming.orderDescription,
    incoming.externalId
  ];
  var billId = '';
  var rows = [];
  var matchMode = gatewayConfig.matchMode || 'bill_id';

  if (matchMode === 'bill_id' || matchMode === 'transfer_content') {
    lookup.billGroups.forEach(function(group) {
      if (billId || !group.pendingRows.length) return;
      for (var i = 0; i < texts.length; i++) {
        if (textContainsToken_(texts[i], group.billId)) {
          billId = group.billId;
          rows = group.pendingRows.slice();
          break;
        }
      }
    });
  }

  if (!rows.length && (matchMode === 'payment_id' || matchMode === 'transfer_content' || matchMode === 'bill_id')) {
    lookup.paymentRows.forEach(function(paymentRow) {
      if (paymentRow.status === 'Đã đóng' || rows.length) return;
      for (var i = 0; i < texts.length; i++) {
        if (textContainsToken_(texts[i], paymentRow.paymentId)) {
          billId = paymentRow.billId;
          rows = [paymentRow];
          break;
        }
      }
    });
  }

  return {
    billId: billId,
    rows: rows
  };
}

function buildPaymentBillLookup_(ss) {
  var contractSheet = ss.getSheetByName('Hợp đồng');
  var paymentSheet = ss.getSheetByName('Thanh toán');
  var contractRoomMap = {};
  var paymentRows = [];
  var billGroupsById = {};

  if (contractSheet && contractSheet.getLastRow() > 1) {
    var contractValues = contractSheet.getDataRange().getValues();
    for (var c = 1; c < contractValues.length; c++) {
      contractRoomMap[String(contractValues[c][0])] = String(contractValues[c][1] || '');
    }
  }

  if (paymentSheet && paymentSheet.getLastRow() > 1) {
    var paymentValues = paymentSheet.getDataRange().getValues();
    for (var i = 1; i < paymentValues.length; i++) {
      var row = paymentValues[i];
      var direction = String(row[10] || 'income');
      if (direction === 'expense') continue;

      var paymentId = String(row[0] || '');
      if (!paymentId) continue;

      var contractId = String(row[1] || '');
      var roomId = contractRoomMap[contractId] || contractId;
      var period = String(row[4] || '');
      var status = String(row[6] || '');
      var billId = buildBillId_(roomId || contractId, period);
      var paymentRow = {
        rowNumber: i + 1,
        paymentId: paymentId,
        contractId: contractId,
        roomId: roomId,
        period: period,
        status: status,
        amount: normalizeMoneyValue_(row[2]),
        type: String(row[3] || ''),
        description: String(row[8] || ''),
        billId: billId
      };

      paymentRows.push(paymentRow);

      if (!billGroupsById[billId]) {
        billGroupsById[billId] = {
          billId: billId,
          allRows: [],
          pendingRows: []
        };
      }

      billGroupsById[billId].allRows.push(paymentRow);
      if (status !== 'Đã đóng') {
        billGroupsById[billId].pendingRows.push(paymentRow);
      }
    }
  }

  var billGroups = [];
  for (var key in billGroupsById) {
    billGroups.push(billGroupsById[key]);
  }

  return {
    paymentSheet: paymentSheet,
    paymentRows: paymentRows,
    billGroups: billGroups
  };
}

function updatePaymentsInSheet_(ss, rows, paidDateValue) {
  var paymentSheet = ss.getSheetByName(TAB_CONFIG.payments.name);
  if (!paymentSheet) return [];

  ensureTabHeaders_(paymentSheet, getTabHeaders_('payments'));
  var paidIds = [];
  rows.forEach(function(row) {
    if (!row || !row.paymentId || row.status === '\u0110\u00e3 \u0111\u00f3ng') return;
    paymentSheet.getRange(row.rowNumber, 7).setValue('\u0110\u00e3 \u0111\u00f3ng');
    paymentSheet.getRange(row.rowNumber, 8).setValue(paidDateValue);
    paymentSheet.getRange(row.rowNumber, 13).setValue(normalizeMoneyValue_(row.amount || 0));
    paymentSheet.getRange(row.rowNumber, 14).setValue(0);
    paymentSheet.getRange(row.rowNumber, 15).setValue(normalizeMoneyValue_(row.amount || 0));
    paidIds.push(row.paymentId);
  });

  return paidIds;
}

function buildBillId_(roomOrContractId, period) {
  return 'BL_' + String((roomOrContractId || '') + ':' + (period || '')).replace(/[^a-zA-Z0-9]+/g, '_');
}

function normalizeMoneyValue_(value) {
  if (typeof value === 'number') return value;
  var normalized = String(value || '').replace(/[^0-9.-]+/g, '');
  if (!normalized) return 0;
  var parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

function normalizeMatchText_(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]+/g, '');
}

function textContainsToken_(source, token) {
  var normalizedSource = normalizeMatchText_(source);
  var normalizedToken = normalizeMatchText_(token);
  if (!normalizedSource || !normalizedToken) return false;
  return normalizedSource.indexOf(normalizedToken) > -1;
}

function tryParseJson_(raw) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

function buildRemoteNotificationId_(hostId, externalId, suffix) {
  return 'NTF_' + String(hostId || 'host') + '_' + String(externalId || 'event').replace(/[^a-zA-Z0-9]+/g, '_') + '_' + String(suffix || 'item').replace(/[^a-zA-Z0-9]+/g, '_');
}

function formatMoneyVnd_(amount) {
  return Utilities.formatString('%s đ', normalizeMoneyValue_(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
}

// ═══════════════════════════════════════
// ROW CONVERTERS
// ═══════════════════════════════════════
function buildingToRow(b) {
  return [b.id, b.name, b.address, b.type, b.totalFloors, b.rentalCost || '', b.leaseStartDate || '', b.leaseEndDate || '', b.hostId || '', b.createdAt || ''];
}

function roomToRow(r) {
  var posX = (r.position && r.position.x) || r.x || 0;
  var posY = (r.position && r.position.y) || r.y || 0;
  return [r.id, r.name, r.price, r.floor, r.status, r.buildingId, posX, posY, r.hostId || '', r.createdAt || ''];
}

function customerToRow(c) {
  return [
    c.id,
    c.name,
    c.phone,
    c.email,
    c.zalo || '',
    c.idNumber || '',
    c.idIssueDate || '',
    c.idIssuePlace || '',
    c.idFrontImage || '',
    c.idBackImage || '',
    c.avatarImage || '',
    c.dateOfBirth || '',
    c.gender || '',
    c.nationality || '',
    c.placeOfOrigin || '',
    c.permanentAddress || '',
    c.currentAddress || '',
    c.occupation || '',
    c.qrCodeData || '',
    c.notes || '',
    c.hostId || '',
    c.createdAt || '',
    c.residenceAddress || c.currentAddress || c.permanentAddress || '',
    c.declarationCreated ? 'Có' : 'Không',
    c.declarationCreatedAt || '',
    c.declarationStatus || (c.declarationCreated ? 'created' : 'not_created')
  ];
}

function contractToRow(c) {
  var extraSvc = '';
  if (c.extraServices && c.extraServices.length > 0) {
    extraSvc = JSON.stringify(c.extraServices);
  }
  return [c.id, c.roomId, c.customerId, c.startDate, c.durationMonths, c.price, c.electricPrice, c.waterPrice, c.internetPrice, extraSvc, c.isActive ? 'Có' : 'Không', c.endDate, c.hostId || '', c.createdAt || ''];
}

function paymentToRow(p) {
  return [
    p.id,
    p.contractId,
    p.amount,
    p.type,
    p.period,
    p.dueDate,
    p.status,
    p.paidDate || '',
    p.description || '',
    p.category || '',
    p.direction || 'income',
    p.sourceDate || '',
    p.paidAmount || 0,
    p.remainingAmount != null ? p.remainingAmount : p.amount,
    p.lastCollectedAmount || 0,
    p.billId || '',
    p.billStatus || '',
    p.paymentMethod || '',
    p.gatewayTransactionId || ''
  ];
}

function equipmentToRow(eq) {
  return [
    eq.id,
    eq.name,
    eq.status,
    eq.buildingId,
    eq.roomId || '',
    eq.purchaseDate,
    eq.price,
    eq.notes || '',
    eq.depreciationMonths || '',
    eq.salvageValue || '',
    eq.currentValue || '',
    eq.lastValuationDate || '',
    JSON.stringify(eq.maintenanceHistory || []),
    eq.hostId || '',
    eq.createdAt || ''
  ];
}

function serviceRecordToRow(sr) {
  return [
    sr.id,
    sr.roomId,
    sr.month,
    sr.electricOldReading || 0,
    sr.electricNewReading || 0,
    sr.electricUsage,
    sr.waterOldReading || 0,
    sr.waterNewReading || 0,
    sr.waterUsage,
    sr.internetCost,
    sr.otherCost,
    sr.totalCost,
    sr.recordedAt || '',
    sr.electricRecordedAt || '',
    sr.waterRecordedAt || '',
    sr.note || ''
  ];
}

function getRowConverter(tabName) {
  var map = {
    buildings: buildingToRow,
    rooms: roomToRow,
    customers: customerToRow,
    contracts: contractToRow,
    payments: paymentToRow,
    equipment: equipmentToRow,
    serviceRecords: serviceRecordToRow
  };
  return map[tabName] || function(r) { return Object.values(r); };
}

function writeSubscriptionSnapshot_(ss, payload) {
  if (!ss) return;

  var sheet = ss.getSheetByName('Gói dịch vụ');
  if (!sheet) {
    sheet = ss.insertSheet('Gói dịch vụ');
  }

  sheet.clearContents();

  var snapshot = (payload && payload.subscriptionSnapshot) || {};
  var pricingTier = (payload && payload.pricingTier) || null;
  var activeAddons = snapshot.activeAddons || [];
  var pendingRequests = snapshot.pendingRequests || [];
  var features = snapshot.features || (pricingTier && pricingTier.features) || [];
  var gateway = snapshot.paymentGateway || {};

  sheet.appendRow(['THÔNG TIN GÓI DỊCH VỤ HOST']);
  formatHeader(sheet, 1);
  sheet.appendRow(['Host ID', snapshot.hostId || payload.hostId || '']);
  sheet.appendRow(['Tên gói', snapshot.planName || (pricingTier && pricingTier.name) || '']);
  sheet.appendRow(['Mã gói', snapshot.planId || (pricingTier && pricingTier.id) || '']);
  sheet.appendRow(['Giá/tháng', snapshot.planPrice || (pricingTier && pricingTier.price) || 0]);
  sheet.appendRow(['Max tòa nhà', snapshot.maxBuildings || (pricingTier && pricingTier.maxBuildings) || 0]);
  sheet.appendRow(['Max phòng', snapshot.maxRooms || (pricingTier && pricingTier.maxRooms) || 0]);

  sheet.appendRow(['']);
  sheet.appendRow(['TÍNH NĂNG ĐANG BẬT']);
  formatHeader(sheet, 1, sheet.getLastRow());
  if (features.length > 0) {
    features.forEach(function(feature) {
      sheet.appendRow([feature]);
    });
  } else {
    sheet.appendRow(['Chưa có danh sách tính năng']);
  }

  sheet.appendRow(['']);
  sheet.appendRow(['ADD-ON ĐANG KÍCH HOẠT', 'MÃ', 'GIÁ/THÁNG', 'MÔ TẢ']);
  formatHeader(sheet, 4, sheet.getLastRow());
  if (activeAddons.length > 0) {
    activeAddons.forEach(function(addon) {
      sheet.appendRow([addon.name || '', addon.id || '', addon.price || 0, addon.description || '']);
    });
  } else {
    sheet.appendRow(['Không có add-on', '', '', '']);
  }

  sheet.appendRow(['']);
  sheet.appendRow(['YÊU CẦU ĐANG CHỜ', 'TRẠNG THÁI', 'SỐ TIỀN', 'MÃ THANH TOÁN', 'THỜI GIAN']);
  formatHeader(sheet, 5, sheet.getLastRow());
  if (pendingRequests.length > 0) {
    pendingRequests.forEach(function(request) {
      sheet.appendRow([request.type || '', request.status || '', request.amount || 0, request.paymentCode || '', request.requestedAt || '']);
    });
  } else {
    sheet.appendRow(['Không có yêu cầu chưa xử lý', '', '', '', '']);
  }

  sheet.appendRow(['']);
  sheet.appendRow(['CỔNG THANH TOÁN HOST', 'Giá trị']);
  formatHeader(sheet, 2, sheet.getLastRow());
  sheet.appendRow(['Nhà cung cấp', gateway.providerLabel || gateway.provider || 'manual']);
  sheet.appendRow(['Bật webhook', gateway.enabled ? 'Có' : 'Không']);
  sheet.appendRow(['Tự gạch thanh toán', gateway.autoMarkPaid ? 'Có' : 'Không']);
  sheet.appendRow(['Webhook gần nhất', gateway.lastWebhookAt || '']);
  sheet.appendRow(['Trạng thái webhook', gateway.lastWebhookStatus || '']);
  sheet.appendRow(['Ghi chú webhook', gateway.lastWebhookMessage || '']);

  if (payload.hostPayments && payload.hostPayments.length > 0) {
    sheet.appendRow(['']);
    sheet.appendRow(['PHÍ PHẦN MỀM', 'KỲ', 'SỐ TIỀN', 'HẠN ĐÓNG', 'TRẠNG THÁI', 'NGÀY ĐÓNG']);
    formatHeader(sheet, 6, sheet.getLastRow());
    payload.hostPayments.forEach(function(hp) {
      sheet.appendRow([hp.id, hp.period, hp.amount, hp.dueDate, hp.status, hp.paidDate || '']);
    });
  }
}

function writeArrayToTab(ss, tabName, items, converter) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet || !items || items.length === 0) return;
  var rows = items.map(converter);
  var resolvedTabKey = null;
  for (var key in TAB_CONFIG) {
    if (TAB_CONFIG[key].name === tabName) {
      resolvedTabKey = key;
      break;
    }
  }
  if (resolvedTabKey) {
    ensureTabHeaders_(sheet, getTabHeaders_(resolvedTabKey));
  }
  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  }
}

// ═══ HELPERS ═══
function formatHeader(sheet, numCols, rowNum) {
  rowNum = rowNum || 1;
  var range = sheet.getRange(rowNum, 1, 1, numCols);
  range.setBackground('#1a56db');
  range.setFontColor('#ffffff');
  range.setFontWeight('bold');
  range.setFontSize(10);
  sheet.setFrozenRows(rowNum);
  for (var i = 1; i <= numCols; i++) {
    sheet.autoResizeColumn(i);
  }
}

function ensureTabHeaders_(sheet, headers) {
  if (!sheet || !headers || headers.length === 0) return;
  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }

  var currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var needsUpdate = currentHeaders.length < headers.length;
  for (var i = 0; i < headers.length && !needsUpdate; i++) {
    if (String(currentHeaders[i] || '') !== String(headers[i] || '')) {
      needsUpdate = true;
    }
  }

  if (!needsUpdate) return;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
