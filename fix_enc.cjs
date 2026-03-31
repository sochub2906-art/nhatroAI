const fs = require('fs');

function fixMojibake(filePath, times = 1) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        for (let i = 0; i < times; i++) {
            content = Buffer.from(content, 'latin1').toString('utf8');
        }
        
        // Safety check: only save if it results in valid recognizable Vietnamese words
        if (content.includes('đó') || content.includes('Xóa') || content.includes('Sơ đồ') || content.includes('Tài sản') || content.includes('phòng') || content.includes('không') || content.includes('đăng') || content.includes('thiết bị')) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed:', filePath, '(decoded ' + times + ' times)');
        } else {
            console.log('Skipped/Failed sanity check:', filePath);
        }
    } catch (e) {
        console.error('Error on', filePath, e.message);
    }
}

// BuildingDetail is single-encoded mojibake like "Ä‘Ã³ng" (đóng) -> decode 1 time
fixMojibake('e:/rental/pages/BuildingDetail.tsx', 1);

// Equipment appears to be double-encoded mojibake like "ÃƒÂ³" (ó) -> decode 2 times
fixMojibake('e:/rental/pages/Equipment.tsx', 2);

console.log('Done');
