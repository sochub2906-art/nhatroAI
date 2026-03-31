import React, { useState } from 'react';
import { CheckCircle, CheckSquare, ChevronLeft, ChevronRight, CreditCard, QrCode, Square } from 'lucide-react';
import { formatCurrency, SERVICE_PRESETS, useApp } from '../AppContext';
import { Contract, Customer } from '../types';
import CCCDScannerModal from './CCCDScannerModal';
import { applyCustomerQrData } from '../utils/customerIdentity';
import { getRoomOccupancyCount } from '../utils/roomOccupancy';

interface Props {
    onClose: () => void;
    initialRoomId?: string;
}

export default function QuickContractWizard({ onClose, initialRoomId = '' }: Props) {
    const { addCustomer, createContract, rooms, contracts } = useApp();
    const [step, setStep] = useState<1 | 2>(1);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const [customer, setCustomer] = useState<Customer>({
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
        nationality: 'Viá»‡t Nam',
    });

    const [contract, setContract] = useState<Contract>({
        id: `HD${Date.now().toString().slice(-6)}`,
        roomId: initialRoomId,
        customerId: '',
        startDate: new Date().toISOString().split('T')[0],
        durationMonths: 12,
        price: initialRoomId ? (rooms.find(room => room.id === initialRoomId)?.price || 0) : 0,
        electricPrice: 3500,
        waterPrice: 15000,
        internetPrice: 100000,
        extraServices: SERVICE_PRESETS.map(service => ({ ...service })),
        isActive: true,
        endDate: '',
    });

    const availableRooms = rooms.filter(room => room.status !== 'Äang sá»­a' || room.id === contract.roomId);

    const getRoomSelectLabel = (roomId: string) => {
        const room = rooms.find(item => item.id === roomId);
        if (!room) return roomId;
        const occupancyCount = getRoomOccupancyCount(roomId, contracts);
        const occupancyLabel = occupancyCount === 0 ? 'trá»‘ng' : `${occupancyCount} khÃ¡ch Ä‘ang á»Ÿ`;
        return `${room.name} - ${formatCurrency(room.price)} (${occupancyLabel})`;
    };

    const handleNext = (event: React.FormEvent) => {
        event.preventDefault();
        if (customer.name && customer.phone) {
            setContract(prev => ({ ...prev, customerId: customer.id }));
            setStep(2);
        }
    };

    const handleRoomChange = (roomId: string) => {
        const room = rooms.find(item => item.id === roomId);
        setContract(prev => ({ ...prev, roomId, price: room ? room.price : 0 }));
    };

    const toggleService = (serviceId: string) => {
        setContract(prev => ({
            ...prev,
            extraServices: prev.extraServices?.map(service => service.id === serviceId ? { ...service, enabled: !service.enabled } : service) || [],
        }));
    };

    const handleFinish = (event: React.FormEvent) => {
        event.preventDefault();
        try {
            addCustomer(customer);
            createContract({
                ...contract,
                extraServices: contract.extraServices?.filter(service => service.enabled) || [],
            });
            onClose();
        } catch (error) {
            console.error(error);
            alert('CÃ³ lá»—i xáº£y ra khi lÆ°u dá»¯ liá»‡u.');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
            <div className="my-4 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex shrink-0 flex-col items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50 sm:flex-row sm:items-center">
                    <h3 className="flex items-center gap-2 text-xl font-bold">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm text-white shadow-lg shadow-blue-500/20">âš¡</span>
                        Táº¡o Nhanh: KhÃ¡ch & Há»£p Äá»“ng
                    </h3>

                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${step === 1 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-400'}`}>
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}>1</span>
                            KhÃ¡ch hÃ ng
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                        <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${step === 2 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-400'}`}>
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}>2</span>
                            Há»£p Ä‘á»“ng
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 ? (
                        <form id="step1-form" onSubmit={handleNext} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">MÃ£ KH (Tá»± Ä‘á»™ng)</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full rounded-xl border border-slate-300 bg-slate-100 p-2.5 text-slate-900 opacity-70 outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                                        value={customer.id}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Há» tÃªn *</label>
                                    <input
                                        required
                                        type="text"
                                        autoFocus
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        value={customer.name}
                                        onChange={event => setCustomer({ ...customer, name: event.target.value })}
                                        placeholder="VD: Nguyá»…n VÄƒn A"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Äiá»‡n thoáº¡i *</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        value={customer.phone}
                                        onChange={event => setCustomer({ ...customer, phone: event.target.value, zalo: event.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                    <input
                                        type="email"
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        value={customer.email}
                                        onChange={event => setCustomer({ ...customer, email: event.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Zalo</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        value={customer.zalo}
                                        onChange={event => setCustomer({ ...customer, zalo: event.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                                        <CreditCard className="h-4 w-4 text-blue-500" />
                                        ThÃ´ng tin Ä‘á»‹nh danh (CCCD)
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setIsScannerOpen(true)}
                                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                                    >
                                        <QrCode className="h-4 w-4" />
                                        QuÃ©t QR CCCD
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Sá»‘ CCCD</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            value={customer.idNumber}
                                            onChange={event => setCustomer({ ...customer, idNumber: event.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">NgÃ y cáº¥p</label>
                                        <input
                                            type="date" lang="vi-VN"
                                            className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            value={customer.idIssueDate}
                                            onChange={event => setCustomer({ ...customer, idIssueDate: event.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">NÆ¡i cáº¥p</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            value={customer.idIssuePlace}
                                            onChange={event => setCustomer({ ...customer, idIssuePlace: event.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <form id="step2-form" onSubmit={handleFinish} className="space-y-6">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h4 className="border-b border-slate-100 pb-2 font-semibold text-blue-600 dark:border-slate-800 dark:text-blue-400">Chi tiáº¿t thuÃª phÃ²ng</h4>
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">Gáº¯n khÃ¡ch vá»›i phÃ²ng</label>
                                        <p className="mb-2 text-xs text-slate-400">
                                            CÃ³ thá»ƒ chá»n cáº£ phÃ²ng Ä‘ang á»Ÿ Ä‘á»ƒ thÃªm ngÆ°á»i cÃ¹ng phÃ²ng. PhÃ²ng Ä‘ang sá»­a sáº½ bá»‹ khÃ³a.
                                        </p>
                                        <select
                                            required
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                            value={contract.roomId}
                                            onChange={event => handleRoomChange(event.target.value)}
                                        >
                                            <option value="">-- Chá»n phÃ²ng khÃ¡ch thuÃª --</option>
                                            {availableRooms.map(room => (
                                                <option key={room.id} value={room.id}>{getRoomSelectLabel(room.id)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1 block text-sm text-slate-500">NgÃ y báº¯t Ä‘áº§u</label>
                                            <input
                                                required
                                                type="date" lang="vi-VN"
                                                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                                value={contract.startDate}
                                                onChange={event => setContract({ ...contract, startDate: event.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm text-slate-500">Ká»³ háº¡n (thÃ¡ng)</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                                value={contract.durationMonths}
                                                onChange={event => setContract({ ...contract, durationMonths: +event.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">GiÃ¡ thuÃª phÃ²ng / thÃ¡ng</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                            value={contract.price}
                                            onChange={event => setContract({ ...contract, price: +event.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="border-b border-slate-100 pb-2 font-semibold text-purple-600 dark:border-slate-800 dark:text-purple-400">Äiá»‡n, NÆ°á»›c & Dá»‹ch vá»¥</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1 block text-sm text-slate-500">GiÃ¡ Ä‘iá»‡n (VNÄ/kWh)</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                                value={contract.electricPrice}
                                                onChange={event => setContract({ ...contract, electricPrice: +event.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm text-slate-500">GiÃ¡ nÆ°á»›c (VNÄ/khá»‘i)</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                                value={contract.waterPrice}
                                                onChange={event => setContract({ ...contract, waterPrice: +event.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <p className="mb-2 text-xs text-slate-500">Tick chá»n cÃ¡c dá»‹ch vá»¥ Ä‘i kÃ¨m:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {contract.extraServices?.map(service => (
                                                <button
                                                    type="button"
                                                    key={service.id}
                                                    onClick={() => toggleService(service.id)}
                                                    className={`flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition-all ${service.enabled ? 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20' : 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-800'}`}
                                                >
                                                    {service.enabled ? <CheckSquare size={14} className="shrink-0 text-purple-500" /> : <Square size={14} className="shrink-0 text-slate-400" />}
                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium">{service.name}</p>
                                                        <p className="text-[10px] text-slate-500">{formatCurrency(service.unitPrice)}/{service.unit}</p>
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
                        ÄÃ³ng
                    </button>
                    <div className="flex flex-1 justify-end gap-3">
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 rounded-xl bg-slate-200 px-5 py-2.5 font-medium text-slate-800 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                            >
                                <ChevronLeft className="h-4 w-4" /> Quay láº¡i
                            </button>
                        )}
                        {step === 1 ? (
                            <button
                                type="submit"
                                form="step1-form"
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                            >
                                Tiáº¿p tá»¥c: Láº­p Há»£p Äá»“ng <ChevronRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                form="step2-form"
                                className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                            >
                                <CheckCircle className="h-4 w-4" /> HoÃ n táº¥t & KÃ½ Há»£p Äá»“ng
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isScannerOpen && (
                <CCCDScannerModal
                    onClose={() => setIsScannerOpen(false)}
                    onDetect={rawValue => setCustomer(prev => applyCustomerQrData(prev, rawValue) as Customer)}
                />
            )}
        </div>
    );
}
