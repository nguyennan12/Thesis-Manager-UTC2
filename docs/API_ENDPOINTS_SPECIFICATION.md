# ĐẶC TẢ DANH MỤC ENDPOINTS RESTFUL API (API SPECIFICATION)
## HỆ THỐNG WEB QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP UTC2 (UTC2-DAMS)

> **Tiêu chuẩn thiết kế:** RESTful API Best Practices, OpenAPI 3.0 (Swagger / Scalar UI)  
> **Phiên bản API:** `v1` (`/api/v1/*`)  
> **Cơ chế xác thực:** JWT Bearer Token & HttpOnly Cookie (`access_token`, `refresh_token`)  
> **Quy chuẩn Response:** Uniform `ApiResponse<T>` `{ success, statusCode, message, data, meta?, timestamp }`  
> **Phân quyền:** Dynamic RBAC (Roles + Granular Permissions + Scope Khoa/Bộ môn)

---

## 📌 BẢNG TỔNG HỢP MA TRẬN PHÂN HỆ VÀ SỐ LƯỢNG ENDPOINTS

| STT | Module Nghiệp Vụ | Prefix URL | Số Endpoints | Tác Nhân Phục Vụ |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **Xác thực & Dynamic RBAC** | `/api/v1/auth`, `/api/v1/roles`, `/api/v1/permissions` | **10** | Mọi người dùng, Admin |
| **2** | **Quản lý Tài khoản & Hồ sơ** | `/api/v1/users`, `/api/v1/students`, `/api/v1/lecturers` | **8** | Admin, Giáo vụ, Giảng viên, Sinh viên |
| **3** | **Danh mục Học thuật** | `/api/v1/academic` | **10** | Admin, Giáo vụ, Ban chủ nhiệm Khoa |
| **4** | **Phân hệ 1.0 – Quản lý Đề tài** | `/api/v1/topics` | **9** | Sinh viên, GVHD, Trưởng bộ môn, BCN Khoa |
| **5** | **Phân hệ 2.0 – Đăng ký Đề tài** | `/api/v1/registrations` | **7** | Sinh viên, GVHD, BCN Khoa |
| **6** | **Phân hệ 3.0 – Theo dõi Tiến độ** | `/api/v1/progress` | **5** | Sinh viên, GVHD, Trưởng bộ môn |
| **7** | **Giai đoạn 4 – Báo cáo & Đạo văn** | `/api/v1/thesis-reports` | **4** | Sinh viên, GVHD, Hệ thống quét trùng lặp |
| **8** | **Phân hệ 4.0 – Hội đồng & Lịch BV** | `/api/v1/councils` | **8** | Giáo vụ Khoa, Trưởng BM, BCN Khoa, Thành viên HĐ |
| **9** | **Phân hệ 5.0 – Chấm điểm & Rubric** | `/api/v1/grading` | **8** | Thành viên HĐ, GVHD, GVPB, BCN Khoa, Giáo vụ |
| **10** | **Khiếu nại & Phúc khảo** | `/api/v1/complaints` | **4** | Sinh viên, BCN Khoa, Hội đồng phúc khảo |
| **11** | **Báo cáo Thống kê** | `/api/v1/statistics` | **5** | BCN Khoa, Ban Giám đốc, Giáo vụ |
| **12** | **Hệ thống Thông báo** | `/api/v1/notifications` | **4** | Mọi người dùng |
| **13** | **Nhật ký Hệ thống (Audit Log)** | `/api/v1/audit-logs` | **2** | Admin |
| **14** | **Cấu hình Tham số Động** | `/api/v1/system-settings` | **3** | Admin, BCN Khoa |
| **TỔNG**| **14 Modules Nghiệp vụ** | | **87** | **Toàn bộ 8 Nhóm tác nhân theo SRS** |

---

## 🔐 1. MODULE XÁC THỰC & DYNAMIC RBAC (`/api/v1/auth`, `/roles`, `/permissions`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền (Roles / Permissions) | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/login` | Đăng nhập hệ thống (cấp phát JWT + Cookie) | Public | `LoginDto` (`username`, `password`) | `200 OK` |
| `POST` | `/api/v1/auth/refresh` | Cấp lại Access Token từ Refresh Token | Public (Cookie / DTO) | `RefreshTokenDto` (`refreshToken?`) | `200 OK` |
| `POST` | `/api/v1/auth/logout` | Đăng xuất & hủy phiên làm việc | Authenticated | None | `200 OK` |
| `GET` | `/api/v1/auth/me` | Lấy thông tin tài khoản hiện tại + Roles & Permissions | Authenticated | None | `200 OK` |
| `PATCH`| `/api/v1/auth/change-password`| Đổi mật khẩu tài khoản | Authenticated | `ChangePasswordDto` (`oldPass`, `newPass`) | `200 OK` |
| `GET` | `/api/v1/roles` | Lấy danh sách các vai trò trong hệ thống | `ADMIN`, `roles.read` | `QueryDto` (`search`, `page`, `limit`) | `200 OK` |
| `POST` | `/api/v1/roles` | Tạo mới vai trò tùy chỉnh | `ADMIN`, `roles.create` | `CreateRoleDto` (`code`, `name`, `desc`) | `201 Created` |
| `PUT` | `/api/v1/roles/:id` | Cập nhật vai trò | `ADMIN`, `roles.update` | `UpdateRoleDto` (`name`, `description`) | `200 OK` |
| `GET` | `/api/v1/permissions` | Lấy toàn bộ danh mục quyền hệ thống | `ADMIN`, `permissions.read` | `QueryDto` (`module?`) | `200 OK` |
| `POST` | `/api/v1/roles/:id/permissions` | Gán danh sách quyền cho vai trò | `ADMIN`, `roles.manage_permissions` | `AssignPermissionsDto` (`permissionIds[]`) | `200 OK` |

---

## 👥 2. MODULE QUẢN LÝ TÀI KHOẢN & HỒ SƠ (`/api/v1/users`, `/students`, `/lecturers`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền (Roles / Permissions) | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/users` | Danh sách tài khoản người dùng | `ADMIN`, `ACADEMIC_AFFAIRS` | `UserQueryDto` (`role`, `status`, `page`) | `200 OK` |
| `POST` | `/api/v1/users` | Tạo tài khoản người dùng thủ công | `ADMIN`, `users.create` | `CreateUserDto` (`username`, `email`, `role`) | `201 Created` |
| `GET` | `/api/v1/users/:id` | Xem chi tiết hồ sơ tài khoản | `ADMIN`, `users.read` | None | `200 OK` |
| `PATCH`| `/api/v1/users/:id/status` | Khóa / Mở khóa tài khoản | `ADMIN`, `users.manage_status` | `UpdateStatusDto` (`isActive: boolean`) | `200 OK` |
| `POST` | `/api/v1/users/:id/roles` | Gán vai trò & Phạm vi Scope (Khoa/Bộ môn) | `ADMIN`, `users.assign_role` | `AssignAccountRoleDto` (`roleId`, `scopeType`, `scopeId`) | `200 OK` |
| `GET` | `/api/v1/students` | Danh sách hồ sơ sinh viên, lớp, GPA, tín chỉ | `ADMIN`, `ACADEMIC_AFFAIRS`, `LECTURER` | `StudentQueryDto` (`classId`, `status`) | `200 OK` |
| `GET` | `/api/v1/lecturers` | Danh sách giảng viên, bộ môn, định mức hướng dẫn | Authenticated | `LecturerQueryDto` (`departmentId`) | `200 OK` |
| `POST` | `/api/v1/users/import-excel` | Nhập danh sách sinh viên / giảng viên từ Excel | `ADMIN`, `ACADEMIC_AFFAIRS` | `multipart/form-data` (`file`) | `200 OK` |

---

## 🏫 3. MODULE DANH MỤC HỌC THUẬT (`/api/v1/academic`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/academic/faculties` | Danh sách Khoa đào tạo | Authenticated | None | `200 OK` |
| `POST` | `/api/v1/academic/faculties` | Tạo mới Khoa | `ADMIN` | `CreateFacultyDto` (`code`, `name`) | `201 Created` |
| `GET` | `/api/v1/academic/majors` | Danh sách Ngành đào tạo | Authenticated | `MajorQueryDto` (`facultyId`) | `200 OK` |
| `POST` | `/api/v1/academic/majors` | Tạo mới Ngành đào tạo | `ADMIN` | `CreateMajorDto` (`code`, `name`, `facultyId`) | `201 Created` |
| `GET` | `/api/v1/academic/departments` | Danh sách Bộ môn trực thuộc Khoa | Authenticated | `DepartmentQueryDto` (`facultyId`) | `200 OK` |
| `POST` | `/api/v1/academic/departments` | Tạo mới Bộ môn | `ADMIN` | `CreateDepartmentDto` (`code`, `name`, `headLecturerId`) | `201 Created` |
| `GET` | `/api/v1/academic/classes` | Danh sách Lớp sinh viên | Authenticated | `ClassQueryDto` (`majorId`, `academicYear`) | `200 OK` |
| `GET` | `/api/v1/academic/semesters` | Danh sách Học kỳ & Mốc thời gian đồ án | Authenticated | `SemesterQueryDto` (`academicYear`) | `200 OK` |
| `GET` | `/api/v1/academic/semesters/current` | Lấy thông tin Học kỳ hiện tại đang mở | Authenticated | None | `200 OK` |
| `POST` | `/api/v1/academic/semesters` | Thiết lập Học kỳ mới & Mốc hạn (ĐK, nộp bài, BV) | `ADMIN`, `ACADEMIC_AFFAIRS` | `CreateSemesterDto` (`code`, `dates`, `deadlines`) | `201 Created` |

---

## 📚 4. PHÂN HỆ 1.0: QUẢN LÝ ĐỀ TÀI (`/api/v1/topics`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền & BR | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/topics` | Tra cứu danh sách đề tài (Data Scoping theo role) | Authenticated | `TopicQueryDto` (`majorId`, `status`, `semesterId`) | `200 OK` |
| `GET` | `/api/v1/topics/:id` | Xem chi tiết đề tài (Mục tiêu, Yêu cầu, GVHD) | Authenticated | None | `200 OK` |
| `POST` | `/api/v1/topics` | Giảng viên tạo đề xuất đề tài mới | `GIANG_VIEN` (Check BR-02 định mức) | `CreateTopicDto` (`titleVi`, `titleEn`, `type`, `maxStudents`, `majorId`) | `201 Created` |
| `PUT` | `/api/v1/topics/:id` | Cập nhật thông tin đề tài (khi DRAFT/PENDING) | `GIANG_VIEN` (Chính chủ) | `UpdateTopicDto` | `200 OK` |
| `DELETE`| `/api/v1/topics/:id` | Xóa đề tài nháp | `GIANG_VIEN` (Chính chủ) | None | `204 No Content` |
| `PATCH`| `/api/v1/topics/:id/submit` | Gửi đề tài lên Trưởng bộ môn thẩm định | `GIANG_VIEN` | None | `200 OK` |
| `PATCH`| `/api/v1/topics/:id/review` | Trưởng bộ môn thẩm định cấp 1; duyệt chuyển sang chờ BCN Khoa | `HEAD_OF_DEPARTMENT` (BR-04) | `ReviewTopicDto` (`isApproved: boolean`, `rejectionReason?`) | `200 OK` |
| `PATCH`| `/api/v1/topics/:id/dean-approval` | Ban Chủ nhiệm Khoa phê duyệt ban hành cấp 2 | `FACULTY_DEAN` (BR-04) | `ReviewTopicDto` (`isApproved: boolean`, `rejectionReason?`) | `200 OK` |
| `GET` | `/api/v1/topics/export` | Xuất danh mục đề tài đã duyệt ra Excel/PDF | `GIAO_VU`, `TRUONG_BO_MON`, `BCN` | `TopicExportQueryDto` (`semesterId`, `format`) | `200 OK` |

---

## 📝 5. PHÂN HỆ 2.0: ĐĂNG KÝ ĐỀ TÀI (`/api/v1/registrations`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền & BR | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/registrations` | Danh sách đăng ký thực hiện đồ án | `GIAO_VU`, `GIANG_VIEN`, `ADMIN` | `RegistrationQueryDto` (`semesterId`, `status`) | `200 OK` |
| `GET` | `/api/v1/registrations/my-registration` | Sinh viên xem hồ sơ đồ án hiện tại của mình | `SINH_VIEN` | None | `200 OK` |
| `GET` | `/api/v1/registrations/:id` | Xem chi tiết hồ sơ đồ án (tiến độ, điểm, file) | Authenticated (Có phân quyền xem) | None | `200 OK` |
| `POST` | `/api/v1/registrations` | Sinh viên đăng ký đề tài | `SINH_VIEN` (Check BR-01: Tín chỉ, GPA $\ge 2.0$) | `CreateRegistrationDto` (`topicId`) | `201 Created` |
| `DELETE`| `/api/v1/registrations/:id/cancel` | Sinh viên hủy đăng ký (trong hạn đăng ký) | `SINH_VIEN` (Chính chủ) | None | `200 OK` |
| `POST` | `/api/v1/registrations/change-requests` | Sinh viên nộp đơn xin đổi đề tài / đổi GVHD muộn | `SINH_VIEN` (BR-03) | `CreateChangeRequestDto` (`type`, `reason`, `newData`) | `201 Created` |
| `PATCH`| `/api/v1/registrations/change-requests/:id/review` | Ban chủ nhiệm Khoa phê duyệt đơn đổi đề tài | `BAN_CHU_NHIEM` (BR-03) | `ReviewChangeRequestDto` (`isApproved`, `reason?`) | `200 OK` |

---

## 📈 6. PHÂN HỆ 3.0: THEO DÕI TIẾN ĐỘ (`/api/v1/progress`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền & BR | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/progress/registrations/:regId/reports` | Xem danh sách báo cáo tiến độ tuần | `SINH_VIEN`, `GIANG_VIEN` (GVHD), `TBM` | None | `200 OK` |
| `POST` | `/api/v1/progress/registrations/:regId/reports` | Sinh viên nộp báo cáo tuần $n$ | `SINH_VIEN` (Check hạn tuần BR-05) | `CreateProgressReportDto` (`weekNumber`, `tasks`, `plan`, `fileUrl?`) | `201 Created` |
| `PUT` | `/api/v1/progress/reports/:id` | Cập nhật báo cáo tuần trong thời hạn | `SINH_VIEN` (Chính chủ) | `UpdateProgressReportDto` | `200 OK` |
| `PATCH`| `/api/v1/progress/reports/:id/review` | GVHD nhận xét & đánh giá mức độ hoàn thành | `GIANG_VIEN` (GVHD BR-05) | `ReviewProgressDto` (`feedback`, `completionLevel`) | `200 OK` |
| `GET` | `/api/v1/progress/warnings` | Danh sách sinh viên chậm tiến độ ($\ge 2$ tuần) | `GIANG_VIEN`, `TRUONG_BO_MON`, `GIAO_VU` | `ProgressWarningQueryDto` (`semesterId`) | `200 OK` |

---

## 📑 7. GIAI ĐOẠN 4: BÁO CÁO TOÀN VĂN & KIỂM TRA TRÙNG LẶP (`/api/v1/thesis-reports`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền & BR | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/thesis-reports/upload` | Nộp file toàn văn đồ án (.pdf/.docx) lên MinIO | `SINH_VIEN` | `multipart/form-data` (`file`, `registrationId`) | `200 OK` |
| `POST` | `/api/v1/thesis-reports/:regId/check-plagiarism` | Đẩy tác vụ quét trùng lặp vào BullMQ Queue | `SINH_VIEN`, `GIANG_VIEN`, `GIAO_VU` | None | `202 Accepted` |
| `GET` | `/api/v1/thesis-reports/:regId/plagiarism-result` | Xem % trùng lặp & chi tiết đoạn trùng (BR-06) | Authenticated | None | `200 OK` |
| `PATCH`| `/api/v1/thesis-reports/:regId/qualify-defense` | GVHD đánh giá sinh viên ĐỦ / KHÔNG ĐỦ điều kiện BV | `GIANG_VIEN` (GVHD BR-06) | `QualifyDefenseDto` (`isQualified: boolean`, `notes?`) | `200 OK` |

---

## ⚖️ 8. PHÂN HỆ 4.0: HỘI ĐỒNG & LỊCH BẢO VỆ (`/api/v1/councils`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền & BR | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/councils` | Danh sách Hội đồng bảo vệ theo học kỳ/khoa | Authenticated | `CouncilQueryDto` (`semesterId`, `departmentId`) | `200 OK` |
| `GET` | `/api/v1/councils/:id` | Xem chi tiết HĐ, thành viên, danh sách SV | Authenticated | None | `200 OK` |
| `POST` | `/api/v1/councils` | Tạo mới Hội đồng (Ngày, Giờ, Phòng bảo vệ) | `GIAO_VU` (Check BR-07 cấm trùng lịch) | `CreateCouncilDto` (`code`, `name`, `date`, `room`, `time`) | `201 Created` |
| `PUT` | `/api/v1/councils/:id` | Sửa thông tin Hội đồng | `GIAO_VU` (Check BR-07) | `UpdateCouncilDto` | `200 OK` |
| `DELETE`| `/api/v1/councils/:id` | Hủy Hội đồng (khi chưa bảo vệ) | `GIAO_VU` | None | `204 No Content` |
| `POST` | `/api/v1/councils/:id/members` | Phân công thành viên HĐ (Chủ tịch, Thư ký, UV, PB) | `TRUONG_BO_MON`, `GIAO_VU` (BR-07) | `AssignCouncilMembersDto` (`members: [{ lecturerId, role }]`) | `200 OK` |
| `POST` | `/api/v1/councils/:id/assign-registrations` | Phân công sinh viên vào Hội đồng bảo vệ | `GIAO_VU` | `AssignRegistrationsDto` (`registrationIds[]`) | `200 OK` |
| `GET` | `/api/v1/councils/:id/export-decision` | Xuất Quyết định thành lập HĐ & Biên bản PDF | `GIAO_VU`, `BAN_CHU_NHIEM` | None | `200 OK` |

---

## 📊 9. PHÂN HỆ 5.0: CHẤM ĐIỂM, RUBRIC & TỔNG KẾT (`/api/v1/grading`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền & BR | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/grading/rubrics` | Danh sách Bộ tiêu chí đánh giá (Rubrics) | Authenticated | `RubricQueryDto` (`topicType`, `year`) | `200 OK` |
| `POST` | `/api/v1/grading/rubrics` | Tạo bộ tiêu chí chấm điểm mới | `GIAO_VU`, `BCN` (Check BR-08 Tổng $= 100\%$) | `CreateRubricSetDto` (`name`, `type`, `criteria: [{ code, weight }]`) | `201 Created` |
| `GET` | `/api/v1/grading/score-sheet/:regId` | Lấy phiếu điểm chi tiết của sinh viên | Authenticated | None | `200 OK` |
| `POST` | `/api/v1/grading/score-sheet/submit` | Giảng viên nhập điểm tiêu chí & Khóa phiếu điểm | `GIANG_VIEN` (Thành viên HĐ/GVHD - BR-09) | `SubmitScoresDto` (`regId`, `scores: [{ criterionId, score, notes }]`) | `200 OK` |
| `PATCH`| `/api/v1/grading/score-sheet/:id/unlock` | Ban chủ nhiệm Khoa mở khóa phiếu điểm có ghi vết | `BAN_CHU_NHIEM` (BR-09) | `UnlockScoreSheetDto` (`reason`) | `200 OK` |
| `POST` | `/api/v1/grading/calculate-final/:regId` | Tính điểm tổng kết theo công thức chuẩn | `GIAO_VU`, `BCN` (BR-10, BR-11) | None | `200 OK` |
| `PATCH`| `/api/v1/grading/publish-grades` | Giáo vụ Khoa công bố điểm chính thức | `GIAO_VU`, `BAN_CHU_NHIEM` | `PublishGradesDto` (`semesterId`, `majorId`) | `200 OK` |
| `GET` | `/api/v1/grading/export-grade-book` | Xuất bảng điểm tổng kết đồ án toàn khóa (Excel) | `GIAO_VU`, `BAN_CHU_NHIEM` | `GradeBookQueryDto` (`semesterId`) | `200 OK` |

---

## ⚖️ 10. MODULE KHIẾU NẠI & PHÚC KHẢO ĐIỂM (`/api/v1/complaints`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền & BR | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/complaints` | Sinh viên gửi đơn khiếu nại / phúc khảo điểm | `SINH_VIEN` (BR-12) | `CreateGradeAppealDto` (`registrationId`, `reason`) | `201 Created` |
| `GET` | `/api/v1/complaints` | Danh sách đơn phúc khảo điểm theo học kỳ | `GIAO_VU`, `BAN_CHU_NHIEM` | `AppealQueryDto` (`semesterId`, `status`) | `200 OK` |
| `GET` | `/api/v1/complaints/:id` | Xem chi tiết đơn khiếu nại | `SINH_VIEN` (Chính chủ), `BCN` | None | `200 OK` |
| `PATCH`| `/api/v1/complaints/:id/resolve` | BCN Khoa cập nhật kết quả & điểm sau phúc khảo | `BAN_CHU_NHIEM` (BR-12) | `ResolveAppealDto` (`status`, `newScore?`, `notes`) | `200 OK` |

---

## 📈 11. MODULE BÁO CÁO THỐNG KÊ (`/api/v1/statistics`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/statistics/overview` | Dashboard số liệu tổng quan (SV, Đề tài, Điểm TB) | `BAN_CHU_NHIEM`, `BAN_GIAM_DOC`, `GIAO_VU` | `StatQueryDto` (`semesterId`, `facultyId?`) | `200 OK` |
| `GET` | `/api/v1/statistics/topics-by-department` | Thống kê số lượng đề tài theo Bộ môn & GVHD | `BAN_CHU_NHIEM`, `TRUONG_BO_MON` | `StatQueryDto` (`semesterId`) | `200 OK` |
| `GET` | `/api/v1/statistics/grades-distribution` | Phổ điểm & Tỷ lệ xếp loại (Xuất sắc, Giỏi, Khá, TB) | `BAN_CHU_NHIEM`, `GIAO_VU` | `StatQueryDto` (`semesterId`) | `200 OK` |
| `GET` | `/api/v1/statistics/advisor-workload` | Báo cáo tải định mức hướng dẫn của Giảng viên | `BAN_CHU_NHIEM`, `TRUONG_BO_MON` | `StatQueryDto` (`semesterId`) | `200 OK` |
| `GET` | `/api/v1/statistics/export-report` | Xuất báo cáo tổng kết học kỳ định dạng PDF / Excel | `BAN_CHU_NHIEM`, `GIAO_VU` | `StatExportDto` (`semesterId`, `format`) | `200 OK` |

---

## 🔔 12. MODULE THÔNG BÁO (`/api/v1/notifications`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/notifications` | Lấy danh sách thông báo của tài khoản hiện tại | Authenticated | `NotificationQueryDto` (`isRead?`, `page`) | `200 OK` |
| `PATCH`| `/api/v1/notifications/:id/read` | Đánh dấu một thông báo đã đọc | Authenticated (Chính chủ) | None | `200 OK` |
| `PATCH`| `/api/v1/notifications/read-all` | Đánh dấu toàn bộ thông báo đã đọc | Authenticated | None | `200 OK` |
| `POST` | `/api/v1/notifications/broadcast` | Quản trị viên gửi thông báo hệ thống toàn trường/khoa | `ADMIN`, `GIAO_VU` | `BroadcastNotificationDto` (`title`, `content`, `roleTarget?`) | `201 Created` |

---

## 📜 13. MODULE NHẬT KÝ HỆ THỐNG (`/api/v1/audit-logs`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền & BR | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/audit-logs` | Tra cứu nhật ký ghi vết thao tác CUD (BR-13) | `ADMIN`, `audit_logs.read` | `AuditLogQueryDto` (`action`, `actorId`, `dates`) | `200 OK` |
| `GET` | `/api/v1/audit-logs/entity/:entityType/:entityId` | Xem lịch sử chuyển trạng thái của hồ sơ/đề tài cụ thể | `ADMIN`, `BAN_CHU_NHIEM`, `GIAO_VU` | None | `200 OK` |

---

## ⚙️ 14. MODULE CẤU HÌNH THAM SỐ ĐỘNG (`/api/v1/system-settings`)

| Phương Thức | Endpoint URL | Mô Tả Chức Năng | Phân Quyền | Request Body / Query | Mã Trả Về |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/system-settings` | Lấy danh sách cấu hình hệ thống (ngưỡng đạo văn, hệ số $a/b/c$) | Authenticated | `SettingQueryDto` (`facultyId?`) | `200 OK` |
| `GET` | `/api/v1/system-settings/public` | Lấy các cấu hình công khai không cần đăng nhập | Public | None | `200 OK` |
| `PATCH`| `/api/v1/system-settings/:key` | Cập nhật tham số hệ thống | `ADMIN`, `BAN_CHU_NHIEM` | `UpdateSettingDto` (`value`, `description?`) | `200 OK` |

---
*Tài liệu Đặc tả API RESTful UTC2-DAMS – Ban hành Tháng 10/2026.*
