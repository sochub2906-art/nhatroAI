# Hướng dẫn Tích hợp Thanh toán Tự động SePay 🚀

Tài liệu này hướng dẫn cách cấu hình Webhook SePay để tự động gạch nợ (đối soát) tiền nhà cho Host và tiền thuê phần mềm cho Admin thông qua Supabase Edge Functions.

---

## 1. Dành cho Kỹ thuật (Developer/Admin)

### Deploy Edge Function
Mở Terminal tại thư mục dự án và chạy lệnh sau để đưa code lên Supabase:

```bash
# Đăng nhập nếu chưa làm
npx supabase login

# Deploy function (Quan trọng: Phải có --no-verify-jwt)
npx supabase functions deploy sepay-webhook --no-verify-jwt
```

### Cấu hình Secrets trên Supabase
1. Vào **Supabase Dashboard** -> **Edge Functions** -> `sepay-webhook` -> **Settings** -> **Secrets**.
2. **Lưu ý:** `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY` thường đã có sẵn từ hệ thống. Bạn **không cần** tự tạo thêm biến có tiền tố `SUPABASE_` (nếu cố tạo sẽ bị báo lỗi naming).

---

## 2. Cấu hình Webhook trên trang SePay (Cho Admin)

Dùng để tự động gạch nợ khi các Host thanh toán phí duy trì phần mềm.

1. **URL gọi đến (Webhook URL):**
   `https://[PROJECT_ID].supabase.co/functions/v1/sepay-webhook?type=admin`
   *(Thay [PROJECT_ID] bằng mã dự án của bạn, ví dụ: `brmhrzyiaknppzqbwwpv`)*
2. **Sự kiện:** Chọn "Có tiền vào".
3. **Kiểu chứng thực:** "Không cần chứng thực" (Vì mình dùng `--no-verify-jwt`).
4. **Cấu trúc nội dung:** Hệ thống sẽ quét tìm mã **`SUB_[HOST_ID]`** trong nội dung chuyển khoản để gia hạn gói.

---

## 3. Cấu hình Webhook trên trang SePay (Cho Host)

Dùng để tự động gạch nợ tiền nhà khi Người thuê chuyển khoản.

1. **Lấy link Webhook:**
   Host truy cập vào mục **Cài đặt hệ thống** -> **Hồ sơ & Thanh toán**.
   - Nếu chưa đăng ký: Nhấn nút **"Yêu cầu mở SePay tự động"** để Admin duyệt.
   - Nếu đã được duyệt: Copy **Webhook URL riêng** hiện ra ở đó.
2. **URL trên SePay:** Link này sẽ có dạng:
   `https://.../sepay-webhook?type=host&hostId=[ID]&token=[UUID]`
3. **Cách thức hoạt động:**
   Khi người thuê chuyển khoản, hệ thống tìm mã **`BL_[ID_HOA_DON]`** (ví dụ: `BL_101`) trong nội dung để đổi trạng thái hóa đơn thành **"Đã đóng"**.

---

## 4. Các mã đối soát quan trọng (Prefix)

Hệ thống hoạt động dựa trên các mã viết hoa sau đây trong nội dung chuyển khoản:

| Mã bắt đầu | Ý nghĩa | Ví dụ nội dung |
| :--- | :--- | :--- |
| **`BL_`** | Hóa đơn tiền nhà (Bills) | `Đóng tiền phòng BL_205` |
| **`SUB_`** | Gia hạn gói phần mềm (Subscription) | `Gia han phan mem SUB_host01` |

---

> [!TIP]
> **Mẹo kiểm tra:** Sau khi lưu Webhook trên SePay, hãy nhấn nút **"Gửi test thử"**. Nếu Supabase trả về mã lỗi **200** hoặc **Message: "Missing transaction data"** (có nghĩa là nó đã chạm được tới code) thì cấu hình URL đã chuẩn!
