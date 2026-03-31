import React, { useEffect, useState } from 'react';
import type { WizardMode } from '../components/QuickContractWizardEnhanced';
import { Link, useParams } from 'react-router-dom';
import { Archive, ArrowLeft, CheckCircle, FileText, Mail, Phone, Plus, User, UserRoundX, Users, Wrench, XCircle, Zap } from 'lucide-react';
import { formatCurrency, useApp } from '../AppContext';
import QuickContractWizard from '../components/QuickContractWizardEnhanced';
import TerminateContractModal from '../components/TerminateContractModal';
import { Contract, Customer, EquipmentStatus, ServiceRecord } from '../types';
import { buildRoomBills } from '../utils/paymentBills';
import { formatDateLabel, getBillStatusTone, getContractExpiryState, getCurrentBillingPeriod } from '../utils/contractStatus';
import { downloadResidenceDeclarationFile } from '../utils/residenceDeclaration';
import { getActiveContractsForRoom, getRoomOccupants } from '../utils/roomOccupancy';

export default function RoomDetail() {
    const { id: roomId = '' } = useParams();
    const { rooms, contracts, customers, payments, serviceRecords, addServiceRecord, equipment, buildings, currentUser, updateEquipment, terminateContract, updateCustomer } = useApp();
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isQuickContractOpen, setIsQuickContractOpen] = useState(false);
    const [wizardMode, setWizardMode] = useState<WizardMode>('new');
    const [residentToTerminate, setResidentToTerminate] = useState<{ contract: Contract; customer: Customer } | null>(null);

    const room = rooms.find(item => item.id === roomId);
    const activeContracts = getActiveContractsForRoom(roomId, contracts);
    const roomResidents = getRoomOccupants(roomId, contracts, customers);
    const referenceContract = activeContracts[0] || null;
    const roomServices = serviceRecords
        .filter(record => record.roomId === roomId)
        .sort((left, right) => right.id.localeCompare(left.id));
    const roomEquipment = equipment.filter(item => item.roomId === roomId);
    const activeBuilding = room ? buildings.find(building => building.id === room.buildingId) || null : null;
    const currentPeriod = getCurrentBillingPeriod();
    const roomBills = React.useMemo(
        () => buildRoomBills({ payments, contracts, rooms, customers, buildings }),
        [payments, contracts, rooms, customers, buildings],
    );
    const currentRoomBill = roomBills.find(bill => bill.roomId === roomId && bill.period === currentPeriod) || null;

    const electricPrice = referenceContract ? referenceContract.electricPrice : 3500;
    const waterPrice = referenceContract ? referenceContract.waterPrice : 15000;
    const internetPrice = referenceContract ? referenceContract.internetPrice : 100000;

    const [newService, setNewService] = useState({
        month: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
        electricUsage: 0,
        waterUsage: 0,
        internetCost: internetPrice,
        otherCost: 50000,
    });

    useEffect(() => {
        setNewService(prev => ({ ...prev, internetCost: internetPrice }));
    }, [internetPrice]);

    const handleTerminateResident = (equipmentUpdates: Array<{ id: string; status: EquipmentStatus }>) => {
        equipmentUpdates.forEach(update => {
            const item = roomEquipment.find(entry => entry.id === update.id);
            if (!item || item.status === update.status) return;
            updateEquipment({ ...item, status: update.status });
        });

        if (residentToTerminate) {
            terminateContract(residentToTerminate.contract.id);
            setResidentToTerminate(null);
        }
    };

    const handleExportDeclaration = (customer: Customer, contract: Contract) => {
        downloadResidenceDeclarationFile({ customer, contract, room, building: activeBuilding, host: currentUser });
        updateCustomer({
            ...customer,
            residenceAddress: customer.residenceAddress || customer.currentAddress || customer.permanentAddress || '',
            declarationCreated: true,
            declarationCreatedAt: new Date().toISOString(),
            declarationStatus: 'created',
        });
    };

    if (!room) return <div className="p-6">Không tìm thấy phòng!</div>;

    const handleAddService = (event: React.FormEvent) => {
        event.preventDefault();
        const total = (newService.electricUsage * electricPrice) + (newService.waterUsage * waterPrice) + newService.internetCost + newService.otherCost;

        const record: ServiceRecord = {
            id: `SV${Date.now()}`,
            roomId: room.id,
            month: newService.month,
            electricUsage: newService.electricUsage,
            waterUsage: newService.waterUsage,
            internetCost: newService.internetCost,
            otherCost: newService.otherCost,
            totalCost: total,
        };

        addServiceRecord(record);
        setIsServiceModalOpen(false);
        setNewService(prev => ({ ...prev, electricUsage: 0, waterUsage: 0, internetCost: internetPrice }));
    };

    const getStatusColor = (status: EquipmentStatus) => {
        switch (status) {
            case 'Tốt':
                return 'text-green-500';
            case 'Hỏng':
                return 'text-red-500';
            case 'Đang sửa':
                return 'text-yellow-500';
            case 'Thanh lý':
                return 'text-gray-500';
            default:
                return 'text-gray-500';
        }
    };

    const getStatusIcon = (status: EquipmentStatus) => {
        switch (status) {
            case 'Tốt':
                return <CheckCircle className="w-4 h-4" />;
            case 'Hỏng':
                return <XCircle className="w-4 h-4" />;
            case 'Đang sửa':
                return <Wrench className="w-4 h-4" />;
            case 'Thanh lý':
                return <Archive className="w-4 h-4" />;
            default:
                return <Archive className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <Link to="/app/rooms" className="inline-flex items-center gap-2 text-gray-400 transition hover:text-gray-900 dark:hover:text-white">
                <ArrowLeft className="w-4 h-4" /> Quay lại danh sách phòng
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{room.name}</h1>
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${room.status === 'Đang ở' ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-500/50 dark:bg-red-500/20 dark:text-red-500' :
                                room.status === 'Trống' ? 'border-green-200 bg-green-50 text-green-600 dark:border-green-500/50 dark:bg-green-500/20 dark:text-green-500' :
                                    'border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-500/50 dark:bg-yellow-500/20 dark:text-yellow-500'
                                }`}>
                                {room.status}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Mã: {room.id}</span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                                <Users className="h-3.5 w-3.5" />
                                {roomResidents.length} khách đang ở
                            </span>
                        </div>

                        <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                {referenceContract ? 'Giá thuê tham chiếu (theo hợp đồng gần nhất)' : 'Giá thuê niêm yết'}
                            </p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {referenceContract ? formatCurrency(referenceContract.price) : formatCurrency(room.price)}
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-500">/tháng</span>
                            </p>
                        </div>

                        <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${getBillStatusTone(currentRoomBill?.status || 'missing')}`}>
                            {currentRoomBill
                                ? `Bill ${currentPeriod}: ${currentRoomBill.status === 'Đã đóng' ? 'Đã đóng tiền tháng' : currentRoomBill.status === 'Quá hạn' ? 'Đang quá hạn thanh toán' : 'Chưa đóng tiền tháng'}`
                                : `Bill ${currentPeriod}: Chưa tạo phiếu thu cho phòng này`}
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => { setWizardMode('new'); setIsQuickContractOpen(true); }}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                            >
                                <Plus className="h-4 w-4" />
                                {roomResidents.length > 0 ? 'Thêm người mới vào phòng' : 'Tạo khách & hợp đồng cho phòng'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setWizardMode('existing'); setIsQuickContractOpen(true); }}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                            >
                                <Users className="h-4 w-4" />
                                Chọn khách từ danh sách
                            </button>
                        </div>
                    </div>

                    {roomResidents.length > 0 ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    Khách thuê hiện tại
                                </h3>
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    {roomResidents.length} người
                                </span>
                            </div>

                            <div className="space-y-4">
                                {roomResidents.map(({ contract, customer }) => (
                                    <div key={contract.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                                        {(() => {
                                            const expiry = getContractExpiryState(contract, 7);

                                            return (
                                                <>
                                                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <Link
                                                                to={`/app/customers/${customer.id}`}
                                                                className="text-base font-semibold text-gray-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                                                            >
                                                                {customer.name}
                                                            </Link>
                                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                                <span>Hợp đồng {contract.id}</span>
                                                                {expiry && (
                                                                    <span className={`rounded-full px-2 py-0.5 font-medium ${expiry.tone === 'error'
                                                                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300'
                                                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
                                                                        }`}>
                                                                        {expiry.label}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleExportDeclaration(customer, contract)}
                                                                className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300"
                                                            >
                                                                <FileText className="h-4 w-4" />
                                                                Xuất CT01 PDF
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setResidentToTerminate({ contract, customer })}
                                                                className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300"
                                                            >
                                                                <UserRoundX className="h-4 w-4" />
                                                                Hủy hợp đồng nhanh
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-4 w-4 text-blue-500" />
                                                            <span>{customer.phone || 'Chưa cập nhật SĐT'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4 text-blue-500" />
                                                            <span className="truncate">{customer.email || 'Chưa cập nhật email'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                                                            <span>Ngày vào trọ: {formatDateLabel(contract.startDate)}</span>
                                                            <span>Hết hạn: {formatDateLabel(contract.endDate)}</span>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 py-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <User className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-700" />
                            <p className="mb-4 text-gray-500 dark:text-gray-500">Phòng hiện đang trống</p>
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setWizardMode('new'); setIsQuickContractOpen(true); }}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                                >
                                    Tạo khách & hợp đồng
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setWizardMode('existing'); setIsQuickContractOpen(true); }}
                                    className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                                >
                                    Chọn khách từ danh sách
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                                <Wrench className="w-5 h-5 text-orange-500" />
                                Trang thiết bị
                            </h3>
                            <Link to="/app/equipment" className="text-xs text-blue-600 hover:underline dark:text-blue-400">Quản lý</Link>
                        </div>

                        {roomEquipment.length > 0 ? (
                            <div className="space-y-3">
                                {roomEquipment.map(item => (
                                    <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-800/50">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.id}</div>
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                                            {getStatusIcon(item.status)}
                                            {item.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 text-center text-sm italic text-gray-500 dark:text-gray-400">
                                Chưa có thiết bị nào được gán.
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6 lg:col-span-2">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                Dịch vụ & Điện nước
                            </h3>
                            {activeContracts.length > 1 && (
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Đơn giá tham chiếu đang lấy theo hợp đồng bắt đầu gần nhất của phòng này.
                                </p>
                            )}
                        </div>
                        {roomResidents.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setIsServiceModalOpen(true)}
                                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                            >
                                <Plus className="w-4 h-4" /> Ghi chỉ số
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                            <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                {activeContracts.length > 1 ? 'Đơn giá Điện (HĐ gần nhất)' : 'Đơn giá Điện'}
                            </div>
                            <div className="font-bold text-yellow-600 dark:text-yellow-500">{formatCurrency(electricPrice)} /kWh</div>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                            <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                {activeContracts.length > 1 ? 'Đơn giá Nước (HĐ gần nhất)' : 'Đơn giá Nước'}
                            </div>
                            <div className="font-bold text-blue-600 dark:text-blue-500">{formatCurrency(waterPrice)} /khối</div>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                            <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                {activeContracts.length > 1 ? 'Internet (HĐ gần nhất)' : 'Internet'}
                            </div>
                            <div className="font-bold text-purple-600 dark:text-purple-500">{formatCurrency(internetPrice)} /phòng</div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                    <tr>
                                        <th className="p-4">Tháng</th>
                                        <th className="p-4 text-center">Điện (kWh)</th>
                                        <th className="p-4 text-center">Nước (Khối)</th>
                                        <th className="p-4 text-right">Tiền Internet</th>
                                        <th className="p-4 text-right">Khác</th>
                                        <th className="p-4 text-right">Tổng cộng</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {roomServices.map(service => (
                                        <tr key={service.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="p-4 font-medium text-gray-900 dark:text-white">{service.month}</td>
                                            <td className="p-4 text-center">
                                                <div className="text-sm text-gray-900 dark:text-white">{service.electricUsage}</div>
                                                <div className="text-xs text-gray-500">{formatCurrency(service.electricUsage * electricPrice)}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="text-sm text-gray-900 dark:text-white">{service.waterUsage}</div>
                                                <div className="text-xs text-gray-500">{formatCurrency(service.waterUsage * waterPrice)}</div>
                                            </td>
                                            <td className="p-4 text-right text-gray-600 dark:text-gray-400">{formatCurrency(service.internetCost)}</td>
                                            <td className="p-4 text-right text-gray-600 dark:text-gray-400">{formatCurrency(service.otherCost)}</td>
                                            <td className="p-4 text-right font-bold text-green-600 dark:text-green-400">{formatCurrency(service.totalCost)}</td>
                                        </tr>
                                    ))}
                                    {roomServices.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                                Chưa có dữ liệu dịch vụ
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isServiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Ghi chỉ số dịch vụ</h3>
                        <form onSubmit={handleAddService} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tháng ghi</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    value={newService.month}
                                    onChange={event => setNewService({ ...newService, month: event.target.value })}
                                    placeholder="MM/YYYY"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Số điện tiêu thụ (kWh)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        value={newService.electricUsage}
                                        onChange={event => setNewService({ ...newService, electricUsage: Number(event.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Số nước tiêu thụ (m³)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        value={newService.waterUsage}
                                        onChange={event => setNewService({ ...newService, waterUsage: Number(event.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Internet (cố định)</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        value={newService.internetCost}
                                        onChange={event => setNewService({ ...newService, internetCost: Number(event.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Phí khác (rác...)</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        value={newService.otherCost}
                                        onChange={event => setNewService({ ...newService, otherCost: Number(event.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Tổng tiền dịch vụ dự tính:</span>
                                    <span className="font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(
                                            (newService.electricUsage * electricPrice) +
                                            (newService.waterUsage * waterPrice) +
                                            newService.internetCost +
                                            newService.otherCost,
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsServiceModalOpen(false)}
                                    className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Hủy
                                </button>
                                <button type="submit" className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                                    Lưu chỉ số
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {residentToTerminate && (
                <TerminateContractModal
                    contract={residentToTerminate.contract}
                    customer={residentToTerminate.customer}
                    room={room}
                    roomEquipment={roomEquipment}
                    outstandingPayments={payments.filter(payment => payment.contractId === residentToTerminate.contract.id && payment.status !== 'Đã đóng')}
                    remainingOccupantCount={Math.max(0, roomResidents.length - 1)}
                    onClose={() => setResidentToTerminate(null)}
                    onConfirm={handleTerminateResident}
                />
            )}

            {isQuickContractOpen && <QuickContractWizard initialRoomId={room.id} initialMode={wizardMode} onClose={() => setIsQuickContractOpen(false)} />}
        </div>
    );
}
