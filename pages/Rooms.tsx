import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building, Home, Plus, Trash2, Users } from 'lucide-react';
import { formatCurrency, useApp } from '../AppContext';
import { getRoomOccupants } from '../utils/roomOccupancy';
import { buildRoomBills } from '../utils/paymentBills';
import { formatDateLabel, getBillStatusTone, getContractExpiryState, getCurrentBillingPeriod } from '../utils/contractStatus';

export default function Rooms() {
    const { rooms, buildings, contracts, customers, payments, addRoom, deleteRoom, currentUser, pricingTiers } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterBuildingId, setFilterBuildingId] = useState('');
    const [newRoom, setNewRoom] = useState({ id: '', name: '', price: 0, floor: 1, buildingId: '' });

    const handleAdd = (event: React.FormEvent) => {
        event.preventDefault();
        if (!newRoom.id || !newRoom.name || !newRoom.buildingId) {
            if (!newRoom.buildingId) alert('⚠️ Vui lòng chọn tòa nhà cho phòng!');
            return;
        }

        if (currentUser?.role === 'HOST') {
            const plan = pricingTiers.find(item => item.id === currentUser.subscriptionPlanId);
            const myRooms = rooms.filter(room => room.hostId === currentUser.id);
            if (plan && myRooms.length >= plan.maxRooms) {
                alert(`❌ Gói dịch vụ hiện tại của bạn chỉ cho phép quản lý tối đa ${plan.maxRooms} phòng. Vui lòng nâng cấp gói để thêm mới!`);
                return;
            }
        }

        addRoom({
            id: newRoom.id,
            name: newRoom.name,
            price: newRoom.price,
            floor: newRoom.floor,
            buildingId: newRoom.buildingId,
            status: 'Trống',
            position: { x: 5, y: 5 },
        }, (newRoom as any).initialEquipment);
        setIsModalOpen(false);
        setNewRoom({ id: '', name: '', price: 0, floor: 1, buildingId: buildings.length === 1 ? buildings[0].id : '' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đang ở':
                return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-500 dark:border-red-500/50';
            case 'Trống':
                return 'bg-green-50 text-green-600 border-green-200 dark:bg-green-500/20 dark:text-green-500 dark:border-green-500/50';
            default:
                return 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-500 dark:border-yellow-500/50';
        }
    };

    const getBuildingName = (buildingId: string) => {
        const building = buildings.find(item => item.id === buildingId);
        return building ? building.name : 'Chưa gán';
    };

    const filteredRooms = filterBuildingId ? rooms.filter(room => room.buildingId === filterBuildingId) : rooms;
    const currentPeriod = getCurrentBillingPeriod();
    const roomBills = React.useMemo(
        () => buildRoomBills({ payments, contracts, rooms, customers, buildings }),
        [payments, contracts, rooms, customers, buildings],
    );
    const currentBillByRoomId = React.useMemo(
        () => new Map(roomBills.filter(bill => bill.period === currentPeriod).map(bill => [bill.roomId, bill])),
        [roomBills, currentPeriod],
    );

    const openAddModal = () => {
        setNewRoom({ id: '', name: '', price: 0, floor: 1, buildingId: buildings.length === 1 ? buildings[0].id : '' });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý phòng</h2>
                <div className="flex items-center gap-3">
                    {buildings.length > 1 && (
                        <select
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            value={filterBuildingId}
                            onChange={event => setFilterBuildingId(event.target.value)}
                        >
                            <option value="">Tất cả tòa nhà</option>
                            {buildings.map(building => (
                                <option key={building.id} value={building.id}>{building.name}</option>
                            ))}
                        </select>
                    )}
                    <button
                        type="button"
                        onClick={openAddModal}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95 hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" /> Thêm phòng
                    </button>
                </div>
            </div>

            {buildings.length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-white py-12 text-center dark:border-gray-800 dark:bg-gray-900">
                    <Building className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                    <p className="font-medium text-gray-500 dark:text-gray-400">Chưa có tòa nhà nào</p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Vui lòng tạo tòa nhà trước khi thêm phòng.</p>
                    <Link to="/app/buildings" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                        Tạo tòa nhà
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRooms.map(room => {
                    const occupants = getRoomOccupants(room.id, contracts, customers);
                    const occupantNames = occupants.map(item => item.customer.name).join(', ');
                    const currentBill = currentBillByRoomId.get(room.id);

                    return (
                        <div key={room.id} className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
                            <div className="mb-4 flex items-start justify-between">
                                <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                                    <Home className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(room.status)}`}>
                                        {room.status}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-500">Tầng {room.floor}</span>
                                </div>
                            </div>

                            <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">{room.name}</h3>
                            <div className="mb-3 flex items-center gap-1.5">
                                <Building className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">{getBuildingName(room.buildingId)}</span>
                            </div>

                            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 dark:border-gray-800 dark:bg-gray-800/50">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                                    <Users className="h-3.5 w-3.5" />
                                    Cư trú hiện tại
                                </div>
                                <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                    {occupants.length === 0 ? 'Phòng trống' : `${occupants.length} khách đang ở`}
                                </div>
                                <div className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                                    {occupantNames || 'Sẵn sàng cho thuê'}
                                </div>
                                {occupants.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {occupants.slice(0, 2).map(({ contract, customer }) => {
                                            const expiry = getContractExpiryState(contract, 7);
                                            return (
                                                <div key={contract.id} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900/80">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-medium text-gray-900 dark:text-white">{customer.name}</span>
                                                        {expiry && (
                                                            <span className={`rounded-full px-2 py-0.5 font-medium ${expiry.tone === 'error'
                                                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300'
                                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
                                                                }`}>
                                                                {expiry.label}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-1 text-gray-500 dark:text-gray-400">
                                                        Ngày vào trọ: {formatDateLabel(contract.startDate)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {occupants.length > 2 && (
                                            <div className="text-[11px] text-gray-500 dark:text-gray-400">
                                                +{occupants.length - 2} khách khác đang ở trong phòng này
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className={`mt-3 rounded-lg border px-3 py-2 text-xs font-medium ${getBillStatusTone(currentBill?.status || 'missing')}`}>
                                    {currentBill
                                        ? `Bill ${currentPeriod}: ${currentBill.status === 'Đã đóng' ? 'Đã đóng tiền tháng' : currentBill.status === 'Quá hạn' ? 'Đang quá hạn thanh toán' : 'Chưa đóng tiền tháng'}`
                                        : `Bill ${currentPeriod}: Chưa tạo bill tháng`}
                                </div>
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Giá thuê</p>
                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(room.price)}</p>
                                </div>
                                <div className="flex gap-2">
                                    {room.status === 'Trống' && (
                                        <button
                                            type="button"
                                            onClick={event => { event.preventDefault(); deleteRoom(room.id); }}
                                            className="z-10 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                                            title="Xóa phòng"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                    <Link to={`/app/rooms/${room.id}`} className="z-10 flex items-center gap-1 rounded-lg bg-blue-50 p-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-600/10 dark:text-blue-500 dark:hover:bg-blue-600 dark:hover:text-white">
                                        Chi tiết <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Thêm phòng mới</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tòa nhà <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    value={newRoom.buildingId}
                                    onChange={event => setNewRoom({ ...newRoom, buildingId: event.target.value })}
                                >
                                    <option value="">— Chọn tòa nhà —</option>
                                    {buildings.map(building => (
                                        <option key={building.id} value={building.id}>{building.name} ({building.address})</option>
                                    ))}
                                </select>
                                {buildings.length === 0 && (
                                    <p className="mt-1 text-xs text-red-500">Chưa có tòa nhà. Vui lòng tạo tòa nhà trước.</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Mã phòng</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        value={newRoom.id}
                                        onChange={event => setNewRoom({ ...newRoom, id: event.target.value })}
                                        placeholder="VD: P301"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tên phòng</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        value={newRoom.name}
                                        onChange={event => setNewRoom({ ...newRoom, name: event.target.value })}
                                        placeholder="VD: Phòng 301"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tầng</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        value={newRoom.floor}
                                        onChange={event => setNewRoom({ ...newRoom, floor: Number(event.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Giá phòng (VNĐ)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        value={newRoom.price}
                                        onChange={event => setNewRoom({ ...newRoom, price: Number(event.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-2 dark:border-gray-800">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Trang bị sẵn cho phòng</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'ac', name: 'Điều hòa' },
                                        { id: 'bed', name: 'Giường ngủ' },
                                        { id: 'table', name: 'Bàn ghế' },
                                        { id: 'fridge', name: 'Tủ lạnh' },
                                    ].map(item => (
                                        <label key={item.id} className="group flex cursor-pointer items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                                                onChange={event => {
                                                    const equipment: any[] = (newRoom as any).initialEquipment || [];
                                                    if (event.target.checked) {
                                                        equipment.push({ name: item.name, status: 'Tốt' });
                                                    } else {
                                                        const index = equipment.findIndex(entry => entry.name === item.name);
                                                        if (index > -1) equipment.splice(index, 1);
                                                    }
                                                    setNewRoom({ ...newRoom, initialEquipment: equipment } as any);
                                                }}
                                            />
                                            <span className="text-sm text-gray-600 transition-colors group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200">
                                                {item.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={buildings.length === 0}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
