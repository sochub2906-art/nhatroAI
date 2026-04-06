import React from 'react';
import { formatCurrency, useApp } from '../AppContext';
import type { Equipment, EquipmentMaintenanceType, EquipmentStatus } from '../types';
import { Archive, Building2, CheckCircle2, ChevronDown, ChevronUp, Edit3, Home, LayoutGrid, List, Plus, Search, ShieldAlert, Trash2, Wrench, FileSpreadsheet } from 'lucide-react';
import { getEquipmentBookValue, getEquipmentMaintenanceTotal, getEquipmentMonthlyDepreciation } from '../utils/hostAnalytics';
import { composeEquipmentNotes, extractEquipmentCategory } from '../utils/equipmentCategory';
import BulkImportModal from '../components/BulkImportModal';
import SmartDateInput from '../components/SmartDateInput';

type EquipmentDraft = {
    name: string;
    category: string;
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

type EquipmentView = {
    item: Equipment;
    category: string;
    cleanNotes: string;
};

const STATUS_META: Record<EquipmentStatus, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
    'Tốt': { label: 'Tốt', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-800', icon: CheckCircle2 },
    'Hỏng': { label: 'Hỏng', className: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-800', icon: ShieldAlert },
    'Đang sửa': { label: 'Đang sửa', className: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-800', icon: Wrench },
    'Thanh lý': { label: 'Thanh lý', className: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700', icon: Archive },
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
    if (!value.trim()) return undefined;
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
        category: 'Khác',
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
    const metadata = extractEquipmentCategory(item.notes, item.name);
    return {
        name: item.name,
        category: metadata.category,
        status: item.status,
        buildingId: item.buildingId,
        roomId: item.roomId || '',
        purchaseDate: item.purchaseDate,
        price: toInputValue(item.price),
        depreciationMonths: toInputValue(item.depreciationMonths),
        salvageValue: toInputValue(item.salvageValue),
        currentValue: toInputValue(item.currentValue),
        lastValuationDate: item.lastValuationDate || '',
        notes: metadata.notes,
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

export default function EquipmentManager() {
    const { equipment, buildings, rooms, addEquipment, updateEquipment, deleteEquipment } = useApp();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterBuilding, setFilterBuilding] = React.useState('all');
    const [filterRoom, setFilterRoom] = React.useState('all');
    const [filterStatus, setFilterStatus] = React.useState('all');
    const [filterCategory, setFilterCategory] = React.useState('all');
    const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({});
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isBulkImportOpen, setIsBulkImportOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [draft, setDraft] = React.useState<EquipmentDraft>(() => createEquipmentDraft());
    const [viewMode, setViewMode] = React.useState<'card' | 'list'>('card');

    const buildingMap = React.useMemo(() => new Map(buildings.map(item => [item.id, item])), [buildings]);
    const roomMap = React.useMemo(() => new Map(rooms.map(item => [item.id, item])), [rooms]);
    const roomsForDraft = React.useMemo(() => rooms.filter(room => room.buildingId === draft.buildingId), [draft.buildingId, rooms]);
    const filteredRooms = React.useMemo(() => filterBuilding === 'all' ? [] : rooms.filter(room => room.buildingId === filterBuilding), [filterBuilding, rooms]);

    const equipmentViews = React.useMemo<EquipmentView[]>(() => (
        equipment.map(item => {
            const metadata = extractEquipmentCategory(item.notes, item.name);
            return { item, category: metadata.category, cleanNotes: metadata.notes };
        })
    ), [equipment]);

    const categoryOptions = React.useMemo(
        () => Array.from(new Set<string>(equipmentViews.map(entry => entry.category))).sort((left, right) => left.localeCompare(right)),
        [equipmentViews],
    );

    const filteredEquipment = React.useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return equipmentViews.filter(entry => {
            const { item, category, cleanNotes } = entry;
            const building = buildingMap.get(item.buildingId);
            const room = item.roomId ? roomMap.get(item.roomId) : undefined;
            const haystack = [item.id, item.name, category, cleanNotes, building?.name || '', room?.name || ''].join(' ').toLowerCase();
            return (filterBuilding === 'all' || item.buildingId === filterBuilding)
                && (filterRoom === 'all' || item.roomId === filterRoom)
                && (filterStatus === 'all' || item.status === filterStatus)
                && (filterCategory === 'all' || category === filterCategory)
                && (!query || haystack.includes(query));
        }).sort((left, right) => new Date(right.item.purchaseDate).getTime() - new Date(left.item.purchaseDate).getTime());
    }, [buildingMap, equipmentViews, filterBuilding, filterCategory, filterRoom, filterStatus, roomMap, searchTerm]);

    const groupedEquipment = React.useMemo(() => filteredEquipment.reduce<Record<string, Record<string, EquipmentView[]>>>((acc, entry) => {
        const roomKey = entry.item.roomId || '__common__';
        if (!acc[entry.category]) acc[entry.category] = {};
        if (!acc[entry.category][roomKey]) acc[entry.category][roomKey] = [];
        acc[entry.category][roomKey].push(entry);
        return acc;
    }, {}), [filteredEquipment]);

    const summary = React.useMemo(() => ({
        purchaseValue: filteredEquipment.reduce((sum, entry) => sum + entry.item.price, 0),
        currentValue: filteredEquipment.reduce((sum, entry) => sum + getEquipmentBookValue(entry.item), 0),
        maintenanceCost: filteredEquipment.reduce((sum, entry) => sum + getEquipmentMaintenanceTotal(entry.item), 0),
        monthlyDepreciation: filteredEquipment.reduce((sum, entry) => sum + getEquipmentMonthlyDepreciation(entry.item), 0),
        categoryCount: Object.keys(groupedEquipment).length,
    }), [filteredEquipment, groupedEquipment]);

    const openCreateModal = () => {
        setEditingId(null);
        setDraft(createEquipmentDraft({ buildingId: filterBuilding !== 'all' ? filterBuilding : buildings[0]?.id || '' }));
        setIsModalOpen(true);
    };

    const handleEdit = (item: Equipment) => {
        setEditingId(item.id);
        setDraft(equipmentToDraft(item));
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (!window.confirm('Xóa tài sản này khỏi danh sách?')) return;
        deleteEquipment(id);
    };

    const handleCloseModal = () => {
        setEditingId(null);
        setDraft(createEquipmentDraft());
        setIsModalOpen(false);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!draft.name.trim() || !draft.buildingId || !draft.purchaseDate) return;

        const original = editingId ? equipment.find(item => item.id === editingId) : undefined;
        const maintenanceHistory = draft.maintenanceHistory
            .filter(entry => entry.date || entry.cost || entry.note || entry.valueAfter)
            .map(entry => ({
                id: entry.id,
                date: entry.date || new Date().toISOString().split('T')[0],
                type: entry.type,
                cost: parseOptionalNumber(entry.cost) || 0,
                note: entry.note.trim() || undefined,
                valueAfter: parseOptionalNumber(entry.valueAfter),
            }));

        const payload: Equipment = {
            id: editingId || `EQ${Date.now()}`,
            name: draft.name.trim(),
            status: draft.status,
            buildingId: draft.buildingId,
            roomId: draft.roomId || undefined,
            purchaseDate: draft.purchaseDate,
            price: parseOptionalNumber(draft.price) || 0,
            notes: composeEquipmentNotes(draft.category, draft.notes),
            depreciationMonths: parseOptionalNumber(draft.depreciationMonths),
            salvageValue: parseOptionalNumber(draft.salvageValue),
            currentValue: parseOptionalNumber(draft.currentValue),
            lastValuationDate: draft.lastValuationDate || undefined,
            maintenanceHistory,
            hostId: original?.hostId,
            createdAt: original?.createdAt,
        };

        if (editingId) updateEquipment(payload);
        else addEquipment(payload);
        handleCloseModal();
    };

    const setMaintenanceField = (index: number, field: keyof MaintenanceDraft, value: string) => {
        setDraft(prev => ({
            ...prev,
            maintenanceHistory: prev.maintenanceHistory.map((entry, currentIndex) => currentIndex === index ? { ...entry, [field]: value } : entry),
        }));
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
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
        { label: 'Nguyên giá tài sản', value: formatCurrency(summary.purchaseValue), helper: `${filteredEquipment.length} tài sản đang hiển thị` },
        { label: 'Giá trị còn lại', value: formatCurrency(summary.currentValue), helper: `${summary.categoryCount} nhóm thiết bị theo loại` },
        { label: 'Chi phí sửa chữa', value: formatCurrency(summary.maintenanceCost), helper: 'Gồm bảo trì, sửa chữa và đánh giá lại' },
        { label: 'Khấu hao tháng', value: formatCurrency(summary.monthlyDepreciation), helper: 'Dùng để theo dõi hao mòn định kỳ' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trang thiết bị</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Group theo loại thiết bị, bấm vào từng nhóm để xem danh sách chi tiết theo từng phòng đang sử dụng.
                    </p>
                </div>

                <div className="flex gap-2">
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
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="h-4 w-4" />
                        Thêm tài sản
                    </button>
                </div>
            </div>

            <BulkImportModal
                type="equipment"
                isOpen={isBulkImportOpen}
                onClose={() => setIsBulkImportOpen(false)}
            />

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="grid gap-3 xl:grid-cols-[1.05fr_repeat(4,minmax(0,0.55fr))]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)}
                            placeholder="Tìm theo tên tài sản, nhóm, phòng, tòa nhà..."
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                    </div>

                    <select value={filterBuilding} onChange={event => { setFilterBuilding(event.target.value); setFilterRoom('all'); }} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                        <option value="all">Tất cả tòa nhà</option>
                        {buildings.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>

                    <select value={filterRoom} onChange={event => setFilterRoom(event.target.value)} disabled={filterBuilding === 'all'} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-800">
                        <option value="all">Tất cả phòng</option>
                        {filteredRooms.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>

                    <select value={filterCategory} onChange={event => setFilterCategory(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                        <option value="all">Tất cả loại</option>
                        {categoryOptions.map(category => <option key={category} value={category}>{category}</option>)}
                    </select>

                    <select value={filterStatus} onChange={event => setFilterStatus(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                        <option value="all">Tất cả trạng thái</option>
                        {Object.keys(STATUS_META).map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
                <div className="mt-3 flex items-center gap-2 lg:hidden">
                    <button type="button" onClick={() => setViewMode('card')} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${viewMode === 'card' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Dạng card">
                        <LayoutGrid className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={() => setViewMode('list')} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${viewMode === 'list' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Dạng danh sách">
                        <List className="h-5 w-5" />
                    </button>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{filteredEquipment.length} tài sản</span>
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

            {/* Mobile List View */}
            <div className={`space-y-2 lg:hidden ${viewMode !== 'list' ? 'hidden' : ''}`}>
                {filteredEquipment.length === 0 && <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">Chưa có tài sản nào khớp với bộ lọc hiện tại.</div>}
                {filteredEquipment.map(({ item, category }) => {
                    const room = item.roomId ? roomMap.get(item.roomId) : undefined;
                    return (
                        <div key={item.id} onClick={() => handleEdit(item)} className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:bg-slate-50 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">
                            <div className="min-w-0 flex-1">
                                <div className="truncate font-semibold text-slate-900 dark:text-white">{item.name}</div>
                                <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{category} · {room?.name || 'Khu vực chung'} · GT: {formatCurrency(getEquipmentBookValue(item))}</div>
                            </div>
                            <div className="flex-shrink-0">
                                {renderStatusBadge(item.status)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Card View (default on desktop, toggle on mobile) */}
            <div className={`space-y-4 ${viewMode === 'list' ? 'hidden lg:block' : ''}`}>
                {Object.keys(groupedEquipment).length === 0 && (
                    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                        Chưa có tài sản nào khớp với bộ lọc hiện tại.
                    </div>
                )}

                {Object.entries(groupedEquipment).sort(([left], [right]) => left.localeCompare(right)).map(([category, roomGroups]) => {
                    const flatItems = Object.values(roomGroups).flat();
                    const totalValue = flatItems.reduce((sum, entry) => sum + getEquipmentBookValue(entry.item), 0);
                    const totalMaintenance = flatItems.reduce((sum, entry) => sum + getEquipmentMaintenanceTotal(entry.item), 0);
                    const isExpanded = expandedCategories[category] ?? true;

                    return (
                        <section key={category} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <button
                                type="button"
                                onClick={() => toggleCategory(category)}
                                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            >
                                <div>
                                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{category}</div>
                                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {flatItems.length} tài sản · {Object.keys(roomGroups).length} khu vực/phòng · giá trị còn lại {formatCurrency(totalValue)}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Chi phí sửa chữa đang ghi nhận: {formatCurrency(totalMaintenance)}
                                    </div>
                                </div>
                                {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                            </button>

                            {isExpanded && (
                                <div className="border-t border-slate-100 px-5 py-5 dark:border-slate-800">
                                    <div className="space-y-5">
                                        {Object.entries(roomGroups).map(([roomKey, items]) => {
                                            const room = roomKey === '__common__' ? null : roomMap.get(roomKey);
                                            const building = items[0] ? buildingMap.get(items[0].item.buildingId) : undefined;

                                            return (
                                                <div key={roomKey} className="rounded-[1.5rem] border border-slate-200 p-4 dark:border-slate-700">
                                                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <div className="text-base font-semibold text-slate-900 dark:text-white">{room ? room.name : 'Khu vực chung'}</div>
                                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                {building?.name || 'Chưa gắn tòa nhà'}{building?.address ? ` · ${building.address}` : ''}
                                                            </div>
                                                        </div>
                                                        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                            {items.length} thiết bị
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-4 lg:grid-cols-2">
                                                        {items.map(({ item, cleanNotes }) => (
                                                            <article key={item.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="min-w-0">
                                                                        <div className="truncate text-lg font-semibold text-slate-900 dark:text-white">{item.name}</div>
                                                                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.id}</div>
                                                                    </div>
                                                                    {renderStatusBadge(item.status)}
                                                                </div>

                                                                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                                                    <div className="rounded-2xl bg-white px-3 py-3 text-sm shadow-sm dark:bg-slate-900">
                                                                        <div className="text-xs text-slate-500 dark:text-slate-400">Nguyên giá</div>
                                                                        <div className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(item.price)}</div>
                                                                    </div>
                                                                    <div className="rounded-2xl bg-white px-3 py-3 text-sm shadow-sm dark:bg-slate-900">
                                                                        <div className="text-xs text-slate-500 dark:text-slate-400">Giá trị còn lại</div>
                                                                        <div className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(getEquipmentBookValue(item))}</div>
                                                                    </div>
                                                                    <div className="rounded-2xl bg-white px-3 py-3 text-sm shadow-sm dark:bg-slate-900">
                                                                        <div className="text-xs text-slate-500 dark:text-slate-400">Sửa chữa</div>
                                                                        <div className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(getEquipmentMaintenanceTotal(item))}</div>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-3 rounded-2xl bg-white px-3 py-3 text-sm shadow-sm dark:bg-slate-900">
                                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Khấu hao tháng</div>
                                                                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(getEquipmentMonthlyDepreciation(item))}</div>
                                                                </div>

                                                                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                                                    <div className="flex items-center gap-2">
                                                                        <Building2 className="h-4 w-4 text-slate-400" />
                                                                        <span>{building?.name || 'Chưa gắn tòa nhà'}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Home className="h-4 w-4 text-slate-400" />
                                                                        <span>{room?.name || 'Khu vực chung'}</span>
                                                                    </div>
                                                                    {cleanNotes && (
                                                                        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs leading-6 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                                                                            {cleanNotes}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleEdit(item)}
                                                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                                                    >
                                                                        <Edit3 className="h-4 w-4" />
                                                                        Sửa tài sản
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDelete(item.id)}
                                                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-300"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                        Xóa
                                                                    </button>
                                                                </div>
                                                            </article>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
                    <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{editingId ? 'Cập nhật tài sản' : 'Thêm tài sản mới'}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Khai báo loại thiết bị, chi phí sửa chữa, đánh giá lại và khấu hao trong cùng một biểu mẫu.</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => setDraft(prev => ({ ...prev, maintenanceHistory: [...prev.maintenanceHistory, createMaintenanceDraft('repair')] }))} className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">+ Sửa chữa</button>
                                <button type="button" onClick={() => setDraft(prev => ({ ...prev, maintenanceHistory: [...prev.maintenanceHistory, createMaintenanceDraft('maintenance')] }))} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">+ Bảo trì</button>
                                <button type="button" onClick={() => setDraft(prev => ({ ...prev, maintenanceHistory: [...prev.maintenanceHistory, createMaintenanceDraft('revaluation')] }))} className="rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300">+ Đánh giá lại</button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 p-5">
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tên tài sản *</label>
                                    <input required value={draft.name} onChange={event => setDraft(prev => ({ ...prev, name: event.target.value }))} placeholder="Tên tài sản" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Danh mục</label>
                                    <input value={draft.category} onChange={event => setDraft(prev => ({ ...prev, category: event.target.value || 'Khác' }))} placeholder="Loại thiết bị" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tòa nhà *</label>
                                    <select required value={draft.buildingId} onChange={event => setDraft(prev => ({ ...prev, buildingId: event.target.value, roomId: '' }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                                        <option value="">Chọn tòa nhà</option>
                                        {buildings.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Vị trí (Phòng ban/Khu vực chung)</label>
                                    <select value={draft.roomId} onChange={event => setDraft(prev => ({ ...prev, roomId: event.target.value }))} disabled={!draft.buildingId} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-800">
                                        <option value="">Khu vực chung</option>
                                        {roomsForDraft.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tình trạng</label>
                                    <select value={draft.status} onChange={event => setDraft(prev => ({ ...prev, status: event.target.value as EquipmentStatus }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                                        {Object.keys(STATUS_META).map(status => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Ngày mua *</label>
                                    <SmartDateInput required value={draft.purchaseDate} onChange={value => setDraft(prev => ({ ...prev, purchaseDate: value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nguyên giá (VNĐ)</label>
                                    <input type="number" min={0} value={draft.price} onChange={event => setDraft(prev => ({ ...prev, price: event.target.value }))} placeholder="Nguyên giá" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Số tháng khấu hao</label>
                                    <input type="number" min={0} value={draft.depreciationMonths} onChange={event => setDraft(prev => ({ ...prev, depreciationMonths: event.target.value }))} placeholder="Số tháng khấu hao" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Giá trị thu hồi sau KH (VNĐ)</label>
                                    <input type="number" min={0} value={draft.salvageValue} onChange={event => setDraft(prev => ({ ...prev, salvageValue: event.target.value }))} placeholder="Giá trị thu hồi" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Giá trị còn lại hiện tại (VNĐ)</label>
                                    <input type="number" min={0} value={draft.currentValue} onChange={event => setDraft(prev => ({ ...prev, currentValue: event.target.value }))} placeholder="Giá trị còn lại" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                </div>
                                <div className="md:col-span-2 xl:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Ngày đánh giá lại/bảo trì gần nhất</label>
                                    <SmartDateInput value={draft.lastValuationDate} onChange={value => setDraft(prev => ({ ...prev, lastValuationDate: value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {draft.maintenanceHistory.length === 0 ? (
                                    <div className="rounded-[1.5rem] border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Chưa có bản ghi bảo trì. Có thể thêm sửa chữa, bảo trì hoặc đánh giá lại ở phía trên.</div>
                                ) : (
                                    draft.maintenanceHistory.map((entry, index) => (
                                        <div key={entry.id} className="rounded-[1.5rem] border border-slate-200 p-4 dark:border-slate-700">
                                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[0.9fr_0.9fr_0.9fr_1fr_auto]">
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Loại xử lý</label>
                                                    <select value={entry.type} onChange={event => setMaintenanceField(index, 'type', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                                                        <option value="repair">Sửa chữa</option>
                                                        <option value="maintenance">Bảo trì</option>
                                                        <option value="revaluation">Đánh giá lại</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Ngày thực hiện</label>
                                                    <SmartDateInput value={entry.date} onChange={value => setMaintenanceField(index, 'date', value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                                </div>
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Chi phí (VNĐ)</label>
                                                    <input type="number" min={0} value={entry.cost} onChange={event => setMaintenanceField(index, 'cost', event.target.value)} placeholder="Chi phí" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                                </div>
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">{entry.type === 'revaluation' ? 'Giá trị sau đánh giá' : 'Giá trị sau xử lý'}</label>
                                                    <input type="number" min={0} value={entry.valueAfter} onChange={event => setMaintenanceField(index, 'valueAfter', event.target.value)} placeholder={entry.type === 'revaluation' ? 'Giá trị sau đánh giá' : 'Giá trị sau xử lý'} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                                </div>
                                                <div className="flex items-end justify-end">
                                                    <button type="button" onClick={() => setDraft(prev => ({ ...prev, maintenanceHistory: prev.maintenanceHistory.filter((_, currentIndex) => currentIndex !== index) }))} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-200 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-950/20"><Trash2 className="h-4 w-4" /></button>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{MAINTENANCE_LABELS[entry.type]}</div>
                                            <div>
                                                <label className="mt-3 mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Ghi chú thêm</label>
                                                <textarea rows={3} value={entry.note} onChange={event => setMaintenanceField(index, 'note', event.target.value)} placeholder="Ghi chú sửa chữa, thay thế, đơn vị thực hiện..." className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <textarea rows={4} value={draft.notes} onChange={event => setDraft(prev => ({ ...prev, notes: event.target.value }))} placeholder="Ghi chú tình trạng, bảo hành, vị trí lắp đặt..." className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />

                            <div className="flex flex-col gap-3 border-t border-slate-100 pt-2 sm:flex-row sm:justify-end dark:border-slate-800">
                                <button type="button" onClick={handleCloseModal} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">Hủy</button>
                                <button type="submit" className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20">{editingId ? 'Lưu cập nhật' : 'Thêm tài sản'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
