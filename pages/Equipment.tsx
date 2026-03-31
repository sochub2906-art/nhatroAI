import React from 'react';
import { formatCurrency, useApp } from '../AppContext';
import {
    Equipment,
    EquipmentMaintenanceType,
    EquipmentStatus,
} from '../types';
import {
    Archive,
    Building2,
    CalendarClock,
    CheckCircle2,
    Edit3,
    LayoutGrid,
    List,
    Home,
    Plus,
    Search,
    ShieldAlert,
    Trash2,
    Wrench,
} from 'lucide-react';
import {
    getEquipmentBookValue,
    getEquipmentMaintenanceTotal,
    getEquipmentMonthlyDepreciation,
} from '../utils/hostAnalytics';
import { formatDateVN } from '../utils/dateFormat';

type EquipmentDraft = {
    name: string;
    status: EquipmentStatus;
    buildingId: string;
    roomId: string;
    purchaseDate: string;
    price: string;
    depreciationMonths: string;
    salvageValue: string;
    currentValue: string;
    lastValuationDate: string;
    notes: string;
    maintenanceHistory: MaintenanceDraft[];
};

type MaintenanceDraft = {
    id: string;
    date: string;
    type: EquipmentMaintenanceType;
    cost: string;
    note: string;
    valueAfter: string;
};

const STATUS_META: Record<EquipmentStatus, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
    'Tốt': {
        label: 'Tốt',
        className: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-800',
        icon: CheckCircle2,
    },
    'Hỏng': {
        label: 'Hỏng',
        className: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-800',
        icon: ShieldAlert,
    },
    'Đang sửa': {
        label: 'Đang sửa',
        className: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-800',
        icon: Wrench,
    },
    'Thanh lý': {
        label: 'Thanh lý',
        className: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
        icon: Archive,
    },
};

const MAINTENANCE_LABELS: Record<EquipmentMaintenanceType, string> = {
    repair: 'Sửa chữa',
    maintenance: 'Bảo trì',
    revaluation: 'Đánh giá lại',
};

function toInputValue(value?: number) {
    return typeof value === 'number' && Number.isFinite(value) ? String(value) : '';
}

function parseOptionalNumber(value: string) {
    if (value.trim()) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function createMaintenanceDraft(type: EquipmentMaintenanceType = 'repair'): MaintenanceDraft {
    return {
        id: `MNT${Date.now()}${Math.random().toString(36).slice(2, 7)}`,
        date: new Date().toISOString().split('T')[0],
        type,
        cost: '',
        note: '',
        valueAfter: '',
    };
}

function createEquipmentDraft(seed?: Partial<{ buildingId: string; roomId: string }>): EquipmentDraft {
    return {
        name: '',
        status: 'Tốt',
        buildingId: seed?.buildingId || '',
        roomId: seed?.roomId || '',
        purchaseDate: new Date().toISOString().split('T')[0],
        price: '',
        depreciationMonths: '',
        salvageValue: '',
        currentValue: '',
        lastValuationDate: '',
        notes: '',
        maintenanceHistory: [],
    };
}

function equipmentToDraft(item: Equipment): EquipmentDraft {
    return {
        name: item.name,
        status: item.status,
        buildingId: item.buildingId,
        roomId: item.roomId || '',
        purchaseDate: item.purchaseDate,
        price: toInputValue(item.price),
        depreciationMonths: toInputValue(item.depreciationMonths),
        salvageValue: toInputValue(item.salvageValue),
        currentValue: toInputValue(item.currentValue),
        lastValuationDate: item.lastValuationDate || '',
        notes: item.notes || '',
        maintenanceHistory: (item.maintenanceHistory || []).map(entry => ({
            id: entry.id,
            date: entry.date,
            type: entry.type,
            cost: toInputValue(entry.cost),
            note: entry.note || '',
            valueAfter: toInputValue(entry.valueAfter),
        })),
    };
}

export default function EquipmentPage() {
    const { equipment, buildings, rooms, addEquipment, updateEquipment, deleteEquipment } = useApp();

    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterBuilding, setFilterBuilding] = React.useState<string>('all');
    const [filterRoom, setFilterRoom] = React.useState<string>('all');
    const [filterStatus, setFilterStatus] = React.useState<string>('all');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [draft, setDraft] = React.useState<EquipmentDraft>(() => createEquipmentDraft());
    const [viewMode, setViewMode] = React.useState<'card' | 'list'>('card');

    const buildingMap = React.useMemo(() => new Map(buildings.map(item => [item.id, item])), [buildings]);
    const roomMap = React.useMemo(() => new Map(rooms.map(item => [item.id, item])), [rooms]);

    const filteredRooms = React.useMemo(() => {
        if (filterBuilding === 'all') return [];
        return rooms.filter(room => room.buildingId === filterBuilding);
    }, [filterBuilding, rooms]);

    const roomsForDraft = React.useMemo(
        () => rooms.filter(room => room.buildingId === draft.buildingId),
        [rooms, draft.buildingId],
    );

    const filteredEquipment = React.useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return equipment
            .filter(item => {
                const building = buildingMap.get(item.buildingId);
                const room = item.roomId ? roomMap.get(item.roomId) : undefined;
                const haystack = [
                    item.id,
                    item.name,
                    item.notes || '',
                    building?.name || '',
                    room?.name || '',
                ].join(' ').toLowerCase();

                const matchesBuilding = filterBuilding === 'all' || item.buildingId === filterBuilding;
                const matchesRoom = filterRoom === 'all' || item.roomId === filterRoom;
                const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
                const matchesSearch = query || haystack.includes(query);
                return matchesBuilding && matchesRoom && matchesStatus && matchesSearch;
            })
            .sort((left, right) => new Date(right.purchaseDate).getTime() - new Date(left.purchaseDate).getTime());
    }, [equipment, buildingMap, roomMap, filterBuilding, filterRoom, filterStatus, searchTerm]);

    const summary = React.useMemo(() => {
        const purchaseValue = filteredEquipment.reduce((sum, item) => sum + item.price, 0);
        const currentValue = filteredEquipment.reduce((sum, item) => sum + getEquipmentBookValue(item), 0);
        const maintenanceCost = filteredEquipment.reduce((sum, item) => sum + getEquipmentMaintenanceTotal(item), 0);
        const monthlyDepreciation = filteredEquipment.reduce((sum, item) => sum + getEquipmentMonthlyDepreciation(item), 0);
        const itemsNeedingAttention = filteredEquipment.filter(item => item.status == 'Tốt').length;
        return { purchaseValue, currentValue, maintenanceCost, monthlyDepreciation, itemsNeedingAttention };
    }, [filteredEquipment]);

    const openCreateModal = () => {
        setEditingId(null);
        setDraft(createEquipmentDraft({ buildingId: filterBuilding == 'all' ? filterBuilding : buildings[0]?.id || '' }));
        setIsModalOpen(true);
    };

    const handleEdit = (item: Equipment) => {
        setEditingId(item.id);
        setDraft(equipmentToDraft(item));
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setDraft(createEquipmentDraft());
    };

    const handleDelete = (id: string) => {
        if (!window.confirm('Xóa tài sản này khỏi danh sách?')) return;
        deleteEquipment(id);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!draft.name.trim() || !draft.buildingId || !draft.purchaseDate) return;

        const maintenanceHistory = draft.maintenanceHistory
            .filter(entry => entry.date || entry.cost || entry.note || entry.valueAfter)
            .map(entry => ({
                id: entry.id || `MNT${Date.now()}${Math.random().toString(36).slice(2, 7)}`,
                date: entry.date || new Date().toISOString().split('T')[0],
                type: entry.type,
                cost: parseOptionalNumber(entry.cost) || 0,
                note: entry.note.trim() || undefined,
                valueAfter: parseOptionalNumber(entry.valueAfter),
            }));

        const lastRevaluation = [...maintenanceHistory]
            .reverse()
            .find(entry => entry.type === 'revaluation' && typeof entry.valueAfter === 'number');

        const original = editingId ? equipment.find(item => item.id === editingId) : undefined;
        const parsedPrice = parseOptionalNumber(draft.price) || 0;
        const parsedCurrentValue = parseOptionalNumber(draft.currentValue);

        const nextItem: Equipment = {
            id: editingId || `EQ${Date.now()}`,
            name: draft.name.trim(),
            status: draft.status,
            buildingId: draft.buildingId,
            roomId: draft.roomId || undefined,
            purchaseDate: draft.purchaseDate,
            price: parsedPrice,
            notes: draft.notes.trim() || undefined,
            depreciationMonths: parseOptionalNumber(draft.depreciationMonths),
            salvageValue: parseOptionalNumber(draft.salvageValue),
            currentValue: parsedCurrentValue ?? lastRevaluation?.valueAfter ?? original?.currentValue,
            lastValuationDate: draft.lastValuationDate || lastRevaluation?.date || original?.lastValuationDate,
            maintenanceHistory,
            hostId: original?.hostId,
            createdAt: original?.createdAt,
        };

        if (editingId) {
            updateEquipment(nextItem);
        } else {
            addEquipment(nextItem);
        }

        handleCloseModal();
    };

    const setMaintenanceField = (index: number, field: keyof MaintenanceDraft, value: string) => {
        setDraft(prev => ({
            ...prev,
            maintenanceHistory: prev.maintenanceHistory.map((entry, entryIndex) =>
                entryIndex === index ? { ...entry, [field]: value } : entry,
            ),
        }));
    };

    const addMaintenanceEntry = (type: EquipmentMaintenanceType) => {
        setDraft(prev => ({
            ...prev,
            maintenanceHistory: [...prev.maintenanceHistory, createMaintenanceDraft(type)],
        }));
    };

    const removeMaintenanceEntry = (index: number) => {
        setDraft(prev => ({
            ...prev,
            maintenanceHistory: prev.maintenanceHistory.filter((_, entryIndex) => entryIndex !== index),
        }));
    };

    const renderStatusBadge = (status: EquipmentStatus) => {
        const meta = STATUS_META[status];
        const Icon = meta.icon;
        return (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${meta.className}`}>
                <Icon className="h-3.5 w-3.5" />
                {meta.label}
            </span>
        );
    };

    const summaryCards = [
        {
            label: 'Nguyên giá tài sản',
            value: formatCurrency(summary.purchaseValue),
            helper: `${filteredEquipment.length} tài sản đang hiển thị`,
        },
        {
            label: 'Giá trị còn lại',
            value: formatCurrency(summary.currentValue),
            helper: 'Đã tính lại từ khấu hao và đánh giá',
        },
        {
            label: 'Chi phí sửa chữa',
            value: formatCurrency(summary.maintenanceCost),
            helper: 'Gồm bảo trì, sửa chữa, đánh giá lại',
        },
        {
            label: 'Khấu hao tháng',
            value: formatCurrency(summary.monthlyDepreciation),
            helper: `${summary.itemsNeedingAttention} tài sản cần theo dõi`,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trang thiết bị</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Quản lý tài sản theo vòng đời: mua sắm, sửa chữa, đánh giá lại và khấu hao.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20"
                >
                    <Plus className="h-4 w-4" />
                    Thêm tài sản
                </button>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="grid gap-3 xl:grid-cols-[1.2fr_repeat(3,minmax(0,0.55fr))]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)}
                            placeholder="Tìm theo tên tài sản, mã, tòa nhà..."
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                    </div>

                    <select
                        value={filterBuilding}
                        onChange={event => {
                            setFilterBuilding(event.target.value);
                            setFilterRoom('all');
                        }}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                        <option value="all">Tất cả tòa nhà</option>
                        {buildings.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterRoom}
                        onChange={event => setFilterRoom(event.target.value)}
                        disabled={filterBuilding === 'all'}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-800"
                    >
                        <option value="all">Tất cả phòng</option>
                        {filteredRooms.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={event => setFilterStatus(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        {Object.keys(STATUS_META).map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2 lg:hidden">
                    <button type="button" onClick={() => setViewMode('card')} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${viewMode === 'card' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Dạng card">
                        <LayoutGrid className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={() => setViewMode('list')} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${viewMode === 'list' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Dạng danh sách">
                        <List className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map(card => (
                    <div key={card.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{card.label}</div>
                        <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{card.value}</div>
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{card.helper}</div>
                    </div>
                ))}
            </div>

            {/* Mobile Card View */}
            <div className={`grid gap-4 lg:hidden ${viewMode !== 'card' ? 'hidden' : ''}`}>
                {filteredEquipment.length === 0 && (
                    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                        Chưa có tài sản nào khớp với bộ lọc hiện tại.
                    </div>
                )}

                {filteredEquipment.map(item => {
                    const building = buildingMap.get(item.buildingId);
                    const room = item.roomId ? roomMap.get(item.roomId) : undefined;
                    return (
                        <article key={item.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="truncate text-lg font-semibold text-slate-900 dark:text-white">{item.name}</div>
                                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.id}</div>
                                </div>
                                {renderStatusBadge(item.status)}
                            </div>

                            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                    <span>{building?.name || 'Chưa gắn tòa nhà'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Home className="h-4 w-4 text-slate-400" />
                                    <span>{room?.name || 'Khu vực chung'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-slate-400" />
                                        <span>Mua ngày {formatDateVN(item.purchaseDate, item.purchaseDate)}</span>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-800/80">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Nguyên giá</div>
                                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(item.price)}</div>
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-800/80">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Giá trị còn lại</div>
                                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(getEquipmentBookValue(item))}</div>
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-800/80">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Sửa chữa</div>
                                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(getEquipmentMaintenanceTotal(item))}</div>
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-800/80">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Khấu hao tháng</div>
                                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(getEquipmentMonthlyDepreciation(item))}</div>
                                </div>
                            </div>

                            {item.maintenanceHistory && item.maintenanceHistory.length > 0 && (
                                <div className="mt-4 rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Giao dịch gần nhất
                                    </div>
                                    {item.maintenanceHistory
                                        .slice()
                                        .sort((left, right) => right.date.localeCompare(left.date))
                                        .slice(0, 2)
                                        .map(entry => (
                                            <div key={entry.id} className="flex items-start justify-between gap-3 py-1.5 text-sm">
                                                <div className="min-w-0">
                                                    <div className="font-medium text-slate-900 dark:text-white">{MAINTENANCE_LABELS[entry.type]}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{entry.date}</div>
                                                </div>
                                                <div className="text-right font-medium text-slate-900 dark:text-white">
                                                    {entry.type === 'revaluation' && typeof entry.valueAfter === 'number'
                                                        ? formatCurrency(entry.valueAfter)
                                                        : formatCurrency(entry.cost)}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}

                            <div className="mt-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(item)}
                                    className="flex-1 min-h-[48px] rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item.id)}
                                    className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-rose-200 px-5 py-3 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-950/20"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Mobile List View */}
            <div className={`space-y-2 lg:hidden ${viewMode !== 'list' ? 'hidden' : ''}`}>
                {filteredEquipment.length === 0 && <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">Chưa có tài sản nào khớp với bộ lọc hiện tại.</div>}
                {filteredEquipment.map(item => {
                    const room = item.roomId ? roomMap.get(item.roomId) : undefined;
                    return (
                        <div key={item.id} onClick={() => handleEdit(item)} className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:bg-slate-50 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">
                            <div className="min-w-0 flex-1">
                                <div className="truncate font-semibold text-slate-900 dark:text-white">{item.name}</div>
                                <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{room?.name || 'Khu vực chung'} • GT còn lại: {formatCurrency(getEquipmentBookValue(item))}</div>
                            </div>
                            <div className="flex-shrink-0">
                                {renderStatusBadge(item.status)}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="hidden overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                            <tr>
                                <th className="px-5 py-4">Tài sản</th>
                                <th className="px-5 py-4">Trạng thái</th>
                                <th className="px-5 py-4">Vị trí</th>
                                <th className="px-5 py-4 text-right">Nguyên giá</th>
                                <th className="px-5 py-4 text-right">Giá trị còn lại</th>
                                <th className="px-5 py-4 text-right">Sửa chữa</th>
                                <th className="px-5 py-4 text-right">Khấu hao tháng</th>
                                <th className="px-5 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredEquipment.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                                        Chưa có tài sản nào khớp với bộ lọc hiện tại.
                                    </td>
                                </tr>
                            ) : (
                                filteredEquipment.map(item => {
                                    const building = buildingMap.get(item.buildingId);
                                    const room = item.roomId ? roomMap.get(item.roomId) : undefined;
                                    return (
                                        <tr key={item.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                            <td className="px-5 py-4">
                                                <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                                                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                    {item.id} • Mua ngày {formatDateVN(item.purchaseDate, item.purchaseDate)}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">{renderStatusBadge(item.status)}</td>
                                            <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                <div>{building?.name || 'Chưa gắn tòa nhà'}</div>
                                                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{room?.name || 'Khu vực chung'}</div>
                                            </td>
                                            <td className="px-5 py-4 text-right font-medium text-slate-900 dark:text-white">{formatCurrency(item.price)}</td>
                                            <td className="px-5 py-4 text-right font-medium text-slate-900 dark:text-white">{formatCurrency(getEquipmentBookValue(item))}</td>
                                            <td className="px-5 py-4 text-right text-slate-700 dark:text-slate-200">{formatCurrency(getEquipmentMaintenanceTotal(item))}</td>
                                            <td className="px-5 py-4 text-right text-slate-700 dark:text-slate-200">{formatCurrency(getEquipmentMonthlyDepreciation(item))}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(item)}
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id)}
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-950/20"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
                    <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    {editingId ? 'Cập nhật tài sản' : 'Thêm tài sản mới'}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Theo dõi nguyên giá, giá trị còn lại, khấu hao và lịch sử bảo trì trong cùng một biểu mẫu.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => addMaintenanceEntry('repair')}
                                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    + Sửa chữa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addMaintenanceEntry('maintenance')}
                                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    + Bảo trì
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addMaintenanceEntry('revaluation')}
                                    className="rounded-2xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                                >
                                    + Đánh giá lại
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 p-5">
                            <section className="space-y-4">
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">Thông tin cơ bản</div>
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    <input
                                        required
                                        value={draft.name}
                                        onChange={event => setDraft(prev => ({ ...prev, name: event.target.value }))}
                                        placeholder="Tên tài sản"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                    />
                                    <select
                                        required
                                        value={draft.buildingId}
                                        onChange={event => setDraft(prev => ({ ...prev, buildingId: event.target.value, roomId: '' }))}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                    >
                                        <option value="">Chọn tòa nhà</option>
                                        {buildings.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={draft.roomId}
                                        onChange={event => setDraft(prev => ({ ...prev, roomId: event.target.value }))}
                                        disabled={!draft.buildingId}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-800"
                                    >
                                        <option value="">Khu vực chung</option>
                                        {roomsForDraft.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={draft.status}
                                        onChange={event => setDraft(prev => ({ ...prev, status: event.target.value as EquipmentStatus }))}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                    >
                                        {Object.keys(STATUS_META).map(status => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="date" lang="vi-VN"
                                        required
                                        value={draft.purchaseDate}
                                        onChange={event => setDraft(prev => ({ ...prev, purchaseDate: event.target.value }))}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min={0}
                                        value={draft.price}
                                        onChange={event => setDraft(prev => ({ ...prev, price: event.target.value }))}
                                        placeholder="Nguyên giá"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">Khấu hao và đánh giá</div>
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min={0}
                                        value={draft.depreciationMonths}
                                        onChange={event => setDraft(prev => ({ ...prev, depreciationMonths: event.target.value }))}
                                        placeholder="Số tháng khấu hao"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min={0}
                                        value={draft.salvageValue}
                                        onChange={event => setDraft(prev => ({ ...prev, salvageValue: event.target.value }))}
                                        placeholder="Giá trị thu hồi"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min={0}
                                        value={draft.currentValue}
                                        onChange={event => setDraft(prev => ({ ...prev, currentValue: event.target.value }))}
                                        placeholder="Giá trị còn lại"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                    />
                                    <input
                                        type="date" lang="vi-VN"
                                        value={draft.lastValuationDate}
                                        onChange={event => setDraft(prev => ({ ...prev, lastValuationDate: event.target.value }))}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                    />
                                </div>

                                <div className="rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                                    Giá trị còn lại hiện tính thử:{' '}
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {formatCurrency(
                                            getEquipmentBookValue({
                                                id: editingId || 'preview',
                                                name: draft.name || 'Tài sản',
                                                status: draft.status,
                                                buildingId: draft.buildingId || 'preview',
                                                roomId: draft.roomId || undefined,
                                                purchaseDate: draft.purchaseDate || new Date().toISOString().split('T')[0],
                                                price: parseOptionalNumber(draft.price) || 0,
                                                notes: draft.notes || undefined,
                                                depreciationMonths: parseOptionalNumber(draft.depreciationMonths),
                                                salvageValue: parseOptionalNumber(draft.salvageValue),
                                                currentValue: parseOptionalNumber(draft.currentValue),
                                                lastValuationDate: draft.lastValuationDate || undefined,
                                                maintenanceHistory: draft.maintenanceHistory.map(entry => ({
                                                    id: entry.id,
                                                    date: entry.date || new Date().toISOString().split('T')[0],
                                                    type: entry.type,
                                                    cost: parseOptionalNumber(entry.cost) || 0,
                                                    note: entry.note || undefined,
                                                    valueAfter: parseOptionalNumber(entry.valueAfter),
                                                })),
                                            })
                                        )}
                                    </span>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Lịch sử bảo trì và chi phí phát sinh</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                        Dùng để tổng hợp chi phí sửa chữa và phục vụ kiểm kê tài sản.
                                    </div>
                                </div>

                                {draft.maintenanceHistory.length === 0 ? (
                                    <div className="rounded-[1.5rem] border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                        Chưa có bản ghi bảo trì. Có thể thêm sửa chữa, bảo trì định kỳ hoặc đánh giá lại tài sản.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {draft.maintenanceHistory.map((entry, index) => (
                                            <div key={entry.id} className="rounded-[1.5rem] border border-slate-200 p-4 dark:border-slate-700">
                                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[0.9fr_0.9fr_0.9fr_1fr_auto]">
                                                    <select
                                                        value={entry.type}
                                                        onChange={event => setMaintenanceField(index, 'type', event.target.value)}
                                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                                    >
                                                        <option value="repair">Sửa chữa</option>
                                                        <option value="maintenance">Bảo trì</option>
                                                        <option value="revaluation">Đánh giá lại</option>
                                                    </select>
                                                    <input
                                                        type="date" lang="vi-VN"
                                                        value={entry.date}
                                                        onChange={event => setMaintenanceField(index, 'date', event.target.value)}
                                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                                    />
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={0}
                                                        value={entry.cost}
                                                        onChange={event => setMaintenanceField(index, 'cost', event.target.value)}
                                                        placeholder="Chi phí"
                                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                                    />
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={0}
                                                        value={entry.valueAfter}
                                                        onChange={event => setMaintenanceField(index, 'valueAfter', event.target.value)}
                                                        placeholder={entry.type === 'revaluation' ? 'Giá trị sau đánh giá' : 'Giá trị sau xử lý (nếu có)'}
                                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMaintenanceEntry(index)}
                                                        className="inline-flex h-12 items-center justify-center rounded-2xl border border-rose-200 px-4 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-950/20"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <textarea
                                                    rows={3}
                                                    value={entry.note}
                                                    onChange={event => setMaintenanceField(index, 'note', event.target.value)}
                                                    placeholder="Ghi chú sửa chữa, hạng mục thay thế, đơn vị thực hiện..."
                                                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className="space-y-3">
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">Ghi chú</div>
                                <textarea
                                    rows={4}
                                    value={draft.notes}
                                    onChange={event => setDraft(prev => ({ ...prev, notes: event.target.value }))}
                                    placeholder="Mô tả tình trạng, vị trí lắp đặt, thông tin bảo hành..."
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                />
                            </section>

                            <div className="flex flex-col gap-3 border-t border-slate-100 pt-2 sm:flex-row sm:justify-end dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20"
                                >
                                    {editingId ? 'Lưu cập nhật' : 'Thêm tài sản'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
