import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, GripHorizontal, Info, Sparkles, User } from 'lucide-react';
import { useApp } from '../AppContext';
import type { Room } from '../types';
import { getRoomOccupants } from '../utils/roomOccupancy';
import { buildRoomCanvasLayout } from '../utils/roomCanvasLayout';

interface RoomMapProps {
    buildingId?: string;
}

type PositionMap = Record<string, { x: number; y: number }>;

type DragSession = {
    roomId: string;
    floor: number;
    offsetX: number;
    offsetY: number;
};

const MOBILE_ROOM_SIZE = { width: 96, height: 64 };
const DESKTOP_ROOM_SIZE = { width: 128, height: 96 };

function hasSavedPosition(room: Room) {
    return typeof room.position?.x === 'number' && typeof room.position?.y === 'number';
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

export default function RoomMap({ buildingId }: RoomMapProps) {
    const { rooms, updateRoomPosition, customers, contracts, theme, buildings } = useApp();
    const navigate = useNavigate();

    const [selectedBuildingId, setSelectedBuildingId] = React.useState<string>(buildingId || buildings[0]?.id || '');
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [draggingRoom, setDraggingRoom] = React.useState<string | null>(null);
    const [localPositions, setLocalPositions] = React.useState<PositionMap>({});

    const containerRefs = React.useRef<Record<number, HTMLDivElement | null>>({});
    const dragSessionRef = React.useRef<DragSession | null>(null);
    const localPositionsRef = React.useRef<PositionMap>({});
    const frameRef = React.useRef<number | null>(null);
    const pendingPointerRef = React.useRef<{ x: number; y: number } | null>(null);

    React.useEffect(() => {
        localPositionsRef.current = localPositions;
    }, [localPositions]);

    React.useEffect(() => {
        if (buildingId) {
            setSelectedBuildingId(buildingId);
            return;
        }
        if (!selectedBuildingId && buildings.length > 0) {
            setSelectedBuildingId(buildings[0].id);
        }
    }, [buildingId, buildings, selectedBuildingId]);

    const filteredRooms = React.useMemo(() => {
        if (selectedBuildingId === 'all') return rooms;
        return rooms.filter(room => room.buildingId === selectedBuildingId);
    }, [rooms, selectedBuildingId]);

    const buildingById = React.useMemo(
        () => new Map(buildings.map(building => [building.id, building])),
        [buildings],
    );

    const autoLayout = React.useMemo(() => buildRoomCanvasLayout(filteredRooms), [filteredRooms]);

    React.useEffect(() => {
        setLocalPositions(previous => {
            const next: PositionMap = {};
            filteredRooms.forEach(room => {
                const fallback = autoLayout.get(room.id) || { x: 4, y: 6 };
                const current = previous[room.id];

                if (draggingRoom === room.id && current) {
                    next[room.id] = current;
                    return;
                }

                next[room.id] = hasSavedPosition(room)
                    ? { x: room.position!.x, y: room.position!.y }
                    : current || fallback;
            });
            return next;
        });
    }, [autoLayout, draggingRoom, filteredRooms]);

    const floors = React.useMemo(
        () => Array.from(new Set<number>(filteredRooms.map(room => room.floor || 1))).sort((left, right) => left - right),
        [filteredRooms],
    );

    const getOccupancySummary = React.useCallback((roomId: string) => {
        const occupants = getRoomOccupants(roomId, contracts, customers);
        if (occupants.length === 0) return null;
        if (occupants.length === 1) return occupants[0].customer.name;
        return `${occupants.length} khách: ${occupants.map(item => item.customer.name).join(', ')}`;
    }, [contracts, customers]);

    const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

    const getRoomSize = React.useCallback(() => {
        return window.innerWidth < 768 ? MOBILE_ROOM_SIZE : DESKTOP_ROOM_SIZE;
    }, []);

    const applyPendingPointer = React.useCallback(() => {
        frameRef.current = null;

        const session = dragSessionRef.current;
        const pointer = pendingPointerRef.current;
        if (!session || !pointer) return;

        const container = containerRefs.current[session.floor];
        if (!container) return;

        const { width: roomWidth, height: roomHeight } = getRoomSize();
        const bounds = container.getBoundingClientRect();
        const rawX = pointer.x - bounds.left - session.offsetX;
        const rawY = pointer.y - bounds.top - session.offsetY;
        const nextX = clamp(rawX, 0, Math.max(0, bounds.width - roomWidth));
        const nextY = clamp(rawY, 0, Math.max(0, bounds.height - roomHeight));
        const percentX = Number(((nextX / Math.max(bounds.width, 1)) * 100).toFixed(2));
        const percentY = Number(((nextY / Math.max(bounds.height, 1)) * 100).toFixed(2));

        setLocalPositions(previous => {
            const current = previous[session.roomId];
            if (current && current.x === percentX && current.y === percentY) return previous;
            return {
                ...previous,
                [session.roomId]: { x: percentX, y: percentY },
            };
        });
    }, [getRoomSize]);

    const queuePointerUpdate = React.useCallback((clientX: number, clientY: number) => {
        pendingPointerRef.current = { x: clientX, y: clientY };
        if (frameRef.current == null) {
            frameRef.current = window.requestAnimationFrame(applyPendingPointer);
        }
    }, [applyPendingPointer]);

    const stopDragging = React.useCallback((persist: boolean) => {
        const session = dragSessionRef.current;
        if (frameRef.current != null) {
            window.cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }
        applyPendingPointer();

        if (persist && session) {
            const finalPosition = localPositionsRef.current[session.roomId];
            if (finalPosition) {
                updateRoomPosition(session.roomId, session.floor, finalPosition.x, finalPosition.y);
            }
        }

        dragSessionRef.current = null;
        pendingPointerRef.current = null;
        setDraggingRoom(null);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerCancel);
    }, [applyPendingPointer, updateRoomPosition]);

    const handlePointerMove = React.useCallback((event: PointerEvent) => {
        if (!dragSessionRef.current) return;
        event.preventDefault();
        queuePointerUpdate(event.clientX, event.clientY);
    }, [queuePointerUpdate]);

    const handlePointerUp = React.useCallback((event: PointerEvent) => {
        if (!dragSessionRef.current) return;
        queuePointerUpdate(event.clientX, event.clientY);
        stopDragging(true);
    }, [queuePointerUpdate, stopDragging]);

    const handlePointerCancel = React.useCallback(() => {
        if (!dragSessionRef.current) return;
        stopDragging(false);
    }, [stopDragging]);

    React.useEffect(() => {
        return () => {
            if (frameRef.current != null) {
                window.cancelAnimationFrame(frameRef.current);
            }
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerCancel);
        };
    }, [handlePointerCancel, handlePointerMove, handlePointerUp]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>, room: Room) => {
        if (!isEditMode) return;
        event.preventDefault();
        event.stopPropagation();

        const container = containerRefs.current[room.floor];
        if (!container) return;

        const rect = event.currentTarget.getBoundingClientRect();
        dragSessionRef.current = {
            roomId: room.id,
            floor: room.floor,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
        };
        setDraggingRoom(room.id);
        event.currentTarget.setPointerCapture?.(event.pointerId);

        window.addEventListener('pointermove', handlePointerMove, { passive: false });
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerCancel);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đang ở':
                return 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/20';
            case 'Trống':
                return 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/50 hover:bg-green-100 dark:hover:bg-green-500/20';
            default:
                return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/50 hover:bg-yellow-100 dark:hover:bg-yellow-500/20';
        }
    };

    return (
        <div className="select-none space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sơ đồ nhà</h2>
                    <p className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">
                        Phòng mới sẽ được rải đều tự động. Khi cần tinh chỉnh, bật chế độ sửa vị trí và kéo thả nhẹ trên canvas.
                    </p>
                </div>

                <div className="flex w-full items-center gap-3 sm:w-auto">
                    {!buildingId && (
                        <div className="relative flex-1 sm:flex-none">
                            <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <select
                                className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:w-52"
                                value={selectedBuildingId}
                                onChange={event => setSelectedBuildingId(event.target.value)}
                            >
                                <option value="all">Tất cả tòa nhà</option>
                                {buildings.map(building => (
                                    <option key={building.id} value={building.id}>{building.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsEditMode(previous => !previous)}
                        className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-all sm:px-4 sm:text-base ${isEditMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                    >
                        <GripHorizontal className="h-4 w-4" />
                        {isEditMode ? 'Đang sửa' : 'Sửa vị trí'}
                    </button>
                </div>
            </div>

            {isEditMode && (
                <div className="flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300">
                    <Sparkles className="h-4 w-4" />
                    Kéo thả giờ chỉ lưu khi bạn thả tay, nên cảm giác di chuyển sẽ nhẹ và mượt hơn.
                </div>
            )}

            <div className="space-y-8 pb-10">
                {floors.map(floor => {
                    const floorRooms = filteredRooms.filter(room => room.floor === floor);
                    const columns = floorRooms.length <= 3 ? floorRooms.length : Math.min(5, Math.max(2, Math.ceil(Math.sqrt(floorRooms.length * 1.35))));
                    const rows = Math.ceil(floorRooms.length / columns) || 1;
                    const baseMinHeight = Math.max(320, rows * 130);
                    const baseMinWidth = Math.max(100, columns * 130); // Prevent overlapping

                    return (
                    <div key={floor} className="space-y-2">
                        <h3 className="border-b border-gray-200 pb-2 font-bold text-gray-500 dark:border-gray-800 dark:text-gray-400">Tầng {floor}</h3>
                        <div className="w-full overflow-x-auto touch-manipulation pb-4">
                            <div
                                ref={element => { containerRefs.current[floor] = element; }}
                                className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white touch-none transition-[height] duration-300 dark:border-gray-700 dark:bg-gray-900/50"
                                style={{
                                    backgroundImage: `radial-gradient(${gridColor} 1px, transparent 1px)`,
                                    backgroundSize: '20px 20px',
                                    minHeight: `${baseMinHeight}px`,
                                    minWidth: `${baseMinWidth}px`,
                                }}
                            >
                            {floorRooms.map(room => {
                                const occupancySummary = getOccupancySummary(room.id);
                                const buildingName = buildingById.get(room.buildingId)?.name;
                                const position = localPositions[room.id] || room.position || autoLayout.get(room.id) || { x: 4, y: 6 };
                                const isDragging = draggingRoom === room.id;

                                return (
                                    <div
                                        key={room.id}
                                        onPointerDown={event => handlePointerDown(event, room)}
                                        onDoubleClick={() => !isEditMode && navigate(`/app/rooms/${room.id}`)}
                                        onClick={() => !isEditMode && navigate(`/app/rooms/${room.id}`)}
                                        className={`
                                            absolute flex h-16 w-24 flex-col justify-between rounded-lg border p-1.5 shadow-sm will-change-transform md:h-24 md:w-32 md:p-2
                                            transition-[left,top,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]
                                            ${getStatusColor(room.status)}
                                            ${isEditMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
                                            ${isDragging ? 'z-[90] scale-[1.03] shadow-2xl ring-2 ring-blue-500' : 'z-10'}
                                        `}
                                        style={{
                                            left: `${position.x}%`,
                                            top: `${position.y}%`,
                                            transitionDuration: isDragging ? '0ms' : '180ms',
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <span className="block truncate text-xs font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-sm">{room.name}</span>
                                                {selectedBuildingId === 'all' && buildingName && (
                                                    <span className="block truncate text-[10px] text-gray-500 dark:text-gray-400 sm:text-xs">{buildingName}</span>
                                                )}
                                            </div>
                                            <div className={`h-1.5 w-1.5 shrink-0 rounded-full sm:h-2 sm:w-2 ${room.status === 'Đang ở' ? 'bg-red-500' : room.status === 'Trống' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                        </div>

                                        {occupancySummary ? (
                                            <div className="flex items-center gap-0.5 text-[10px] text-gray-600 dark:text-gray-400 sm:gap-1 sm:text-xs">
                                                <User className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                <span className="max-w-[85%] truncate">{occupancySummary}</span>
                                            </div>
                                        ) : (
                                            <div className="text-[10px] italic text-gray-400 dark:text-gray-500 sm:text-xs">Trống</div>
                                        )}

                                        <div className="flex h-3 justify-end sm:h-4">
                                            {!isEditMode && <Info className="h-3 w-3 text-gray-400 opacity-50 hover:opacity-100 sm:h-4 sm:w-4" />}
                                        </div>
                                    </div>
                                );
                            })}
                            </div>
                        </div>
                    </div>
                    );
                })}
            </div>

            {floors.length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500">
                    Chưa có phòng nào. Vui lòng thêm phòng và chọn tầng.
                </div>
            )}
        </div>
    );
}
