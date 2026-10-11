# MA TRẬN PHÂN QUYỀN VÀ DANH MỤC PERMISSION THEO CHUẨN SRS
## HỆ THỐNG WEB QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP UTC2 (UTC2-DAMS)

> **Căn cứ tài liệu:** Mục 2.3 và Chương 6 tài liệu [`docs/SRS_Quan_ly_do_an_UTC2.md`](SRS_Quan_ly_do_an_UTC2.md).  
> **Nguyên tắc thiết kế:** Hệ thống gom 8 tác nhân nghiệp vụ thành **4 Role kỹ thuật chính** (`STUDENT`, `LECTURER`, `STAFF`, `ADMIN`), kết hợp với **Chức danh (Position / Scope)** và **Quan hệ dữ liệu thực tế**.

---

## 👥 1. CƠ CHẾ 4 ROLE KỸ THUẬT & ÁNH XẠ TÁC NHÂN NGHIỆP VỤ

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   MÔ HÌNH PHÂN QUYỀN 4 ROLE CHÍNH (SRS MỤC 2.3)                 │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 1. STUDENT (Sinh viên)                                                           │
│    -> Gán cho toàn bộ sinh viên làm đồ án. Scope: Dữ liệu của chính mình.        │
│                                                                                  │
│ 2. LECTURER (Giảng viên)                                                         │
│    -> Giảng viên thường / GVHD: Qua quan hệ ma_gvhd trong bản ghi đăng ký.       │
│    -> Thành viên Hội đồng: Qua bảng phân công thành viên hội đồng.               │
│    -> Trưởng Bộ môn (TBM): Giảng viên + Chức danh HEAD_OF_DEPARTMENT (theo Bộ môn)│
│    -> Ban Chủ nhiệm Khoa (BCN): Giảng viên + Chức danh FACULTY_DEAN (theo Khoa) │
│                                                                                  │
│ 3. STAFF (Nhân viên quản lý)                                                     │
│    -> Giáo vụ Khoa: Chức danh ACADEMIC_AFFAIRS gắn với Khoa.                     │
│    -> Phòng Đào tạo: Chức danh TRAINING_DEPT phạm vi Toàn trường.                │
│    -> Ban Giám đốc: Chức danh UNIVERSITY_BOARD phạm vi Toàn trường (Chỉ đọc).   │
│                                                                                  │
│ 4. ADMIN (Quản trị hệ thống)                                                     │
│    -> Vận hành kỹ thuật, tài khoản, phân quyền, cấu hình, sao lưu, audit log.   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Bảng Ánh xạ 8 Tác nhân Nghiệp vụ $\leftrightarrow$ 4 Role Kỹ thuật:

| STT | Tác Nhân Nghiệp Vụ | Role Kỹ Thuật Chính | Cách Xác Định Quyền Hạn Trong Hệ Thống | Phạm Vi Tác Động (Scope) |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Sinh viên** | `STUDENT` | Role riêng | `OWNER` (Cá nhân sinh viên) |
| **2** | **Giảng viên hướng dẫn** | `LECTURER` | Role `LECTURER` + Quan hệ `ma_gvhd` trong `registrations` | `OWNER_ADVISOR` (Đề tài mình HD) |
| **3** | **Thành viên Hội đồng** | `LECTURER` | Role `LECTURER` + Bản ghi trong `council_members` | `ASSIGNED_COUNCIL` (HĐ mình chấm) |
| **4** | **Trưởng Bộ môn** | `LECTURER` | Role `LECTURER` + Chức danh `HEAD_OF_DEPARTMENT` | `DEPARTMENT` (Bộ môn mình phụ trách) |
| **5** | **Ban Chủ nhiệm Khoa** | `LECTURER` | Role `LECTURER` + Chức danh `FACULTY_DEAN` | `FACULTY` (Toàn Khoa) |
| **6** | **Giáo vụ Khoa** | `STAFF` | Role `STAFF` + Chức danh `ACADEMIC_AFFAIRS` (Khoa) | `FACULTY` (Toàn Khoa) |
| **7** | **Phòng Đào tạo / BGĐ** | `STAFF` | Role `STAFF` + Chức danh `TRAINING_DEPT` / `BOARD` | `GLOBAL` (Toàn trường, Giám sát/Xem) |
| **8** | **Quản trị hệ thống** | `ADMIN` | Role riêng `ADMIN` | `SYSTEM` (Vận hành kỹ thuật) |

---

## 📋 2. DANH MỤC MÃ PERMISSION CHUẨN HÓA (45 PERMISSIONS)

Quy ước: `<module>:<action>`

### Nhóm 1: Xác thực & Quản trị Hệ thống
* `auth:login`: Đăng nhập hệ thống.
* `auth:change_password`: Đổi mật khẩu tài khoản.
* `roles:manage`: Quản lý danh mục vai trò & gán quyền.
* `users:read`: Xem danh sách tài khoản.
* `users:manage`: Tạo/khóa tài khoản, gán chức danh & phạm vi quản lý.
* `profiles:read`: Xem hồ sơ học thuật sinh viên, giảng viên theo phạm vi.
* `profiles:manage`: Quản lý hồ sơ SV, GV và import dữ liệu hàng loạt.
* `audit_logs:read`: Xem nhật ký hệ thống ghi vết CUD.
* `settings:manage`: Cấu hình tham số động (ngưỡng đạo văn, công thức điểm).

### Nhóm 2: Danh mục Học thuật
* `academic:read`: Tra cứu Khoa, Ngành, Bộ môn, Lớp, Học kỳ.
* `academic:manage`: Thêm/sửa/xóa Khoa, Ngành, Bộ môn, Lớp.
* `semesters:manage`: Cấu hình học kỳ, mốc hạn đăng ký, nộp bài, bảo vệ.
* `quotas:manage`: Quản lý chỉ tiêu định mức hướng dẫn đồ án theo học kỳ.

### Nhóm 3: Phân hệ 1.0 – Quản lý Đề tài
* `topics:read_approved`: Tra cứu danh sách đề tài đã duyệt (Công khai).
* `topics:read_all`: Xem toàn bộ đề tài theo phạm vi quản lý (Bộ môn / Khoa).
* `topics:propose`: Giảng viên tạo đề xuất đề tài mới (Check định mức BR-02).
* `topics:update_draft`: Sửa/xóa đề tài nháp của chính mình.
* `topics:submit_review`: Gửi đề tài lên Trưởng bộ môn thẩm định.
* `topics:review_department`: Trưởng bộ môn thẩm định & duyệt cấp 1 (BR-04).
* `topics:approve_dean`: Ban chủ nhiệm Khoa phê duyệt ban hành cấp 2 (BR-04).
* `topics:export`: Xuất danh mục đề tài ra Excel/PDF.

### Nhóm 4: Phân hệ 2.0 – Đăng ký Đề tài
* `registrations:register`: Sinh viên đăng ký đề tài (Check GPA $\ge 2.0$, tín chỉ BR-01).
* `registrations:cancel`: Sinh viên hủy đề tài trong hạn cho phép.
* `registrations:read_self`: Sinh viên xem hồ sơ đồ án của chính mình.
* `registrations:read_scope`: Xem danh sách đăng ký theo phạm vi (HD / Bộ môn / Khoa).
* `registrations:request_change`: Nộp đơn xin đổi đề tài / đổi GVHD muộn (BR-03).
* `registrations:approve_change`: BCN Khoa phê duyệt đơn đổi đề tài (BR-03).

### Nhóm 5: Phân hệ 3.0 – Theo dõi Tiến độ
* `progress:submit_report`: Sinh viên nộp báo cáo tuần $n$ (BR-05).
* `progress:update_report`: Sinh viên sửa báo cáo tuần trong hạn.
* `progress:review`: GVHD nhận xét tiến độ & đánh giá mức độ hoàn thành (BR-05).
* `progress:read_reports`: Xem lịch sử báo cáo tuần & nhận xét.
* `progress:view_warnings`: Xem danh sách SV bị cảnh báo chậm tiến độ ($\ge 2$ tuần).

### Nhóm 6: Giai đoạn 4 – Báo cáo Toàn văn & Đạo văn
* `thesis_reports:upload`: Sinh viên nộp file báo cáo toàn văn (.pdf/.docx).
* `thesis_reports:check_plagiarism`: Kích hoạt quét trùng lặp N-gram.
* `thesis_reports:view_plagiarism`: Xem % và chi tiết đoạn trùng lặp (BR-06).
* `thesis_reports:qualify_defense`: GVHD xác nhận ĐỦ / KHÔNG ĐỦ điều kiện bảo vệ (BR-06).

### Nhóm 7: Phân hệ 4.0 – Hội đồng & Lịch Bảo vệ
* `councils:read`: Tra cứu thông tin Hội đồng, phòng, lịch bảo vệ.
* `councils:manage_schedule`: Giáo vụ Khoa lập HĐ, xếp ngày, giờ, phòng (Check BR-07).
* `councils:propose_members`: Trưởng bộ môn đề xuất giảng viên tham gia HĐ.
* `councils:approve_members`: BCN Khoa phê duyệt quyết định thành lập HĐ.
* `councils:assign_students`: Giáo vụ Khoa phân công SV vào Hội đồng bảo vệ.
* `councils:export_decision`: Xuất quyết định thành lập HĐ & biên bản PDF.

### Nhóm 8: Phân hệ 5.0 – Chấm điểm, Rubric & Phúc khảo
* `rubrics:manage`: Thiết lập bộ tiêu chí chấm điểm (Check BR-08 Tổng $= 100\%$).
* `scores:input_advisor`: GVHD nhập điểm quá trình.
* `scores:input_reviewer`: GVPB nhập điểm phản biện.
* `scores:input_council`: Thành viên HĐ nhập điểm tiêu chí Rubric.
* `scores:lock`: Khóa phiếu điểm cá nhân sau khi nộp (BR-09).
* `scores:unlock`: BCN Khoa mở khóa phiếu điểm có ghi vết (BR-09).
* `scores:calculate_final`: Tính điểm tổng kết theo công thức (BR-10, BR-11).
* `scores:publish`: Giáo vụ Khoa công bố điểm chính thức.
* `complaints:create`: Sinh viên nộp đơn phúc khảo điểm (BR-12).
* `complaints:resolve`: BCN Khoa cập nhật điểm & kết quả sau phúc khảo (BR-12).
* `statistics:view`: Xem Dashboard thống kê và xuất báo cáo tổng hợp.

---

## 🎯 3. BẢNG MA TRẬN PHÂN QUYỀN THEO 4 ROLE KỸ THUẬT & CHỨC DANH

> **Quy ước:**
> * `✓ (All)`: Toàn quyền trên phạm vi Khoa / Hệ thống.
> * `✓ (Dept)`: Quyền áp dụng trong Bộ môn được phân công.
> * `✓ (Own)`: Quyền áp dụng đối với chính mình (đề tài mình hướng dẫn / hồ sơ của mình).
> * `✓ (Assigned)`: Quyền áp dụng đối với Hội đồng / Sinh viên được phân công chấm.
> * `-`: Không có quyền.

| Danh Mục Quyền Hạn | Mã Permission | Role 1: `STUDENT` | Role 2: `LECTURER` | | | Role 3: `STAFF` | | Role 4: `ADMIN` |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| | | **Sinh viên** | **Giảng viên (GVHD/HĐ)** | **Trưởng Bộ Môn (`HEAD_OF_DEPT`)** | **Ban Chủ Nhiệm (`FACULTY_DEAN`)** | **Giáo Vụ Khoa (`ACADEMIC_AFFAIRS`)** | **Phòng Đào Tạo / BGĐ** | **Quản Trị Hệ Thống** |
| **Quản trị hệ thống** | `users:manage` | - | - | - | - | - | - | **✓ (All)** |
| | `roles:manage` | - | - | - | - | - | - | **✓ (All)** |
| | `profiles:read` | - | - | **✓ (Dept)** | **✓ (All)** | **✓ (All)** | **✓ (All)** | **✓ (All)** |
| | `profiles:manage` | - | - | - | - | **✓ (All)** | **✓ (All)** | **✓ (All)** |
| | `audit_logs:read` | - | - | - | - | - | - | **✓ (All)** |
| | `settings:manage` | - | - | - | - | - | - | **✓ (All)** |
| **Danh mục học thuật** | `academic:manage` | - | - | - | - | - | **✓ (All)** | **✓ (All)** |
| | `semesters:manage` | - | - | - | - | **✓ (All)** | **✓ (All)** | **✓ (All)** |
| | `quotas:manage` | - | - | **✓ (Dept)** | **✓ (All)** | **✓ (All)** | - | **✓ (All)** |
| **Quản lý đề tài (1.0)** | `topics:read_approved` | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** |
| | `topics:propose` | - | **✓ (Own)** | **✓ (Own)** | **✓ (Own)** | - | - | - |
| | `topics:update_draft` | - | **✓ (Own)** | **✓ (Own)** | **✓ (Own)** | - | - | - |
| | `topics:review_department` | - | - | **✓ (Dept)** | - | - | - | - |
| | `topics:approve_dean` | - | - | - | **✓ (All)** | - | - | **✓ (All)** |
| | `topics:export` | - | - | **✓ (Dept)** | **✓ (All)** | **✓ (All)** | **✓ (All)** | **✓ (All)** |
| **Đăng ký đề tài (2.0)** | `registrations:register` | **✓ (Own)** | - | - | - | - | - | - |
| | `registrations:cancel` | **✓ (Own)** | - | - | - | - | - | - |
| | `registrations:read_scope` | **✓ (Own)** | **✓ (Own)** | **✓ (Dept)** | **✓ (All)** | **✓ (All)** | **✓ (All)** | **✓ (All)** |
| | `registrations:approve_change` | - | - | - | **✓ (All)** | - | - | **✓ (All)** |
| **Theo dõi tiến độ (3.0)** | `progress:submit_report` | **✓ (Own)** | - | - | - | - | - | - |
| | `progress:review` | - | **✓ (Own)** | **✓ (Own)** | **✓ (Own)** | - | - | - |
| | `progress:view_warnings` | - | **✓ (Own)** | **✓ (Dept)** | **✓ (All)** | **✓ (All)** | **✓ (All)** | **✓ (All)** |
| **Báo cáo & Đạo văn** | `thesis_reports:upload` | **✓ (Own)** | - | - | - | - | - | - |
| | `thesis_reports:check_plagiarism`| **✓ (Own)** | **✓ (Own)** | - | - | **✓ (All)** | - | **✓ (All)** |
| | `thesis_reports:qualify_defense` | - | **✓ (Own)** | **✓ (Own)** | **✓ (Own)** | - | - | - |
| **Hội đồng & Lịch BV (4.0)**| `councils:manage_schedule` | - | - | - | - | **✓ (All)** | - | **✓ (All)** |
| | `councils:propose_members` | - | - | **✓ (Dept)** | - | - | - | - |
| | `councils:approve_members` | - | - | - | **✓ (All)** | - | - | **✓ (All)** |
| | `councils:assign_students` | - | - | - | - | **✓ (All)** | - | **✓ (All)** |
| **Chấm điểm & Rubric (5.0)**| `rubrics:manage` | - | - | - | **✓ (All)** | **✓ (All)** | - | **✓ (All)** |
| | `scores:input_advisor` | - | **✓ (Own HD)** | - | - | - | - | - |
| | `scores:input_reviewer` | - | **✓ (Assigned PB)**| - | - | - | - | - |
| | `scores:input_council` | - | **✓ (Assigned HĐ)**| - | - | - | - | - |
| | `scores:lock` | - | **✓ (Own)** | **✓ (Own)** | **✓ (Own)** | - | - | - |
| | `scores:unlock` | - | - | - | **✓ (All)** | - | - | **✓ (All)** |
| | `scores:calculate_final` | - | - | - | - | **✓ (All)** | - | **✓ (All)** |
| | `scores:publish` | - | - | - | - | **✓ (All)** | - | **✓ (All)** |
| **Phúc khảo điểm** | `complaints:create` | **✓ (Own)** | - | - | - | - | - | - |
| | `complaints:resolve` | - | - | - | **✓ (All)** | - | - | **✓ (All)** |
| **Thống kê & Dashboard** | `statistics:view` | - | **✓ (Own)** | **✓ (Dept)** | **✓ (All)** | **✓ (All)** | **✓ (All)** | **✓ (All)** |

---
*Tài liệu Ma trận Phân quyền 4 Role Chuẩn SRS UTC2-DAMS – Ban hành Tháng 10/2026.*
