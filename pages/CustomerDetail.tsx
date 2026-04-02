import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp, formatCurrency } from '../AppContext';
import { ArrowLeft, User, Phone, Mail, CreditCard, History, CheckCircle, AlertCircle, Clock, BadgeCheck, Image, Loader2, Eye, X, FileText, Upload, Trash2, Edit3, Save } from 'lucide-react';
import { Payment } from '../types';
import { downloadResidenceDeclarationFile } from '../utils/residenceDeclaration';
import { compressImageFile } from '../utils/imageCompressor';

export default function CustomerDetail() {
  const { customerId } = useParams();
  const { customers, contracts, payments, rooms, buildings, markPaymentPaid, currentUser, getCustomerImagesFromSheet, hostFeatureFlags, updateCustomer } = useApp();

  const [sheetImages, setSheetImages] = useState<{ idFrontImage?: string; idBackImage?: string; avatarImage?: string } | null>(null);
  const [loadingImages, setLoadingImages] = useState(false);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const customer = customers.find(c => c.id === customerId);
  const customerContracts = contracts.filter(c => c.customerId === customerId);
  const activeContract = customerContracts.find(c => c.isActive) || null;
  const contractIds = customerContracts.map(c => c.id);
  const customerPayments = payments.filter(p => contractIds.includes(p.contractId)).sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  const activeRoom = activeContract ? rooms.find(r => r.id === activeContract.roomId) || null : null;
  const activeBuilding = activeRoom ? buildings.find(b => b.id === activeRoom.buildingId) || null : null;

  const totalDebt = customerPayments
    .filter(p => p.status !== 'Đã đóng')
    .reduce((sum, p) => sum + p.amount, 0);

  useEffect(() => {
    if (customer?.notes !== undefined && !isEditingNotes) {
      setNotesText(customer.notes || '');
    }
  }, [customer?.notes, isEditingNotes]);

  if (!customer) return <div className="p-6">Không tìm thấy khách thuê!</div>;

  // Merge customer stored images with sheet images
  const displayImages = {
    avatarImage: sheetImages?.avatarImage || customer.avatarImage || '',
    idFrontImage: sheetImages?.idFrontImage || customer.idFrontImage || '',
    idBackImage: sheetImages?.idBackImage || customer.idBackImage || '',
  };

  // Fetch images from Google Sheet
  const handleFetchImages = async () => {
    if (!currentUser || !customerId) return;
    setLoadingImages(true);
    try {
      const result = await getCustomerImagesFromSheet(currentUser.id, customerId);
      if (result.success) {
        setSheetImages({
          idFrontImage: result.idFrontImage || customer.idFrontImage || '',
          idBackImage: result.idBackImage || customer.idBackImage || '',
          avatarImage: result.avatarImage || customer.avatarImage || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
    }
    setLoadingImages(false);
  };

  // Silent image upload handler
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'avatarImage' | 'idFrontImage' | 'idBackImage') => {
    const file = event.target.files?.[0];
    if (!file || !customer) return;
    event.target.value = '';

    setUploadingSlot(field);
    const compressed = await compressImageFile(file);
    if (compressed) {
      updateCustomer({ ...customer, [field]: compressed });
    }
    setUploadingSlot(null);
  };

  // Silent image delete handler
  const handleImageDelete = (field: 'avatarImage' | 'idFrontImage' | 'idBackImage') => {
    if (!customer) return;
    updateCustomer({ ...customer, [field]: '' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã đóng':
        return <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium border border-green-200 dark:border-green-800"><CheckCircle className="w-3 h-3" /> {status}</span>;
      case 'Quá hạn':
        return <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full text-xs font-medium border border-red-200 dark:border-red-800"><AlertCircle className="w-3 h-3" /> {status}</span>;
      default:
        return <span className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full text-xs font-medium border border-yellow-200 dark:border-yellow-800"><Clock className="w-3 h-3" /> {status}</span>;
    }
  };

  const handleExportDeclaration = () => {
    downloadResidenceDeclarationFile({ customer, contract: activeContract, room: activeRoom, building: activeBuilding, host: currentUser });
    updateCustomer({
      ...customer,
      residenceAddress: customer.residenceAddress || customer.currentAddress || customer.permanentAddress || '',
      declarationCreated: true,
      declarationCreatedAt: new Date().toISOString(),
      declarationStatus: 'created',
    });
  };

  const imageSlots: { label: string; field: 'avatarImage' | 'idFrontImage' | 'idBackImage'; src: string; ref: React.RefObject<HTMLInputElement | null> }[] = [
    { label: 'Ảnh chân dung', field: 'avatarImage', src: displayImages.avatarImage, ref: avatarInputRef },
    { label: 'CCCD Mặt trước', field: 'idFrontImage', src: displayImages.idFrontImage, ref: frontInputRef },
    { label: 'CCCD Mặt sau', field: 'idBackImage', src: displayImages.idBackImage, ref: backInputRef },
  ];

  // Hidden file inputs
  const fileInputs = (
    <>
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'avatarImage')} />
      <input ref={frontInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'idFrontImage')} />
      <input ref={backInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'idBackImage')} />
    </>
  );

  return (
    <div className="space-y-6">
      <Link to="/app/customers" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
      </Link>

      <button
        type="button"
        onClick={handleExportDeclaration}
        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
      >
        <FileText className="h-4 w-4" />
        Xuất CT01 PDF
      </button>

      {fileInputs}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              {displayImages.avatarImage ? (
                <img
                  src={displayImages.avatarImage}
                  alt={customer.name}
                  className="w-20 h-20 rounded-full object-cover shadow-lg mb-4 border-4 border-blue-200 dark:border-blue-800 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setViewImage(displayImages.avatarImage)}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
                  {customer.name.split(' ').pop()?.charAt(0)}
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Mã khách: {customer.id}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <span>Zalo: {customer.zalo}</span>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Tổng hợp công nợ</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Tổng nợ hiện tại:</span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalDebt)}</span>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Hợp đồng đang thuê:</p>
                {customerContracts.filter(c => c.isActive).map(c => {
                  const room = rooms.find(r => r.id === c.roomId);
                  return (
                    <div key={c.id} className="flex justify-between text-sm font-medium text-blue-900 dark:text-blue-200">
                      <span>Phòng {room?.name || c.roomId}</span>
                      <span>{formatCurrency(c.price)}/tháng</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Ghi chú</h3>
              {!isEditingNotes ? (
                <button onClick={() => setIsEditingNotes(true)} className="text-gray-400 hover:text-blue-500 transition-colors" title="Sửa ghi chú">
                  <Edit3 size={18} />
                </button>
              ) : (
                <button onClick={() => {
                  setIsEditingNotes(false);
                  updateCustomer({ ...customer, notes: notesText });
                }} className="text-green-600 hover:text-green-700 transition-colors" title="Lưu ghi chú">
                  <Save size={18} />
                </button>
              )}
            </div>
            {isEditingNotes ? (
              <textarea
                value={notesText}
                onChange={e => setNotesText(e.target.value)}
                className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 p-3 shadow-sm"
                rows={5}
                placeholder="Nhập ghi chú hoặc thông tin đặc biệt về khách hàng này..."
                autoFocus
              />
            ) : (
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap min-h-[60px] p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                {customer.notes || <span className="italic text-gray-400">Chưa có ghi chú nào...</span>}
              </div>
            )}
          </div>
        </div>

        {/* KYC Card + Images */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><BadgeCheck className="text-blue-500 w-5 h-5" /> Xác minh danh tính (KYC)</h3>
              {hostFeatureFlags.cccdReader && (
                <button
                  onClick={handleFetchImages}
                  disabled={loadingImages}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 disabled:opacity-50 transition-colors"
                >
                  {loadingImages ? <Loader2 size={14} className="animate-spin" /> : <Image size={14} />}
                  {loadingImages ? 'Đang tải...' : 'Đồng bộ ảnh từ Google Sheet'}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 mb-1">Số CCCD/CMND</p>
                <p className="font-semibold text-gray-900 dark:text-white">{customer.idNumber || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 mb-1">Ngày cấp</p>
                <p className="font-semibold text-gray-900 dark:text-white">{customer.idIssueDate || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 mb-1">Nơi cấp</p>
                <p className="font-semibold text-gray-900 dark:text-white">{customer.idIssuePlace || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
              </div>
            </div>

            {/* Inline Image Gallery with Upload */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Eye size={16} className="text-blue-500" /> Hình ảnh CCCD & Chân dung
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {imageSlots.map(slot => (
                  <div key={slot.field} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs font-medium text-center py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{slot.label}</p>
                    {slot.src ? (
                      <div className="relative group">
                        <div
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setViewImage(slot.src)}
                        >
                          <img
                            src={slot.src}
                            alt={slot.label}
                            className="w-full h-48 object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150"><rect width="200" height="150" fill="%23f1f5f9"/><text x="100" y="75" text-anchor="middle" fill="%2394a3b8" font-size="12">Không tải được</text></svg>'); }}
                          />
                        </div>
                        {hostFeatureFlags.imageUpload && (
                          <button
                            type="button"
                            onClick={() => handleImageDelete(slot.field)}
                            className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                            title="Xóa ảnh"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center text-gray-400 text-sm italic">
                        Chưa có ảnh
                      </div>
                    )}
                    {hostFeatureFlags.imageUpload && (
                      <button
                        type="button"
                        onClick={() => slot.ref.current?.click()}
                        disabled={uploadingSlot === slot.field}
                        className="flex w-full items-center justify-center gap-1.5 border-t border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                      >
                        {uploadingSlot === slot.field ? (
                          <><Loader2 size={14} className="animate-spin" /> Đang nén...</>
                        ) : (
                          <><Upload size={14} /> Chọn ảnh</>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Image Lightbox */}
        {viewImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setViewImage(null)}>
            <div className="max-w-3xl max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
              <img src={viewImage} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
              <button onClick={() => setViewImage(null)} className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Debt History */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <History className="w-5 h-5 text-blue-500" />
              Lịch sử Công nợ & Thanh toán
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-4">Kỳ hạn</th>
                    <th className="p-4">Loại khoản</th>
                    <th className="p-4">Số tiền</th>
                    <th className="p-4">Hạn đóng</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {customerPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
                        Chưa có lịch sử thanh toán.
                      </td>
                    </tr>
                  ) : (
                    customerPayments.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="p-4 font-medium text-gray-900 dark:text-white">{p.period}</td>
                        <td className="p-4">
                          <div className="text-sm text-gray-900 dark:text-white font-medium">{p.type}</div>
                          {p.description && <div className="text-xs text-gray-500 dark:text-gray-400">{p.description}</div>}
                        </td>
                        <td className="p-4 font-bold text-gray-900 dark:text-white">{formatCurrency(p.amount)}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{p.dueDate}</td>
                        <td className="p-4">{getStatusBadge(p.status)}</td>
                        <td className="p-4 text-right">
                          {p.status !== 'Đã đóng' && (
                            <button
                              onClick={() => markPaymentPaid(p.id)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                              Xác nhận đóng
                            </button>
                          )}
                          {p.status === 'Đã đóng' && p.paidDate && (
                            <div className="text-[10px] text-gray-500 dark:text-gray-500">
                              Đã đóng ngày: {p.paidDate}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
