# 🎨 HƯỚNG DẪN THIẾT KẾ & BỘ STYLE CHUNG FRONTEND (UTC2 DESIGN SYSTEM)
## HỆ THỐNG WEB QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP UTC2 (UTC2-DAMS)

> **Căn cứ thiết kế:** Được trích xuất và chuẩn hóa trực tiếp từ website chính thức của **Phân hiệu Trường Đại học Giao thông Vận tải tại TP. Hồ Chí Minh** ([https://utc2.edu.vn](https://utc2.edu.vn/)).  
> **Phong cách chủ đạo:** **Carbon Design System (IBM)** – Phẳng (Flat), hiện đại, học thuật kỹ thuật, tinh gọn, tốc độ cao.

---

## 📑 MỤC LỤC
1. [Bộ Phông Chữ & Quy Chuẩn Typography](#1-bộ-phông-chữ--quy-chuẩn-typography)
2. [Hệ Thống Bảng Màu Chuẩn UTC2 (Color Tokens)](#2-hệ-thống-bảng-màu-chuẩn-utc2-color-tokens)
3. [Quy Chuẩn UI Components Nguyên Tử (Atomic Components)](#3-quy-chuẩn-ui-components-nguyên-tử-atomic-components)
   - [3.1. Nút Bấm (Button)](#31-nút-bấm-button)
   - [3.2. Huy Hiệu Trạng Thái Đồ Án (Badges)](#32-huy-hiệu-trạng-thái-đồ-án-badges)
   - [3.3. Hộp Thông Tin & Thẻ Đề Tài (Cards)](#33-hộp-thông-tin--thẻ-đề-tài-cards)
   - [3.4. Bảng Dữ Liệu & Danh Sách (Table)](#34-bảng-dữ-liệu--danh-sách-table)
   - [3.5. Biểu Mẫu Nhập Liệu (Input & Form Controls)](#35-biểu-mẫu-nhập-liệu-input--form-controls)
4. [Bố Cục Nhận Diện Thương Hiệu (Header & Sidebar)](#4-bố-cục-nhận-diện-thương-hiệu-header--sidebar)
5. [Hiệu Ứng Đổ Bóng & Bo Góc (Elevation & Radius)](#5-hiệu-ứng-đổ-bóng--bo-góc-elevation--radius)

---

## 1. BỘ PHÔNG CHỮ & QUY CHUẨN TYPOGRAPHY

### 🔤 Phông Chữ Chính Thức: `Be Vietnam Pro`
Toàn bộ ứng dụng sử dụng phông chữ **Be Vietnam Pro** (Google Fonts) – phông chữ chính thức hiển thị trên cổng thông tin `utc2.edu.vn`.

```css
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
}
```

### 📐 Thang Cỡ Chữ & Trọng Lượng (Hierarchy):
* **H1 - Tiêu đề chính trang:** `text-2xl font-bold text-utc2-text-main` (24px / 1.5rem, weight 700).  
  *Ví dụ: "Hội Đồng Bảo Vệ Đồ Án Tốt Nghiệp", "Đăng Ký Đề Tài"*
* **H2 - Tiêu đề nhóm / Card lớn:** `text-lg font-semibold text-utc2-text-main` (18px / 1.125rem, weight 600).
* **H3 - Tiêu đề đề tài con:** `text-base font-semibold text-utc2-text-main` (16px / 1rem, weight 600).
* **Body - Chữ nội dung thông thường:** `text-sm font-normal text-utc2-text-main` (14px / 0.875rem, weight 400).
* **Muted/Caption - Thông tin phụ, thời gian, mã đề tài:** `text-xs font-normal text-utc2-text-muted` (12px / 0.75rem, weight 400).

---

## 2. HỆ THỐNG BẢNG MÀU CHUẨN UTC2 (COLOR TOKENS)

### 🎨 1. Bảng Màu Thương Hiệu (Brand Colors):

| Tên Token Tailwind | Mã Màu Hex | Mô Tả & Vị Trí Sử Dụng |
| :--- | :---: | :--- |
| `bg-utc2-primary` / `text-utc2-primary` | `#0f62fe` | **Xanh dương chủ đạo UTC2 (Blue 60):** Nút hành động chính, active sidebar, tiến trình thanh đo. |
| `bg-utc2-dark` / `text-utc2-dark` | `#0043ce` | **Xanh dương đậm (Blue 70):** Thanh Header trên cùng, trạng thái Hover của nút bấm chính. |
| `bg-utc2-accent` / `text-utc2-accent` | `#4589ff` | **Xanh sáng tương tác (Blue 50):** Viền focus, biểu tượng nổi bật, liên kết điều hướng. |
| `bg-utc2-light` | `#78a9ff` | **Xanh nhạt (Blue 40):** Dải sáng phụ, highlight khi rê chuột vào hàng bảng. |
| `bg-utc2-surface` | `#f4f4f4` | **Nền ứng dụng (Surface):** Nền toàn trang Dashboard, tạo độ sâu tương phản với các Card trắng. |
| `bg-utc2-card` | `#ffffff` | **Nền Card / Hộp chứa:** Màu trắng phẳng tinh khiết. |

### 🖤 2. Bảng Màu Chữ & Viền (Neutrals):

| Tên Token Tailwind | Mã Màu Hex | Vị Trí Sử Dụng |
| :--- | :---: | :--- |
| `text-utc2-text-main` | `#161616` | Chữ chính, tiêu đề (đen than dễ đọc, không gắt mắt). |
| `text-utc2-text-muted` | `#525252` | Chữ phụ, mô tả ngắn, nhãn form. |
| `text-utc2-text-subtle`| `#8d8d8d` | Placeholder ô nhập liệu, thông tin chú giải. |
| `border-utc2-border` | `#e0e0e0` | Đường kẻ phân cách, viền Card, viền Table. |
| `border-utc2-border-light` | `#e8e8e8` | Viền nhẹ, vách ngăn danh mục. |

### 🚦 3. Bảng Màu Trạng Thái Nghiệp Vụ (Business Status):

| Trạng Thái Nghiệp Vụ | Mã Màu Hex | Lớp Tailwind Khuyến Nghị |
| :--- | :---: | :--- |
| **Thành công / Hoàn thành / Đạt** | `#24a148` | `bg-[#defbe6] text-[#24a148] border-[#24a148]/30` |
| **Cảnh báo / Chờ duyệt / Xem xét** | `#f1c21b` | `bg-[#fcf4d6] text-[#b28900] border-[#f1c21b]/40` |
| **Từ chối / Trượt / Vi phạm đạo văn**| `#da1e28` | `bg-[#ffebee] text-[#da1e28] border-[#da1e28]/30` |
| **Đang diễn ra / Thông tin hệ thống** | `#0043ce` | `bg-[#edf5ff] text-[#0043ce] border-[#0043ce]/30` |

---

## 3. QUY CHUẨN UI COMPONENTS NGUYÊN TỬ (ATOMIC COMPONENTS)

### 3.1. Nút Bấm (`Button`)
Bo góc chuẩn 8px (`rounded-lg`), khoảng cách lề `px-4 py-2.5`, hiệu ứng chuyển tiếp 150ms.

* **Primary (Chính):**
  ```html
  <button class="rounded-lg bg-utc2-primary px-4 py-2.5 text-sm font-medium text-white shadow-utc2-sm hover:bg-utc2-dark transition duration-150 active:scale-[0.98]">
    Lưu Báo Cáo
  </button>
  ```
* **Secondary (Phụ):**
  ```html
  <button class="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-utc2-text-main hover:bg-slate-200 transition">
    Hủy Bỏ
  </button>
  ```
* **Outline (Viền mỏng):**
  ```html
  <button class="rounded-lg border border-utc2-border bg-white px-4 py-2.5 text-sm font-medium text-utc2-text-main hover:bg-slate-50 transition">
    Xuất File Excel
  </button>
  ```
* **Danger (Hủy / Khóa / Từ chối):**
  ```html
  <button class="rounded-lg bg-utc2-status-danger px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition">
    Từ Chối Đề Tài
  </button>
  ```

---

### 3.2. Huy Hiệu Trạng Thái Đồ Án (`Badges`)
Sử dụng bo góc mềm (`rounded-full` hoặc `rounded-md`), cỡ chữ `text-xs font-semibold px-2.5 py-1`:

* **Đã duyệt / Đủ điều kiện:**
  `<span class="inline-flex items-center rounded-md bg-[#defbe6] px-2.5 py-1 text-xs font-medium text-[#24a148]">Đã Phê Duyệt</span>`
* **Chờ Trưởng bộ môn thẩm định:**
  `<span class="inline-flex items-center rounded-md bg-[#fcf4d6] px-2.5 py-1 text-xs font-medium text-[#b28900]">Chờ Thẩm Định</span>`
* **Cảnh báo chậm tiến độ:**
  `<span class="inline-flex items-center rounded-md bg-[#ffebee] px-2.5 py-1 text-xs font-medium text-[#da1e28]">Cảnh Báo Tuần 2</span>`
* **Đang thực hiện:**
  `<span class="inline-flex items-center rounded-md bg-[#edf5ff] px-2.5 py-1 text-xs font-medium text-[#0043ce]">Đang Thực Hiện</span>`

---

### 3.3. Hộp Thông Tin & Thẻ Đề Tài (`Cards`)
Thiết kế phẳng, tinh tế, viền mảnh:
```html
<div class="rounded-lg border border-utc2-border bg-utc2-card p-5 shadow-utc2-card hover:shadow-utc2-hover transition duration-200">
  <div class="flex items-center justify-between mb-3">
    <span class="text-xs font-semibold text-utc2-primary">KHOA CNTT</span>
    <!-- Badge trạng thái -->
  </div>
  <h3 class="text-base font-semibold text-utc2-text-main line-clamp-2">
    Xây dựng hệ thống quản lý đồ án tốt nghiệp UTC2
  </h3>
  <p class="text-xs text-utc2-text-muted mt-2">
    GVHD: TS. Phan Thị Miên | Chỉ tiêu: 2 SV
  </p>
</div>
```

---

### 3.4. Bảng Dữ Liệu & Danh Sách (`Table`)
* **Header:** Nền `bg-slate-50`, chữ `text-xs font-semibold uppercase tracking-wider text-utc2-text-muted`, viền dưới `border-b border-utc2-border`.
* **Row:** Nền trắng, xen kẽ `hover:bg-slate-50/80`, khoảng cách ô `px-4 py-3 text-sm`.

---

### 3.5. Biểu Mẫu Nhập Liệu (`Input & Form Controls`)
* **Input Text / Select:**
  ```html
  <input 
    type="text" 
    class="w-full rounded-lg border border-utc2-border bg-white px-3.5 py-2.5 text-sm text-utc2-text-main placeholder-utc2-text-subtle focus:border-utc2-primary focus:outline-none focus:ring-2 focus:ring-utc2-primary/20 transition"
    placeholder="Nhập tên đề tài..."
  />
  ```
* **Thông báo lỗi (Error message):**
  `<p class="mt-1 text-xs text-utc2-status-danger">Vui lòng không để trống trường này</p>`

---

## 4. BỐ CỤC NHẬN DIỆN THƯƠNG HIỆU (HEADER & SIDEBAR)

### 🏫 Thanh Header Phía Trên (Brand Topbar):
* Chiều cao: `h-16` (64px).
* Nền: Trắng viền dưới `border-b border-utc2-border`.
* **Khối Logo & Tiêu đề:**
  * Logo biểu tượng UTC2 tròn (kích thước `40x40px`).
  * Chữ thương hiệu 2 tầng chuẩn:
    * Dòng trên: **TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI** (`text-xs font-bold text-utc2-dark uppercase`).
    * Dòng dưới: **PHÂN HIỆU TẠI TP. HỒ CHÍ MINH** (`text-[10px] font-medium text-utc2-text-muted`).

### 📌 Thanh Menu Bên (Sidebar Navigation):
* Chiều rộng: `w-64` (256px), nền trắng `bg-white`, đường viền phải `border-r border-utc2-border`.
* Menu Item Active:
  * Nền xanh nhạt: `bg-[#edf5ff]`.
  * Chữ và icon màu xanh UTC2: `text-utc2-primary font-semibold`.
  * Vạch nhấn bên trái (Left accent line): `border-l-4 border-utc2-primary`.

---

## 5. HIỆU ỨNG ĐỔ BÓNG & BO GÓC (ELEVATION & RADIUS)

* **Bo góc:** Thống nhất chuẩn `rounded-lg` (8px) cho tất cả buttons, cards, modals và inputs.
* **Đổ bóng (Shadows):**
  * `shadow-utc2-sm`: Cho các nút bấm và dropdown menu nhỏ.
  * `shadow-utc2-card`: Cho các khối Card danh sách đồ án.
  * `shadow-utc2-hover`: Cho hiệu ứng hover nổi bật nhẹ nhàng khi tương tác.

---
*Tài liệu Tiêu chuẩn Giao diện UTC2-DAMS – Trích xuất chuẩn xác từ Cổng thông tin UTC2 tháng 10/2026.*
