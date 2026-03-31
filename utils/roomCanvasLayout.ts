import type { Room } from '../types';

export interface RoomCanvasPosition {
    x: number;
    y: number;
}

function clampPercent(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function sortRoomsForLayout(left: Room, right: Room) {
    return (
        left.floor - right.floor ||
        left.name.localeCompare(right.name, 'vi', { numeric: true, sensitivity: 'base' })
    );
}

export function buildRoomCanvasLayout(rooms: Room[]): Map<string, RoomCanvasPosition> {
    const layout = new Map<string, RoomCanvasPosition>();
    const floors = Array.from(new Set(rooms.map(room => room.floor || 1))).sort((left, right) => left - right);

    floors.forEach(floor => {
        const floorRooms = rooms
            .filter(room => (room.floor || 1) === floor)
            .sort(sortRoomsForLayout);

        if (floorRooms.length === 0) return;

        const columns = floorRooms.length <= 3
            ? floorRooms.length
            : Math.min(5, Math.max(2, Math.ceil(Math.sqrt(floorRooms.length * 1.35))));
        const rows = Math.ceil(floorRooms.length / columns);

        const minX = 4;
        const maxX = 76;
        const minY = 6;
        const maxY = 70;
        const xStep = columns === 1 ? 0 : (maxX - minX) / (columns - 1);
        const yStep = rows === 1 ? 0 : (maxY - minY) / (rows - 1);

        floorRooms.forEach((room, index) => {
            const rowIndex = Math.floor(index / columns);
            const columnIndex = index % columns;
            const staggerOffset = rowIndex % 2 === 1 && columns > 2 ? Math.min(6, xStep * 0.18) : 0;

            layout.set(room.id, {
                x: clampPercent(minX + columnIndex * xStep + staggerOffset, minX, maxX),
                y: clampPercent(minY + rowIndex * yStep, minY, maxY),
            });
        });
    });

    return layout;
}
