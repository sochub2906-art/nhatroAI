import React, { useMemo, useState } from 'react';
import { CheckCircle, CheckSquare, ChevronLeft, ChevronRight, CreditCard, MapPinHouse, QrCode, Search, Square, UserCheck, UserPlus } from 'lucide-react';
import { formatCurrency, SERVICE_PRESETS, useApp } from '../AppContext';
import type { Contract, Customer } from '../types';
import CCCDScannerModal from './CCCDScannerModal';
import { applyCustomerQrData } from '../utils/customerIdentity';
import { getRoomOccupancyCount } from '../utils/roomOccupancy';

export type WizardMode = 'new' | 'existing';

interface Props {
    onClose: () => void;
    initialRoomId?: string;
    initialMode?: WizardMode;
}

function createCustomerDraft(): Customer {
    return {
        id: `KH${Date.now().toString().slice(-6)}`,
        name: '',
        phone: '',
        email: '',
        zalo: '',
        idNumber: '',
        idIssueDate: '',
        idIssuePlace: '',
        avatarImage: '',
        idFrontImage: '',
        idBackImage: '',
        nationality: 'Việt Nam',
        permanentAddress: '',
        currentAddress: '',
        placeOfOrigin: '',
    };
}

export default function QuickContractWizardEnhanced({ onClose, initialRoomId = '', initialMode = 'new' }: Props) {
    const { addCustomer, createContract, rooms, contracts, customers } = useApp();
    const [step, setStep] = useState<1 | 2>(1);
    const [mode, setMode] = useState<WizardMode>(initialMode);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [customer, setCustomer] = useState<Customer>(() => createCustomerDraft());
    const [selectedExistingCustomer, setSelectedExistingCustomer] = useState<Customer | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [lookupQuery, setLookupQuery] = useState('');
    const [contract, setContract] = useState<Contract>({
        id: `HD${Date.now().toString().slice(-6)}`,
        roomId: initialRoomId,
        customerId: '',
        startDate: new Date().toISOString().split('T')[0],
        durationMonths: 12,
        price: initialRoomId ? (rooms.find((room) => room.id === initialRoomId)?.price || 0) : 0,
        electricPrice: 3500,
        waterPrice: 15000,
        internetPrice: 100000,
        extraServices: SERVICE_PRESETS.map((service) => ({ ...service })),
        isActive: true,
        endDate: '',
    });

    const activeCustomerIds = useMemo(
        () => new Set(contracts.filter((c) => c.isActive).map((c) => c.customerId)),
        [contracts],
    );

    const availableCustomers = useMemo(() => {
        return customers.filter((c) => !activeCustomerIds.has(c.id));
    }, [customers, activeCustomerIds]);

    const filteredCustomers = useMemo(() => {
        if (!searchQuery.trim()) return availableCustomers;
        const q = searchQuery.trim().toLowerCase();
        return availableCustomers.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.id.toLowerCase().includes(q) ||
                (c.idNumber && c.idNumber.includes(q)) ||
                c.phone.includes(q),
        );
    }, [availableCustomers, searchQuery]);

    const availableRooms = useMemo(
        () => rooms.filter((room) => room.status !== 'Đang sửa' || room.id === contract.roomId),
        [contract.roomId, rooms],
    );

    const getRoomSelectLabel = (roomId: string) => {
        const room = rooms.find((item) => item.id === roomId);
        if (!room) return roomId;
        const occupancyCount = getRoomOccupancyCount(roomId, contracts);
        const occupancyLabel = occupancyCount === 0 ? 'trống' : `${occupancyCount} khách đang ở`;
        return `${room.name} - ${formatCurrency(room.price)} (${occupancyLabel})`;
    };

    const handleLookup = () => {
        if (!lookupQuery.trim()) return;
        const q = lookupQuery.trim().toLowerCase();
        const found = customers.find(
            (c) => c.id.toLowerCase() === q || (c.idNumber && c.idNumber === lookupQuery.trim()),
        );
        if (found) {
            setCustomer(found);
            setMode('existing');
            setSelectedExistingCustomer(found);
            setLookupQuery('');
        } else {
            alert('Không tìm thấy khách hàng với mã KH hoặc CCCD này.');
        }
    };

    const handleSelectExistingCustomer = (c: Customer) => {
        setSelectedExistingCustomer(c);
        setCustomer(c);
    };

    const handleNext = (event: React.FormEvent) => {
        event.preventDefault();

        if (mode === 'existing') {
            if (!selectedExistingCustomer) {
                alert('Vui lòng chọn một khách hàng từ danh sách.');
                return;
            }
            setContract((prev) => ({ ...prev, customerId: selectedExistingCustomer.id }));
        } else {
            if (!customer.name || !customer.phone) return;
            setContract((prev) => ({ ...prev, customerId: customer.id }));
        }
        setStep(2);
    };

    const handleRoomChange = (roomId: string) => {
        const room = rooms.find((item) => item.id === roomId);
        setContract((prev) => ({
            ...prev,
            roomId,
            price: room ? room.price : 0,
        }));
    };

    const toggleService = (serviceId: string) => {
        setContract((prev) => ({
            ...prev,
            extraServices:
                prev.extraServices?.map((service) =>
                    service.id === serviceId ? { ...service, enabled: !service.enabled } : service,
                ) || [],
        }));
    };

    const handleFinish = (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const isExisting = mode === 'existing' && selectedExistingCustomer;

            if (!isExisting) {
                addCustomer({
                    ...customer,
                    currentAddress: customer.currentAddress || customer.permanentAddress || '',
                });
            }

            createContract({
                ...contract,
                customerId: isExisting ? selectedExistingCustomer.id : customer.id,
                extraServices: contract.extraServices?.filter((service) => service.enabled) || [],
            });
            onClose();
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi lưu dữ liệu.');
        }
    };

    const handleSwitchMode = (newMode: WizardMode) => {
        setMode(newMode);
        if (newMode === 'new') {
            setSelectedExistingCustomer(null);
            setCustomer(createCustomerDraft());
            setSearchQuery('');
        } else {
            setLookupQuery('');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
            <div className="my-4 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex shrink-0 flex-col gap-4 border-b border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm text-white shadow-lg shadow-blue-500/20">
                                ✦
                            </span>
                            {mode === 'existing' ? 'Gắn khách có sẵn vào phòng' : 'Tạo nhanh: Khách & Hợp đồng'}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {mode === 'existing'
                                ? 'Chọn khách hàng đã có trong hệ thống để tạo hợp đồng mới.'
                                : 'Bổ sung luôn địa chỉ thường trú, địa chỉ tạm trú và thông tin CCCD để đỡ nhập lại sau này.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${step === 1 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-400'}`}>
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}>1</span>
                            Khách thuê
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                        <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${step === 2 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-400'}`}>
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}>2</span>
                            Hợp đồng
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 ? (
                        <form id="quick-contract-step-1" onSubmit={handleNext} className="space-y-6">
                            {/* Mode Switcher */}
                            <div className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-800/50">
                                <button
                                    type="button"
                                    onClick={() => handleSwitchMode('new')}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                                        mode === 'new'
                                            ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-blue-300'
                                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Tạo khách mới
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSwitchMode('existing')}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                                        mode === 'existing'
                                            ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-300'
                                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <UserCheck className="h-4 w-4" />
                                    Chọn khách có sẵn
                                </button>
                            </div>

                            {mode === 'existing' ? (
                                /* ── Existing Customer Selection ── */
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Tìm theo tên, mã KH, CCCD, hoặc SĐT..."
                                            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                    {filteredCustomers.length === 0 ? (
                                        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 py-10 text-center dark:border-slate-700">
                                            <UserCheck className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {searchQuery.trim()
                                                    ? 'Không tìm thấy khách hàng nào phù hợp.'
                                                    : 'Không có khách hàng nào chưa có phòng.'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800/50">
                                            {filteredCustomers.map((c) => {
                                                const isSelected = selectedExistingCustomer?.id === c.id;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={c.id}
                                                        onClick={() => handleSelectExistingCustomer(c)}
                                                        className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                                                            isSelected
                                                                ? 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400 dark:border-emerald-600 dark:bg-emerald-950/30'
                                                                : 'border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-600 dark:hover:bg-slate-700/50'
                                                        }`}
                                                    >
                                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                                            isSelected
                                                                ? 'bg-emerald-500 text-white'
                                                                : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                                        }`}>
                                                            {isSelected ? <CheckCircle className="h-5 w-5" /> : c.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate font-medium text-slate-900 dark:text-white">{c.name}</p>
                                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                                <span>Mã: {c.id}</span>
                                                                {c.idNumber && <span>CCCD: {c.idNumber}</span>}
                                                                <span>SĐT: {c.phone || '—'}</span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {selectedExistingCustomer && (
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Khách đã chọn</p>
                                            <p className="text-lg font-bold text-emerald-900 dark:text-emerald-200">{selectedExistingCustomer.name}</p>
                                            <div className="mt-1 flex flex-wrap gap-3 text-sm text-emerald-700 dark:text-emerald-400">
                                                <span>{selectedExistingCustomer.phone || '—'}</span>
                                                {selectedExistingCustomer.idNumber && <span>CCCD: {selectedExistingCustomer.idNumber}</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* ── New Customer Form ── */
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Mã KH</label>
                                            <input
                                                readOnly
                                                value={customer.id}
                                                className="w-full rounded-xl border border-slate-300 bg-slate-100 p-2.5 text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Họ tên *</label>
                                            <div className="flex gap-2">
                                                <input
                                                    required
                                                    autoFocus
                                                    value={customer.name}
                                                    onChange={(event) => setCustomer((prev) => ({ ...prev, name: event.target.value }))}
                                                    placeholder="Ví dụ: Nguyễn Văn A"
                                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lookup existing customer by ID/CCCD */}
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                                        <p className="mb-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                                            Tra cứu nhanh: Nhập mã KH hoặc CCCD để tự động điền thông tin (nếu đã có trong hệ thống)
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={lookupQuery}
                                                onChange={(e) => setLookupQuery(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLookup(); } }}
                                                placeholder="Mã KH hoặc số CCCD"
                                                className="flex-1 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-700 dark:bg-slate-800 dark:text-white"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleLookup}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                                            >
                                                <Search className="h-4 w-4" />
                                                Tra cứu
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Điện thoại *</label>
                                            <input
                                                required
                                                value={customer.phone}
                                                onChange={(event) => setCustomer((prev) => ({ ...prev, phone: event.target.value, zalo: prev.zalo || event.target.value }))}
                                                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                            <input
                                                type="email"
                                                value={customer.email}
                                                onChange={(event) => setCustomer((prev) => ({ ...prev, email: event.target.value }))}
                                                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Zalo</label>
                                            <input
                                                value={customer.zalo}
                                                onChange={(event) => setCustomer((prev) => ({ ...prev, zalo: event.target.value }))}
                                                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                                                <CreditCard className="h-4 w-4 text-blue-500" />
                                                Thông tin định danh (CCCD)
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setIsScannerOpen(true)}
                                                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                                            >
                                                <QrCode className="h-4 w-4" />
                                                Quét QR CCCD
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <input
                                                value={customer.idNumber || ''}
                                                onChange={(event) => setCustomer((prev) => ({ ...prev, idNumber: event.target.value }))}
                                                placeholder="Số CCCD"
                                                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                            <input
                                                type="date"
                                                lang="vi-VN"
                                                value={customer.idIssueDate || ''}
                                                onChange={(event) => setCustomer((prev) => ({ ...prev, idIssueDate: event.target.value }))}
                                                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                            <input
                                                value={customer.idIssuePlace || ''}
                                                onChange={(event) => setCustomer((prev) => ({ ...prev, idIssuePlace: event.target.value }))}
                                                placeholder="Nơi cấp"
                                                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                                        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                                            <MapPinHouse className="h-4 w-4 text-blue-500" />
                                            Thông tin cư trú
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <input
                                                value={customer.permanentAddress || ''}
                                                onChange={(event) => setCustomer((prev) => ({
                                                    ...prev,
                                                    permanentAddress: event.target.value,
                                                    currentAddress: prev.currentAddress || event.target.value,
                                                }))}
                                                placeholder="Địa chỉ thường trú"
                                                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                            <input
                                                value={customer.currentAddress || ''}
                                                onChange={(event) => setCustomer((prev) => ({ ...prev, currentAddress: event.target.value }))}
                                                placeholder="Địa chỉ tạm trú hiện tại"
                                                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                            <input
                                                value={customer.placeOfOrigin || ''}
                                                onChange={(event) => setCustomer((prev) => ({ ...prev, placeOfOrigin: event.target.value }))}
                                                placeholder="Nguyên quán"
                                                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                            <input
                                                value={customer.nationality || 'Việt Nam'}
                                                onChange={(event) => setCustomer((prev) => ({ ...prev, nationality: event.target.value }))}
                                                placeholder="Quốc tịch"
                                                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </form>
                    ) : (
                        <form id="quick-contract-step-2" onSubmit={handleFinish} className="space-y-6">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h4 className="border-b border-slate-100 pb-2 font-semibold text-blue-600 dark:border-slate-800 dark:text-blue-400">Chi tiết thuê phòng</h4>
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">Gắn khách với phòng</label>
                                        <p className="mb-2 text-xs text-slate-400">
                                            Có thể chọn cả phòng đang ở để thêm khách cùng phòng. Phòng đang sửa sẽ bị khóa.
                                        </p>
                                        <select
                                            required
                                            value={contract.roomId}
                                            onChange={(event) => handleRoomChange(event.target.value)}
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                        >
                                            <option value="">-- Chọn phòng khách thuê --</option>
                                            {availableRooms.map((room) => (
                                                <option key={room.id} value={room.id}>
                                                    {getRoomSelectLabel(room.id)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            required
                                            type="date"
                                            lang="vi-VN"
                                            value={contract.startDate}
                                            onChange={(event) => setContract((prev) => ({ ...prev, startDate: event.target.value }))}
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                        />
                                        <input
                                            required
                                            type="number"
                                            min={1}
                                            value={contract.durationMonths}
                                            onChange={(event) => setContract((prev) => ({ ...prev, durationMonths: Number(event.target.value) }))}
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                        />
                                    </div>
                                    <input
                                        required
                                        type="number"
                                        min={0}
                                        value={contract.price}
                                        onChange={(event) => setContract((prev) => ({ ...prev, price: Number(event.target.value) }))}
                                        placeholder="Giá thuê phòng / tháng"
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <h4 className="border-b border-slate-100 pb-2 font-semibold text-purple-600 dark:border-slate-800 dark:text-purple-400">Điện, nước và dịch vụ</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            required
                                            type="number"
                                            min={0}
                                            value={contract.electricPrice}
                                            onChange={(event) => setContract((prev) => ({ ...prev, electricPrice: Number(event.target.value) }))}
                                            placeholder="Giá điện"
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                        />
                                        <input
                                            required
                                            type="number"
                                            min={0}
                                            value={contract.waterPrice}
                                            onChange={(event) => setContract((prev) => ({ ...prev, waterPrice: Number(event.target.value) }))}
                                            placeholder="Giá nước"
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <p className="mb-2 text-xs text-slate-500">Tick chọn các dịch vụ đi kèm:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {contract.extraServices?.map((service) => (
                                                <button
                                                    type="button"
                                                    key={service.id}
                                                    onClick={() => toggleService(service.id)}
                                                    className={`flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition-all ${
                                                        service.enabled
                                                            ? 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20'
                                                            : 'border-slate-200 bg-slate-50 opacity-70 dark:border-slate-700 dark:bg-slate-800'
                                                    }`}
                                                >
                                                    {service.enabled ? (
                                                        <CheckSquare size={14} className="shrink-0 text-purple-500" />
                                                    ) : (
                                                        <Square size={14} className="shrink-0 text-slate-400" />
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium">{service.name}</p>
                                                        <p className="text-[10px] text-slate-500">
                                                            {formatCurrency(service.unitPrice)}/{service.unit}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                <div className="flex shrink-0 gap-3 border-t border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        Đóng
                    </button>
                    <div className="flex flex-1 justify-end gap-3">
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 rounded-xl bg-slate-200 px-5 py-2.5 font-medium text-slate-800 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Quay lại
                            </button>
                        )}
                        {step === 1 ? (
                            <button
                                type="submit"
                                form="quick-contract-step-1"
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                            >
                                Tiếp tục: Lập hợp đồng
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                form="quick-contract-step-2"
                                className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Hoàn tất và ký hợp đồng
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isScannerOpen && (
                <CCCDScannerModal
                    onClose={() => setIsScannerOpen(false)}
                    onDetect={(rawValue) => setCustomer((prev) => applyCustomerQrData(prev, rawValue) as Customer)}
                />
            )}
        </div>
    );
}
