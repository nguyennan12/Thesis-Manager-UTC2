# QUY TẮC PHÁT TRIỂN PHẦN MỀM & TIÊU CHUẨN KIẾN TRÚC CODE (CODING GUIDELINES)
## HỆ THỐNG WEB QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP UTC2 (UTC2-DAMS)

> **Tài liệu này là bộ quy tắc bắt buộc (Mandatory Rules)** áp dụng cho toàn bộ quá trình phát triển mã nguồn Frontend, Backend, Database và Tích hợp hệ thống. Mọi Pull Request / Commit đều phải tuân thủ nghiêm ngặt các nguyên tắc dưới đây.

---

## 🏛️ PHẦN 1: NGUYÊN TẮC CỐT LÕI (CORE ENGINEERING PRINCIPLES)

1. **Single Responsibility Principle (SRP) – Không bao giờ viết "God Service":**
   * Mỗi class/service chỉ đảm nhận **DUY NHẤT MỘT TRÁCH NHIỆM**.
   * Độ dài một file Service **không vượt quá 200 - 250 dòng**. Nếu dài hơn hoặc có nhiều logic tính toán/xử lý file/kiểm tra chéo $\rightarrow$ **BẮT BUỘC** tách thành Service con chuyên biệt (ví dụ: `GradeCalculatorService`, `ScheduleConflictValidator`, `TextExtractorService`, `TopicExportService`).
2. **Đọc kỹ và tuân thủ 100% tài liệu SRS:**
   * Mọi logic nghiệp vụ phải ánh xạ chính xác với đặc tả trong [`docs/SRS_Quan_ly_do_an_UTC2.md`](docs/SRS_Quan_ly_do_an_UTC2.md), đặc biệt là **13 Business Rules (BR-01 $\rightarrow$ BR-13)** và ma trận phân quyền 8 Roles.
   * Tuyệt đối không tự ý bịa thêm trạng thái hoặc bỏ qua các bước kiểm tra điều kiện tiên quyết.
3. **Type-Safety Toàn diện (100% Strict TypeScript):**
   * Tuyệt đối không dùng kiểu `any`. Định nghĩa rõ ràng kiểu dữ liệu, DTO và Interface.
   * Tận dụng Prisma Client types (`@prisma/client`) và package dùng chung (`packages/types`).
4. **Tối ưu hóa, Tái sử dụng & Clean Code (DRY - Don't Repeat Yourself):**
   * Các hàm tiện ích dùng chung (format ngày giờ, tính toán, decorator, guard, filter) phải đưa vào `src/common/`.
   * Các hàm query tái sử dụng giữa nhiều service phải đưa vào tầng `repositories/`.
5. **Defense in Depth (Bảo vệ đa lớp):**
   * **Tầng 1 (Frontend):** Route Guard & Form Validation (Zod).
   * **Tầng 2 (Gateway/Controller):** `@UseGuards(JwtAuthGuard, RolesGuard)` + Decorators `@Roles()`, `@Permissions()`, `@RequirePosition()`.
   * **Tầng 3 (Service):** Data Scoping & Permission Check theo dữ liệu thực tế (chỉ xem/sửa đề tài thuộc Khoa/Bộ môn mình).
   * **Tầng 4 (Database):** Ràng buộc toàn vẹn CSDL (Unique, Check, Foreign Key).

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
├── dto/                  # Data Transfer Objects (Request, Response, Query có class-validator + Swagger)
│   ├── create-<entity>.dto.ts
│   ├── update-<entity>.dto.ts
│   ├── query-<entity>.dto.ts
│   └── <entity>-response.dto.ts
│
├── services/             # Tách nhỏ Service theo nguyên lý SRP
│   ├── <module>.service.ts               # CRUD & Điều phối nghiệp vụ chính
│   ├── <feature>-calculator.service.ts   # Thuật toán tính toán độc lập
│   ├── <feature>-validator.service.ts    # Logic kiểm tra nghiệp vụ phức tạp
│   └── <feature>-export.service.ts       # Xử lý xuất file PDF/Excel/Word
│
├── repositories/         # Tầng truy vấn dữ liệu phức tạp (Custom SQL / Complex Joins)
│   └── <entity>.repository.ts
│
└── <module>.module.ts    # Khai báo NestJS Module (Gắn controllers, providers, exports)
```

---

## 🛡️ PHẦN 3: CHIẾN LƯỢC VALIDATION 3 TẦNG (THREE-LAYER VALIDATION)

Mọi dữ liệu đầu vào từ người dùng phải được kiểm duyệt qua 3 tầng nghiêm ngặt:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CHIẾN LƯỢC VALIDATION 3 TẦNG                        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. DTO Validation (class-validator + class-transformer)               │
│    -> Kiểm tra kiểu dữ liệu, định dạng, độ dài, regex, required       │
│                                                                        │
│ 2. Domain & Business Rule Validation (Custom Service Validators)       │
│    -> Kiểm tra logic: Điểm tích lũy >= 2.0, Không trùng lịch HĐ,      │
│       Tổng trọng số rubric = 100%, Chưa khóa phiếu điểm               │
│                                                                        │
│ 3. Database Constraints (PostgreSQL & Prisma)                          │
│    -> UNIQUE(student_id, semester_id), CHECK(score >= 0 AND score <= 10)│
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Quy tắc viết DTO:
* Bắt buộc có Swagger Decorators (`@ApiProperty()`, `@ApiPropertyOptional()`).
* Bắt buộc có decorator validation (`@IsNotEmpty()`, `@IsString()`, `@IsInt()`, `@Min()`, `@Max()`, `@IsEnum()`, `@IsUUID()`).
* Luôn có thông báo lỗi tiếng Việt rõ ràng qua thuộc tính `message`.

```typescript
// Ví dụ chuẩn DTO:
export class CreateTopicDto {
  @ApiProperty({ example: 'Xây dựng ứng dụng quản lý đồ án tốt nghiệp', description: 'Tên đề tài tiếng Việt' })
  @IsNotEmpty({ message: 'Tên đề tài tiếng Việt không được để trống' })
  @IsString({ message: 'Tên đề tài phải là chuỗi ký tự' })
  @MinLength(5, { message: 'Tên đề tài phải có tối thiểu 5 ký tự' })
  @MaxLength(300, { message: 'Tên đề tài không được vượt quá 300 ký tự' })
  titleVi: string;

  @ApiProperty({ enum: TopicType, example: TopicType.MAJOR, description: 'Loại đồ án' })
  @IsEnum(TopicType, { message: 'Loại đồ án không hợp lệ' })
  topicType: TopicType;

  @ApiProperty({ example: 1, minimum: 1, maximum: 2, description: 'Số lượng sinh viên tối đa' })
  @IsInt({ message: 'Số lượng sinh viên phải là số nguyên' })
  @Min(1, { message: 'Số lượng sinh viên tối thiểu là 1' })
  @Max(2, { message: 'Số lượng sinh viên tối đa là 2' })
  maxStudents: number;
}
```

---

## 📋 PHẦN 4: CHECKLIST QUY TẮC NGHIỆP VỤ BẮT BUỘC (SRS BR-01 $\rightarrow$ BR-13)

Khi phát triển các module tương ứng, **BẮT BUỘC** tích hợp các quy tắc sau:

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

## 🔄 PHẦN 5: PIPELINE 6 BƯỚC KHI XÂY DỰNG MỘT TÍNH NĂNG MỚI (DEVELOPMENT WORKFLOW)

Khi được giao xây dựng một Module hoặc Endpoint mới, Developer phải thực hiện tuần tự theo 6 bước:

```
[1. Đọc SRS] ➔ [2. Tạo DTO & Schema] ➔ [3. Viết Service Logic] ➔ [4. Viết Controller & Guard] ➔ [5. Kiểm thử Unit/API] ➔ [6. Kết nối Frontend]
```

### Chi tiết các bước:
1. **Bước 1 – Đọc SRS & Phân tích nghiệp vụ:**
   * Mở [`docs/SRS_Quan_ly_do_an_UTC2.md`](docs/SRS_Quan_ly_do_an_UTC2.md), tìm use case và quy tắc nghiệp vụ liên quan.
   * Xác định dữ liệu cần đọc/ghi trên 28 bảng CSDL.
2. **Bước 2 – Khai báo DTOs & Validation:**
   * Tạo các file trong `dto/` kèm theo class-validator decorators và Swagger/Scalar annotations (`@ApiProperty()`, `@IsNotEmpty()`, `@Min()`, `@Max()`...).
   * Khai báo thông báo lỗi tiếng Việt rõ ràng cho từng trường.
3. **Bước 3 – Cài đặt Service Layer:**
   * Inject `PrismaService` hoặc `CustomRepository`.
   * Kiểm tra điều kiện nghiệp vụ (Business Rule Check).
   * Thực thi Transaction nếu có nhiều thao tác ghi dữ liệu liên quan (`this.prisma.$transaction`).
   * Ghi nhận Status History hoặc Audit Log nếu là hành động thay đổi trạng thái quan trọng.
4. **Bước 4 – Cài đặt Controller Layer & Bảo mật:**
   * Định nghĩa RESTful Route chuẩn (`GET /topics`, `POST /topics`, `PATCH /topics/:id/approve`).
   * Gắn `@UseGuards(JwtAuthGuard, RolesGuard)`.
   * Khai báo `@Roles('...')`, `@Permissions('...')`, `@RequirePosition('...')`.
   * Gắn `@ApiOperation()`, `@ApiResponse()` cho Swagger UI & Scalar.
5. **Bước 5 – Kiểm thử API & Type-check:**
   * Chạy `pnpm --filter backend exec tsc --noEmit` đảm bảo không có lỗi biên dịch.
   * Mở Scalar UI (`http://localhost:8000/api/reference`) để test trực tiếp các kịch bản thành công và ngoại lệ.
6. **Bước 6 – Kết nối Frontend Next.js:**
   * Viết API Client Function trong `apps/frontend/src/features/<module>/`.
   * Sử dụng TanStack Query (`useQuery`, `useMutation`).
   * Render giao diện theo đúng Role Space (`/student`, `/lecturer`, `/admin`...).

---

## 🏷️ PHẦN 6: QUY CHUẨN ĐẶT TÊN (NAMING CONVENTIONS)

| Thành phần | Quy ước | Ví dụ |
| :--- | :--- | :--- |
| **Thư mục (Folders)** | `kebab-case` | `thesis-reports`, `system-settings`, `detailed-scores` |
| **Tên File (Files)** | `kebab-case.suffix.ts` | `create-topic.dto.ts`, `schedule-conflict.validator.ts` |
| **Tên Class / Interface** | `PascalCase` | `TopicsService`, `CreateTopicDto`, `JwtPayload` |
| **Tên Method / Biến** | `camelCase` | `findAllTopics()`, `scoreProcess`, `advisorLecturerId` |
| **Tên Enum / Constant** | `UPPER_SNAKE_CASE` | `TopicStatus.APPROVED`, `AccountRole.STUDENT` |
| **Database Tables** | `plural_snake_case` | `faculties`, `lecturers`, `detailed_scores` |
| **Database Columns** | `snake_case` | `full_name`, `is_qualified_for_defense`, `score_final` |
| **RESTful API URL** | `kebab-case` (Số nhiều) | `GET /api/v1/thesis-reports`, `POST /api/v1/grade-appeals` |

---

## 📦 PHẦN 7: QUY CHUẨN GIT COMMIT (CONVENTIONAL COMMITS)

Mọi commit phải tuân thủ định dạng: `<type>(<scope>): <description>`

* `feat`: Thêm tính năng mới (`feat(topics): implement topic proposal and approval workflow`).
* `fix`: Sửa lỗi (`fix(grading): fix weight calculation in rubric criteria`).
* `refactor`: Tái cấu trúc mã nguồn không thay đổi chức năng (`refactor(auth): split jwt strategy into separate guards`).
* `docs`: Cập nhật tài liệu (`docs(srs): add full SRS specification`).
* `chore`: Cập nhật cấu hình, dependencies (`chore: update prisma driver adapter dependencies`).

---
*Tài liệu Tiêu chuẩn Kiến trúc Code UTC2-DAMS – Ban hành Tháng 10/2026.*
