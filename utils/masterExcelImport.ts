import * as XLSX from 'xlsx';
import { Building, Room, Customer, Contract, Equipment } from '../types';

export const MASTER_TEMPLATE_HEADERS = {
  buildings: [
    'Mã Tòa Nhà (Ví dụ: B01) (*)',
    'Tên Tòa Nhà (*)',
    'Địa chỉ',
  ],
  rooms: [
    'Mã Phòng (Ví dụ: P101) (*)',
    'Mã Tòa Nhà (*) (Nối từ sheet Tòa Nhà)',
    'Tên Phòng (*)',
    'Giá Thuê Niêm Yết (VNĐ) (*)',
    'Tầng (*)',
  ],
  customers: [
    'Tên khách hàng (*)',           // 0
    'Điện thoại (*)',               // 1
    'Email',                        // 2
    'Zalo',                         // 3
    'CCCD/CMND',                    // 4
    'Ngày sinh (YYYY-MM-DD)',        // 5
    'Giới tính (Nam/Nữ)',           // 6
    'Quê quán',                     // 7
    'Nghề nghiệp',                  // 8
    'Ghi chú',                      // 9
    'Mã Tòa Nhà (Tùy chọn)',       // 10
    'Mã Phòng (Tùy chọn)',         // 11
    // ── Thông tin Hợp đồng (tự động tạo HĐ nếu có Mã Phòng) ──
    'Ngày vào ở (YYYY-MM-DD)',      // 12
    'Thời hạn HĐ (Tháng)',          // 13
    'Giá thuê theo HĐ (VNĐ)',       // 14
    'Tiền cọc (VNĐ)',               // 15
    'Đơn giá Điện (VNĐ/kWh)',       // 16
    'Tính Điện (Theo số/Khoán)',    // 17
    'Đơn giá Nước (VNĐ/khối)',      // 18
    'Tính Nước (Theo số/Khoán)',    // 19
    'Tiền Internet/tháng (VNĐ)',    // 20
  ],
  equipment: [
    'Tên tài sản (*)',
    'Mã Tòa Nhà (*) (Để gán chung vào tòa)',
    'Mã Phòng (Tùy chọn - Nếu gán riêng phòng)',
    'Trạng thái (Tốt/Hỏng/Đang sửa/Thanh lý)',
    'Giá mua (*)',
    'Ngày mua (YYYY-MM-DD)',
    'Ghi chú',
  ],
};

export function downloadMasterTemplate() {
  const wb = XLSX.utils.book_new();

  // 1. Buildings
  const wsBuildings = XLSX.utils.aoa_to_sheet([MASTER_TEMPLATE_HEADERS.buildings]);
  XLSX.utils.sheet_add_aoa(
    wsBuildings,
    [['B01', 'Nhà Trọ Cầu Giấy', '123 Cầu Giấy, Hà Nội']],
    { origin: -1 },
  );
  wsBuildings['!cols'] = MASTER_TEMPLATE_HEADERS.buildings.map(() => ({ wch: 28 }));
  XLSX.utils.book_append_sheet(wb, wsBuildings, 'Tòa_Nhà');

  // 2. Rooms
  const wsRooms = XLSX.utils.aoa_to_sheet([MASTER_TEMPLATE_HEADERS.rooms]);
  XLSX.utils.sheet_add_aoa(
    wsRooms,
    [
      ['P101', 'B01', 'Phòng 101', 3_500_000, 1],
      ['P102', 'B01', 'Phòng 102', 3_800_000, 1],
    ],
    { origin: -1 },
  );
  wsRooms['!cols'] = MASTER_TEMPLATE_HEADERS.rooms.map(() => ({ wch: 28 }));
  XLSX.utils.book_append_sheet(wb, wsRooms, 'Phòng_Trọ');

  // 3. Customers (with contract fields)
  const wsCustomers = XLSX.utils.aoa_to_sheet([MASTER_TEMPLATE_HEADERS.customers]);
  XLSX.utils.sheet_add_aoa(
    wsCustomers,
    [[
      'Nguyễn Văn A', '0912345678', 'nva@email.com', '0912345678',
      '010123456789', '1995-01-01', 'Nam', 'Hà Tĩnh', 'Sinh viên',
      '',                    // ghi chú
      'B01', 'P101',         // tòa + phòng
      '2026-01-01',          // ngày vào ở
      12,                    // thời hạn 12 tháng
      3_500_000,             // giá thuê HĐ
      1_000_000,             // tiền cọc
      3_500,                 // giá điện
      'Theo số',             // tính điện
      15_000,                // giá nước
      'Theo số',             // tính nước
      100_000,               // internet
    ]],
    { origin: -1 },
  );
  wsCustomers['!cols'] = MASTER_TEMPLATE_HEADERS.customers.map(() => ({ wch: 26 }));
  XLSX.utils.book_append_sheet(wb, wsCustomers, 'Khách_Thuê');

  // 4. Equipment
  const wsEquipment = XLSX.utils.aoa_to_sheet([MASTER_TEMPLATE_HEADERS.equipment]);
  XLSX.utils.sheet_add_aoa(
    wsEquipment,
    [['Điều hòa', 'B01', 'P101', 'Tốt', 6_500_000, '2023-01-15', 'Còn bảo hành']],
    { origin: -1 },
  );
  wsEquipment['!cols'] = MASTER_TEMPLATE_HEADERS.equipment.map(() => ({ wch: 26 }));
  XLSX.utils.book_append_sheet(wb, wsEquipment, 'Trang_Thiết_Bị');

  XLSX.writeFile(wb, 'Mau_Nhap_Du_Lieu_Toan_He_Thong.xlsx');
}

export interface MasterImportData {
  buildings: Building[];
  rooms: Room[];
  customers: Customer[];
  contracts: Contract[];
  equipment: Equipment[];
  deposits: DepositRecord[];
  errors: string[];
}

export interface DepositRecord {
  contractId: string;
  amount: number;
  customerId: string;
  roomId: string;
}

export async function parseMasterExcelImport(
  file: File,
  hostId: string,
): Promise<MasterImportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('File rỗng.');

        const wb = XLSX.read(data, { type: 'binary' });
        const errors: string[] = [];

        const rawBuildings: any[][] = [];
        const rawRooms: any[][] = [];
        const rawCustomers: any[][] = [];
        const rawEquipment: any[][] = [];

        wb.SheetNames.forEach(sheetName => {
          const ws = wb.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });
          if (json.length > 1) {
            const rows = (json.slice(1) as any[][]).filter(
              row => row.length > 0 && row.some(cell => cell !== undefined && cell !== ''),
            );
            if (sheetName === 'Tòa_Nhà') rawBuildings.push(...rows);
            if (sheetName === 'Phòng_Trọ') rawRooms.push(...rows);
            if (sheetName === 'Khách_Thuê') rawCustomers.push(...rows);
            if (sheetName === 'Trang_Thiết_Bị') rawEquipment.push(...rows);
          }
        });

        // ── 1. Buildings ────────────────────────────────────
        const parsedBuildings: Building[] = [];
        rawBuildings.forEach((row, idx) => {
          const id = String(row[0] || '').trim();
          const name = String(row[1] || '').trim();
          if (!id || !name) {
            errors.push(`[Tòa_Nhà] Dòng ${idx + 2}: Mã tòa và Tên tòa là bắt buộc.`);
            return;
          }
          parsedBuildings.push({
            id: `BLD_${id}`,
            name,
            address: String(row[2] || '').trim(),
            type: 'Owned',
            totalFloors: 1,
            hostId,
            createdAt: new Date().toISOString(),
          });
        });

        const buildingIdMap = new Map<string, string>();
        parsedBuildings.forEach((b, idx) =>
          buildingIdMap.set(String(rawBuildings[idx][0]).trim(), b.id),
        );

        // ── 2. Rooms ────────────────────────────────────────
        const parsedRooms: Room[] = [];
        const roomIdMap = new Map<string, string>(); // original code -> generated id
        rawRooms.forEach((row, idx) => {
          const code = String(row[0] || '').trim();
          const oldBldId = String(row[1] || '').trim();
          const name = String(row[2] || '').trim();
          const price = Number(row[3]);
          const floor = Number(row[4]);

          if (!code || !oldBldId || !name || isNaN(price) || isNaN(floor)) {
            errors.push(
              `[Phòng_Trọ] Dòng ${idx + 2}: Thiếu Mã phòng, Mã tòa, Tên, Giá, hoặc Tầng.`,
            );
            return;
          }

          const realBuildingId = buildingIdMap.get(oldBldId);
          if (!realBuildingId) {
            errors.push(
              `[Phòng_Trọ] Dòng ${idx + 2}: Tòa nhà mã '${oldBldId}' không tồn tại trong sheet Tòa_Nhà.`,
            );
            return;
          }

          const newRoomId = `R_${code}_${Math.random().toString(36).substr(2, 5)}`;
          roomIdMap.set(code, newRoomId);

          parsedRooms.push({
            id: newRoomId,
            buildingId: realBuildingId,
            hostId,
            name,
            price,
            floor,
            status: 'Trống',
            createdAt: new Date().toISOString(),
          });
        });

        // ── 3. Customers + Contracts ─────────────────────────
        const parsedCustomers: Customer[] = [];
        const parsedContracts: Contract[] = [];
        const parsedDeposits: DepositRecord[] = [];

        rawCustomers.forEach((row, idx) => {
          const name = String(row[0] || '').trim();
          const phone = String(row[1] || '').trim();
          const originalBldCode = String(row[10] || '').trim();
          const originalRoomCode = String(row[11] || '').trim();

          if (!name || !phone) {
            errors.push(`[Khách_Thuê] Dòng ${idx + 2}: Cần tối thiểu Tên và Điện thoại.`);
            return;
          }

          const customerId = `C_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

          const customer: Customer = {
            id: customerId,
            name,
            phone,
            email: String(row[2] || '').trim(),
            zalo: String(row[3] || '').trim() || phone,
            idNumber: String(row[4] || '').trim(),
            dateOfBirth: String(row[5] || '').trim(),
            gender: String(row[6] || '').trim() === 'Nữ' ? 'Nữ' : 'Nam',
            placeOfOrigin: String(row[7] || '').trim(),
            occupation: String(row[8] || '').trim(),
            notes: String(row[9] || '').trim(),
            permanentAddress: '',
            currentAddress: '',
            nationality: 'Việt Nam',
            residenceAddress: '',
            declarationCreated: false,
            declarationStatus: 'not_created',
            hostId,
            createdAt: new Date().toISOString(),
          };
          parsedCustomers.push(customer);

          // Tạo Hợp đồng nếu có đủ thông tin phòng + ngày vào ở
          if (originalBldCode && originalRoomCode) {
            const realBldId = buildingIdMap.get(originalBldCode);
            const realRoomId = roomIdMap.get(originalRoomCode);

            if (!realBldId) {
              errors.push(
                `[Khách_Thuê] Dòng ${idx + 2}: Mã tòa '${originalBldCode}' không tồn tại — bỏ qua HĐ cho khách này.`,
              );
            } else if (!realRoomId) {
              errors.push(
                `[Khách_Thuê] Dòng ${idx + 2}: Mã phòng '${originalRoomCode}' không tồn tại — bỏ qua HĐ cho khách này.`,
              );
            } else {
              const startDateRaw = String(row[12] || '').trim();
              const durationMonths = Number(row[13]) || 12;
              const contractPrice = Number(row[14]) || 0;
              const depositAmount = Number(row[15]) || 0;
              const electricPrice = Number(row[16]) || 3_500;
              const electricBillingType = String(row[17] || 'Theo số').trim().toLowerCase() === 'khoán'
                ? 'fixed' as const
                : 'meter' as const;
              const waterPrice = Number(row[18]) || 15_000;
              const waterBillingType = String(row[19] || 'Theo số').trim().toLowerCase() === 'khoán'
                ? 'fixed' as const
                : 'meter' as const;
              const internetPrice = Number(row[20]) || 0;

              const startDate = startDateRaw || new Date().toISOString().split('T')[0];
              const endDateObj = new Date(startDate);
              endDateObj.setMonth(endDateObj.getMonth() + durationMonths);
              const endDate = endDateObj.toISOString().split('T')[0];

              const contractId = `CT_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

              const contract: Contract = {
                id: contractId,
                roomId: realRoomId,
                customerId,
                startDate,
                durationMonths,
                price: contractPrice || 0,
                electricPrice,
                electricBillingType,
                waterPrice,
                waterBillingType,
                internetPrice,
                isActive: true,
                endDate,
                hostId,
                createdAt: new Date().toISOString(),
              };
              parsedContracts.push(contract);

              if (depositAmount > 0) {
                parsedDeposits.push({
                  contractId,
                  customerId,
                  roomId: realRoomId,
                  amount: depositAmount,
                });
              }
            }
          }
        });

        // ── 4. Equipment ────────────────────────────────────
        const parsedEquipment: Equipment[] = [];
        rawEquipment.forEach((row, idx) => {
          const name = String(row[0] || '').trim();
          const originalBldCode = String(row[1] || '').trim();
          const originalRoomCode = String(row[2] || '').trim();
          const price = Number(row[4]);

          if (!name || !originalBldCode || isNaN(price)) {
            errors.push(
              `[Trang_Thiết_Bị] Dòng ${idx + 2}: Thiếu Tên tài sản, Mã tòa hoặc Giá mua.`,
            );
            return;
          }

          const realBuildingId = buildingIdMap.get(originalBldCode);
          if (!realBuildingId) {
            errors.push(
              `[Trang_Thiết_Bị] Dòng ${idx + 2}: Tòa nhà mã '${originalBldCode}' không tồn tại.`,
            );
            return;
          }

          let realRoomId: string | undefined;
          if (originalRoomCode) {
            realRoomId = roomIdMap.get(originalRoomCode);
          }

          let status = String(row[3] || 'Tốt').trim();
          if (!['Tốt', 'Hỏng', 'Đang sửa', 'Thanh lý'].includes(status)) status = 'Tốt';

          parsedEquipment.push({
            id: `EQ_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name,
            buildingId: realBuildingId,
            roomId: realRoomId,
            status: status as any,
            price,
            purchaseDate:
              String(row[5] || '').trim() || new Date().toISOString().split('T')[0],
            notes: String(row[6] || '').trim(),
            hostId,
            createdAt: new Date().toISOString(),
          });
        });

        resolve({
          buildings: parsedBuildings,
          rooms: parsedRooms,
          customers: parsedCustomers,
          contracts: parsedContracts,
          equipment: parsedEquipment,
          deposits: parsedDeposits,
          errors,
        });
      } catch (err: any) {
        reject(err.message || 'Lỗi khi đọc file Excel');
      }
    };

    reader.onerror = () => reject('Không thể đọc file.');
    reader.readAsBinaryString(file);
  });
}
