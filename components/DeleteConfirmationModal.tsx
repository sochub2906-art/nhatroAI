import React from 'react';
import { AlertTriangle, Trash2, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onTerminateAndConfirm?: () => void;
  title: string;
  message: string;
  itemName: string;
  activeContractId?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  onTerminateAndConfirm,
  title,
  message,
  itemName,
  activeContractId,
  isLoading
}: Props) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewContract = () => {
    if (activeContractId) {
      onClose();
      navigate(`/app/contracts/${activeContractId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in duration-300">
        
        {/* Decorative Header with Animated Warning Icon */}
        <div className="relative h-40 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 flex items-center justify-center">
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
            <div className="relative flex items-center justify-center h-24 w-24 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-4 border-white dark:border-slate-900 shadow-xl">
              <AlertTriangle className="h-12 w-12" />
            </div>
          </div>
        </div>

        <div className="p-8 pt-0 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {title}
          </h3>
          
          <div className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8">
            {message} 
            <div className="mt-2 inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100">
              {itemName}
            </div>
          </div>

          {activeContractId ? (
            <div className="mb-8 overflow-hidden rounded-3xl border border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/10 text-left">
              <div className="p-5">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm mb-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] dark:bg-red-900/50">!</span>
                  Cảnh báo: Đang có hợp đồng còn hiệu lực
                </div>
                <p className="text-xs text-red-500 dark:text-red-400/80 leading-relaxed mb-5">
                  Đối tượng này đang gắn liền với một hợp đồng đang hoạt động. Bạn nên kết thúc hợp đồng trước để đảm bảo tính giá trị của dữ liệu và an toàn dòng tiền.
                </p>
                
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={onTerminateAndConfirm}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                    Hủy hợp đồng & Xóa luôn
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleViewContract}
                    className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all active:scale-[0.98]"
                  >
                    <Eye className="h-5 w-5" />
                    Xem chi tiết hợp đồng
                  </button>
                </div>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors border-t border-red-100 dark:border-red-900/20"
              >
                Quay lại
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full py-4 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-lg font-bold shadow-xl shadow-red-600/20 transition-all active:scale-[0.97] disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
                Xác nhận xóa
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 px-8 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-lg transition-all active:scale-[0.97]"
              >
                Quay lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
