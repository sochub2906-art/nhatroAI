const fs = require('fs');
let c = fs.readFileSync('e:/rental/pages/BuildingDetail.tsx', 'utf8');

const replacements = {
    "status: 'Tá»‘t'": "status: 'Tốt'",
    "'Đã \u0018óng'": "'Đã đóng'",
    "'Tá»‘t':": "'Tốt':",
    "Sơ \u0018\u001c nhà": "Sơ đồ nhà",
    "Thiết bá»‹ chung tòa nhà": "Thiết bị chung tòa nhà",
    "Trang thiết bá»‹": "Trang thiết bị",
    "Tá»•ng người á»Ÿ": "Tổng người ở",
    "Tiền Ä‘iá»‡n (Thu)": "Tiền điện (Thu)",
    "Tiền nư:c (Thu)": "Tiền nước (Thu)",
    "Tá»•ng cá»™ng": "Tổng cộng",
    "Bắt \u0018ầu:": "Bắt đầu:",
    "Tá»•ng chưa \u0018óng:": "Tổng chưa đóng:",
    "thiết bá»‹": "thiết bị",
    "Thêm thiết bá»‹": "Thêm thiết bị",
    "â€”": "—",
    "\u0018Ồ bắt \u0018ầu.": "để bắt đầu.",
    "Sửa thiết bá»‹": "Sửa thiết bị",
    "Thêm thiết bá»‹ má»›i": "Thêm thiết bị mới",
    "Tên thiết bá»‹": "Tên thiết bị",
    "value=\"Tá»‘t\"": "value=\"Tốt\"",
    ">Tá»‘t<": ">Tốt<",
    "\u001d": "—",
    "Giá trá»‹": "Giá trị"
};

for (const [bad, good] of Object.entries(replacements)) {
    c = c.split(bad).join(good);
}

fs.writeFileSync('e:/rental/pages/BuildingDetail.tsx', c, 'utf8');
console.log('Fixed BuildingDetail.tsx');
