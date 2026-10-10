# QUY TẮC PHÁT TRIỂN PHẦN MỀM & TIÊU CHUẨN KIẾN TRÚC CODE (CODING GUIDELINES)
## HỆ THỐNG WEB QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP UTC2 (UTC2-DAMS)

> **Tài liệu này là bộ quy tắc kiến trúc bắt buộc (Mandatory Architecture Rules)** áp dụng cho toàn bộ quá trình phát triển mã nguồn Frontend, Backend, Database và Tích hợp hệ thống. Mọi Pull Request / Commit đều phải tuân thủ nghiêm ngặt các nguyên tắc dưới đây.

---

## 🏛️ PHẦN 1: NGUYÊN TẮC KỸ THUẬT CỐT LÕI (CORE ENGINEERING PRINCIPLES)

1. **Single Responsibility Principle (SRP) – Không bao giờ viết "God Service":**
   * Mỗi class/service chỉ đảm nhận **DUY NHẤT MỘT TRÁCH NHIỆM**.
   * Độ dài một file Service **không vượt quá 200 - 250 dòng**. Nếu dài hơn hoặc có nhiều logic tính toán/xử lý file/kiểm tra chéo $\rightarrow$ **BẮT BUỘC** tách thành Service con chuyên biệt hoặc đưa vào thư mục `helpers/` (ví dụ: `TokenHelper`, `AuthProfileHelper`, `GradeCalculatorService`, `ScheduleConflictValidator`).
2. **Result Pattern & Explicit Error Handling (Không lạm dụng `throw Exception`):**
   * Tầng Service và Repository **tuyệt đối không `throw new HttpException`** bừa bãi gây ẩn luồng điều khiển (hidden control flow).
   * Mọi hàm Service phải trả về kiểu **`Promise<Result<T, AppError>>`**.
   * Tầng Controller tiếp nhận `result` và mở gói qua **`result.unwrap()`** (tự động ánh xạ `AppError` thành mã HTTP chuẩn `400`, `401`, `403`, `404`, `409`, `500`).
3. **Tách biệt Data Access Layer (Repository Pattern):**
   * Service **không gọi trực tiếp `PrismaService`**. Mọi câu lệnh truy vấn PostgreSQL phải được đóng gói tại thư mục `repositories/`.
   * Giúp mã nguồn dễ viết Unit Test, dễ Mock và tách bạch hoàn toàn tầng nghiệp vụ với tầng dữ liệu.
4. **100% Strict TypeScript (Type-Safety Toàn diện):**
   * Tuyệt đối không dùng kiểu `any`. Định nghĩa rõ ràng kiểu dữ liệu, DTO và Interface.
   * Tận dụng Prisma Payload Types (`Prisma.AccountGetPayload<{ include: ... }>`) và package dùng chung (`packages/types`).
5. **Secure by Default & Defense in Depth (Bảo vệ đa lớp):**
   * **Tầng 1 (Frontend):** Route Guard & Form Validation (Zod).
   * **Tầng 2 (Global Guards):** `JwtAuthGuard` & `RolesGuard` đăng ký toàn cục qua `APP_GUARD`. Mọi API mặc định đều được bảo vệ, chỉ mở tự do khi có `@Public()`.
   * **Tầng 3 (Data Scoping & Positions):** Kiểm tra phạm vi dữ liệu thực tế (`userRoleScopes`: chỉ xem/sửa đề tài thuộc Khoa/Bộ môn mình).
   * **Tầng 4 (Database):** Ràng buộc toàn vẹn CSDL (Unique, Check, Foreign Key, Date ranges).

---

## 📁 PHẦN 2: CẤU TRÚC THƯ MỤC CHUẨN CHO TỪNG MODULE BACKEND

Mỗi module trong `apps/backend/src/modules/<tên-module>/` bắt buộc phải tuân theo cấu trúc phân tầng sau:

```text
src/modules/<tên-module>/
├── controllers/          # Tách Controller theo nhóm người dùng / chức năng
│   ├── <module>.student.controller.ts    # Endpoint dành cho Sinh viên
│   ├── <module>.lecturer.controller.ts   # Endpoint dành cho Giảng viên
│   └── <module>.admin.controller.ts      # Endpoint dành cho Quản trị / Giáo vụ / TBM
│
├── dto/                  # Data Transfer Objects (class-validator + class-transformer thuần túy)
│   ├── create-<entity>.dto.ts
│   ├── update-<entity>.dto.ts
│   ├── query-<entity>.dto.ts
│   └── <entity>-response.dto.ts
│
├── helpers/              # Tầng Helper chuyên biệt (Transform dữ liệu, trích xuất Scope, Utility)
│   ├── <feature>.helper.ts
│   └── index.ts
│
├── repositories/         # Tầng Data Access (Prisma queries độc lập, Transaction)
│   ├── <entity>.repository.ts
│   └── index.ts
│
├── services/             # Tầng Business Logic tinh gọn (< 250 dòng, trả về Result Pattern)
│   ├── <module>.service.ts               # CRUD & Điều phối nghiệp vụ chính
│   ├── <feature>-calculator.service.ts   # Thuật toán tính toán độc lập
│   └── <feature>-validator.service.ts    # Logic kiểm tra nghiệp vụ phức tạp
│
└── <module>.module.ts    # Khai báo NestJS Module (Gắn controllers, repositories, helpers, services)
```

---

## ⚡ PHẦN 3: KIẾN TRÚC CACHING VÀ GHI VẾT TOÀN CỤC (GLOBAL INFRASTRUCTURE)

### 1. Global Redis Module (`src/database/redis/`)
* **Single Connection Pool**: Kết nối tập trung tại `@Global() RedisModule`, không kết nối riêng lẻ trong từng service.
* **Non-blocking Operations**: Tuyệt đối không dùng lệnh chặn `KEYS *`. Quản lý danh sách keys qua Redis Set (`SADD`, `SMEMBERS`, `SISMEMBER`) với thời gian truy xuất $O(1)$.
* **Self-Healing (Cache-Aside)**: Khi xảy ra Cache Miss hoặc Redis khởi động lại, tầng Cache Service phải tự động nạp lại dữ liệu từ Repository vào Redis.
* **Cache Invalidation**: Bắt buộc kích hoạt xóa/làm mới cache ngay lập tức khi phát sinh sự kiện CUD (Tạo/Sửa Role, Gán quyền, Đổi mật khẩu, Logout).

### 2. Global Audit Trail Module (BR-13) (`src/modules/audit-logs/`)
* Ghi nhận toàn bộ thao tác nhạy cảm: Đăng nhập (`AUTH_LOGIN`), Đăng xuất (`AUTH_LOGOUT`), Đổi mật khẩu (`AUTH_CHANGE_PASSWORD`), Gán quyền (`ROLES_ASSIGN_PERMISSIONS`), Duyệt đề tài, Khóa/Mở điểm.
* **Non-blocking Fire-and-Forget**: Ghi vết bất đồng bộ, không làm nghẽn hoặc ảnh hưởng đến thời gian phản hồi của API chính.
* Lưu vết đầy đủ: `accountId`, `action`, `endpoint`, `httpMethod`, `ipAddress`, `userAgent`, `payload`, `responseStatus`, `createdAt`.

---

## 🛡️ PHẦN 4: CHIẾN LƯỢC XỬ LÝ LỖI & RESULT PATTERN

### 1. Cấu trúc Lớp `AppError` (`src/common/utils/app-error.ts`)
```typescript
export class AppError {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = HttpStatus.BAD_REQUEST,
    public readonly code?: string,
    public readonly details?: any,
  ) {}

  static badRequest(message: string, code?: string, details?: any): AppError { ... }
  static unauthorized(message: string, code?: string): AppError { ... }
  static forbidden(message: string, code?: string): AppError { ... }
  static notFound(message: string, code?: string): AppError { ... }
  static conflict(message: string, code?: string): AppError { ... }
}
```

### 2. Cấu trúc Lớp `Result<T, E>` (`src/common/utils/result.ts`)
```typescript
export class Result<T, E = AppError> {
  public static ok<T, E>(value?: T): Result<T, E> { ... }
  public static fail<T, E>(error: E): Result<T, E> { ... }

  public get isSuccess(): boolean { ... }
  public get isFailure(): boolean { ... }
  public get value(): T { ... }
  public get error(): E { ... }

  public unwrap(): T {
    if (this.isFailure) {
      if (this._error instanceof AppError) throw this._error.toHttpException();
      throw new Error(String(this._error));
    }
    return this._value as T;
  }
}
```

### 3. Quy chuẩn viết DTO (Validation Layer)
* Sử dụng thuần `class-validator` và `class-transformer` (`@IsNotEmpty()`, `@IsString()`, `@IsUUID()`, `@Min()`, `@Max()`).
* **Không dùng decorators Swagger (`@Api*`)** để giữ mã nguồn DTO sạch sẽ, tối giản và chuẩn hóa.
* Luôn có thông báo lỗi tiếng Việt rõ ràng thông qua thuộc tính `message`.

```typescript
export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
  @IsString({ message: 'Mật khẩu hiện tại phải là chuỗi ký tự' })
  oldPassword: string;

  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' })
  newPassword: string;
}
```

---

## 📋 PHẦN 5: CHECKLIST QUY TẮC NGHIỆP VỤ BẮT BUỘC (SRS BR-01 $\rightarrow$ BR-13)

| Mã BR | Quy Tắc Nghiệp Vụ | Module Phụ Trách | Logic Cần Xử Lý |
| :---: | :--- | :--- | :--- |
| **BR-01** | **Giới hạn đăng ký** | `registrations` | Một SV chỉ đăng ký 1 đề tài/học kỳ. Kiểm tra `creditsAccumulated` $\ge$ điều kiện, `gpaCumulative` $\ge 2.0$. |
| **BR-02** | **Định mức GVHD** | `topics`, `registrations` | GVHD không nhận vượt quá `maxAdvisingQuota` (mặc định 5 đề tài/kỳ). |
| **BR-03** | **Đổi đề tài / GVHD muộn** | `registrations` | Sau hạn đăng ký, đổi đề tài/GVHD phải tạo `ChangeRequest` và được BCN Khoa phê duyệt. |
| **BR-04** | **Phê duyệt đề tài 2 cấp** | `topics` | Giảng viên đề xuất $\rightarrow$ Trưởng bộ môn thẩm định $\rightarrow$ BCN Khoa phê duyệt ban hành. |
| **BR-05** | **Báo cáo tuần & Cảnh báo** | `progress` | Báo cáo tuần nộp đúng hạn. Quá 2 tuần không nộp $\rightarrow$ Tự động cảnh báo & GVHD đánh giá Không đạt. |
| **BR-06** | **Ngưỡng kiểm tra trùng lặp** | `thesis-reports` | Tỷ lệ trùng lặp $\le$ ngưỡng quy định (mặc định $20\%-25\%$). Vượt ngưỡng $\rightarrow$ Không đủ điều kiện bảo vệ. |
| **BR-07** | **Cấm trùng lịch Hội đồng** | `councils` | `ScheduleConflictValidator`: Cấm xếp 1 GV vào 2 HĐ cùng khung giờ hoặc 2 HĐ cùng phòng cùng giờ. |
| **BR-08** | **Chuẩn hóa Rubric 100%** | `grading` | Tổng trọng số các tiêu chí trong `RubricSet` phải **bằng đúng 100.00%**. |
| **BR-09** | **Cơ chế Khóa phiếu điểm** | `grading` | Giảng viên nộp phiếu điểm $\rightarrow$ Khóa (`isLocked = true`). Chỉ BCN Khoa mới có quyền mở khóa có ghi vết. |
| **BR-10** | **Thuật toán tính điểm HĐ** | `grading` | Điểm HĐ $= \sum (\text{Điểm từng TV}) / n$. Lệch giữa 2 TV $\ge 2.0$ điểm $\rightarrow$ Cảnh báo hội chẩn. |
| **BR-11** | **Tính điểm tổng kết** | `grading` | $Điểm_{\text{TK}} = a \times Điểm_{\text{GVHD}} + b \times Điểm_{\text{GVPB}} + c \times Điểm_{\text{HĐ}}$ ($a, b, c$ cấu hình động). |
| **BR-12** | **Quy trình Phúc khảo** | `complaints` | Đơn phúc khảo gửi trong thời hạn công bố điểm $\rightarrow$ BCN Khoa thành lập HĐ chấm lại $\rightarrow$ Cập nhật điểm. |
| **BR-13** | **Ghi vết Audit Trail** | `audit-logs` | Ghi nhận mọi thao tác CUD nhạy cảm (Sửa điểm, Chuyển trạng thái, Duyệt ngoại lệ) kèm IP, Timestamp, Actor. |

---

## 🔄 PHẦN 6: QUY TRÌNH 6 BƯỚC PHÁT TRIỂN TÍNH NĂNG MỚI (DEVELOPMENT WORKFLOW)

```
[1. Đọc SRS & BR] ➔ [2. Tạo DTOs & Validation] ➔ [3. Viết Repository & Helper] ➔ [4. Viết Service (Result Pattern)] ➔ [5. Viết Controller & Guards] ➔ [6. Test API & Audit Log]
```

### Chi tiết các bước:
1. **Bước 1 – Đọc SRS & Ma trận phân quyền:**
   * Mở [`docs/SRS_Quan_ly_do_an_UTC2.md`](docs/SRS_Quan_ly_do_an_UTC2.md) và [`docs/RBAC_PERMISSION_MATRIX.md`](docs/RBAC_PERMISSION_MATRIX.md).
   * Xác định dữ liệu cần đọc/ghi trên 28 bảng CSDL.
2. **Bước 2 – Khai báo DTOs:**
   * Tạo các file trong `dto/` kèm theo class-validator decorators và thông báo lỗi tiếng Việt.
3. **Bước 3 – Xây dựng Repository & Helper Layer:**
   * Viết các hàm truy vấn trong `repositories/<entity>.repository.ts`.
   * Tách logic biến đổi/trích xuất dữ liệu phức tạp sang `helpers/<feature>.helper.ts`.
4. **Bước 4 – Cài đặt Service Layer:**
   * Inject Repository, Helper, RedisService và AuditLogsService.
   * Kiểm tra điều kiện nghiệp vụ (Business Rules). Trả về `Result.ok()` hoặc `Result.fail(AppError)`.
5. **Bước 5 – Cài đặt Controller Layer:**
   * Định nghĩa RESTful Route chuẩn.
   * Gắn `@Roles()`, `@RequirePermissions()`, `@RequirePosition()`.
   * Tiếp nhận request, gọi service và mở gói dữ liệu bằng `result.unwrap()`.
6. **Bước 6 – Kiểm thử API & Type-check:**
   * Chạy `pnpm --filter backend exec tsc --noEmit` đảm bảo không có lỗi biên dịch.
   * Chạy `pnpm --filter backend run build`.

---

## 🏷️ PHẦN 7: QUY CHUẨN ĐẶT TÊN (NAMING CONVENTIONS)

| Thành phần | Quy ước | Ví dụ |
| :--- | :--- | :--- |
| **Thư mục (Folders)** | `kebab-case` | `thesis-reports`, `system-settings`, `audit-logs` |
| **Tên File (Files)** | `kebab-case.suffix.ts` | `create-topic.dto.ts`, `accounts.repository.ts` |
| **Tên Class / Interface** | `PascalCase` | `TopicsService`, `AccountsRepository`, `AppError` |
| **Tên Method / Biến** | `camelCase` | `findAllTopics()`, `scoreProcess`, `advisorLecturerId` |
| **Tên Enum / Constant** | `UPPER_SNAKE_CASE` | `TopicStatus.APPROVED`, `ROLES.ADMIN` |
| **Database Tables** | `plural_snake_case` | `faculties`, `lecturers`, `audit_logs` |
| **Database Columns** | `snake_case` | `full_name`, `is_qualified_for_defense`, `valid_to` |
| **RESTful API URL** | `kebab-case` (Số nhiều) | `GET /api/v1/thesis-reports`, `POST /api/v1/roles` |

---

## 📦 PHẦN 8: QUY CHUẨN GIT COMMIT (CONVENTIONAL COMMITS)

Mọi commit phải tuân thủ định dạng: `<type>(<scope>): <description>`

* `feat`: Thêm tính năng mới (`feat(auth): implement token rotation with pure redis cache`).
* `fix`: Sửa lỗi (`fix(auth): prevent expired role assignment via validTo filter`).
* `refactor`: Tái cấu trúc mã nguồn (`refactor(auth): migrate error handling to Result Pattern`).
* `docs`: Cập nhật tài liệu (`docs(guidelines): update architecture rules with Result Pattern`).
* `chore`: Cập nhật cấu hình, dependencies (`chore: install ioredis and setup global redis module`).

---
*Tài liệu Tiêu chuẩn Kiến trúc Code UTC2-DAMS – Cập nhật Tháng 10/2026.*
