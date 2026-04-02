import type { AppUser, Building, Contract, Customer, Room, AdminSettings } from '../types';
import { openPrintDocument } from './printDocument';
import { formatDateVN } from './dateFormat';
import { formatCurrency } from '../AppContext';

interface ContractPayload {
    contract: Contract;
    customer: Customer;
    room: Room;
    building?: Building;
    host: AppUser;
    settings?: AdminSettings;
}

function safe(value?: string | number | null): string {
    return value === undefined || value === null || value === '' ? '................................................' : String(value);
}

function formatDate(value?: string): string {
    if (!value) return '......../......../............';
    return formatDateVN(value, value);
}

export function buildContractHtml(payload: ContractPayload): string {
    const { contract, customer, room, building, host, settings } = payload;
    
    // Services HTML
    let servicesHtml = `
      <li><strong>Điện:</strong> ${formatCurrency(contract.electricPrice)} / kWh(chữ)</li>
      <li><strong>Nước:</strong> ${formatCurrency(contract.waterPrice)} / khối</li>
      <li><strong>Internet:</strong> ${formatCurrency(contract.internetPrice)} / tháng</li>
    `;

    if (contract.extraServices) {
        servicesHtml += contract.extraServices
            .filter(s => s.enabled)
            .map(s => {
                let unitStr = s.unit || 'tháng';
                if (s.unit === 'person') unitStr = 'người';
                if (s.unit === 'room') unitStr = 'phòng';
                if (s.unit === 'kwh') unitStr = 'kWh(chữ)';
                if (s.unit === 'm3') unitStr = 'khối';
                
                return `<li><strong>${s.name}:</strong> ${formatCurrency(s.unitPrice)} / ${unitStr}</li>`;
            })
            .join('');
    }

    const buildingAddress = building ? `${building.name}, ${building.address}` : '................................................';

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Hợp Đồng Thuê Phòng - ${customer.name}</title>
  <style>
    body { font-family: "Times New Roman", serif; margin: 20px 30px; color: #000; line-height: 1.5; font-size: 14pt; }
    .page { max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 20px; }
    .header .nation { font-weight: bold; font-size: 14pt; text-transform: uppercase; }
    .header .motto { font-weight: bold; font-size: 14pt; text-decoration: underline; margin-bottom: 20px; }
    .header .title { font-weight: bold; font-size: 18pt; text-transform: uppercase; margin-bottom: 5px; }
    .header .subtitle { font-style: italic; font-size: 12pt; }
    p { margin: 5px 0; text-align: justify; }
    ul { margin: 5px 0 10px 20px; padding: 0; }
    li { margin-bottom: 5px; }
    .section-title { font-weight: bold; font-size: 14pt; margin-top: 15px; margin-bottom: 10px; text-transform: uppercase; }
    .bold { font-weight: bold; }
    .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
    .signature-box { text-align: center; width: 45%; }
    .signature-box .role { font-weight: bold; text-transform: uppercase; }
    .signature-box .note { font-style: italic; font-size: 12pt; margin-bottom: 80px; }
    .signature-box .name { font-weight: bold; }
    @media print {
        @page { size: A4; margin: 20mm; }
        body { margin: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="nation">Cộng hòa xã hội chủ nghĩa Việt Nam</div>
      <div class="motto">Độc lập - Tự do - Hạnh phúc</div>
      <div class="title">Hợp Đồng Cho Thuê Phòng Trọ</div>
      <div class="subtitle">Hôm nay, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}, tại ${buildingAddress}</div>
    </div>

    <p>Chúng tôi gồm có:</p>

    <div class="section-title">BÊN CHO THUÊ (BÊN A):</div>
    <p><span class="bold">Ông/Bà:</span> ${safe(host.name)}</p>
    <p><span class="bold">Số điện thoại:</span> ${safe(host.phone)}</p>
    <p><span class="bold">Là chủ sở hữu/Đại diện quản lý nhà trọ tại địa chỉ:</span> ${buildingAddress}</p>

    <div class="section-title">BÊN THUÊ (BÊN B):</div>
    <p><span class="bold">Ông/Bà:</span> ${safe(customer.name)}</p>
    <p><span class="bold">Sinh năm:</span> ${safe(customer.dateOfBirth)}</p>
    <p><span class="bold">Số CMND/CCCD:</span> ${safe(customer.idNumber)} <span class="bold">Ngày cấp:</span> ${safe(customer.idIssueDate)} <span class="bold">Nơi cấp:</span> ${safe(customer.idIssuePlace)}</p>
    <p><span class="bold">Hộ khẩu thường trú:</span> ${safe(customer.permanentAddress)}</p>
    <p><span class="bold">Số điện thoại:</span> ${safe(customer.phone)}</p>

    <p>Sau khi thỏa thuận, hai bên nhất trí ký kết hợp đồng thuê phòng với các điều khoản sau:</p>

    <div class="section-title">ĐIỀU 1: THÔNG TIN PHÒNG THUÊ VÀ GIÁ CẢ</div>
    <p>1.1 Bên A đồng ý cho Bên B thuê phòng số: <span class="bold">${safe(room.name)}</span> tại địa chỉ: ${buildingAddress}.</p>
    <p>1.2 Giá thuê phòng là: <span class="bold">${formatCurrency(contract.price)}/tháng</span> (Bằng chữ: ..............................................................).</p>
    <p>1.3 Bên B thanh toán tiền thuê nhà cho Bên A vào ngày <span class="bold">.....</span> hàng tháng.</p>
    <p>1.4 Số tiền đặt cọc: <span class="bold">........................................</span>. Tiền cọc sẽ được hoàn trả (hoặc trừ vào tiền phòng, dịch vụ còn thiếu) khi Bên B kết thúc hợp đồng đúng hạn và bàn giao lại phòng cùng trang thiết bị trong tình trạng tốt.</p>

    <div class="section-title">ĐIỀU 2: CÁC CHI PHÍ DỊCH VỤ KHÁC</div>
    <p>Bên B có trách nhiệm thanh toán các khoản chi phí dịch vụ sinh hoạt hàng tháng theo mức giá quy định như sau:</p>
    <ul>
      ${servicesHtml}
    </ul>

    <div class="section-title">ĐIỀU 3: THỜI HẠN HỢP ĐỒNG</div>
    <p>3.1 Hợp đồng có giá trị kể từ ngày <span class="bold">${formatDate(contract.startDate)}</span> đến ngày <span class="bold">${formatDate(contract.endDate)}</span>.</p>
    <p>3.2 Nếu một trong hai bên muốn chấm dứt hợp đồng trước thời hạn, phải báo trước cho bên kia ít nhất 30 ngày. Nếu Bên B tự ý chấm dứt hợp đồng trước thời hạn mà không báo trước hoặc vi phạm nội quy, Bên B sẽ mất toàn bộ tiền cọc.</p>

    <div class="section-title">ĐIỀU 4: TRÁCH NHIỆM HAI BÊN</div>
    <p><span class="bold">Trách nhiệm của Bên A:</span></p>
    <ul>
      <li>Giao phòng và trang thiết bị (nếu có) đúng như thỏa thuận.</li>
      <li>Đảm bảo quyền sử dụng trọn vẹn và độc lập của Bên B đối với phòng thuê.</li>
      <li>Hỗ trợ thực hiện đăng ký tạm trú cho Bên B (nếu có yêu cầu và Bên B cung cấp đủ giấy tờ hợp lệ).</li>
    </ul>
    
    <p><span class="bold">Trách nhiệm của Bên B:</span></p>
    <ul>
      <li>Thanh toán tiền thuê phòng và các dịch vụ đúng hạn.</li>
      <li>Giữ gìn vệ sinh chung, an ninh trật tự, không tàng trữ vật liệu cháy nổ hoặc hàng cấm.</li>
      <li>Tự bảo quản tài sản cá nhân. Chịu trách nhiệm bồi thường nếu làm hư hỏng trang thiết bị, tài sản của Bên A.</li>
      <li>Không được tự ý cải tạo phòng hoặc chuyển nhượng hợp đồng cho người khác khi chưa có sự đồng ý của Bên A.</li>
    </ul>

    <div class="section-title">ĐIỀU 5: CAM KẾT CHUNG</div>
    <p>Hai bên cam kết thực hiện đúng các điều khoản đã ghi trong hợp đồng. Mọi thay đổi hoặc tranh chấp (nếu có) sẽ được giải quyết dựa trên tinh thần thương lượng, hòa giải.</p>
    <p>Hợp đồng được lập thành 02 (hai) bản có giá trị pháp lý như nhau, mỗi bên giữ 01 (một) bản.</p>

    <div class="signatures">
      <div class="signature-box">
        <div class="role">BÊN THUÊ (BÊN B)</div>
        <div class="note">(Ký, ghi rõ họ tên)</div>
        <div class="name">${safe(customer.name)}</div>
      </div>
      <div class="signature-box">
        <div class="role">BÊN CHO THUÊ (BÊN A)</div>
        <div class="note">(Ký, ghi rõ họ tên)</div>
        <div class="name">${safe(host.name)}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function printContractDocument(payload: ContractPayload): void {
    const html = buildContractHtml(payload);
    openPrintDocument(html, {
        title: `HopDongThuePhong_${payload.customer.name}_${payload.room.name}`,
        autoPrint: true,
    });
}
