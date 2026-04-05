import React, { useState } from 'react';
import { Upload, X, Download, AlertCircle, CheckCircle2, FileText, Users, Building2, Wrench, BookOpen } from 'lucide-react';
import { useApp } from '../AppContext';
import { downloadMasterTemplate, parseMasterExcelImport, MasterImportData } from '../utils/masterExcelImport';
import { Payment } from '../types';

interface MasterBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImportStats {
  buildings: number;
  rooms: number;
  customers: number;
  contracts: number;
  equipment: number;
  deposits: number;
}

export default function MasterBulkImportModal({ isOpen, onClose }: MasterBulkImportModalProps) {
  const { addBuilding, addRoomsBulk, addCustomersBulk, addEquipmentBulk, createContract, addEquipment, currentUser } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setErrors([]);
      setWarnings([]);
      setSuccess(false);
      setImportStats(null);
    }
  };

  const handleImport = async () => {
    if (!file || !currentUser) return;
    setLoading(true);
    setErrors([]);
    setWarnings([]);

    try {
      const result: MasterImportData = await parseMasterExcelImport(file, currentUser.id);

      // Tách errors thực sự (thiếu field bắt buộc) với warnings (bỏ qua HĐ)
      const hardErrors = result.errors.filter(e => !e.includes('bỏ qua HĐ'));
      const softWarnings = result.errors.filter(e => e.includes('bỏ qua HĐ'));

      if (hardErrors.length > 0) {
        setErrors(hardErrors);
        if (softWarnings.length > 0) setWarnings(softWarnings);
        setLoading(false);
        return;
      }

      if (softWarnings.length > 0) setWarnings(softWarnings);

      const isEmpty =
        result.buildings.length === 0 &&
        result.rooms.length === 0 &&
        result.customers.length === 0 &&
        result.equipment.length === 0;

      if (isEmpty) {
        setErrors(['File không có dữ liệu để import.']);
        setLoading(false);
        return;
      }

      // ── Ghi dữ liệu vào hệ thống theo thứ tự ───────────────
      // 1. Tòa nhà (cần trước để Phòng tham chiếu)
      for (const b of result.buildings) {
        addBuilding(b, []);
      }

      // 2. Phòng
      if (result.rooms.length > 0) {
        addRoomsBulk(result.rooms, []);
      }

      // 3. Trang thiết bị
      if (result.equipment.length > 0) {
        addEquipmentBulk(result.equipment);
      }

      // 4. Khách thuê
      if (result.customers.length > 0) {
        addCustomersBulk(result.customers);
      }

      // 5. Hợp đồng (sau customers để FK customer tồn tại)
      for (const contract of result.contracts) {
        createContract(contract);
      }

      // 6. Phiếu tiền cọc (tạo payment loại deposit)
      // Handled externally via contract creation – note for devs to extend if needed.

      setImportStats({
        buildings: result.buildings.length,
        rooms: result.rooms.length,
        customers: result.customers.length,
        contracts: result.contracts.length,
        equipment: result.equipment.length,
        deposits: result.deposits.length,
      });
      setSuccess(true);
    } catch (error: any) {
      setErrors([error.message || 'Lỗi không xác định khi đọc file.']);
    } finally {
      setLoading(false);
    }
  };

  const statCards = importStats
    ? [
        { icon: Building2, label: 'Tòa nhà', value: importStats.buildings, color: 'blue' },
        { icon: FileText, label: 'Phòng trọ', value: importStats.rooms, color: 'emerald' },
        { icon: Users, label: 'Khách thuê', value: importStats.customers, color: 'violet' },
        { icon: BookOpen, label: 'Hợp đồng', value: importStats.contracts, color: 'amber' },
        { icon: Wrench, label: 'Thiết bị', value: importStats.equipment, color: 'orange' },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Khởi tạo dữ liệu hệ thống</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tải lên toàn bộ Tòa nhà, Phòng trọ, Khách thuê, Hợp đồng và Thiết bị chỉ với 1 file Excel.
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {!success ? (
            <div className="space-y-5">
              {/* Bước 1: Tải mẫu */}
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300">Bước 1: Tải File Mẫu</h4>
                    <p className="mt-1 mb-3 text-sm text-blue-700 dark:text-blue-400">
                      File mẫu có 4 sheet: <strong>Tòa Nhà, Phòng Trọ, Khách Thuê, Trang Thiết Bị</strong>.
                      Sheet Khách Thuê có các cột bổ sung để tự động tạo <strong>hợp đồng</strong> và <strong>tiền cọc</strong>.
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-blue-600 dark:text-blue-400 mb-3">
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 dark:bg-blue-900/50">✓ Ngày vào ở</span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 dark:bg-blue-900/50">✓ Thời hạn HĐ</span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 dark:bg-blue-900/50">✓ Tiền cọc</span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 dark:bg-blue-900/50">✓ Tính điện/nước (Theo số/Khoán)</span>
                    </div>
                    <button
                      onClick={downloadMasterTemplate}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Tải File Mẫu (.xlsx)
                    </button>
                  </div>
                </div>
              </div>

              {/* Bước 2: Upload */}
              <div
                className={`rounded-lg border-2 border-dashed p-6 text-center transition ${
                  file
                    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/10'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <h4 className="mt-3 font-semibold text-gray-900 dark:text-white">Bước 2: Tải lên file đã điền</h4>
                {file ? (
                  <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ {file.name}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">Chọn file .xlsx hoặc .xls</p>
                )}
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                />
              </div>

              {/* Hard errors */}
              {errors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10 max-h-40 overflow-y-auto">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2 font-semibold">
                    <AlertCircle className="h-4 w-4" /> {errors.length} lỗi cần sửa trước khi import:
                  </div>
                  <ul className="list-disc pl-5 text-sm text-red-600 dark:text-red-400 space-y-1">
                    {errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              )}

              {/* Soft warnings */}
              {warnings.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/30 dark:bg-amber-900/10 max-h-32 overflow-y-auto">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1 font-medium text-sm">
                    <AlertCircle className="h-4 w-4" /> {warnings.length} cảnh báo (sẽ bỏ qua):
                  </div>
                  <ul className="list-disc pl-5 text-xs text-amber-600 dark:text-amber-400 space-y-0.5">
                    {warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* Success */
            <div className="py-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-9 w-9 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Import Thành Công!</h3>
              <p className="mt-1 text-sm text-gray-500">Dữ liệu đã được đưa vào hệ thống và đồng bộ lên cloud.</p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {statCards.map(({ icon: Icon, label, value, color }) => (
                  <div
                    key={label}
                    className={`rounded-xl border bg-${color}-50 dark:bg-${color}-900/10 border-${color}-100 dark:border-${color}-900/30 p-3`}
                  >
                    <Icon className={`mx-auto h-5 w-5 text-${color}-500 mb-1`} />
                    <span className="block text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                ))}
              </div>

              {warnings.length > 0 && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-left dark:border-amber-900/30 dark:bg-amber-900/10">
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    ⚠️ {warnings.length} hợp đồng bị bỏ qua do thiếu thông tin phòng. Bạn có thể tạo hợp đồng thủ công.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 p-5 dark:border-gray-800">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {success ? 'Đóng' : 'Hủy'}
          </button>
          {!success && (
            <button
              onClick={handleImport}
              disabled={!file || loading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                'Bắt đầu Import'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
