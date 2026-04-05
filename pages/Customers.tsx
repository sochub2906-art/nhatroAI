import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Home, LayoutGrid, List, Plus, QrCode, Search, FileSpreadsheet, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import CCCDScannerModal from '../components/CCCDScannerModal';
import QuickContractWizard from '../components/QuickContractWizardEnhanced';
import BulkImportModal from '../components/BulkImportModal';
import { useApp } from '../AppContext';
import { applyCustomerQrData, createCustomerDraft, type CustomerDraft } from '../utils/customerIdentity';
import { downloadResidenceDeclarationFile } from '../utils/residenceDeclaration';
import SmartDateInput from '../components/SmartDateInput';

export default function Customers() {
    const { customers, contracts, rooms, buildings, currentUser, addCustomer, updateCustomer, deleteCustomer, terminateContract } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [newCustomer, setNewCustomer] = useState<CustomerDraft>(createCustomerDraft());

    const filteredCustomers = customers.filter(customer => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return true;
        return customer.name.toLowerCase().includes(query) || customer.phone.includes(query) || (customer.idNumber || '').includes(query);
    });

    const getActiveContract = (customerId: string) => contracts.find(item => item.customerId === customerId && item.isActive) || null;

    const getActiveRoom = (customerId: string) => {
        const contract = getActiveContract(customerId);
        if (!contract) return null;
        return rooms.find(room => room.id === contract.roomId) || null;
    };

    const resetDraft = () => setNewCustomer(createCustomerDraft());

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!newCustomer.name || !newCustomer.phone) return;
        addCustomer(newCustomer);
        resetDraft();
        setIsModalOpen(false);
    };

    const handleExportDeclaration = (customerId: string) => {
        const customer = customers.find(item => item.id === customerId);
        if (!customer) return;

        const contract = getActiveContract(customerId);
        const room = contract ? rooms.find(item => item.id === contract.roomId) || null : null;
        const building = room ? buildings.find(item => item.id === room.buildingId) || null : null;

        downloadResidenceDeclarationFile({
            customer,
            contract,
            room,
            building,
            host: currentUser,
        });

        updateCustomer({
            ...customer,
            residenceAddress: customer.residenceAddress || customer.currentAddress || customer.permanentAddress || '',
            declarationCreated: true,
            declarationCreatedAt: new Date().toISOString(),
            declarationStatus: 'created',
        });
    };

    const openDeleteModal = (customer: any) => {
        setCustomerToDelete(customer);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!customerToDelete) return;
        setIsDeleting(true);
        try {
            await deleteCustomer(customerToDelete.id);
            setIsDeleteModalOpen(false);
            setCustomerToDelete(null);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleTerminateAndConfirm = async () => {
        if (!customerToDelete) return;
        setIsDeleting(true);
        try {
            const activeContract = getActiveContract(customerToDelete.id);
            if (activeContract) {
                await terminateContract(activeContract.id);
            }
            await deleteCustomer(customerToDelete.id);
            setIsDeleteModalOpen(false);
            setCustomerToDelete(null);
        } finally {
            setIsDeleting(false);
        }
    };

    const renderRoomPill = (customerId: string) => {
        const room = getActiveRoom(customerId);
        if (!room) return <span className="text-xs italic text-slate-400">Chưa có phòng</span>;
        return (
            <Link
                to={`/app/rooms/${room.id}`}
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
            >
                <Home className="h-3.5 w-3.5" />
                {room.name}
            </Link>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Khách thuê</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Hiển thị dạng card trên mobile, có luồng quét QR CCCD và xuất CT01 PDF ngay từ danh sách.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative min-w-0 sm:w-72">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)}
                            placeholder="Tìm theo tên, SĐT, CCCD..."
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsBulkImportOpen(true)}
                        className="rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        Nhập từ Excel
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsWizardOpen(true)}
                        className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                    >
                        Tạo nhanh
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            resetDraft();
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="h-4 w-4" />
                        Thêm khách
                    </button>
                </div>
            </div>

            <BulkImportModal 
                type="customers"
                isOpen={isBulkImportOpen}
                onClose={() => setIsBulkImportOpen(false)}
            />

            {/* Mobile view toggle */}
            <div className="flex items-center gap-2 lg:hidden">
                <button type="button" onClick={() => setViewMode('card')} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${viewMode === 'card' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Dạng card">
                    <LayoutGrid className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => setViewMode('list')} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${viewMode === 'list' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Dạng danh sách">
                    <List className="h-5 w-5" />
                </button>
                <span className="text-xs text-slate-400 dark:text-slate-500">{filteredCustomers.length} khách thuê</span>
            </div>

            <div className="hidden overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                            <tr>
                                <th className="px-5 py-4">Mã khách</th>
                                <th className="px-5 py-4">Họ tên</th>
                                <th className="px-5 py-4">Phòng</th>
                                <th className="px-5 py-4">Điện thoại</th>
                                <th className="px-5 py-4">CCCD</th>
                                <th className="px-5 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{customer.id}</td>
                                    <td className="px-5 py-4">
                                        <Link to={`/app/customers/${customer.id}`} className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                                            {customer.name}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-4">{renderRoomPill(customer.id)}</td>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{customer.phone}</td>
                                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{customer.idNumber || 'Chưa cập nhật'}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleExportDeclaration(customer.id)}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 transition hover:text-violet-700 dark:text-violet-400"
                                                title="Xuất tờ khai CT01"
                                            >
                                                <FileText className="h-4 w-4" />
                                                CT01
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal(customer)}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-red-500 transition hover:text-red-700 dark:text-red-400"
                                                title="Xóa khách"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Xóa
                                            </button>
                                            <Link to={`/app/customers/${customer.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                                                Chi tiết
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className={`grid gap-4 lg:hidden ${viewMode !== 'card' ? 'hidden' : ''}`}>
                {filteredCustomers.map(customer => (
                    <div key={customer.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <Link to={`/app/customers/${customer.id}`} className="block truncate font-semibold text-slate-900 dark:text-white">
                                    {customer.name}
                                </Link>
                                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{customer.id}</div>
                            </div>
                            {renderRoomPill(customer.id)}
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                            <div>Điện thoại: {customer.phone}</div>
                            <div>CCCD: {customer.idNumber || 'Chưa cập nhật'}</div>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => handleExportDeclaration(customer.id)}
                                className="inline-flex flex-1 min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-2 py-2.5 text-xs font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300"
                            >
                                <FileText className="h-4 w-4" />
                                CT01
                            </button>
                            <button
                                type="button"
                                onClick={() => openDeleteModal(customer)}
                                className="inline-flex flex-1 min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-2 py-2.5 text-xs font-medium text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                            >
                                <Trash2 className="h-4 w-4" />
                                Xóa
                            </button>
                            <Link
                                to={`/app/customers/${customer.id}`}
                                className="inline-flex flex-1 min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-slate-200 px-2 py-2.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                            >
                                Chi tiết
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile List View */}
            <div className={`space-y-2 lg:hidden ${viewMode !== 'list' ? 'hidden' : ''}`}>
                {filteredCustomers.map(customer => (
                    <Link key={customer.id} to={`/app/customers/${customer.id}`} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:bg-slate-50 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">
                        <div className="min-w-0 flex-1">
                            <div className="truncate font-semibold text-slate-900 dark:text-white">{customer.name}</div>
                            <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{customer.phone} • {customer.idNumber || 'Chưa có CCCD'}</div>
                        </div>
                        <div className="flex-shrink-0">{renderRoomPill(customer.id)}</div>
                    </Link>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
                    <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Thêm khách thuê</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Tự sinh mã khách và cho phép quét QR CCCD trên mobile.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsScannerOpen(true)}
                                className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                            >
                                <QrCode className="h-4 w-4" />
                                Quét QR CCCD
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <input value={newCustomer.id} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" />
                                <input required value={newCustomer.name} onChange={event => setNewCustomer(prev => ({ ...prev, name: event.target.value }))} placeholder="Họ tên" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                                <input required value={newCustomer.phone} onChange={event => setNewCustomer(prev => ({ ...prev, phone: event.target.value, zalo: prev.zalo || event.target.value }))} placeholder="Điện thoại" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                                <input value={newCustomer.zalo} onChange={event => setNewCustomer(prev => ({ ...prev, zalo: event.target.value }))} placeholder="Zalo" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                                <input type="email" value={newCustomer.email} onChange={event => setNewCustomer(prev => ({ ...prev, email: event.target.value }))} placeholder="Email" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                                <input value={newCustomer.occupation || ''} onChange={event => setNewCustomer(prev => ({ ...prev, occupation: event.target.value }))} placeholder="Nghề nghiệp" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                            </div>

                            <div className="rounded-[1.75rem] border border-slate-200 p-4 dark:border-slate-800">
                                <div className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Thông tin CCCD</div>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <input value={newCustomer.idNumber || ''} onChange={event => setNewCustomer(prev => ({ ...prev, idNumber: event.target.value }))} placeholder="Số CCCD" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                                    <SmartDateInput value={newCustomer.dateOfBirth || ''} onChange={value => setNewCustomer(prev => ({ ...prev, dateOfBirth: value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                                    <select value={newCustomer.gender || 'Nam'} onChange={event => setNewCustomer(prev => ({ ...prev, gender: event.target.value as CustomerDraft['gender'] }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                    <SmartDateInput value={newCustomer.idIssueDate || ''} onChange={value => setNewCustomer(prev => ({ ...prev, idIssueDate: value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                                    <input value={newCustomer.idIssuePlace || ''} onChange={event => setNewCustomer(prev => ({ ...prev, idIssuePlace: event.target.value }))} placeholder="Nơi cấp" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                                    <input value={newCustomer.nationality || 'Việt Nam'} onChange={event => setNewCustomer(prev => ({ ...prev, nationality: event.target.value }))} placeholder="Quốc tịch" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                                </div>
                                <div className="mt-4 grid gap-4 md:grid-cols-2">
                                    <input value={newCustomer.placeOfOrigin || ''} onChange={event => setNewCustomer(prev => ({ ...prev, placeOfOrigin: event.target.value }))} placeholder="Nguyên quán" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                                    <input value={newCustomer.permanentAddress || ''} onChange={event => setNewCustomer(prev => ({ ...prev, permanentAddress: event.target.value, currentAddress: prev.currentAddress || event.target.value }))} placeholder="Địa chỉ thường trú" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                                </div>
                                <input value={newCustomer.currentAddress || ''} onChange={event => setNewCustomer(prev => ({ ...prev, currentAddress: event.target.value }))} placeholder="Địa chỉ tạm trú hiện tại" className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                            </div>

                            <div className="flex flex-col gap-3 border-t border-slate-100 pt-2 dark:border-slate-800 sm:flex-row sm:justify-end">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">Hủy</button>
                                <button type="submit" className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20">Lưu khách thuê</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isWizardOpen && <QuickContractWizard onClose={() => setIsWizardOpen(false)} />}
            {isScannerOpen && (
                <CCCDScannerModal
                    onClose={() => setIsScannerOpen(false)}
                    onDetect={rawValue => setNewCustomer(prev => applyCustomerQrData(prev, rawValue))}
                />
            )}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                onTerminateAndConfirm={handleTerminateAndConfirm}
                title="Xóa khách thuê"
                message="Bạn có chắc chắn muốn xóa khách hàng"
                itemName={customerToDelete?.name || ''}
                activeContractId={contracts.find(c => c.customerId === customerToDelete?.id && c.isActive)?.id}
                isLoading={isDeleting}
            />
        </div>
    );
}
