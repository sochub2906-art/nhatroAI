import React, { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, X, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Customer, Equipment } from '../types';
import { ImportType, downloadImportTemplate, parseExcelImport } from '../utils/excelImport';
import { useApp } from '../AppContext';

interface BulkImportModalProps {
  type: ImportType;
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkImportModal({ type, isOpen, onClose }: BulkImportModalProps) {
  const { addCustomersBulk, addEquipmentBulk, rooms, buildings } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [data, setData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1 = Upload, 2 = Review

  if (!isOpen) return null;

  const resetState = () => {
    setData([]);
    setErrors([]);
    setStep(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleDownloadTemplate = () => {
    downloadImportTemplate(type);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrors([]);
    
    try {
      const result = await parseExcelImport<any>(file, type);
      
      // Additional Cross-Validation
      let extraErrors: string[] = [];
      const validData: any[] = [];

      if (type === 'equipment') {
        const equipmentData = result.data as Equipment[];
        equipmentData.forEach((eq, index) => {
          const b = buildings.find(bld => bld.id === eq.buildingId);
          if (!b) {
            extraErrors.push(`Dòng ${index + 2}: Tòa nhà "${eq.buildingId}" không tồn tại trên hệ thống.`);
          } else if (eq.roomId) {
            const r = rooms.find(room => room.id === eq.roomId && room.buildingId === eq.buildingId);
            if (!r) {
              extraErrors.push(`Dòng ${index + 2}: Phòng "${eq.roomId}" không thuộc tòa nhà "${eq.buildingId}" hoặc không tồn tại.`);
            }
          }
          if (b) validData.push(eq);
        });
      } else {
         // customers
         validData.push(...result.data);
      }

      const allErrors = [...result.errors, ...extraErrors];
      
      setData(validData);
      setErrors(allErrors);
      setStep(2);

    } catch (err: any) {
      setErrors([err.toString()]);
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommit = () => {
    if (data.length === 0) return;

    if (type === 'customers') {
      addCustomersBulk(data as Customer[]);
    } else {
      addEquipmentBulk(data as Equipment[]);
    }
    
    alert(`Đã nhập thành công ${data.length} bản ghi!`);
    handleClose();
  };

  const title = type === 'customers' ? 'Nhập Khách Hàng Từ Excel' : 'Nhập Trang Thiết Bị Từ Excel';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="text-green-600" size={20} />
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Hướng dẫn nhập liệu:</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>Tải file Excel mẫu về máy để xem định dạng chuẩn.</li>
                  <li>Điền dữ liệu vào file mẫu (Không thay đổi tên cột).</li>
                  <li>Tải lên file đã điền để hệ thống cập nhật tự động.</li>
                  {type === 'equipment' && <li><strong>Lưu ý:</strong> Cần nhập đúng Mã Tòa Nhà và Mã Phòng (lấy từ dữ liệu trong hệ thống).</li>}
                </ul>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="mt-4 px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <Download size={16} /> Tải file mẫu ({type}.xlsx)
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-800/50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <RefreshCw size={32} className="animate-spin mb-4 text-blue-500" />
                    <p>Đang xử lý file...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                      <Upload size={28} />
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium mb-1">Kéo thả file tải lên hoặc nhấn để Chọn file</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">Định dạng hỗ trợ: .xlsx, .xls</p>
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm"
                    >
                      Chọn File Excel
                    </button>

                    {errors.length > 0 && step === 1 && (
                       <div className="mt-4 text-left w-full text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900">
                          <p className="font-semibold flex items-center gap-1 mb-1"><AlertCircle size={14}/> Có lỗi xảy ra:</p>
                          <ul className="list-disc list-inside">
                            {errors.map((e, idx) => <li key={idx}>{e}</li>)}
                          </ul>
                       </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Kết quả kiểm tra dữ liệu</h3>
                  <p className="text-sm text-gray-500">
                    Hợp lệ: <strong className="text-green-600">{data.length}</strong> dòng
                    {errors.length > 0 && <span className="ml-2">| Lỗi: <strong className="text-red-600">{errors.length}</strong> báo cáo</span>}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetState}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Chọn file khác
                </button>
              </div>

              {errors.length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900 max-h-48 overflow-y-auto">
                  <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-1">
                    <AlertCircle size={16} /> Các dòng bị bỏ qua / Cảnh báo:
                  </h4>
                  <ul className="text-xs text-orange-700 dark:text-orange-300 space-y-1 list-disc list-inside">
                    {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                  </ul>
                </div>
              )}

              {data.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900">
                   <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-1">
                    <Check size={16} /> Dữ liệu sẵn sàng để nhập:
                  </h4>
                  <div className="max-h-60 overflow-y-auto w-full text-xs">
                    <table className="w-full text-left bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <tr>
                          {type === 'customers' ? (
                            <>
                              <th className="p-2 font-medium">Tên khách</th>
                              <th className="p-2 font-medium">SĐT</th>
                              <th className="p-2 font-medium">CMND/CCCD</th>
                            </>
                          ) : (
                            <>
                              <th className="p-2 font-medium">Tên tài sản</th>
                              <th className="p-2 font-medium">Tòa nhà</th>
                              <th className="p-2 font-medium">Trị giá</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {data.slice(0, 50).map((row, idx) => (
                           <tr key={idx}>
                             {type === 'customers' ? (
                               <>
                                <td className="p-2 font-semibold text-gray-900 dark:text-white truncate">{row.name}</td>
                                <td className="p-2 text-gray-600 dark:text-gray-400">{row.phone}</td>
                                <td className="p-2 text-gray-600 dark:text-gray-400">{row.idNumber || '-'}</td>
                               </>
                             ) : (
                                <>
                                <td className="p-2 font-semibold text-gray-900 dark:text-white truncate">{row.name}</td>
                                <td className="p-2 text-gray-600 dark:text-gray-400">{row.buildingId}</td>
                                <td className="p-2 text-gray-600 dark:text-gray-400">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.price)}</td>
                               </>
                             )}
                           </tr>
                        ))}
                      </tbody>
                    </table>
                    {data.length > 50 && <p className="text-center py-2 text-gray-500 font-medium">... và {data.length - 50} bản ghi khác</p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
          <button
            onClick={handleClose}
            className="px-4 py-2 font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Hủy bỏ
          </button>
          {step === 2 && data.length > 0 && (
            <button
              onClick={handleCommit}
              className="px-4 py-2 font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 flex items-center gap-2"
            >
              <Check size={16} /> Lưu vào hệ thống
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
