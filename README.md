# Smart Rental Manager

Ứng dụng quản lý nhà trọ gồm 2 mặt triển khai Firebase Hosting:

- `nhatroai`: giao diện host/landing/PWA
- `nhatrobe`: giao diện admin nội bộ

Kiến trúc hiện tại dùng:

- `React 19` + `Vite`
- `Firebase Auth`, `Firestore`, `Firebase Hosting`, `Firebase Messaging`
- `Supabase` cho user/admin settings/snapshot
- `Google Sheets` là nguồn dữ liệu nghiệp vụ chính cho host

## Cấu trúc chính

- `App.tsx`: route entry, chia route host/admin
- `AppContext.tsx`: orchestration state chính
- `context/appDefaults.ts`: default state và helper tách từ `AppContext`
- `context/importValidation.ts`: validation cho `importData`
- `firebase.ts`: bootstrap Firebase từ biến môi trường
- `services/`
  - `googleSheetService.ts`: CRUD + hydrate từ Google Sheets
  - `supabaseService.ts`: user/settings/snapshot
  - `localCacheService.ts`: cache local cho host

## Biến môi trường

Sao chép từ `.env.example` sang `.env`, `.env.host`, `.env.admin`.

Các biến Firebase bắt buộc:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

Các biến khác:

- `VITE_APP_MODE`: để trống cho local dev, `host` cho host site, `admin` cho admin site
- `VITE_SUPABASE_ANON_KEY`

## Chạy local

```bash
npm install
npm run dev
```

Chế độ riêng:

```bash
npm run dev:host
npm run dev:admin
```

## Build

```bash
npm run build:host
npm run build:admin
npm run build:all
```

Output:

- `dist-host`
- `dist-admin`

## Deploy Firebase

Deploy toàn bộ:

```bash
npm run deploy:all
```

Deploy riêng:

```bash
npm run deploy:host
npm run deploy:admin
```

Lưu ý:

- Dự án đã dùng `BrowserRouter`, nên `firebase.json` phải giữ `rewrites` về `/index.html`.
- `firestore.rules` đang theo hướng role-based và deny-by-default cho collection chưa khai báo.

## Hướng dữ liệu

1. User đăng nhập qua Firebase Auth.
2. App hydrate state từ cache local, Supabase snapshot và Google Sheets.
3. CRUD nghiệp vụ host đẩy vào Google Sheets.
4. Metadata admin/user/subscription giữ ở Supabase.

## Ghi chú bảo trì

- Không chỉnh file tiếng Việt bằng shell write ngầm định trên Windows; ưu tiên UTF-8 explicit hoặc `apply_patch`.
- Nếu cần giảm thêm kích thước `AppContext`, nên tách tiếp các nhóm `auth`, `sync`, `notifications`, `payments` thành module riêng thay vì refactor lớn một lần.
