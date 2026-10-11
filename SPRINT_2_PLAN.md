# KẾ HOẠCH SPRINT 2 (BẢN HIỆU CHỈNH V2)
## Master Data, Hồ sơ người dùng, Phân quyền theo phạm vi, Import & Rubric
### HỆ THỐNG WEB QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP UTC2 (UTC2-DAMS)

> **Căn cứ:** `SRS_Quan_ly_do_an_UTC2.md`, `RBAC_PERMISSION_MATRIX.md`, `CODING_GUIDELINES_AND_ARCHITECTURE_RULES.md`.
> Bản này thay thế bản plan đầu tiên, sửa các điểm lệch với SRS, RBAC Matrix và Coding Guidelines. Các chỗ tài liệu không nói rõ được ghi ở Mục 0, kèm quyết định mặc định để xác nhận hoặc đổi.

---

## 0. QUYẾT ĐỊNH & GIẢ ĐỊNH CẦN XÁC NHẬN

| # | Vấn đề | Quyết định mặc định trong plan | Căn cứ |
|---|---|---|---|
| A1 | Quota hướng dẫn | **Theo từng GV, từng học kỳ**. Giá trị hiệu lực = quota riêng của kỳ, nếu không có thì dùng setting `advising.default_quota` (mặc định **5**). **Bỏ** cách tính 7/5/3 theo học vị. | SRS FR-DM-06; Guidelines BR-02 |
| A2 | Ai quản lý hồ sơ SV/GV | Tách quyền: `users:manage` chỉ dành cho ADMIN (tài khoản, chức danh). Thêm `profiles:*` cho Giáo vụ/Phòng Đào tạo quản lý hồ sơ và import. | SRS FR-AUT-06, FR-DM-02/03; RBAC Matrix |
| A3 | Nguồn sự thật của Trưởng bộ môn | **`userRoleScopes` (position `HEAD_OF_DEPARTMENT`)** là nguồn chính. `departments.headLecturerId` được đồng bộ trong cùng transaction. | RBAC Matrix |
| A4 | Import | Có bước **preview → confirm**; hỗ trợ `.xlsx` và `.csv` (không hỗ trợ `.xls`). Phạm vi: Sinh viên, Giảng viên, Lớp. | SRS FR-DM-03 |
| A5 | Mã BR | Dùng mã theo `CODING_GUIDELINES` (BR-02 quota, BR-08 rubric, BR-13 audit). SRS đánh số BR khác nên cần ghi chú ánh xạ trong code. | Hai tài liệu đang lệch số |

### 0.1. Đề xuất bổ sung RBAC Matrix (45 → 48 permission)

| Permission mới | Ai có (phạm vi) |
|---|---|
| `profiles:read` | ADMIN, TRAINING_DEPT (Global); ACADEMIC_AFFAIRS, FACULTY_DEAN (Faculty); HEAD_OF_DEPARTMENT (Dept) |
| `profiles:manage` | ADMIN, TRAINING_DEPT (Global); ACADEMIC_AFFAIRS (Faculty) |
| `quotas:manage` | ADMIN; ACADEMIC_AFFAIRS, FACULTY_DEAN (Faculty) |

Điều chỉnh thêm cho các permission hiện có:

- `academic:manage`: thêm `TRAINING_DEPT` (Global). `ACADEMIC_AFFAIRS` chỉ được quản lý **Lớp** thuộc khoa mình.
- `semesters:manage`: giữ ACADEMIC_AFFAIRS, TRAINING_DEPT, ADMIN.
- `rubrics:manage`: bổ sung `FACULTY_DEAN` (đã có trong Matrix, plan cũ bỏ sót).

> Cần cập nhật đồng thời `RBAC_PERMISSION_MATRIX.md`, `permissions.constant.ts` và `seed.ts`.

---

## 1. PHẠM VI & CHIA SPRINT

| | Sprint 2A | Sprint 2B |
|---|---|---|
| **Nội dung** | Academic, Semesters, Quota, Users, Positions, Students, Lecturers | Data Import, Rubrics |
| **Endpoints** | **44** | **12** |
| **Tổng** | **56 endpoints** | |

**Ngoài phạm vi Sprint 2:** cấu hình mốc theo khoa (FR-DM-08), đóng/chuyển học kỳ (FR-DM-09), cấu hình rubric riêng theo khoa, xuất Excel danh mục.

**Thứ tự phụ thuộc module (một chiều, không vòng):**
`Academic → Positions → Users → DataImport`; `Grading` độc lập (chỉ phụ thuộc Academic).

---

## 2. CÔNG NGHỆ & THƯ VIỆN

- **Đã có:** NestJS 11, Prisma 7, PostgreSQL 16, `@Global() RedisModule` (ioredis), `bcryptjs`, `class-validator`, `class-transformer`.
- **Thêm mới:** `exceljs` (đọc `.xlsx`), `csv-parse` (đọc `.csv`), `@types/multer`.

```bash
pnpm --filter backend add exceljs csv-parse
pnpm --filter backend add -D @types/multer
```

- **Hash mật khẩu khi import:** giữ `bcryptjs` (tránh lỗi build native trên Windows). **Hash ngoài transaction**, xử lý theo lô song song tối đa 8 tác vụ để không giữ transaction lâu.
- **Mật khẩu khởi tạo:** đọc từ biến môi trường `DEFAULT_INITIAL_PASSWORD`, không hard-code. Mọi tài khoản tạo hàng loạt có `mustChangePassword = true`.

---

## 3. THAY ĐỔI CƠ SỞ DỮ LIỆU

> Đối chiếu với `academic.prisma` và `grading.prisma` hiện có rồi chỉ bổ sung phần còn thiếu.

| Thay đổi | Mục đích |
|---|---|
| Bảng `lecturer_semester_quotas (lecturer_id, semester_id, max_quota)`, `UNIQUE(lecturer_id, semester_id)`, `CHECK(max_quota > 0)` | A1, FR-DM-06 |
| `accounts.must_change_password boolean default false` | Import an toàn |
| `semesters`: thêm `execution_start`, `execution_end` (thời gian thực hiện, cho phép nộp báo cáo tuần) nếu chưa có | FR-DM-04, BR-05 |
| `evaluation_criteria.weight` = `Decimal(5,2)`, `CHECK(weight > 0 AND weight <= 100)` | BR-08 chính xác |
| Unique index một bộ tiêu chí `is_active = true` cho mỗi `(project_type, academic_year)` | Tránh nhiều rubric active |
| `rubric_sets.parent_id` (nullable) hoặc `version` | Clone phiên bản |
| Setting `advising.default_quota = 5` trong `system_settings` | A1 |

---

## 4. KIẾN TRÚC & CẤU TRÚC THƯ MỤC

### 4.1. Hạ tầng dùng chung (làm trước)

```text
src/common/helpers/
├── data-scope.helper.ts        # Đọc userRoleScopes → ScopeFilter {GLOBAL | FACULTY ids | DEPARTMENT ids}
└── pagination.helper.ts
src/database/
└── transaction-manager.ts      # run(fn: (tx) => Promise<T>)
```

- **Tầng 3 Defense in Depth:** mọi repository của Student/Class/Lecturer nhận `ScopeFilter`. Giáo vụ Khoa A không bao giờ thấy dữ liệu Khoa B, kể cả khi gọi `GET /:id`.
- **Quy ước transaction:** Service không gọi Prisma. Service gọi `transactionManager.run(tx => repo.create(data, tx))`. Repository nhận tham số `tx?` tùy chọn.

### 4.2. Các module

```text
apps/backend/src/modules/
├── academic/        # Faculties, Majors, Departments, Classes, Semesters, LecturerQuotas
│   ├── controllers/ faculties | majors | departments | classes | semesters | quotas
│   ├── dto/
│   ├── helpers/     semester-timeline.helper.ts, quota-resolver.helper.ts
│   ├── repositories/
│   └── services/
│
├── positions/       # Chức danh & phạm vi (nguồn sự thật của TBM/BCN/Giáo vụ)
│   ├── controllers/positions.admin.controller.ts
│   ├── dto/
│   ├── repositories/
│   └── services/position-assignment.service.ts   # đồng bộ headLecturerId trong cùng transaction
│
├── users/           # Tài khoản + hồ sơ SV/GV
│   ├── controllers/ users.admin | students | lecturers
│   ├── dto/
│   ├── helpers/     account-factory.helper.ts      # tạo Account + AccountRole + scope
│   ├── repositories/
│   └── services/    users-management | students | lecturers | password-reset
│
├── data-import/     # Sprint 2B
│   ├── controllers/import.controller.ts
│   ├── dto/
│   ├── helpers/     excel-parser | csv-parser | file-guard (.helper.ts)
│   ├── processors/  student-import | lecturer-import | class-import (.processor.ts)
│   └── services/    import-preview | import-confirm | import-session-store
│
└── grading/         # Sprint 2B: Rubrics
    ├── controllers/rubrics.controller.ts
    ├── dto/
    ├── helpers/     rubric-weight.helper.ts
    ├── repositories/ rubric-sets | evaluation-criteria
    └── services/    rubrics.service.ts, rubric-activation.service.ts
```

Mỗi service **≤ 250 dòng**. Phần import được tách thành processor riêng để không vượt giới hạn này.

---

## 4B. MÔ TẢ CHI TIẾT TỪNG MODULE

> Với mỗi module: **mục đích**, **thành phần và vai trò**, **phụ thuộc**, **cache/audit** và **ranh giới trách nhiệm** (module KHÔNG làm gì).

### 4B.1. Hạ tầng dùng chung (`common/` và `database/`)

| Thành phần | Vai trò |
|---|---|
| `DataScopeHelper` | Đọc `userRoleScopes` của người gọi, trả về `ScopeFilter` (`GLOBAL`, danh sách `facultyIds` hoặc `departmentIds`). Mọi repository dùng filter này để thêm điều kiện `WHERE` tự động |
| `PaginationHelper` | Chuẩn hóa `page`, `limit`, `sort` và định dạng kết quả phân trang |
| `TransactionManager` | Cung cấp `run(fn)` bọc `prisma.$transaction`, để Service dùng transaction mà không gọi Prisma trực tiếp |

**Không làm:** không chứa nghiệp vụ của bất kỳ module nào.

### 4B.2. Module `academic`: Tổ chức học thuật, Học kỳ, Quota

**Mục đích:** quản lý danh mục nền (Khoa, Ngành, Bộ môn, Lớp), khung thời gian học kỳ và chỉ tiêu hướng dẫn. Đây là dữ liệu mà các module Đề tài, Đăng ký, Tiến độ ở sprint sau đều tham chiếu.

| Thành phần | Vai trò |
|---|---|
| `FacultiesService` | CRUD Khoa; kiểm tra trùng mã; chặn xóa nếu còn Ngành/Bộ môn |
| `MajorsService` | CRUD Ngành; kiểm tra Khoa tồn tại; chặn xóa nếu còn Lớp hoặc Đề tài |
| `DepartmentsService` | CRUD Bộ môn; hiển thị Trưởng bộ môn hiện tại (chỉ đọc, việc gán TBM thuộc module `positions`) |
| `ClassesService` | CRUD Lớp; kiểm tra Ngành và GV chủ nhiệm hợp lệ; áp `ScopeFilter` theo khoa cho Giáo vụ |
| `SemestersService` | CRUD Học kỳ; gọi `SemesterTimelineHelper` để validate mốc; xử lý `set-current` (transaction + xóa cache); khóa ghi khi kỳ đã đóng |
| `LecturerQuotasService` | Đọc/đặt quota từng GV theo kỳ; gọi `QuotaResolverHelper`; chặn đặt quota thấp hơn số đề tài đã nhận |
| `SemesterTimelineHelper` | Hàm thuần kiểm tra thứ tự các mốc thời gian, trả danh sách lỗi cụ thể |
| `QuotaResolverHelper` | Hàm thuần tính quota hiệu lực = quota riêng của kỳ, nếu không có thì lấy mặc định từ `system_settings` |
| 5 Repository (`faculties`, `majors`, `departments`, `classes`, `semesters`) + `lecturer-quotas` | Toàn bộ truy vấn Prisma, kèm đếm bản ghi con để phục vụ kiểm tra chặn xóa |

- **Phụ thuộc:** `RedisService`, `AuditLogsService`, `SystemSettingsService`, `TransactionManager`.
- **Cache/Audit:** cache `current_semester` (xóa sau khi commit); audit `SEMESTER_*`, `LECTURER_QUOTA_UPDATE`.
- **Không làm:** không tạo/sửa hồ sơ giảng viên (thuộc `users`), không gán chức danh TBM (thuộc `positions`).

### 4B.3. Module `positions`: Chức danh & phạm vi quyền

**Mục đích:** là nguồn sự thật duy nhất của chức danh (TBM, BCN, Giáo vụ, Phòng ĐT, BGĐ) và phạm vi tương ứng. Quyết định này giúp tránh hai nguồn dữ liệu mâu thuẫn cho Trưởng bộ môn.

| Thành phần | Vai trò |
|---|---|
| `PositionAssignmentService` | Gán/thu hồi chức danh. Validate: GV thuộc đúng bộ môn/khoa của phạm vi; mỗi bộ môn một TBM; mỗi khoa chỉ có số BCN theo quy định. Với TBM: transaction gồm thu hồi TBM cũ, tạo scope mới và cập nhật `departments.headLecturerId` |
| `PositionsRepository` | Truy vấn/ghi `userRoleScopes`, kiểm tra người đang giữ chức danh trong một phạm vi |
| `PositionsAdminController` | `POST/DELETE /users/:id/positions`, `PUT /academic/departments/:id/head` |

- **Phụ thuộc:** `academic` (đọc Khoa/Bộ môn), `RedisService` (xóa cache quyền của tài khoản bị ảnh hưởng), `AuditLogsService`.
- **Audit:** `POSITION_ASSIGN`, `POSITION_REVOKE`, `DEPARTMENT_HEAD_ASSIGN`.
- **Không làm:** không tạo tài khoản, không sửa danh mục Khoa/Bộ môn.

### 4B.4. Module `users`: Tài khoản, Sinh viên, Giảng viên

**Mục đích:** quản lý vòng đời tài khoản đăng nhập và hồ sơ học thuật của sinh viên/giảng viên.

| Thành phần | Vai trò |
|---|---|
| `UsersManagementService` | Danh sách/chi tiết tài khoản; tạo thủ công; khóa/mở khóa (khóa thì xóa phiên và đưa token vào blacklist Redis) |
| `PasswordResetService` | Admin đặt lại mật khẩu về mật khẩu khởi tạo, bật `mustChangePassword`, thu hồi phiên cũ |
| `StudentsService` | CRUD sinh viên; kiểm tra Lớp tồn tại; validate GPA (0 đến 4) và tín chỉ; tạo tài khoản `username = mã SV`, role `STUDENT`; áp `ScopeFilter`; SV chỉ xem được hồ sơ của mình |
| `LecturersService` | CRUD giảng viên; kiểm tra Bộ môn tồn tại; tạo tài khoản role `LECTURER` kèm scope bộ môn; trả kèm quota hiệu lực kỳ hiện tại |
| `AccountFactoryHelper` | Hàm dựng dữ liệu `Account` + `AccountRole` + scope cho SV/GV. Dùng chung với `data-import` để hai luồng tạo thủ công và hàng loạt cho kết quả giống nhau |
| `StudentsRepository`, `LecturersRepository`, `AccountsRepository` | Truy vấn có áp `ScopeFilter`; hỗ trợ tham số `tx` |

- **Phụ thuộc:** `academic`, `positions` (chỉ đọc), `RedisService`, `AuditLogsService`, `TransactionManager`.
- **Audit:** `USER_STATUS_CHANGE`, `USER_PASSWORD_RESET`.
- **Không làm:** không gán chức danh TBM/BCN, không import hàng loạt (thuộc `data-import`), không đặt quota (thuộc `academic`).

### 4B.5. Module `data-import` (Sprint 2B): Nhập dữ liệu hàng loạt

**Mục đích:** nhập SV, GV, Lớp từ file với bước xem trước và xác nhận (FR-DM-03).

| Thành phần | Vai trò |
|---|---|
| `FileGuardHelper` | Kiểm tra đuôi file, dung lượng (≤ 5 MB), magic bytes, số dòng tối đa (2.000) |
| `ExcelParserHelper` / `CsvParserHelper` | Đọc file thành mảng object có kiểu, kiểm tra header, chuẩn hóa dữ liệu ô (ngày, số, chuỗi) |
| `ImportPreviewService` | Điều phối: guard, parse, chọn processor, validate, lưu phiên vào Redis, trả báo cáo dòng lỗi |
| `ImportConfirmService` | Kiểm tra token (đúng người, chưa hết hạn), hash mật khẩu theo lô ngoài transaction, ghi theo lô 200 dòng, tổng hợp báo cáo |
| `ImportSessionStore` | Lưu/đọc/xóa phiên import trong Redis (TTL 30 phút) |
| `StudentImportProcessor` | Quy tắc riêng cho SV: mã lớp thuộc phạm vi người import, trùng MSSV/email trong file và DB, GPA/tín chỉ hợp lệ |
| `LecturerImportProcessor` | Quy tắc riêng cho GV: mã bộ môn hợp lệ, trùng mã GV/email, học vị hợp lệ |
| `ClassImportProcessor` | Quy tắc riêng cho Lớp: mã ngành tồn tại, GV chủ nhiệm tồn tại |

- **Phụ thuộc:** `users` (dùng `AccountFactoryHelper`, repositories), `academic` (tra mã lớp/bộ môn/ngành), `RedisService`, `AuditLogsService`.
- **Audit:** `USER_BULK_IMPORT`.
- **Không làm:** không chứa logic CRUD thủ công; không ghi DB ở bước preview.

### 4B.6. Module `grading` (Phần Rubric, Sprint 2B)

**Mục đích:** quản lý bộ tiêu chí chấm điểm và đảm bảo BR-08. Phần nhập điểm, khóa phiếu và tính điểm tổng kết sẽ làm ở sprint sau.

| Thành phần | Vai trò |
|---|---|
| `RubricsService` | CRUD bộ tiêu chí và tiêu chí con; chặn sửa/xóa khi bộ đã active hoặc đã có điểm; kiểm tra tiêu chí con (trọng số, thứ tự, mã không trùng) |
| `RubricActivationService` | Kích hoạt: gọi `RubricWeightHelper`, kiểm tra có ít nhất 1 tiêu chí, transaction hạ bộ active cũ cùng `(projectType, academicYear)` rồi kích hoạt bộ mới. Xử lý `clone` thành phiên bản mới |
| `RubricWeightHelper` | Cộng trọng số bằng `Prisma.Decimal`, so sánh đúng 100.00, trả tổng hiện tại để làm thông báo lỗi |
| `RubricSetsRepository`, `EvaluationCriteriaRepository` | Truy vấn bộ tiêu chí và tiêu chí con; đếm điểm đã chấm trong `detailed_scores` để quyết định khóa |

- **Phụ thuộc:** `academic` (năm học/loại đồ án), `AuditLogsService`, `TransactionManager`.
- **Audit:** `RUBRIC_ACTIVATED`, `RUBRIC_CLONED`.
- **Không làm:** không nhập điểm, không tính điểm tổng kết (BR-09 đến BR-11 thuộc sprint chấm điểm).

### 4B.7. Sơ đồ phụ thuộc giữa các module

```text
common (DataScope, Pagination)   database (TransactionManager)   RedisModule   AuditLogsModule
                  │                         │                        │               │
                  └─────────────┬───────────┴────────────────────────┴───────────────┘
                                ▼
                            academic
                           ▲   ▲    ▲
                           │   │    └────────────── grading
                    positions  │
                           ▲   │
                           │   │
                          users
                           ▲
                           │
                       data-import
```

Quy tắc: module phía dưới chỉ import module phía trên, không import ngược lại, để tránh circular dependency.

---

## 5. DANH MỤC ENDPOINT & PHÂN QUYỀN

> Mọi endpoint đi qua `JwtAuthGuard → RolesGuard → PermissionsGuard` (+ `PositionGuard` khi cần), sau đó Service áp `ScopeFilter`.
> Viết tắt: **TĐT** = TRAINING_DEPT, **GVụ** = ACADEMIC_AFFAIRS, **BCN** = FACULTY_DEAN, **TBM** = HEAD_OF_DEPARTMENT.

### 5.1. Cơ cấu tổ chức (`/api/v1/academic`), 20 endpoints

| Nhóm | Endpoints | Ai gọi được | Ghi chú |
|---|---|---|---|
| **Faculties** (5) | `GET /faculties`, `GET /faculties/:id`, `POST /faculties`, `PUT /faculties/:id`, `DELETE /faculties/:id` | GET: đã đăng nhập. Ghi: ADMIN, TĐT (`academic:manage`) | DELETE trả 409 nếu còn Ngành/Bộ môn |
| **Majors** (5) | `GET /majors` (lọc `facultyId`), `GET /majors/:id`, `POST`, `PUT /:id`, `DELETE /:id` | GET: đã đăng nhập. Ghi: ADMIN, TĐT | DELETE trả 409 nếu còn Lớp/Đề tài |
| **Departments** (5) | `GET /departments` (lọc `facultyId`, kèm TBM), `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id` | GET: đã đăng nhập. Ghi: ADMIN, TĐT | **Không** sửa `headLecturerId` ở đây (xem 5.3) |
| **Classes** (5) | `GET /classes` (lọc `majorId`, `academicYear`), `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id` | GET: đã đăng nhập. Ghi: ADMIN, TĐT; **GVụ trong khoa mình** | Gán GV chủ nhiệm `homeroomAdvisorId` |

### 5.2. Học kỳ & Quota (`/api/v1/academic/semesters`), 8 endpoints

| Method | Endpoint | Quyền | Chức năng |
|---|---|---|---|
| GET | `/semesters` | Đã đăng nhập | Danh sách, sắp xếp theo năm học giảm dần |
| GET | `/semesters/current` | Đã đăng nhập | Học kỳ hiện tại (Cache-Aside) |
| GET | `/semesters/:id` | Đã đăng nhập | Chi tiết và các mốc thời gian |
| POST | `/semesters` | `semesters:manage` | Tạo kỳ và mốc thời gian |
| PUT | `/semesters/:id` | `semesters:manage` | Sửa kỳ; chặn nếu kỳ đã đóng |
| PATCH | `/semesters/:id/set-current` | `semesters:manage` | Transaction đổi `isCurrent`, sau đó `DEL` cache |
| GET | `/semesters/:id/lecturer-quotas` | `quotas:manage`, TBM (Dept) | Quota hiệu lực của GV trong kỳ |
| PUT | `/semesters/:id/lecturer-quotas/:lecturerId` | `quotas:manage` (scope khoa) | Đặt quota; không thấp hơn số đề tài đã nhận |

### 5.3. Tài khoản, chức danh & hồ sơ (Sprint 2A), 16 endpoints

| Nhóm | Endpoints | Quyền |
|---|---|---|
| **Accounts** (5) | `GET /users`, `POST /users`, `GET /users/:id`, `PATCH /users/:id/status`, `POST /users/:id/reset-password` | `users:read` / `users:manage` (**ADMIN**). Khóa tài khoản → xóa phiên Redis, ghi audit |
| **Positions** (3) | `POST /users/:id/positions`, `DELETE /users/:id/positions/:assignmentId`, `PUT /academic/departments/:id/head` | `users:manage` (ADMIN). Validate: GV phải thuộc bộ môn/khoa của phạm vi được gán; mỗi bộ môn chỉ có 1 TBM; đồng bộ `headLecturerId` cùng transaction |
| **Students** (4) | `GET /students`, `GET /students/:id`, `POST /students`, `PUT /students/:id` | Đọc: `profiles:read` + scope. Ghi: `profiles:manage` + scope. Sinh viên chỉ xem **hồ sơ của chính mình**. Giảng viên thường không liệt kê SV ở module này (xem qua module đăng ký ở sprint sau) |
| **Lecturers** (4) | `GET /lecturers`, `GET /lecturers/:id`, `POST /lecturers`, `PUT /lecturers/:id` | Đọc: đã đăng nhập (cần để chọn GVHD). Ghi: `profiles:manage` + scope. Tạo mới sinh tài khoản và gán `LECTURER` kèm scope bộ môn |

> Sprint 2A: 20 + 8 + 16 = **44 endpoints**.

### 5.4. Import dữ liệu (Sprint 2B), 3 endpoints

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/import/templates/:type` | Tải file mẫu (`students` / `lecturers` / `classes`) |
| POST | `/import/:type/preview` | Upload, parse, validate, **không ghi DB**. Trả `importToken` + báo cáo từng dòng |
| POST | `/import/confirm` | Body `{ importToken, skipInvalidRows? }`. Ghi DB theo lô |

Quyền: `profiles:manage` (GVụ chỉ được import SV/lớp thuộc khoa mình).

### 5.5. Rubric (`/api/v1/grading/rubrics`), 9 endpoints

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/rubrics` | Danh sách (lọc `projectType`, `academicYear`) |
| GET | `/rubrics/:id` | Chi tiết kèm tiêu chí con |
| POST | `/rubrics` | Tạo mới, mặc định `isActive = false` |
| PUT | `/rubrics/:id` | Sửa tên/năm học |
| PATCH | `/rubrics/:id/activate` | Kiểm tra BR-08 rồi kích hoạt |
| POST | `/rubrics/:id/clone` | Tạo phiên bản mới từ bộ đã active để chỉnh sửa |
| POST | `/rubrics/:id/criteria` | Thêm tiêu chí |
| PUT | `/rubrics/:id/criteria/:criterionId` | Sửa tiêu chí |
| DELETE | `/rubrics/:id/criteria/:criterionId` | Xóa tiêu chí |

Quyền ghi: `rubrics:manage` (ADMIN, GVụ, BCN). Mọi thao tác ghi bị chặn (409) khi bộ đã `isActive` hoặc đã có điểm trong `detailed_scores`.

> Sprint 2B: 3 + 9 = **12 endpoints**. Tổng Sprint 2: **56 endpoints**.

---

## 6. LOGIC NGHIỆP VỤ CHI TIẾT

### 6.1. Timeline học kỳ (`SemesterTimelineHelper`)

Không ép đăng ký phải bắt đầu sau ngày khai giảng, vì thực tế đăng ký thường mở trước.

```text
topicRegistrationStart < topicRegistrationEnd ≤ executionStart
executionStart < executionEnd ≤ thesisSubmissionEnd < defenseStart ≤ defenseEnd
startDate ≤ executionStart
defenseEnd ≤ endDate
startDate < endDate
```

- Vi phạm → `Result.fail(AppError.badRequest(...))`, nêu rõ cặp mốc sai.
- Kỳ đã đóng thì khóa mọi thao tác ghi.

### 6.2. Học kỳ hiện tại

1. Trong `transactionManager.run`: đặt toàn bộ `isCurrent = false`, rồi bản ghi được chọn `= true`.
2. **Sau khi commit:** `DEL utc2:cache:current_semester`. Lần đọc kế tiếp tự nạp lại (Cache-Aside, có TTL). Không `SET` thủ công.
3. Ghi audit `SEMESTER_SET_CURRENT`.

### 6.3. Quota hướng dẫn (BR-02, `QuotaResolverHelper`)

```text
quotaHiệuLực = lecturer_semester_quotas.max_quota ?? setting(advising.default_quota)
```

Khi đặt quota mới, không được thấp hơn số đề tài đã nhận trong kỳ đó.

### 6.4. Trưởng bộ môn / chức danh

Gán TBM thực hiện trong **một transaction**:

1. Kiểm tra GV thuộc bộ môn.
2. Thu hồi position TBM cũ (nếu có).
3. Tạo `userRoleScope` mới.
4. Cập nhật `departments.headLecturerId`.

Sau đó invalidate cache quyền của hai tài khoản bị ảnh hưởng và ghi audit `DEPARTMENT_HEAD_ASSIGN`.

### 6.5. Import (FR-DM-03)

**Preview**

1. `FileGuardHelper`: chỉ `.xlsx` / `.csv`, tối đa 5 MB, tối đa 2.000 dòng, kiểm tra magic bytes (xlsx là ZIP, bắt đầu bằng `PK`).
2. Parse, kiểm tra header, validate từng dòng: định dạng email, trường bắt buộc, mã lớp/bộ môn tồn tại **và thuộc phạm vi khoa của người import**, trùng trong file và trong DB.
3. Lưu các dòng hợp lệ vào Redis (`import:{token}`, TTL 30 phút, gắn `accountId` người tạo).
4. Trả `{ token, total, validCount, errors: [{ row, field, reason }] }`.

**Confirm**

1. Kiểm tra token thuộc đúng người dùng và chưa hết hạn. Nếu còn dòng lỗi và `skipInvalidRows = false` thì từ chối.
2. Hash mật khẩu theo lô **ngoài transaction**.
3. Ghi theo lô 200 dòng, mỗi lô một transaction (Student/Lecturer + Account + AccountRole + scope). Lô lỗi được ghi nhận và báo cáo, không làm hỏng lô khác.
4. Trả báo cáo cuối và ghi audit `USER_BULK_IMPORT` kèm số lượng.

**Template Excel**

- Sheet `Students`: `MSSV`, `Họ và tên`, `Giới tính`, `Ngày sinh`, `Email`, `Số điện thoại`, `Mã lớp`, `Tín chỉ tích lũy`, `GPA`.
- Sheet `Lecturers`: `Mã GV`, `Họ và tên`, `Email`, `Số điện thoại`, `Học vị`, `Mã bộ môn`.
- Sheet `Classes`: `Mã lớp`, `Tên lớp`, `Mã ngành`, `Niên khóa`, `Mã GV chủ nhiệm`.

### 6.6. Rubric (BR-08)

- Cộng trọng số bằng `Prisma.Decimal`, so sánh đúng `= 100.00`, không dùng float.
- Kích hoạt yêu cầu: có ít nhất 1 tiêu chí, tổng bằng đúng 100.00; trong một transaction hạ bộ đang active cùng `(projectType, academicYear)` rồi kích hoạt bộ mới.
- Thông báo lỗi nêu tổng hiện tại, ví dụ: *"Tổng trọng số hiện tại là 95.00%, bắt buộc phải bằng đúng 100.00% mới được kích hoạt (BR-08)."*
- Muốn chỉnh bộ đang dùng, gọi `clone` để tạo phiên bản mới.

---

## 7. AUDIT LOG (BR-13)

`USER_STATUS_CHANGE`, `USER_PASSWORD_RESET`, `POSITION_ASSIGN`, `POSITION_REVOKE`, `DEPARTMENT_HEAD_ASSIGN`, `SEMESTER_CREATE`, `SEMESTER_UPDATE`, `SEMESTER_SET_CURRENT`, `LECTURER_QUOTA_UPDATE`, `USER_BULK_IMPORT`, `RUBRIC_ACTIVATED`, `RUBRIC_CLONED`.

Ghi fire-and-forget, không chặn phản hồi API.

---

## 8. LỘ TRÌNH THỰC HIỆN

```text
Sprint 2A: [1 Nền tảng] → [2 Academic] → [3 Semesters & Quota] → [4 Positions → Users] → [5 Test & Build]
Sprint 2B: [6 Rubrics] → [7 Data Import] → [8 Hoàn thiện & E2E]
```

**Sprint 2A**

1. **Nền tảng:** cập nhật RBAC Matrix, `permissions.constant.ts`, `seed.ts`; migration DB (Mục 3); `DataScopeHelper`, `TransactionManager`.
2. **Academic:** repositories → DTO (thông báo lỗi tiếng Việt) → helpers → services (Result) → controllers → module.
3. **Semesters & Quota:** timeline helper, quota resolver, cache invalidation.
4. **Positions → Users** (accounts, students, lecturers).
5. **Unit test** cho các helper lõi, rồi `tsc --noEmit` và `build`.

**Sprint 2B**

6. **Rubrics:** weight helper, activation, clone.
7. **Data Import:** file guard, parsers, preview/confirm, 3 processors.
8. **Hoàn thiện:** audit, kiểm tra Scalar/Swagger, test end-to-end bằng file Excel mẫu.

```bash
pnpm --filter backend exec tsc --noEmit
pnpm --filter backend run build
```

---

## 9. DEFINITION OF DONE

1. **Kiến trúc:** không service nào vượt 250 dòng; Service không gọi Prisma trực tiếp; không dùng `any`.
2. **Result Pattern:** 100% hàm Service trả `Promise<Result<T, AppError>>`; Controller dùng `result.unwrap()`.
3. **Phân quyền:** mọi endpoint có đủ Guards và đúng permission theo Matrix đã cập nhật; **có test chứng minh** Giáo vụ Khoa A không truy cập được dữ liệu Khoa B.
4. **Nghiệp vụ:**
   - BR-02: quota theo kỳ, có mặc định.
   - BR-08: dùng Decimal, đúng 100.00.
   - Timeline hợp lệ; duy nhất một học kỳ hiện tại.
   - Duy nhất một TBM mỗi bộ môn; một rubric active mỗi loại đồ án/năm học.
5. **Import:** preview không ghi DB; confirm ghi theo lô; tài khoản có `mustChangePassword`; báo cáo lỗi chi tiết theo dòng; từ chối file sai định dạng/quá cỡ.
6. **Kiểm thử:** unit test cho `SemesterTimelineHelper`, `QuotaResolverHelper`, `RubricWeightHelper`, `DataScopeHelper` và các parser (theo NFR-MA-01).
7. **Build:** `tsc --noEmit` và `pnpm build` đạt 0 lỗi.

---

## 10. RỦI RO CHÍNH

| Rủi ro | Giảm thiểu |
|---|---|
| Quota theo kỳ cần migration và thay đổi nghiệp vụ so với schema hiện tại | Làm migration ở bước 1, có mặc định 5 để không chặn các sprint sau |
| Hai nguồn sự thật của TBM | Chỉ sửa qua `PositionAssignmentService`, cấm sửa `headLecturerId` trực tiếp |
| Import lớn gây treo | Giới hạn 2.000 dòng, lô 200, hash ngoài transaction |
| Tài liệu SRS và Guidelines lệch số BR | Thống nhất bảng ánh xạ trong một file trước khi code |
| Tài liệu SRS và RBAC Matrix mâu thuẫn về quyền quản lý hồ sơ (Admin hay Giáo vụ/Phòng ĐT) | Xác nhận A2 với nhóm nghiệp vụ trước khi code controller |

---
*Kế hoạch Sprint 2 (V2) – UTC2-DAMS – Tháng 10/2026.*
