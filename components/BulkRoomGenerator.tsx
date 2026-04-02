import React from 'react';
import { useApp } from '../AppContext';
import type { Equipment, Room } from '../types';
import { Building as BuildingIcon, CheckSquare, Copy, Save, Settings, Square, X } from 'lucide-react';
import { buildRoomCanvasLayout } from '../utils/roomCanvasLayout';

interface Props {
  buildingId: string;
  onClose: () => void;
}

interface DraftRoom {
  floor: number;
  name: string;
  price: number;
}

export default function BulkRoomGenerator({ buildingId, onClose }: Props) {
  const { buildings, addRoomsBulk, currentUser } = useApp();
  const building = buildings.find(item => item.id === buildingId);

  const [totalRooms, setTotalRooms] = React.useState<number>(10);
  const [prefix, setPrefix] = React.useState<string>('Phòng ');
  const [basePrice, setBasePrice] = React.useState<number>(3000000);
  const [floors, setFloors] = React.useState<number>(building?.totalFloors || 1);
  const [drafts, setDrafts] = React.useState<DraftRoom[]>([]);
  const [selectedEqs, setSelectedEqs] = React.useState<{ name: string; checked: boolean }[]>([
    { name: 'Điều hòa', checked: false },
    { name: 'Bóng đèn', checked: true },
    { name: 'Giường', checked: false },
    { name: 'Tủ quần áo', checked: false },
    { name: 'Nóng lạnh', checked: false },
  ]);

  React.useEffect(() => {
    if (totalRooms <= 0 || totalRooms > 200) return;

    const nextDrafts: DraftRoom[] = [];
    const totalFloors = Math.max(1, floors);
    const roomsPerFloor = Math.ceil(totalRooms / totalFloors);

    let currentFloor = 1;
    let roomInFloor = 1;

    for (let index = 1; index <= totalRooms; index += 1) {
      let name = `${prefix}${index}`;
      if (prefix.trim() === '') {
        name = `${currentFloor}${roomInFloor < 10 ? '0' : ''}${roomInFloor}`;
      }

      nextDrafts.push({
        floor: currentFloor,
        name,
        price: basePrice,
      });

      roomInFloor += 1;
      if (roomInFloor > roomsPerFloor) {
        currentFloor += 1;
        roomInFloor = 1;
      }
    }

    setDrafts(nextDrafts);
  }, [basePrice, floors, prefix, totalRooms]);

  const toggleEq = (index: number) => {
    setSelectedEqs(prev => prev.map((item, itemIndex) => itemIndex === index ? { ...item, checked: !item.checked } : item));
  };

  const updateDraft = (index: number, field: keyof DraftRoom, value: string | number) => {
    setDrafts(prev => prev.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  };

  const handleCreate = () => {
    if (!building) return;

    const seed = Date.now();
    const newRooms: Room[] = drafts.map((draft, index) => ({
      id: `R${seed}_${index}_${Math.random().toString(36).slice(2, 7)}`,
      name: draft.name,
      price: draft.price,
      floor: draft.floor,
      status: 'Trống',
      buildingId: building.id,
      hostId: currentUser?.id,
      createdAt: new Date().toISOString(),
    }));

    const layout = buildRoomCanvasLayout(newRooms);
    const positionedRooms = newRooms.map(room => ({
      ...room,
      position: layout.get(room.id) || { x: 4, y: 6 },
    }));

    const newEquipments: Equipment[] = [];
    positionedRooms.forEach((room, roomIndex) => {
      selectedEqs.filter(item => item.checked).forEach((eq, eqIndex) => {
        newEquipments.push({
          id: `EQ${seed}_${roomIndex}_${eqIndex}_${Math.random().toString(36).slice(2, 7)}`,
          name: eq.name,
          status: 'Tốt',
          buildingId: building.id,
          roomId: room.id,
          purchaseDate: new Date().toISOString().split('T')[0],
          price: 0,
          hostId: currentUser?.id,
          createdAt: new Date().toISOString(),
        });
      });
    });

    if (!addRoomsBulk) {
      alert('Lỗi: hàm addRoomsBulk chưa được hỗ trợ trong phiên bản này.');
      return;
    }

    addRoomsBulk(positionedRooms, newEquipments);
    onClose();
  };

  if (!building) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="mx-auto my-4 flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl md:max-h-[90vh] dark:border-slate-800 dark:bg-slate-900">
        <div className="flex shrink-0 items-center justify-between bg-blue-600 p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500 p-2">
              <Copy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Trình tạo phòng hàng loạt</h3>
              <p className="flex items-center gap-1 text-sm text-blue-100">
                <BuildingIcon className="h-3.5 w-3.5" />
                Tòa nhà: {building.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg bg-blue-500 p-2 transition-colors hover:bg-blue-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          <div className="w-full shrink-0 overflow-y-auto border-b border-slate-200 bg-slate-50 p-5 md:max-h-none md:w-80 md:border-b-0 md:border-r md:p-6 dark:border-slate-800 dark:bg-slate-800/50">
            <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
              <Settings className="h-4 w-4 text-blue-500" />
              Cấu hình sinh bản nháp
            </h4>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Số phòng cần tạo</label>
                <input type="number" min="1" max="200" className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" value={totalRooms} onChange={event => setTotalRooms(parseInt(event.target.value, 10) || 0)} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Số tầng</label>
                <input type="number" min="1" max="50" className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" value={floors} onChange={event => setFloors(parseInt(event.target.value, 10) || 1)} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Tiền tố tên phòng</label>
                <input type="text" className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" value={prefix} onChange={event => setPrefix(event.target.value)} placeholder="Để trống sẽ đánh số 101, 102..." />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Giá thuê mặc định</label>
                <input type="number" step="100000" className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" value={basePrice} onChange={event => setBasePrice(parseFloat(event.target.value) || 0)} />
              </div>

              <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">Trang bị sẵn cho mỗi phòng</label>
                <div className="space-y-2">
                  {selectedEqs.map((eq, index) => (
                    <button key={eq.name} type="button" onClick={() => toggleEq(index)} className={`flex w-full items-center justify-between rounded-lg border p-2 text-sm transition-all ${eq.checked ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                      <span>{eq.name}</span>
                      {eq.checked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4 opacity-50" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900">
            <div className="z-10 flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Xem trước & sửa thủ công</h4>
                <p className="text-xs text-slate-500">Phòng sẽ được rải đều lên sơ đồ tầng ngay sau khi tạo.</p>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                Sẽ tạo: {drafts.length} phòng
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                {drafts.map((draft, index) => (
                  <div key={`${draft.floor}-${index}`} className="group rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-2 flex justify-between">
                      <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-400 dark:border-slate-700 dark:bg-slate-900">Tầng {draft.floor}</span>
                    </div>
                    <input type="text" className="mb-1 w-full border-b border-transparent bg-transparent text-lg font-bold text-slate-900 outline-none transition-colors hover:border-slate-300 focus:border-blue-500 dark:text-white dark:hover:border-slate-600" value={draft.name} onChange={event => updateDraft(index, 'name', event.target.value)} />
                    <input type="number" className="w-full border-b border-transparent bg-transparent text-sm font-medium text-green-600 outline-none transition-colors hover:border-slate-300 focus:border-green-500 dark:text-green-400 dark:hover:border-slate-600" value={draft.price} onChange={event => updateDraft(index, 'price', parseInt(event.target.value, 10) || 0)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <button onClick={onClose} className="rounded-xl border border-slate-300 px-6 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
                Hủy bỏ
              </button>
              <button onClick={handleCreate} className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-2.5 font-bold text-white shadow-lg shadow-blue-500/30 transition-transform active:scale-95 hover:bg-blue-700">
                <Save className="h-4 w-4" />
                Lưu & tạo {drafts.length} phòng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
