import * as XLSX from 'xlsx';
import { Building, Room, Customer, Equipment } from '../types';

export const MASTER_TEMPLATE_HEADERS = {
  buildings: ['Mã Tòa Nhà (Ví dụ: B01) (*)', 'Tên Tòa Nhà (*)', 'Địa chỉ'],
  rooms: ['Mã Phòng (Ví dụ: P101) (*)', 'Mã Tòa Nhà (*) (Nối từ sheet Tòa Nhà)', 'Tên Phòng (*)', 'Giá Thuê (VNĐ) (*)', 'Tầng (*)'],
  customers: ['Tên khách hàng (*)', 'Điện thoại (*)', 'Email', 'Zalo', 'CCCD/CMND', 'Ngày sinh', 'Giới tính (Nam/Nữ)', 'Quê quán', 'Nghề nghiệp', 'Ghi chú', 'Mã Tòa Nhà (Tùy chọn)', 'Mã Phòng (Tùy chọn)'],
  equipment: ['Tên tài sản (*)', 'Mã Tòa Nhà (*) (Để gán chung vào tòa)', 'Mã Phòng (Tùy chọn - Nếu gán riêng phòng)', 'Trạng thái (Tốt/Hỏng/Đang sửa/Thanh lý)', 'Giá mua (*)', 'Ngày mua (YYYY-MM-DD)', 'Ghi chú']
};

export function downloadMasterTemplate() {
  const wb = XLSX.utils.book_new();

  // 1. Buildings
  const wsBuildings = XLSX.utils.aoa_to_sheet([MASTER_TEMPLATE_HEADERS.buildings]);
  XLSX.utils.sheet_add_aoa(wsBuildings, [['B01', 'Nhà Trọ Cầu Giấy', '123 Cầu Giấy, Hà Nội']], {origin: -1});
  wsBuildings['!cols'] = MASTER_TEMPLATE_HEADERS.buildings.map(() => ({ wch: 25 }));
  XLSX.utils.book_append_sheet(wb, wsBuildings, 'Tòa_Nhà');

  // 2. Rooms
  const wsRooms = XLSX.utils.aoa_to_sheet([MASTER_TEMPLATE_HEADERS.rooms]);
  XLSX.utils.sheet_add_aoa(wsRooms, [['P101', 'B01', 'Phòng 101', 3500000, 1], ['P102', 'B01', 'Phòng 102', 3800000, 1]], {origin: -1});
  wsRooms['!cols'] = MASTER_TEMPLATE_HEADERS.rooms.map(() => ({ wch: 25 }));
  XLSX.utils.book_append_sheet(wb, wsRooms, 'Phòng_Trọ');

  // 3. Customers
  const wsCustomers = XLSX.utils.aoa_to_sheet([MASTER_TEMPLATE_HEADERS.customers]);
  XLSX.utils.sheet_add_aoa(wsCustomers, [['Nguyễn Văn A', '0912345678', 'nva@email.com', '0912345678', '010123456789', '1995-01-01', 'Nam', 'Hà Tĩnh', 'Sinh viên', '', 'B01', 'P101']], {origin: -1});
  wsCustomers['!cols'] = MASTER_TEMPLATE_HEADERS.customers.map(() => ({ wch: 20 }));
  XLSX.utils.book_append_sheet(wb, wsCustomers, 'Khách_Thuê');

  // 4. Equipment
  const wsEquipment = XLSX.utils.aoa_to_sheet([MASTER_TEMPLATE_HEADERS.equipment]);
  XLSX.utils.sheet_add_aoa(wsEquipment, [['Điều hòa', 'B01', 'P101', 'Tốt', 6500000, '2023-01-15', 'Còn bảo hành']], {origin: -1});
  wsEquipment['!cols'] = MASTER_TEMPLATE_HEADERS.equipment.map(() => ({ wch: 20 }));
  XLSX.utils.book_append_sheet(wb, wsEquipment, 'Trang_Thiết_Bị');

  XLSX.writeFile(wb, `Mau_Nhap_Du_Lieu_Toan_He_Thong.xlsx`);
}

export interface MasterImportData {
  buildings: Building[];
  rooms: Room[];
  customers: Customer[];
  equipment: Equipment[];
  errors: string[];
}

export async function parseMasterExcelImport(file: File, hostId: string): Promise<MasterImportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("File rỗng.");

        const wb = XLSX.read(data, { type: 'binary' });
        
        const errors: string[] = [];
        
        // Cấu trúc Data thô
        const rawBuildings: any[] = [];
        const rawRooms: any[] = [];
        const rawCustomers: any[] = [];
        const rawEquipment: any[] = [];

        // Đọc từng sheet
        wb.SheetNames.forEach(sheetName => {
          const ws = wb.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });
          if (json.length > 1) {
            const rows = json.slice(1).filter(row => row.length > 0 && row.some(cell => cell !== undefined && cell !== ''));
            if (sheetName === 'Tòa_Nhà') rawBuildings.push(...rows);
            if (sheetName === 'Phòng_Trọ') rawRooms.push(...rows);
            if (sheetName === 'Khách_Thuê') rawCustomers.push(...rows);
            if (sheetName === 'Trang_Thiết_Bị') rawEquipment.push(...rows);
          }
        });

        // 1. Xử lý Buildings (Tòa nhà)
        const parsedBuildings: Building[] = [];
        rawBuildings.forEach((row, idx) => {
          const id = String(row[0] || '').trim();
          const name = String(row[1] || '').trim();
          if (!id || !name) {
            errors.push(`Tab [Tòa_Nhà] Dòng ${idx+2}: Mã tòa và Tên tòa là bắt buộc.`);
            return;
          }
          parsedBuildings.push({
            id: `BLD_${id}`,
            name,
            address: String(row[2] || '').trim(),
            type: 'Owned',
            totalFloors: 1,
            hostId,
            createdAt: new Date().toISOString()
          });
        });

        // Map lưu mã gốc để tra cứu
        const buildingIdMap = new Map<string, string>();
        parsedBuildings.forEach((b, idx) => buildingIdMap.set(String(rawBuildings[idx][0]).trim(), b.id));

        // 2. Xử lý Rooms (Phòng)
        const parsedRooms: Room[] = [];
        const roomIdMap = new Map<string, string>(); // Original room ID -> New room ID
        rawRooms.forEach((row, idx) => {
          const id = String(row[0] || '').trim();
          const oldBuildingId = String(row[1] || '').trim();
          const name = String(row[2] || '').trim();
          const price = Number(row[3]);
          const floor = Number(row[4]);

          if (!id || !oldBuildingId || !name || isNaN(price) || isNaN(floor)) {
            errors.push(`Tab [Phòng_Trọ] Dòng ${idx+2}: Thiếu Mã phòng, Mã tòa, Tên, Giá, hoặc Tầng.`);
            return;
          }

          const realBuildingId = buildingIdMap.get(oldBuildingId);
          if (!realBuildingId) {
             errors.push(`Tab [Phòng_Trọ] Dòng ${idx+2}: Tòa nhà mã '${oldBuildingId}' không tồn tại trong sheet Tòa_Nhà.`);
             return;
          }

          const newRoomId = `R_${id}_${Math.random().toString(36).substr(2, 5)}`;
          roomIdMap.set(id, newRoomId);

          parsedRooms.push({
            id: newRoomId,
            buildingId: realBuildingId,
            hostId,
            name,
            price,
            floor,
            status: 'Trống',
            createdAt: new Date().toISOString()
          });
        });

        // 3. Xử lý Customers (Khách Thuê)
        const parsedCustomers: Customer[] = [];
        rawCustomers.forEach((row, idx) => {
          const name = String(row[0] || '').trim();
          const phone = String(row[1] || '').trim();
          const pBuildingId = String(row[10] || '').trim();
          const pRoomId = String(row[11] || '').trim();

          if (!name || !phone) {
            errors.push(`Tab [Khách_Thuê] Dòng ${idx+2}: Cần tối thiểu Tên và Điện thoại.`);
            return;
          }

          const c: Customer = {
            id: `C_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name, phone,
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
            createdAt: new Date().toISOString()
          };

          // NOTE: Currently we just link Customer passively? Customer needs Contract to be in room.
          // Or we can manually map. But the bulk import doesn't create contracts.
          // Wait, I will just import the raw customer profiles. 
          parsedCustomers.push(c);
        });

        // 4. Xử lý Equipment
        const parsedEquipment: Equipment[] = [];
        rawEquipment.forEach((row, idx) => {
          const name = String(row[0] || '').trim();
          const originalBuildingId = String(row[1] || '').trim();
          const originalRoomId = String(row[2] || '').trim();
          const price = Number(row[4]);

          if (!name || !originalBuildingId || isNaN(price)) {
            errors.push(`Tab [Trang_Thiết_Bị] Dòng ${idx+2}: Thiếu Tên tài sản, Mã tòa hoặc Giá mua.`);
            return;
          }

          const realBuildingId = buildingIdMap.get(originalBuildingId);
          if (!realBuildingId) {
             errors.push(`Tab [Trang_Thiết_Bị] Dòng ${idx+2}: Tòa nhà mã '${originalBuildingId}' không tồn tại trong sheet Tòa_Nhà.`);
             return;
          }

          let realRoomId: string | undefined = undefined;
          if (originalRoomId) {
             realRoomId = roomIdMap.get(originalRoomId);
             // If room specified but not found, it's an error? Or ignore?
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
            purchaseDate: String(row[5] || '').trim() || new Date().toISOString().split('T')[0],
            notes: String(row[6] || '').trim(),
            hostId,
            createdAt: new Date().toISOString()
          });
        });

        resolve({
          buildings: parsedBuildings,
          rooms: parsedRooms,
          customers: parsedCustomers,
          equipment: parsedEquipment,
          errors
        });

      } catch (err: any) {
        reject(err.message || 'Lỗi khi đọc file Excel');
      }
    };

    reader.onerror = () => {
      reject("Không thể đọc file.");
    };

    reader.readAsBinaryString(file);
  });
}
