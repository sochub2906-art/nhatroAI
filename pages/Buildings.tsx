import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building as BuildingIcon, DollarSign, Home, MapPin, Plus, Trash2, Users } from 'lucide-react';
import { formatCurrency, useApp } from '../AppContext';
import { Building, BuildingType, Equipment } from '../types';
import BulkRoomGenerator from '../components/BulkRoomGenerator';
import { formatDateVN } from '../utils/dateFormat';

type BuildingDraft = Partial<Building> & {
    initialEquipment?: Array<Partial<Equipment>>;
};

export default function Buildings() {
    const { buildings, rooms, contracts, payments, serviceRecords, addBuilding, deleteBuilding, currentUser, pricingTiers } = useApp();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkGeneratorOpen, setIsBulkGeneratorOpen] = useState(false);
    const [createdBuildingId, setCreatedBuildingId] = useState<string | null>(null);
    const [newBuilding, setNewBuilding] = useState<BuildingDraft>({
        name: '',
        address: '',
        type: 'Owned',
        totalFloors: 1,
        initialEquipment: [],
    });

    const handleAddBuilding = (event: React.FormEvent) => {
        event.preventDefault();
        if (!newBuilding.name || !newBuilding.address) return;

        if (currentUser?.role === 'HOST') {
            const plan = pricingTiers.find(item => item.id === currentUser.subscriptionPlanId);
            const myBuildings = buildings.filter(building => building.hostId === currentUser.id);
            if (plan && myBuildings.length >= plan.maxBuildings) {
                alert(`❌ Gói dịch vụ hiện tại của bạn chỉ cho phép quản lý tối đa ${plan.maxBuildings} tòa nhà. Vui lòng nâng cấp gói để thêm mới!`);
                return;
            }
        }

        const buildingId = `B${Date.now()}`;
        addBuilding(
            {
                id: buildingId,
                name: newBuilding.name,
                address: newBuilding.address,
                type: newBuilding.type || 'Owned',
                totalFloors: newBuilding.totalFloors || 1,
                rentalCost: newBuilding.rentalCost,
                leaseStartDate: newBuilding.leaseStartDate,
                leaseDurationMonths: newBuilding.leaseDurationMonths,
                leaseEndDate: newBuilding.leaseEndDate,
            },
            newBuilding.initialEquipment,
        );

        setIsModalOpen(false);
        setNewBuilding({ name: '', address: '', type: 'Owned', totalFloors: 1, initialEquipment: [] });
        setCreatedBuildingId(buildingId);
        setIsBulkGeneratorOpen(true);
    };

    const getBuildingStats = (buildingId: string) => {
        const buildingRooms = rooms.filter(room => room.buildingId === buildingId);
        const roomIds = buildingRooms.map(room => room.id);
        const activeContracts = contracts.filter(contract => contract.isActive && roomIds.includes(contract.roomId));
        const totalResidents = activeContracts.length;
        const occupiedRooms = new Set(activeContracts.map(contract => contract.roomId)).size;

        const buildingPayments = payments.filter(payment => {
            const contract = contracts.find(item => item.id === payment.contractId);
            return contract && roomIds.includes(contract.roomId);
        });
        const totalDebt = buildingPayments
            .filter(payment => payment.status !== 'Đã đóng')
            .reduce((sum, payment) => sum + payment.amount, 0);

        const buildingServices = serviceRecords.filter(record => roomIds.includes(record.roomId));
        const totalServiceCosts = buildingServices.reduce((sum, record) => sum + record.totalCost, 0);

        const buildingInfo = buildings.find(item => item.id === buildingId);
        const rentalCost = buildingInfo?.type === 'Rented' ? (buildingInfo.rentalCost || 0) : 0;

        return { totalResidents, occupiedRooms, totalRooms: buildingRooms.length, totalDebt, totalServiceCosts, rentalCost };
    };

    const toggleInitialEquipment = (name: string, checked: boolean) => {
        const equipment = [...(newBuilding.initialEquipment || [])];
        if (checked) {
            equipment.push({ name, status: 'Tốt' });
        } else {
            const index = equipment.findIndex(entry => entry.name === name);
            if (index > -1) equipment.splice(index, 1);
        }
        setNewBuilding(prev => ({ ...prev, initialEquipment: equipment }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý tòa nhà</h2>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                    <Plus className="h-5 w-5" />
                    Thêm tòa nhà
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {buildings.map(building => {
                    const stats = getBuildingStats(building.id);
                    const warningThreshold = new Date();
                    warningThreshold.setDate(warningThreshold.getDate() + (building.warningDays || 30));

                    return (
                        <div
                            key={building.id}
                            onClick={() => navigate(`/app/buildings/${building.id}`)}
                            className="group relative cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`rounded-lg p-3 ${building.type === 'Owned' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                                        {building.type === 'Owned' ? <BuildingIcon className="h-6 w-6" /> : <Home className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                            {building.name}
                                        </h3>
                                        <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                            {building.type === 'Owned' ? 'Nhà của mình' : 'Nhà thuê lại'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={event => {
                                            event.stopPropagation();
                                            setCreatedBuildingId(building.id);
                                            setIsBulkGeneratorOpen(true);
                                        }}
                                        className="p-1 text-gray-400 transition-colors hover:text-blue-500"
                                        title="Tạo phòng tự động"
                                    >
                                        <span className="text-lg">⚡</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={event => {
                                            event.stopPropagation();
                                            deleteBuilding(building.id);
                                        }}
                                        className="p-1 text-gray-400 transition-colors hover:text-red-500"
                                        title="Xóa tòa nhà"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span className="line-clamp-2">{building.address}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
                                        <div className="mb-1 flex items-center gap-1.5 text-gray-500">
                                            <Users className="h-3.5 w-3.5" />
                                            <span className="text-xs">Cư trú</span>
                                        </div>
                                        <div className="font-semibold text-gray-900 dark:text-gray-100">{stats.totalResidents} người</div>
                                        <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                            {stats.occupiedRooms}/{stats.totalRooms} phòng đang ở
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-red-50 p-2 dark:bg-red-900/10">
                                        <div className="mb-1 flex items-center gap-1.5 text-red-500">
                                            <DollarSign className="h-3.5 w-3.5" />
                                            <span className="text-xs">Công nợ</span>
                                        </div>
                                        <span className="font-semibold text-red-600 dark:text-red-400">{formatCurrency(stats.totalDebt)}</span>
                                    </div>
                                </div>

                                {building.type === 'Rented' && (
                                    <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-xs">Tiền thuê nhà:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(stats.rentalCost)}</span>
                                        </div>
                                        {building.leaseEndDate && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs">Hết hạn HĐ:</span>
                                                <span className={`text-xs font-medium ${new Date(building.leaseEndDate) < warningThreshold ? 'text-red-500' : 'text-green-500'}`}>
                                                    {formatDateVN(building.leaseEndDate, building.leaseEndDate)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-900">
                        <div className="border-b border-gray-200 p-6 dark:border-gray-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Thêm tòa nhà mới</h3>
                        </div>
                        <form onSubmit={handleAddBuilding} className="space-y-4 p-6">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tên tòa nhà</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    value={newBuilding.name}
                                    onChange={event => setNewBuilding(prev => ({ ...prev, name: event.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Địa chỉ</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    value={newBuilding.address}
                                    onChange={event => setNewBuilding(prev => ({ ...prev, address: event.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Loại hình</label>
                                    <select
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        value={newBuilding.type}
                                        onChange={event => setNewBuilding(prev => ({ ...prev, type: event.target.value as BuildingType }))}
                                    >
                                        <option value="Owned">Nhà của mình</option>
                                        <option value="Rented">Nhà thuê lại</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Số tầng</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        value={newBuilding.totalFloors}
                                        onChange={event => setNewBuilding(prev => ({ ...prev, totalFloors: parseInt(event.target.value, 10) }))}
                                    />
                                </div>
                            </div>

                            {newBuilding.type === 'Rented' && (
                                <div className="space-y-4 border-t border-gray-100 pt-2 dark:border-gray-800">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Giá thuê (VNĐ)</label>
                                        <input
                                            type="number"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                            value={newBuilding.rentalCost || ''}
                                            onChange={event => setNewBuilding(prev => ({ ...prev, rentalCost: parseInt(event.target.value, 10) }))}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Ngày bắt đầu</label>
                                            <input
                                                type="date"
                                                lang="vi-VN"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                                value={newBuilding.leaseStartDate || ''}
                                                onChange={event => setNewBuilding(prev => ({ ...prev, leaseStartDate: event.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Thời hạn (tháng)</label>
                                            <input
                                                type="number"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                                value={newBuilding.leaseDurationMonths || ''}
                                                onChange={event => {
                                                    const months = parseInt(event.target.value, 10);
                                                    let endDate = '';
                                                    if (newBuilding.leaseStartDate && months) {
                                                        const date = new Date(newBuilding.leaseStartDate);
                                                        date.setMonth(date.getMonth() + months);
                                                        endDate = date.toISOString().split('T')[0];
                                                    }
                                                    setNewBuilding(prev => ({ ...prev, leaseDurationMonths: months, leaseEndDate: endDate }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-gray-100 pt-2 dark:border-gray-800">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Trang bị ban đầu cho tòa nhà</label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'cctv', name: 'Hệ thống camera CCTV' },
                                        { id: 'wifi', name: 'Hệ thống router Wi-Fi' },
                                        { id: 'fire', name: 'Chuông báo cháy' },
                                    ].map(item => (
                                        <label key={item.id} className="group flex cursor-pointer items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                                                checked={(newBuilding.initialEquipment || []).some(entry => entry.name === item.name)}
                                                onChange={event => toggleInitialEquipment(item.name, event.target.checked)}
                                            />
                                            <span className="text-sm text-gray-600 transition-colors group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200">
                                                {item.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                >
                                    Thêm tòa nhà
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isBulkGeneratorOpen && createdBuildingId && (
                <BulkRoomGenerator buildingId={createdBuildingId} onClose={() => setIsBulkGeneratorOpen(false)} />
            )}
        </div>
    );
}
