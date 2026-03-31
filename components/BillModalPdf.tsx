import React from 'react';
import { Copy, Download, Mail, MessageCircle, Printer, QrCode, Send, Share2, X } from 'lucide-react';
import { formatCurrency, useApp } from '../AppContext';
import { buildBillDocumentHtml, buildBillShareText, buildBillTransferContent } from '../utils/paymentBills';
import { openPrintDocument } from '../utils/printDocument';
import type { RoomBill } from '../utils/paymentBills';

interface BillModalPdfProps {
    bill: RoomBill;
    onClose: () => void;
}

export default function BillModalPdf({ bill, onClose }: BillModalPdfProps) {
    const { bankInfo } = useApp();

    const shareText = React.useMemo(() => buildBillShareText(bill, bankInfo), [bill, bankInfo]);
    const documentHtml = React.useMemo(() => buildBillDocumentHtml(bill, bankInfo), [bill, bankInfo]);
    const transferContent = React.useMemo(() => buildBillTransferContent(bill), [bill]);
    const qrAmount = bill.pendingAmount > 0 ? bill.pendingAmount : bill.totalAmount;

    const qrUrl = bankInfo.bankName && bankInfo.accountNumber && bankInfo.accountName
        ? `https://img.vietqr.io/image/${bankInfo.bankName}-${bankInfo.accountNumber}-compact.png?amount=${qrAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankInfo.accountName)}`
        : '';

    const handleCopy = async (withAlert = true) => {
        try {
            await navigator.clipboard.writeText(shareText);
            if (withAlert) {
                alert('Đã sao chép nội dung bill để gửi cho khách.');
            }
        } catch (error) {
            console.error('Copy bill text failed', error);
            if (withAlert) {
                alert('Không sao chép được nội dung bill trên trình duyệt này.');
            }
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Phiếu thu phòng ${bill.roomName} kỳ ${bill.period}`,
                    text: shareText,
                });
                return;
            } catch (error) {
                console.error('Native share cancelled or failed', error);
            }
        }

        await handleCopy(true);
    };

    const handleOpenChannel = async (url: string, label: string) => {
        await handleCopy(false);
        window.open(url, '_blank', 'noopener,noreferrer');
        alert(`Đã sao chép nội dung bill. Mở ${label} và dán để gửi cho khách.`);
    };

    const handleOpenEmail = () => {
        const subject = encodeURIComponent(`Phiếu thu phòng ${bill.roomName} kỳ ${bill.period}`);
        const body = encodeURIComponent(shareText);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const handleExportPdf = () => {
        openPrintDocument(documentHtml, {
            title: `Phieu thu ${bill.roomName} ${bill.period}`,
            autoPrint: true,
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/80">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Phiếu thu theo phòng</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {bill.roomLabel} · kỳ {bill.period} · mã {bill.id}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                        <div className="space-y-6">
                            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">Tòa nhà / phòng</div>
                                        <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{bill.roomLabel}</div>
                                        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{bill.buildingAddress || 'Chưa cập nhật địa chỉ tòa nhà'}</div>
                                    </div>
                                    <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                                        <div className="text-xs uppercase tracking-wide">Hạn thanh toán</div>
                                        <div className="mt-1 text-lg font-semibold">{bill.dueDate}</div>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-4 md:grid-cols-2">
                                    <div className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/80">
                                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Khách thuê</div>
                                        <div className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                                            {bill.customers.length === 0 ? 'Chưa cập nhật khách thuê' : bill.customers.map(customer => customer.name).join(', ')}
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                            {bill.customers.map(customer => customer.phone).filter(Boolean).join(', ') || 'Chưa cập nhật số điện thoại'}
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/80">
                                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Nội dung chuyển khoản</div>
                                        <div className="mt-2 rounded-xl bg-white px-3 py-3 font-mono text-xs text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                                            {transferContent}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="mb-4 flex items-center justify-between gap-4">
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Chi tiết khoản thu</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Các khoản dùng chung theo phòng đã được gộp để tránh lặp bill.</p>
                                    </div>
                                    {bill.mergedDuplicateCount > 0 && (
                                        <div className="rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300">
                                            Gộp {bill.mergedDuplicateCount} dòng trùng
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {bill.items.map(item => (
                                        <div key={item.id} className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-700">
                                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-slate-900 dark:text-white">{item.title}</div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                                        {item.scope === 'room' ? 'Dùng chung theo phòng' : item.customerNames.join(', ') || 'Theo hợp đồng'}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.note || item.description}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{formatCurrency(item.amount)}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.status}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 grid gap-4 md:grid-cols-2">
                                    <div className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/80">
                                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Tổng phiếu</div>
                                        <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{formatCurrency(bill.totalAmount)}</div>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/80">
                                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Còn phải thu</div>
                                        <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{formatCurrency(bill.pendingAmount)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-[1.75rem] border border-blue-200 bg-blue-50 p-5 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/20">
                                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                                    <QrCode className="h-4 w-4" />
                                    <h4 className="text-lg font-semibold">QR thanh toán</h4>
                                </div>
                                <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                    Mở popup in để lưu PDF, đồng thời có thể dùng QR này để gửi khách thanh toán nhanh.
                                </p>

                                <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
                                    {qrUrl ? (
                                        <img src={qrUrl} alt="QR thanh toán bill phòng" className="mx-auto h-64 w-64 object-contain" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="flex h-64 items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
                                            Chưa cấu hình tài khoản nhận tiền để tạo QR.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center gap-2">
                                    <Share2 className="h-4 w-4 text-slate-500" />
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Chia sẻ bill</h4>
                                </div>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Nội dung bill sẽ được sao chép sẵn trước khi mở Zalo hoặc Messenger.
                                </p>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={handleNativeShare}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white"
                                    >
                                        <Send className="h-4 w-4" />
                                        Chia sẻ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(true)}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                                    >
                                        <Copy className="h-4 w-4" />
                                        Sao chép
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenChannel('https://zalo.me/', 'Zalo')}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Zalo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenChannel('https://www.messenger.com/', 'Messenger')}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Messenger
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleOpenEmail}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200 sm:col-span-2"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Gửi email
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row">
                    <button
                        type="button"
                        onClick={handleExportPdf}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                        <Printer className="h-4 w-4" />
                        In phiếu
                    </button>
                    <button
                        type="button"
                        onClick={handleExportPdf}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                        <Download className="h-4 w-4" />
                        Xuất PDF
                    </button>
                    <button
                        type="button"
                        onClick={handleNativeShare}
                        className="inline-flex flex-[1.2] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white"
                    >
                        <Send className="h-4 w-4" />
                        Chia sẻ bill
                    </button>
                </div>
            </div>
        </div>
    );
}
