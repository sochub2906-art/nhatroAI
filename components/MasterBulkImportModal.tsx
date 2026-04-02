import React, { useState } from 'react';
import { Upload, X, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../AppContext';
import { downloadMasterTemplate, parseMasterExcelImport, MasterImportData } from '../utils/masterExcelImport';

interface MasterBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MasterBulkImportModal({ isOpen, onClose }: MasterBulkImportModalProps) {
  const { addBuilding, addRoomsBulk, addCustomersBulk, addEquipmentBulk, currentUser } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [importStats, setImportStats] = useState<any>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    downloadMasterTemplate();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrors([]);
      setSuccess(false);
      setImportStats(null);
    }
  };

  const handleImport = async () => {
    if (!file || !currentUser) return;
    setLoading(true);
    setErrors([]);
    
    try {
      const result: MasterImportData = await parseMasterExcelImport(file, currentUser.id);
      
      if (result.errors && result.errors.length > 0) {
        setErrors(result.errors);
        setLoading(false);
        return; // Dừng nếu có lỗi format từ file
      }

      if (result.buildings.length === 0 && result.rooms.length === 0 && result.customers.length === 0 && result.equipment.length === 0) {
         setErrors(['File không có dữ liệu để import.']);
         setLoading(false);
         return;
      }

      // Xử lý ghi dữ liệu vào hệ thống tuần tự
      // 1. Tòa nhà
      for (const b of result.buildings) {
          addBuilding(b, []);
      }

      // 2. Phòng và Thiết bị cùng lúc (hoặc tách riêng)
      if (result.rooms.length > 0) {
          addRoomsBulk(result.rooms, []); // Import raw rooms
      }
      
      if (result.equipment.length > 0) {
          addEquipmentBulk(result.equipment);
      }

      if (result.customers.length > 0) {
          addCustomersBulk(result.customers);
      }

      setImportStats({
        buildings: result.buildings.length,
        rooms: result.rooms.length,
        customers: result.customers.length,
        equipment: result.equipment.length
      });
      setSuccess(true);
    } catch (error: any) {
      setErrors([error.message || 'Lỗi không xác định']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Khởi tạo dữ liệu hệ thống</h3>
            <p className="mt-1 text-sm text-gray-500">Tải lên toàn bộ Tòa nhà, Phòng trọ, Khách thuê, Thiết bị chỉ với 1 file Excel.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!success ? (
            <>
              {/* Bước 1: Tải template */}
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/50">
                    <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300">Bước 1: Tải File Mẫu</h4>
                    <p className="mb-3 mt-1 text-sm text-blue-700 dark:text-blue-400">File mẫu đã có sẵn 4 Sheet (Tòa Nhà, Phòng Trọ, Khách Thuê, Trang Thiết Bị). Vui lòng nhập đúng cột bắt buộc.</p>
                    <button
                      onClick={handleDownloadTemplate}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Tải File Mẫu (.xlsx)
                    </button>
                  </div>
                </div>
              </div>

              {/* Bước 2: Upload */}
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <h4 className="mt-4 font-semibold text-gray-900 dark:text-white">Bước 2: Tải lên dữ liệu</h4>
                
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                />
              </div>

              {errors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10 max-h-40 overflow-y-auto">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2 font-semibold font-sm">
                    <AlertCircle className="h-4 w-4" /> Có {errors.length} lỗi trong file:
                  </div>
                  <ul className="list-disc pl-5 text-sm text-red-600 dark:text-red-400">
                    {errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Import Thành Công!</h3>
              
              <div className="mt-4 flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                 <div className="bg-gray-50 px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700">
                    <span className="font-bold block text-lg">{importStats?.buildings || 0}</span> Tòa nhà
                 </div>
                 <div className="bg-gray-50 px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700">
                    <span className="font-bold block text-lg">{importStats?.rooms || 0}</span> Phòng trọ
                 </div>
                 <div className="bg-gray-50 px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700">
                    <span className="font-bold block text-lg">{importStats?.customers || 0}</span> Khách thuê
                 </div>
                 <div className="bg-gray-50 px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700">
                    <span className="font-bold block text-lg">{importStats?.equipment || 0}</span> Thiết bị
                 </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 p-6 dark:border-gray-800">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Đóng
          </button>
          {!success && (
            <button
              onClick={handleImport}
              disabled={!file || loading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Bắt đầu Import'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
