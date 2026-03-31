const fs = require('fs');

function fixBuilding() {
    let c = fs.readFileSync('e:/rental/pages/BuildingDetail.tsx', 'utf8');
    // Replace the problematic bytes
    c = c.replace(/Đã \x18óng/g, 'Đã đóng');
    c = c.replace(/Sơ \x18\x1c nhà/g, 'Sơ đồ nhà');
    c = c.replace(/Bắt \x18ầu:/g, 'Bắt đầu:');
    c = c.replace(/chưa \x18óng:/g, 'chưa đóng:');
    c = c.replace(/\x18Ồ bắt \x18ầu./g, 'để bắt đầu.');
    c = c.replace(/thiết bá»‹ má»›i/g, 'thiết bị mới');
    c = c.replace(/Chung tòa nhà \x1d/g, 'Chung tòa nhà —');
    c = c.replace(/Cáº­p nháº­t/g, 'Cập nhật');
    c = c.replace(/ThÃªm má»›i/g, 'Thêm mới');

    // Also fixing Total Ngưòi ở
    c = c.replace(/Tá»•ng người á»Ÿ/g, 'Tổng người ở');

    fs.writeFileSync('e:/rental/pages/BuildingDetail.tsx', c, 'utf8');
    console.log('Fixed BuildingDetail.');
}

function fixEquipment() {
    let c = fs.readFileSync('e:/rental/pages/Equipment.tsx', 'utf8');
    // In Equipment, we have a lot of weird artifacts like "TÒ a" because of the double decode failure
    // We can define a massive replace map
    const map = {
        "TÒ a": "Tòa",
        "TÒ a nhÒ ": "Tòa nhà",
        "cÒ³": "có",
        "tÒ i sản": "tài sản",
        "TÒ i sản": "Tài sản",
        "Trang thiết báo": "Trang thiết bị",
        "Tá»‘t": "Tốt",
        "Hỏ ng": "Hỏng",
        "Đang sử a": "Đang sửa",
        "Thanh lÃ½": "Thanh lý",
        "ChÃ†Â°a": "Chưa",
        "bá»\x1e lọc": "bộ lọc",
        "hiá»\x19n": "hiện",
        "thá»\x19": "thị",
        "hiá»\x21n": "hiện",
        "gắn": "gắn",
        "tÒ²a": "tòa",
        "nhÒ ": "nhà",
        "ThÒ´ng tin": "Thông tin",
        "CÃ†Â¡": "Cơ",
        "bản": "bản",
        "bảo trÒ¬": "bảo trì",
        "thÒªm": "thêm",
        "kỳ": "kỳ",
        "hoặc": "hoặc",
        "lại": "lại",
        "sản": "sản",
        "Ghi chÒº": "Ghi chú",
        "hạng mục": "hạng mục",
        "thay thế": "thay thế",
        "cập nhật": "cập nhật",
        "ThÒªm": "Thêm",
        "Ã„â€˜": "đ",
        "Ã†Â¡": "ơ",
        "bá»\x21c": "bậc",
        "gÒ§n": "gần",
        "nhÒ¥t": "nhất",
        "kiá»\x19m": "kiểm",
        "kÒª": "kê",
        "sử a chử a": "sửa chữa",
        "vÒ²ng": "vòng",
        "Ã„â€˜á»\x11i": "đời",
        "mua sÒµm": "mua sắm",
        "khÒ¥u hao": "khấu hao",
        "NguyÒªn": "Nguyên",
        "giÒ¡": "giá",
        "trá»\x21": "trị",
        "cÒ²n": "còn",
        "KhÒ¥u hao": "Khấu hao",
        "thÒ¡ng": "tháng"
    };

    for (const [bad, good] of Object.entries(map)) {
        c = c.split(bad).join(good);
    }
    
    // Also clean up broken sequences like 
    c = c.replace(/\x1e|\x19|\x21|\x11|\x18/g, '');

    fs.writeFileSync('e:/rental/pages/Equipment.tsx', c, 'utf8');
    console.log('Fixed Equipment.');
}

fixBuilding();
fixEquipment();
