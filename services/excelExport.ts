/**
 * ═══════════════════════════════════════════════════
 * Excel Export Utility
 * ═══════════════════════════════════════════════════
 * Generates .xlsx files from Host data (tabs 1-5)
 */

import * as XLSX from 'xlsx';
import { Building, Room, Customer, Contract, Payment, Equipment } from '../types';

export interface ExcelExportData {
    hostName: string;
    buildings: Building[];
    rooms: Room[];
    customers: Customer[];
    contracts: Contract[];
    payments: Payment[];
    equipment: Equipment[];
}

export function exportHostDataToExcel(data: ExcelExportData) {
    const wb = XLSX.utils.book_new();

    // ═══ TAB 1: Tài sản nhà ═══
    const buildingRows = data.buildings.map(b => ({
        'Mã tòa nhà': b.id,
        'Tên tòa nhà': b.name,
        'Địa chỉ': b.address,
        'Loại hình': b.type === 'Owned' ? 'Sở hữu' : 'Thuê',
        'Số tầng': b.totalFloors,
        'Chi phí thuê': b.rentalCost || '',
        'Ngày BĐ thuê': b.leaseStartDate || '',
        'Ngày KT thuê': b.leaseEndDate || ''
    }));
    const roomRows = data.rooms.map(r => ({
        'Mã phòng': r.id,
        'Tên phòng': r.name,
        'Giá thuê': r.price,
        'Tầng': r.floor,
        'Trạng thái': r.status,
        'Mã tòa nhà': r.buildingId
    }));
    const ws1 = XLSX.utils.json_to_sheet(buildingRows);
    // Append an empty row then room headers
    XLSX.utils.sheet_add_json(ws1, roomRows, { origin: -1, skipHeader: false });
    XLSX.utils.book_append_sheet(wb, ws1, 'Tài sản nhà');

    // ═══ TAB 2: Khách thuê ═══
    const customerRows = data.customers.map(c => ({
        'Mã KH': c.id,
        'Họ tên': c.name,
        'Số ĐT': c.phone,
        'Email': c.email,
        'Zalo': c.zalo || '',
        'Số CCCD': c.idNumber || '',
        'Ngày cấp': c.idIssueDate || '',
        'Nơi cấp': c.idIssuePlace || ''
    }));
    const ws2 = XLSX.utils.json_to_sheet(customerRows.length > 0 ? customerRows : [{}]);
    XLSX.utils.book_append_sheet(wb, ws2, 'Khách thuê');

    // ═══ TAB 3: Trang thiết bị ═══
    const eqRows = data.equipment.map(eq => ({
        'Mã TB': eq.id,
        'Tên thiết bị': eq.name,
        'Trạng thái': eq.status,
        'Mã tòa nhà': eq.buildingId,
        'Mã phòng': eq.roomId || '',
        'Ngày mua': eq.purchaseDate,
        'Giá tiền': eq.price,
        'Ghi chú': eq.notes || ''
    }));
    const ws3 = XLSX.utils.json_to_sheet(eqRows.length > 0 ? eqRows : [{}]);
    XLSX.utils.book_append_sheet(wb, ws3, 'Trang thiết bị');

    // ═══ TAB 4: Hợp đồng ═══
    const contractRows = data.contracts.map(c => ({
        'Mã HĐ': c.id,
        'Mã phòng': c.roomId,
        'Mã KH': c.customerId,
        'Ngày BĐ': c.startDate,
        'Thời hạn (tháng)': c.durationMonths,
        'Giá thuê': c.price,
        'Giá điện': c.electricPrice,
        'Giá nước': c.waterPrice,
        'Giá internet': c.internetPrice,
        'Dịch vụ thêm': c.extraServices?.filter(s => s.enabled).map(s => `${s.name}: ${s.unitPrice}`).join('; ') || '',
        'Còn hiệu lực': c.isActive ? 'Có' : 'Không',
        'Ngày kết thúc': c.endDate
    }));
    const ws4 = XLSX.utils.json_to_sheet(contractRows.length > 0 ? contractRows : [{}]);
    XLSX.utils.book_append_sheet(wb, ws4, 'Hợp đồng');

    // ═══ TAB 5: Lịch sử thanh toán ═══
    const paymentRows = data.payments.map(p => ({
        'Mã phiếu': p.id,
        'Mã HĐ': p.contractId,
        'Số tiền': p.amount,
        'Loại': p.type,
        'Kỳ': p.period,
        'Hạn đóng': p.dueDate,
        'Trạng thái': p.status,
        'Ngày đóng': p.paidDate || '',
        'Mô tả': p.description || ''
    }));
    const ws5 = XLSX.utils.json_to_sheet(paymentRows.length > 0 ? paymentRows : [{}]);
    XLSX.utils.book_append_sheet(wb, ws5, 'Lịch sử thanh toán');

    // Write and download
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.hostName}_DuLieu_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
