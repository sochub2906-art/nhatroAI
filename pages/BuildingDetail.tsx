import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, formatCurrency } from '../AppContext';
import RoomMap from './RoomMap';
import { MapPin, Users, DollarSign, Calendar, AlertTriangle, ArrowLeft, Wrench, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Equipment } from '../types';
import { formatDateVN } from '../utils/dateFormat';

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
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Không tìm thấy tòa nhà</h2>
        <button onClick={() => navigate('/app/buildings')} className="mt-4 text-blue-600 hover:underline">Quay lại danh sách</button>
      </div>
    );
  }

  const buildingRooms = rooms.filter(r => r.buildingId === id);
  const roomIds = buildingRooms.map(r => r.id);
  const activeContracts = contracts.filter(c => c.isActive && roomIds.includes(c.roomId));
  const totalResidents = activeContracts.length;

  const buildingPayments = payments.filter(p => { const c = contracts.find(c => c.id === p.contractId); return c && roomIds.includes(c.roomId); });
  const totalDebt = buildingPayments.filter(p => p.status !== 'Đã �óng').reduce((sum, p) => sum + p.amount, 0);

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

  // Equipment for this building
  const buildingEquipment = equipment.filter(e => e.buildingId === id);
  const buildingOnlyEquipment = buildingEquipment.filter(e => !e.roomId);
  const roomEquipmentMap: Record<string, Equipment[]> = {};
  buildingEquipment.filter(e => e.roomId).forEach(e => {
    if (!roomEquipmentMap[e.roomId!]) roomEquipmentMap[e.roomId!] = [];
    roomEquipmentMap[e.roomId!].push(e);
  });

  const handleEqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEq) {
      updateEquipment({ ...editingEq, ...eqForm, buildingId: id! });
    } else {
      addEquipment({
        id: `EQ${Date.now()}`, name: eqForm.name, status: eqForm.status as any,
        buildingId: id!, roomId: eqForm.roomId || undefined,
        purchaseDate: eqForm.purchaseDate || new Date().toISOString().split('T')[0],
        price: eqForm.price
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

  const statusBadge = (s: string) => {
    const m: Record<string, string> = {
      'Tốt': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Hỏng': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'Đang sửa': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'Thanh lý': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    };
    return m[s] || '';
  };

  const tabs = [
    { key: 'map', label: 'Sơ �� nhà' },
    { key: 'details', label: 'Chi tiết & Chi phí' },
    { key: 'equipment', label: `Trang thiết bị (${buildingEquipment.length})` }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button onClick={() => navigate('/app/buildings')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white w-fit">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {building.name}
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-normal">
                {building.type === 'Owned' ? 'Nhà của mình' : 'Nhà thuê lại'}
              </span>
            </h1>
            <div className="flex items-center gap-2 text-slate-500 mt-1"><MapPin className="w-4 h-4" /><span>{building.address}</span></div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500">Tổng người ở</div>
              <div className="font-bold text-lg">{totalResidents}</div>
            </div>
            <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500">Công nợ</div>
              <div className="font-bold text-lg text-red-600">{formatCurrency(totalDebt)}</div>
            </div>
          </div>
        </div>

        {building.type === 'Rented' && isExpiringSoon && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <span className="font-bold">Cảnh báo hết hạn!</span>
                  <span className="block text-sm">Hết hạn vào {formatDateVN(building.leaseEndDate, building.leaseEndDate)} (còn {daysUntilExpiry} ngày).</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.key ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'map' && <RoomMap buildingId={id} />}

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-500" /> Chi tiết Chi phí</h3>
              <div className="space-y-3">
                {[
                  { label: 'Tiền thuê nhà (Phải trả)', val: rentalCost },
                  { label: 'Tiền điện (Thu)', val: electricCost },
                  { label: 'Tiền nư�:c (Thu)', val: waterCost },
                  { label: 'Internet (Thu)', val: internetCost },
                  { label: 'Chi phí khác (Thu)', val: otherCost }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    <span className="font-medium">{formatCurrency(item.val)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(totalExpenses)}</span>
                </div>
              </div>
            </div>

            {/* Lease Info */}
            {building.type === 'Rented' && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500" /> HĐ Thuê nhà</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Bắt �ầu:</span> <span className="font-medium">{formatDateVN(building.leaseStartDate, building.leaseStartDate)}</span></div>
                <div><span className="text-slate-500">Kết thúc:</span> <span className={`font-medium ${isExpiringSoon ? 'text-red-500' : ''}`}>{formatDateVN(building.leaseEndDate, building.leaseEndDate)}</span></div>
                  <div><span className="text-slate-500">Giá thuê:</span> <span className="font-medium">{formatCurrency(building.rentalCost || 0)}</span></div>
                  <div><span className="text-slate-500">Cảnh báo:</span> <span className="font-medium">{building.warningDays || 30} ngày</span></div>
                </div>
              </div>
            )}

            {/* Debt */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" /> Công nợ</h3>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tá»•ng chưa �óng:</span>
                <span className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-slate-500 text-sm">Tổng cộng {buildingEquipment.length} thiết bị</p>
              <button onClick={() => { setEditingEq(null); setEqForm({ name: '', status: 'Tốt', roomId: '', price: 0, purchaseDate: '' }); setShowEqModal(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium shadow-lg shadow-blue-600/20">
                <Plus size={16} /> Thêm thiết bị
              </button>
            </div>

            {/* Building-level equipment */}
            {buildingOnlyEquipment.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="font-bold text-sm flex items-center gap-2"><Wrench size={16} className="text-purple-500" /> Thiết bị chung tòa nhà</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {buildingOnlyEquipment.map(eq => (
                    <div key={eq.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{eq.name}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(eq.price)} — {eq.purchaseDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusBadge(eq.status)}`}>{eq.status}</span>
                        <button onClick={() => openEditEq(eq)} className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"><Edit size={14} /></button>
                        <button onClick={() => deleteEquipment(eq.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Per-room equipment */}
            {buildingRooms.map(room => {
              const roomEq = roomEquipmentMap[room.id] || [];
              if (roomEq.length === 0) return null;
              return (
                <div key={room.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-sm">{room.name} <span className="text-slate-400 font-normal">({roomEq.length} thiết bị)</span></h3>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {roomEq.map(eq => (
                      <div key={eq.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{eq.name}</p>
                          <p className="text-xs text-slate-500">{formatCurrency(eq.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusBadge(eq.status)}`}>{eq.status}</span>
                          <button onClick={() => openEditEq(eq)} className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"><Edit size={14} /></button>
                          <button onClick={() => deleteEquipment(eq.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {buildingEquipment.length === 0 && (
              <div className="text-center py-12 text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                Chưa có thiết bị. Nhấn "Thêm thiết bị" �Ồ bắt �ầu.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Equipment Modal */}
      {showEqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold">{editingEq ? 'Sửa thiết bị' : 'Thêm thiết bị má»›i'}</h3>
            </div>
            <form onSubmit={handleEqSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên thiết bị</label>
                <input required className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={eqForm.name} onChange={e => setEqForm({ ...eqForm, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Trạng thái</label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" value={eqForm.status} onChange={e => setEqForm({ ...eqForm, status: e.target.value as any })}>
                    <option value="Tốt">Tốt</option>
                    <option value="Hỏng">Hỏng</option>
                    <option value="Đang sửa">Đang sửa</option>
                    <option value="Thanh lý">Thanh lý</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phòng (tùy chọn)</label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" value={eqForm.roomId} onChange={e => setEqForm({ ...eqForm, roomId: e.target.value })}>
                    <option value="">— Chung tòa nhà �—</option>
                    {buildingRooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Giá trị (VNĐ)</label>
                  <input type="number" min={0} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={eqForm.price} onChange={e => setEqForm({ ...eqForm, price: +e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày mua</label>
                  <input type="date" lang="vi-VN" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={eqForm.purchaseDate} onChange={e => setEqForm({ ...eqForm, purchaseDate: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEqModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Hủy</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                  {editingEq ? 'Cập nhật' : 'Thêm má»›i'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
