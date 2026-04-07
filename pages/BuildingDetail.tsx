import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, formatCurrency } from '../AppContext';
import RoomMap from './RoomMap';
import { MapPin, DollarSign, Calendar, AlertTriangle, ArrowLeft, Wrench, Plus, Edit, Trash2 } from 'lucide-react';
import { Equipment } from '../types';
import { formatDateVN } from '../utils/dateFormat';
import SmartDateInput from '../components/SmartDateInput';

export default function BuildingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { buildings, rooms, contracts, payments, serviceRecords, equipment, addEquipment, updateEquipment, deleteEquipment } = useApp();
  const [activeTab, setActiveTab] = useState<'map' | 'details' | 'equipment'>('map');
  const [showEqModal, setShowEqModal] = useState(false);
  const [editingEq, setEditingEq] = useState<Equipment | null>(null);
  const [eqForm, setEqForm] = useState({ name: '', status: 'Tốt' as Equipment['status'], roomId: '', price: 0, purchaseDate: '' });

  const building = buildings.find(b => b.id === id);

  if (!building) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Không tìm thấy tòa nhà</h2>
        <button onClick={() => navigate('/app/buildings')} className="mt-4 text-blue-600 hover:underline">Quay lại danh sách</button>
      </div>
    );
  }

  const buildingRooms = rooms.filter(r => r.buildingId === id);
  const roomIds = buildingRooms.map(r => r.id);
  const activeContracts = contracts.filter(c => c.isActive && roomIds.includes(c.roomId));
  const totalResidents = activeContracts.length;

  const buildingPayments = payments.filter(p => {
    const contract = contracts.find(item => item.id === p.contractId);
    return contract && roomIds.includes(contract.roomId);
  });
  const totalDebt = buildingPayments
    .filter(p => p.status !== 'Đã đóng')
    .reduce((sum, p) => sum + p.amount, 0);

  const buildingServices = serviceRecords.filter(s => roomIds.includes(s.roomId));
  const electricCost = buildingServices.reduce((sum, s) => sum + (s.electricUsage * (contracts.find(c => c.roomId === s.roomId)?.electricPrice || 0)), 0);
  const waterCost = buildingServices.reduce((sum, s) => sum + (s.waterUsage * (contracts.find(c => c.roomId === s.roomId)?.waterPrice || 0)), 0);
  const internetCost = buildingServices.reduce((sum, s) => sum + s.internetCost, 0);
  const otherCost = buildingServices.reduce((sum, s) => sum + s.otherCost, 0);
  const totalServiceCosts = buildingServices.reduce((sum, s) => sum + s.totalCost, 0);
  const rentalCost = building.type === 'Rented' ? (building.rentalCost || 0) : 0;
  const totalExpenses = totalServiceCosts + rentalCost;

  const daysUntilExpiry = building.leaseEndDate ? Math.ceil((new Date(building.leaseEndDate).getTime() - Date.now()) / 86400000) : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= (building.warningDays || 30);

  const buildingEquipment = equipment.filter(e => e.buildingId === id);
  const buildingOnlyEquipment = buildingEquipment.filter(e => !e.roomId);
  const roomEquipmentMap: Record<string, Equipment[]> = {};
  buildingEquipment.filter(e => e.roomId).forEach(e => {
    if (!roomEquipmentMap[e.roomId!]) roomEquipmentMap[e.roomId!] = [];
    roomEquipmentMap[e.roomId!].push(e);
  });

  const handleEqSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingEq) {
      updateEquipment({ ...editingEq, ...eqForm, buildingId: id! });
    } else {
      addEquipment({
        id: `EQ${Date.now()}`,
        name: eqForm.name,
        status: eqForm.status as Equipment['status'],
        buildingId: id!,
        roomId: eqForm.roomId || undefined,
        purchaseDate: eqForm.purchaseDate || new Date().toISOString().split('T')[0],
        price: eqForm.price,
      });
    }
    setShowEqModal(false);
    setEditingEq(null);
    setEqForm({ name: '', status: 'Tốt', roomId: '', price: 0, purchaseDate: '' });
  };

  const openEditEq = (eq: Equipment) => {
    setEditingEq(eq);
    setEqForm({ name: eq.name, status: eq.status, roomId: eq.roomId || '', price: eq.price, purchaseDate: eq.purchaseDate });
    setShowEqModal(true);
  };

  const statusBadge = (status: string) => {
    const classes: Record<string, string> = {
      'Tốt': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Hỏng': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'Đang sửa': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'Thanh lý': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    };
    return classes[status] || '';
  };

  const tabs = [
    { key: 'map', label: 'Sơ đồ nhà' },
    { key: 'details', label: 'Chi tiết & chi phí' },
    { key: 'equipment', label: `Trang thiết bị (${buildingEquipment.length})` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <button onClick={() => navigate('/app/buildings')} className="flex w-fit items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </button>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold">
              {building.name}
              <span className="rounded-full border border-slate-200 px-2 py-1 text-xs font-normal text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                {building.type === 'Owned' ? 'Nhà của mình' : 'Nhà thuê lại'}
              </span>
            </h1>
            <div className="mt-1 flex items-center gap-2 text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>{building.address}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs text-slate-500">Tổng người ở</div>
              <div className="text-lg font-bold">{totalResidents}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs text-slate-500">Công nợ</div>
              <div className="text-lg font-bold text-red-600">{formatCurrency(totalDebt)}</div>
            </div>
          </div>
        </div>

        {building.type === 'Rented' && isExpiringSoon && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <span className="font-bold">Cảnh báo hết hạn!</span>
              <span className="block text-sm">Hết hạn vào {formatDateVN(building.leaseEndDate, building.leaseEndDate)} (còn {daysUntilExpiry} ngày).</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex w-fit gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'map' | 'details' | 'equipment')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'map' && <RoomMap buildingId={id} />}

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold"><DollarSign className="h-5 w-5 text-green-500" /> Chi tiết chi phí</h3>
              <div className="space-y-3">
                {[
                  { label: 'Tiền thuê nhà (phải trả)', val: rentalCost },
                  { label: 'Tiền điện (thu)', val: electricCost },
                  { label: 'Tiền nước (thu)', val: waterCost },
                  { label: 'Internet (thu)', val: internetCost },
                  { label: 'Chi phí khác (thu)', val: otherCost },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    <span className="font-medium">{formatCurrency(item.val)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(totalExpenses)}</span>
                </div>
              </div>
            </div>

            {building.type === 'Rented' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold"><Calendar className="h-5 w-5 text-blue-500" /> HĐ thuê nhà</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500">Bắt đầu:</span> <span className="font-medium">{formatDateVN(building.leaseStartDate, building.leaseStartDate)}</span></div>
                  <div><span className="text-slate-500">Kết thúc:</span> <span className={`font-medium ${isExpiringSoon ? 'text-red-500' : ''}`}>{formatDateVN(building.leaseEndDate, building.leaseEndDate)}</span></div>
                  <div><span className="text-slate-500">Giá thuê:</span> <span className="font-medium">{formatCurrency(building.rentalCost || 0)}</span></div>
                  <div><span className="text-slate-500">Cảnh báo:</span> <span className="font-medium">{building.warningDays || 30} ngày</span></div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold"><AlertTriangle className="h-5 w-5 text-red-500" /> Công nợ</h3>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tổng chưa đóng:</span>
                <span className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Tổng cộng {buildingEquipment.length} thiết bị</p>
              <button
                onClick={() => {
                  setEditingEq(null);
                  setEqForm({ name: '', status: 'Tốt', roomId: '', price: 0, purchaseDate: '' });
                  setShowEqModal(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
              >
                <Plus size={16} /> Thêm thiết bị
              </button>
            </div>

            {buildingOnlyEquipment.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <h3 className="flex items-center gap-2 text-sm font-bold"><Wrench size={16} className="text-purple-500" /> Thiết bị chung tòa nhà</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {buildingOnlyEquipment.map(eq => (
                    <div key={eq.id} className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{eq.name}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(eq.price)} - {eq.purchaseDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${statusBadge(eq.status)}`}>{eq.status}</span>
                        <button onClick={() => openEditEq(eq)} className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20"><Edit size={14} /></button>
                        <button onClick={() => deleteEquipment(eq.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {buildingRooms.map(room => {
              const roomEq = roomEquipmentMap[room.id] || [];
              if (roomEq.length === 0) return null;
              return (
                <div key={room.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                    <h3 className="text-sm font-bold">{room.name} <span className="font-normal text-slate-400">({roomEq.length} thiết bị)</span></h3>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {roomEq.map(eq => (
                      <div key={eq.id} className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{eq.name}</p>
                          <p className="text-xs text-slate-500">{formatCurrency(eq.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${statusBadge(eq.status)}`}>{eq.status}</span>
                          <button onClick={() => openEditEq(eq)} className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20"><Edit size={14} /></button>
                          <button onClick={() => deleteEquipment(eq.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {buildingEquipment.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                Chưa có thiết bị. Nhấn "Thêm thiết bị" để bắt đầu.
              </div>
            )}
          </div>
        )}
      </div>

      {showEqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-6 dark:border-slate-800">
              <h3 className="text-lg font-bold">{editingEq ? 'Sửa thiết bị' : 'Thêm thiết bị mới'}</h3>
            </div>
            <form onSubmit={handleEqSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium">Tên thiết bị</label>
                <input required className="w-full rounded-xl border border-slate-300 bg-white p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800" value={eqForm.name} onChange={event => setEqForm({ ...eqForm, name: event.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Trạng thái</label>
                  <select className="w-full rounded-xl border border-slate-300 bg-white p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800" value={eqForm.status} onChange={event => setEqForm({ ...eqForm, status: event.target.value as Equipment['status'] })}>
                    <option value="Tốt">Tốt</option>
                    <option value="Hỏng">Hỏng</option>
                    <option value="Đang sửa">Đang sửa</option>
                    <option value="Thanh lý">Thanh lý</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Phòng (tùy chọn)</label>
                  <select className="w-full rounded-xl border border-slate-300 bg-white p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800" value={eqForm.roomId} onChange={event => setEqForm({ ...eqForm, roomId: event.target.value })}>
                    <option value="">- Chung tòa nhà -</option>
                    {buildingRooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Giá trị (VNĐ)</label>
                  <input type="number" min={0} className="w-full rounded-xl border border-slate-300 bg-white p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800" value={eqForm.price} onChange={event => setEqForm({ ...eqForm, price: +event.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Ngày mua</label>
                  <SmartDateInput className="w-full rounded-xl border border-slate-300 bg-white p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800" value={eqForm.purchaseDate} onChange={value => setEqForm({ ...eqForm, purchaseDate: value })} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEqModal(false)} className="flex-1 rounded-xl bg-slate-100 py-2.5 font-medium transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">Hủy</button>
                <button type="submit" className="flex-1 rounded-xl bg-blue-600 py-2.5 font-medium text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
                  {editingEq ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
