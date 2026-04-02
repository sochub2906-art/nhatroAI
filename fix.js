const fs = require('fs');
let code = fs.readFileSync('e:/rental/AppContext.tsx', 'utf8');
const search = "const updateRoomPosition = (id: string, _floor: number, x: number, y: number) => {";
const replace = 
    const updateRoom = (updatedRoom: Room) => {
        if (!canEdit()) { alert('B?n không có quy?n s?a!'); return; }
        setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
        pushToSheet('rooms', updatedRoom);
        if (currentUser) upsertCacheItem(currentUser.id, 'rooms', updatedRoom);
    };
    const updateRoomPosition = (id: string, _floor: number, x: number, y: number) => {;
code = code.replace(search, replace.trimStart());
fs.writeFileSync('e:/rental/AppContext.tsx', code);
