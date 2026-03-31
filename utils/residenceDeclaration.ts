import type { AppUser, Building, Contract, Customer, Room } from '../types';
import { openPrintDocument } from './printDocument';
import { formatDateVN, parseDateInput } from './dateFormat';

// CT01 template is aligned to the official current BCA consolidated source:
// 42/VBHN-BCA dated 2025-09-11, attached current "Mẫu CT01 ban hành kèm theo Thông tư 53".

interface DeclarationPayload {
    customer: Customer;
    contract?: Contract | null;
    room?: Room | null;
    building?: Building | null;
    host?: AppUser | null;
    householdMembers?: Customer[];
}

function safe(value?: string | number | null): string {
    return value === undefined || value === null || value === '' ? '................................................' : String(value);
}

function formatDate(value?: string): string {
    if (!value) return '......../......../............';
    return formatDateVN(value, value);
}

function splitDateParts(value?: string): { day: string; month: string; year: string } {
    if (!value) return { day: '........', month: '........', year: '............' };
    const date = parseDateInput(value);
    if (!date || Number.isNaN(date.getTime())) return { day: value, month: '........', year: '............' };
    return {
        day: String(date.getDate()).padStart(2, '0'),
        month: String(date.getMonth() + 1).padStart(2, '0'),
        year: String(date.getFullYear()),
    };
}

function composeResidenceAddress(room?: Room | null, building?: Building | null): string {
    const parts = [
        room?.name ? `Phòng ${room.name}` : '',
        building?.name || '',
        building?.address || '',
    ].filter(Boolean);
    return safe(parts.join(', '));
}

function buildProposalContent(payload: DeclarationPayload): string {
    const address = composeResidenceAddress(payload.room, payload.building);
    if (payload.contract?.startDate) {
        return `Đăng ký tạm trú mới tại ${address} kể từ ngày ${formatDate(payload.contract.startDate)}.`;
    }
    return `Đăng ký tạm trú mới tại ${address}.`;
}

function blankRows(count: number): string {
    return Array.from({ length: count })
        .map(
            () => `
                <tr>
                  <td>.............................................................................</td>
                  <td>........../........../............</td>
                  <td>.............</td>
                  <td>................................................</td>
                  <td>................................................</td>
                </tr>`,
        )
        .join('');
}

function buildMemberRows(members: Customer[]): string {
    if (members.length === 0) {
        return blankRows(4);
    }

    const rows = members
        .slice(0, 4)
        .map(
            member => `
                <tr>
                  <td>${safe(member.name)}</td>
                  <td>${formatDate(member.dateOfBirth)}</td>
                  <td>${safe(member.gender)}</td>
                  <td>${safe(member.idNumber)}</td>
                  <td>................................................</td>
                </tr>`,
        )
        .join('');

    return `${rows}${blankRows(Math.max(0, 4 - members.length))}`;
}

function buildResidenceDeclarationHtml(payload: DeclarationPayload): string {
    const { customer, contract, room, building, host } = payload;
    const birth = splitDateParts(customer.dateOfBirth);
    const address = composeResidenceAddress(room, building);
    const householdMembers = (payload.householdMembers || []).filter(member => member.id !== customer.id);

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Mẫu CT01 - ${customer.name}</title>
  <style>
    body { font-family: "Times New Roman", serif; margin: 18px 26px; color: #111827; line-height: 1.45; font-size: 14px; }
    .page { max-width: 980px; margin: 0 auto; }
    .topline { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; margin-bottom: 12px; }
    .left-header { text-align: center; font-weight: 700; text-transform: uppercase; }
    .left-header small { display: block; font-size: 12px; margin-top: 6px; font-weight: 400; text-transform: none; }
    .right-header { text-align: center; }
    .right-header .nation { font-weight: 700; text-transform: uppercase; }
    .right-header .motto { font-weight: 700; }
    .underline { width: 180px; border-bottom: 1px solid #111827; margin: 8px auto 0; }
    .title { text-align: center; margin: 14px 0 6px; }
    .title h1 { margin: 0; font-size: 22px; font-weight: 700; text-transform: uppercase; }
    .subtitle { text-align: center; font-style: italic; margin-bottom: 10px; }
    .row { margin-bottom: 8px; }
    .label { font-weight: 700; }
    .inline-grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 12px; }
    .inline-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .note { font-size: 12px; font-style: italic; margin-top: 4px; }
    .table-title { margin-top: 12px; margin-bottom: 6px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    th, td { border: 1px solid #111827; padding: 6px 8px; vertical-align: top; }
    th { text-align: center; font-size: 12px; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 18px; }
    .signature { text-align: center; min-height: 180px; }
    .signature .heading { font-weight: 700; text-transform: uppercase; }
    .signature .sub { font-size: 12px; font-style: italic; }
    .signature .name { margin-top: 90px; font-weight: 700; }
    .approval { margin-top: 16px; }
    .approval-title { font-weight: 700; text-transform: uppercase; }
    .approval-box { min-height: 80px; border-bottom: 1px dashed #111827; margin-top: 8px; }
    .small { font-size: 12px; }
    @media print { body { margin: 12px 16px; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="topline">
      <div class="left-header">
        Công an(1) ..............................................
        <small>Đơn vị tiếp nhận hồ sơ cư trú</small>
      </div>
      <div class="right-header">
        <div class="nation">Cộng hòa xã hội chủ nghĩa Việt Nam</div>
        <div class="motto">Độc lập - Tự do - Hạnh phúc</div>
        <div class="underline"></div>
      </div>
    </div>

    <div class="title">
      <h1>Tờ khai thay đổi thông tin cư trú</h1>
    </div>
    <div class="subtitle">Mẫu CT01</div>

    <div class="row"><span class="label">Kính gửi(2):</span> ....................................................................................................................................................</div>
    <div class="row"><span class="label">1. Họ, chữ đệm và tên:</span> ${safe(customer.name)}</div>
    <div class="inline-grid">
      <div class="row"><span class="label">2. Ngày, tháng, năm sinh:</span> ${birth.day} / ${birth.month} / ${birth.year}</div>
      <div class="row"><span class="label">3. Giới tính:</span> ${safe(customer.gender)}</div>
      <div class="row"><span class="label">4. Số định danh cá nhân/CMND:</span> ${safe(customer.idNumber)}</div>
    </div>
    <div class="inline-grid-2">
      <div class="row"><span class="label">5. Số điện thoại liên hệ:</span> ${safe(customer.phone)}</div>
      <div class="row"><span class="label">6. Email:</span> ${safe(customer.email)}</div>
    </div>
    <div class="inline-grid">
      <div class="row"><span class="label">7. Họ, chữ đệm và tên chủ hộ:</span> ................................................</div>
      <div class="row"><span class="label">8. Quan hệ với chủ hộ:</span> ................................................</div>
      <div class="row"><span class="label">9. Số định danh cá nhân của chủ hộ:</span> ................................................</div>
    </div>

    <div class="row">
      <span class="label">10. Nội dung đề nghị(3):</span> ${safe(buildProposalContent(payload))}
    </div>
    <div class="note">
      Ví dụ: đăng ký tạm trú mới, điều chỉnh thông tin về nơi ở, xác nhận thông tin cư trú, xóa đăng ký tạm trú...
    </div>

    <div class="row" style="margin-top:10px;">
      <span class="label">Địa chỉ chỗ ở hợp pháp đề nghị đăng ký:</span> ${address}
    </div>
    <div class="inline-grid-2">
      <div class="row"><span class="label">Ngày bắt đầu cư trú:</span> ${formatDate(contract?.startDate)}</div>
      <div class="row"><span class="label">Thời hạn cư trú dự kiến:</span> ${formatDate(contract?.endDate)}</div>
    </div>
    <div class="inline-grid-2">
      <div class="row"><span class="label">Nơi thường trú hiện tại:</span> ${safe(customer.residenceAddress || customer.currentAddress || customer.permanentAddress)}</div>
      <div class="row"><span class="label">Quê quán:</span> ${safe(customer.placeOfOrigin)}</div>
    </div>
    <div class="inline-grid-2">
      <div class="row"><span class="label">Nghề nghiệp:</span> ${safe(customer.occupation)}</div>
      <div class="row"><span class="label">Quốc tịch:</span> ${safe(customer.nationality || 'Việt Nam')}</div>
    </div>

    <div class="table-title">11. Những thành viên trong hộ gia đình cùng thay đổi thông tin cư trú (nếu có)</div>
    <table>
      <thead>
        <tr>
          <th>Họ, chữ đệm và tên</th>
          <th>Ngày, tháng, năm sinh</th>
          <th>Giới tính</th>
          <th>Số định danh cá nhân/CMND</th>
          <th>Quan hệ với người kê khai</th>
        </tr>
      </thead>
      <tbody>
        ${buildMemberRows(householdMembers)}
      </tbody>
    </table>

    <div class="approval">
      <div class="approval-title">Ý kiến của chủ hộ (4)</div>
      <div class="small">....................................................................................................................................................................................</div>
      <div class="approval-box"></div>
    </div>

    <div class="approval">
      <div class="approval-title">Ý kiến của chủ sở hữu chỗ ở hợp pháp (5)</div>
      <div class="small">Họ và tên: ${safe(host?.name)}</div>
      <div class="small">Số điện thoại liên hệ: ${safe(host?.phone)}</div>
      <div class="approval-box"></div>
    </div>

    <div class="signatures">
      <div class="signature">
        <div class="heading">Ý kiến của cha, mẹ hoặc người giám hộ</div>
        <div class="sub">(6)</div>
      </div>
      <div class="signature">
        <div class="heading">Chủ sở hữu chỗ ở hợp pháp</div>
        <div class="sub">(Ký, ghi rõ họ tên)</div>
        <div class="name">${safe(host?.name)}</div>
      </div>
      <div class="signature">
        <div class="heading">Người kê khai</div>
        <div class="sub">(Ký, ghi rõ họ tên)</div>
        <div class="name">${safe(customer.name)}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function downloadResidenceDeclarationFile(payload: DeclarationPayload): void {
    const html = buildResidenceDeclarationHtml(payload);
    openPrintDocument(html, {
        title: `Mau CT01 - ${payload.customer.name}`,
        autoPrint: true,
    });
}
