import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Edit, ExternalLink, LayoutGrid, List, Plus, PlusCircle, Square, Trash2, XCircle } from 'lucide-react';
import { formatCurrency, SERVICE_PRESETS, useApp } from '../AppContext';
import { Contract, ContractService } from '../types';
import { getRoomOccupancyCount } from '../utils/roomOccupancy';

export default function Contracts() {
    const { contracts, rooms, customers, createContract, updateContract, terminateContract } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [customServiceName, setCustomServiceName] = useState('');
    const [customServicePrice, setCustomServicePrice] = useState(0);
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

    const initialFormState: Contract = {
        id: '',
        roomId: '',
        customerId: '',
        startDate: '',
        durationMonths: 12,
        price: 0,
        electricPrice: 3500,
        waterPrice: 15000,
        internetPrice: 100000,
        extraServices: [],
        isActive: true,
        endDate: '',
    };
    const [form, setForm] = useState<Contract>(initialFormState);

    const availableRooms = rooms.filter(room => room.status !== 'Đang sửa' || (isEditMode && room.id === form.roomId));

    const getRoomSelectLabel = (roomId: string) => {
        const room = rooms.find(item => item.id === roomId);
        if (!room) return roomId;
        const occupancyCount = getRoomOccupancyCount(roomId, contracts);
        const occupancyLabel = occupancyCount === 0 ? 'trống' : `${occupancyCount} khách đang ở`;
        return `${room.name} - ${formatCurrency(room.price)} (${occupancyLabel})`;
    };

    const handleOpenCreate = () => {
        setIsEditMode(false);
        setForm({ ...initialFormState, extraServices: SERVICE_PRESETS.map(service => ({ ...service })) });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (contract: Contract) => {
        setIsEditMode(true);
        const mergedServices = SERVICE_PRESETS.map(preset => {
            const existing = contract.extraServices?.find(service => service.id === preset.id);
            return existing || { ...preset };
        });
        const customServices = contract.extraServices?.filter(service => !SERVICE_PRESETS.find(preset => preset.id === service.id)) || [];
        setForm({ ...contract, extraServices: [...mergedServices, ...customServices] });
        setIsModalOpen(true);
    };

    const handleRoomChange = (roomId: string) => {
        const room = rooms.find(item => item.id === roomId);
        setForm(prev => ({ ...prev, roomId, price: room ? room.price : 0 }));
    };

    const toggleService = (serviceId: string) => {
        setForm(prev => ({
            ...prev,
            extraServices: prev.extraServices?.map(service => service.id === serviceId ? { ...service, enabled: !service.enabled } : service) || [],
        }));
    };

    const updateServicePrice = (serviceId: string, price: number) => {
        setForm(prev => ({
            ...prev,
            extraServices: prev.extraServices?.map(service => service.id === serviceId ? { ...service, unitPrice: price } : service) || [],
        }));
    };

    const addCustomService = () => {
        if (!customServiceName.trim()) return;
        const newService: ContractService = {
            id: `custom_${Date.now()}`,
            name: customServiceName.trim(),
            unitPrice: customServicePrice,
            unit: 'tháng',
            enabled: true,
        };
        setForm(prev => ({ ...prev, extraServices: [...(prev.extraServices || []), newService] }));
        setCustomServiceName('');
        setCustomServicePrice(0);
    };

    const removeService = (serviceId: string) => {
        setForm(prev => ({ ...prev, extraServices: prev.extraServices?.filter(service => service.id !== serviceId) || [] }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const cleanForm = { ...form, extraServices: form.extraServices?.filter(service => service.enabled) || [] };
        if (isEditMode) updateContract(cleanForm);
        else createContract(cleanForm);
        setIsModalOpen(false);
    };

    const getCustomerName = (customerId: string) => customers.find(customer => customer.id === customerId)?.name || customerId;
    const getRoomName = (roomId: string) => rooms.find(room => room.id === roomId)?.name || roomId;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hợp đồng thuê</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Quản lý hợp đồng, giá thuê và dịch vụ phụ.</p>
                </div>
                <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20"
                >
                    <Plus className="h-4 w-4" /> Tạo hợp đồng
                </button>
            </div>

            {/* Mobile view toggle */}
            <div className="flex items-center gap-2 lg:hidden">
                <button type="button" onClick={() => setViewMode('card')} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${viewMode === 'card' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Dạng card">
                    <LayoutGrid className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => setViewMode('list')} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${viewMode === 'list' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Dạng danh sách">
                    <List className="h-5 w-5" />
                </button>
                <span className="text-xs text-slate-400 dark:text-slate-500">{contracts.length} hợp đồng</span>
            </div>

            {/* Mobile Card View */}
            <div className={`grid gap-4 lg:hidden ${viewMode !== 'card' ? 'hidden' : ''}`}>
                {contracts.length === 0 && <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">Chưa có hợp đồng nào.</div>}
                {contracts.map(contract => (
                    <article key={contract.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="truncate text-lg font-semibold text-slate-900 dark:text-white">
                                    <Link to={`/app/rooms/${contract.roomId}`} className="hover:text-blue-500">{getRoomName(contract.roomId)}</Link>
                                </div>
                                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{contract.id}</div>
                            </div>
                            <span className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${contract.isActive ? 'border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 text-red-500 dark:border-red-800 dark:bg-red-900/20'}`}>
                                {contract.isActive ? 'Hiệu lực' : 'Hết hạn'}
                            </span>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                            <div>Khách thuê: <Link to={`/app/customers/${contract.customerId}`} className="font-medium text-blue-600 dark:text-blue-400">{getCustomerName(contract.customerId)}</Link></div>
                            <div>Ngày vào: {contract.startDate} — Hết hạn: {contract.endDate || 'Chưa xác định'}</div>
                            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(contract.price)}/tháng</div>
                            {contract.extraServices && contract.extraServices.filter(s => s.enabled).length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {contract.extraServices.filter(s => s.enabled).map(service => (
                                        <span key={service.id} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                            {service.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button type="button" onClick={() => handleOpenEdit(contract)} className="flex-1 min-h-[48px] rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                                Chỉnh sửa
                            </button>
                            {contract.isActive && (
                                <button type="button" onClick={() => terminateContract(contract.id)} className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-rose-200 px-5 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-950/20">
                                    <XCircle className="mr-1.5 h-4 w-4" /> Kết thúc
                                </button>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {/* Mobile List View */}
            <div className={`space-y-2 lg:hidden ${viewMode !== 'list' ? 'hidden' : ''}`}>
                {contracts.length === 0 && <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">Chưa có hợp đồng nào.</div>}
                {contracts.map(contract => (
                    <div key={contract.id} onClick={() => handleOpenEdit(contract)} className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:bg-slate-50 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">
                        <div className="min-w-0 flex-1">
                            <div className="truncate font-semibold text-slate-900 dark:text-white">{getRoomName(contract.roomId)} — {getCustomerName(contract.customerId)}</div>
                            <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{contract.id} • {formatCurrency(contract.price)}/tháng</div>
                        </div>
                        <span className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${contract.isActive ? 'border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 text-red-500 dark:border-red-800 dark:bg-red-900/20'}`}>
                            {contract.isActive ? 'Hiệu lực' : 'Hết hạn'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                            <tr>
                                <th className="px-5 py-4">Mã HĐ</th>
                                <th className="px-5 py-4">Phòng</th>
                                <th className="px-5 py-4">Khách thuê</th>
                                <th className="px-5 py-4">Ngày vào</th>
                                <th className="px-5 py-4">Hết hạn</th>
                                <th className="px-5 py-4">Giá thuê</th>
                                <th className="px-5 py-4">Dịch vụ phụ</th>
                                <th className="px-5 py-4">Trạng thái</th>
                                <th className="px-5 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {contracts.map(contract => (
                                <tr key={contract.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{contract.id}</td>
                                    <td className="px-5 py-4">
                                        <Link to={`/app/rooms/${contract.roomId}`} className="flex items-center gap-1 transition hover:text-blue-500">
                                            {getRoomName(contract.roomId)} <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Link to={`/app/customers/${contract.customerId}`} className="transition hover:text-blue-500">
                                            {getCustomerName(contract.customerId)}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-4 text-slate-500">{contract.startDate}</td>
                                    <td className="px-5 py-4 text-slate-500">{contract.endDate}</td>
                                    <td className="px-5 py-4 font-medium text-blue-500">{formatCurrency(contract.price)}</td>
                                    <td className="px-5 py-4">
                                        {contract.extraServices && contract.extraServices.filter(service => service.enabled).length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {contract.extraServices.filter(service => service.enabled).map(service => (
                                                    <span key={service.id} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                                        {service.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : <span className="text-xs text-slate-400">Không có</span>}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${contract.isActive ? 'border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 text-red-500 dark:border-red-800 dark:bg-red-900/20'}`}>
                                            {contract.isActive ? 'Hiệu lực' : 'Hết hạn'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button type="button" onClick={() => handleOpenEdit(contract)} title="Sửa" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            {contract.isActive && (
                                                <button type="button" onClick={() => terminateContract(contract.id)} title="Kết thúc" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-950/20">
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
                    <div className="my-4 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-100 p-6 dark:border-slate-800">
                            <h3 className="text-xl font-bold">{isEditMode ? 'Cập nhật hợp đồng' : 'Tạo hợp đồng mới'}</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h4 className="border-b border-slate-100 pb-2 font-semibold text-blue-500 dark:border-slate-800">Thông tin thuê</h4>
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">Mã hợp đồng</label>
                                        <input
                                            required
                                            disabled={isEditMode}
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800"
                                            value={form.id}
                                            onChange={event => setForm({ ...form, id: event.target.value })}
                                            placeholder="HD..."
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">Phòng</label>
                                        <p className="mb-2 text-xs text-slate-400">
                                            Có thể chọn cả phòng đang ở để thêm khách ghép phòng. Chỉ khóa phòng đang sửa.
                                        </p>
                                        <select
                                            required
                                            disabled={isEditMode}
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800"
                                            value={form.roomId}
                                            onChange={event => handleRoomChange(event.target.value)}
                                        >
                                            <option value="">Chọn phòng...</option>
                                            {availableRooms.map(room => (
                                                <option key={room.id} value={room.id}>{getRoomSelectLabel(room.id)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">Khách thuê</label>
                                        <select
                                            required
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800"
                                            value={form.customerId}
                                            onChange={event => setForm({ ...form, customerId: event.target.value })}
                                        >
                                            <option value="">Chọn khách...</option>
                                            {customers.map(customer => (
                                                <option key={customer.id} value={customer.id}>{customer.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="mb-1 block text-sm text-slate-500">Ngày bắt đầu</label>
                                            <input
                                                required
                                                type="date"
                                                lang="vi-VN"
                                                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                                value={form.startDate}
                                                onChange={event => setForm({ ...form, startDate: event.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm text-slate-500">Kỳ hạn (tháng)</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                                value={form.durationMonths}
                                                onChange={event => setForm({ ...form, durationMonths: +event.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="border-b border-slate-100 pb-2 font-semibold text-amber-500 dark:border-slate-800">Chi phí cơ bản</h4>
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">Giá thuê phòng / tháng</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                            value={form.price}
                                            onChange={event => setForm({ ...form, price: +event.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">Giá điện (VNĐ/kWh)</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                            value={form.electricPrice}
                                            onChange={event => setForm({ ...form, electricPrice: +event.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">Giá nước (VNĐ/khối)</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                            value={form.waterPrice}
                                            onChange={event => setForm({ ...form, waterPrice: +event.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-500">Internet (cố định/tháng)</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                            value={form.internetPrice}
                                            onChange={event => setForm({ ...form, internetPrice: +event.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
                                <h4 className="mb-3 font-semibold text-purple-500">Dịch vụ phụ (tick để thêm)</h4>
                                <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3">
                                    {form.extraServices?.filter(service => SERVICE_PRESETS.find(preset => preset.id === service.id)).map(service => (
                                        <button
                                            type="button"
                                            key={service.id}
                                            onClick={() => toggleService(service.id)}
                                            className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition-all ${service.enabled ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20' : 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-800'}`}
                                        >
                                            {service.enabled ? <CheckSquare size={16} className="shrink-0 text-blue-500" /> : <Square size={16} className="shrink-0 text-slate-400" />}
                                            <div className="min-w-0">
                                                <p className="truncate font-medium">{service.name}</p>
                                                <p className="text-xs text-slate-500">{formatCurrency(service.unitPrice)}/{service.unit}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {form.extraServices?.filter(service => !SERVICE_PRESETS.find(preset => preset.id === service.id)).map(service => (
                                    <div key={service.id} className="mb-2 flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 p-2 dark:border-purple-800 dark:bg-purple-900/10">
                                        <CheckSquare size={16} className="shrink-0 text-purple-500" />
                                        <span className="flex-1 text-sm font-medium">{service.name}</span>
                                        <input
                                            type="number"
                                            className="w-24 rounded-lg border border-slate-300 bg-white p-1 text-right text-sm dark:border-slate-700 dark:bg-slate-800"
                                            value={service.unitPrice}
                                            onChange={event => updateServicePrice(service.id, +event.target.value)}
                                        />
                                        <span className="text-xs text-slate-500">đ</span>
                                        <button type="button" onClick={() => removeService(service.id)} className="p-1 text-red-400 hover:text-red-600">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}

                                <div className="mt-3 flex items-center gap-2">
                                    <input
                                        placeholder="Tên dịch vụ tùy chỉnh..."
                                        className="flex-1 rounded-xl border border-slate-300 bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800"
                                        value={customServiceName}
                                        onChange={event => setCustomServiceName(event.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Giá"
                                        className="w-24 rounded-xl border border-slate-300 bg-slate-50 p-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
                                        value={customServicePrice || ''}
                                        onChange={event => setCustomServicePrice(+event.target.value)}
                                    />
                                    <button type="button" onClick={addCustomService} className="rounded-xl p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                        <PlusCircle size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 font-medium hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                                >
                                    {isEditMode ? 'Cập nhật' : 'Tạo hợp đồng'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
