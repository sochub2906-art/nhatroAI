import * as XLSX from 'xlsx';
import { Customer, Equipment } from '../types';

export type ImportType = 'customers' | 'equipment';

export const CUSTOMER_TEMPLATE_HEADERS = [
  'Tên khách hàng (*)', 'Điện thoại (*)', 'Email', 'Zalo', 'CCCD/CMND',
  'Ngày cấp', 'Nơi cấp', 'Ngày sinh', 'Giới tính (Nam/Nữ)', 'Quốc tịch',
  'Quê quán', 'Địa chỉ thường trú', 'Nghề nghiệp', 'Ghi chú'
];

export const EQUIPMENT_TEMPLATE_HEADERS = [
  'Tên tài sản (*)', 'Mã Tòa nhà (*)', 'Mã Phòng', 'Trạng thái (Tốt/Hỏng/Đang sửa/Thanh lý)',
  'Giá mua (*)', 'Ngày mua (YYYY-MM-DD)', 'Ghi chú'
];

export function downloadImportTemplate(type: ImportType) {
  const headers = type === 'customers' ? CUSTOMER_TEMPLATE_HEADERS : EQUIPMENT_TEMPLATE_HEADERS;
  const sheetName = type === 'customers' ? 'Khách_Thuê' : 'Trang_Thiết_Bị';
  
  const ws = XLSX.utils.aoa_to_sheet([headers]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Create some sample data
  if (type === 'customers') {
    XLSX.utils.sheet_add_aoa(ws, [['Nguyễn Văn A', '0987654321', 'nva@example.com', '0987654321', '001090123456', '2021-01-01', 'Cục cảnh sát ABC', '1990-01-01', 'Nam', 'Việt Nam', 'Hà Nội', '123 Phố X, Hà Nội', 'Kỹ sư', 'Khách VIP']], {origin: -1});
  } else {
    XLSX.utils.sheet_add_aoa(ws, [['Máy lạnh Daikin 1HP', 'BLD_1234', 'ROOM_5678', 'Tốt', 8500000, '2023-05-15', 'Còn bảo hành']], {origin: -1});
  }

  // Adjust column widths
  ws['!cols'] = headers.map(() => ({ wch: 20 }));

  XLSX.writeFile(wb, `Mau_Nhap_${sheetName}.xlsx`);
}

export async function parseExcelImport<T>(file: File, type: ImportType): Promise<{ data: T[], errors: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("File rỗng.");

        const wb = XLSX.read(data, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        
        // Convert array of arrays to list of objects
        const json = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
        
        if (json.length < 2) {
          return resolve({ data: [], errors: ["File Excel không có dữ liệu (có thể chỉ có tiêu đề)."] });
        }

        const headers = json[0];
        const rows = json.slice(1).filter(row => row.length > 0 && row.some(cell => cell !== undefined && cell !== ''));

        const parsedData: any[] = [];
        const errors: string[] = [];

        if (type === 'customers') {
          rows.forEach((row, rowIndex) => {
            const name = String(row[0] || '').trim();
            const phone = String(row[1] || '').trim();
            
            if (!name || !phone) {
              errors.push(`Dòng ${rowIndex + 2}: Thiếu Tên hoặc Điện thoại khách hàng.`);
              return;
            }

            const customer: Partial<Customer> = {
              id: `C${Date.now()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
              name,
              phone,
              email: String(row[2] || '').trim(),
              zalo: String(row[3] || '').trim() || phone,
              idNumber: String(row[4] || '').trim(),
              idIssueDate: String(row[5] || '').trim(),
              idIssuePlace: String(row[6] || '').trim(),
              dateOfBirth: String(row[7] || '').trim(),
              gender: (String(row[8] || '').trim() === 'Nữ' ? 'Nữ' : String(row[8] || '').trim() === 'Khác' ? 'Khác' : 'Nam'),
              nationality: String(row[9] || 'Việt Nam').trim(),
              placeOfOrigin: String(row[10] || '').trim(),
              currentAddress: String(row[11] || '').trim(),
              permanentAddress: String(row[11] || '').trim(),
              occupation: String(row[12] || '').trim(),
              notes: String(row[13] || '').trim(),
              createdAt: new Date().toISOString()
            };
            parsedData.push(customer);
          });
        } else if (type === 'equipment') {
          rows.forEach((row, rowIndex) => {
            const name = String(row[0] || '').trim();
            const buildingId = String(row[1] || '').trim();
            const priceVal = Number(row[4]);
            
            if (!name || !buildingId || isNaN(priceVal)) {
              errors.push(`Dòng ${rowIndex + 2}: Thiếu Tên tài sản, Mã Tòa nhà, hoặc Giá không hợp lệ.`);
              return;
            }

            let status = String(row[3] || 'Tốt').trim();
            if (!['Tốt', 'Hỏng', 'Đang sửa', 'Thanh lý'].includes(status)) {
               status = 'Tốt';
            }

            const equipment: Partial<Equipment> = {
              id: `EQ_${Date.now()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
              name,
              buildingId,
              roomId: String(row[2] || '').trim() || undefined,
              status: status as any,
              price: priceVal,
              purchaseDate: String(row[5] || '').trim() || new Date().toISOString().split('T')[0],
              notes: String(row[6] || '').trim(),
              createdAt: new Date().toISOString()
            };
            parsedData.push(equipment);
          });
        }

        resolve({ data: parsedData as T[], errors });

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
