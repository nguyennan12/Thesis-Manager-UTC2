# HƯỚNG DẪN THIẾT KẾ KIẾN TRÚC CODE & PHÂN QUYỀN HỆ THỐNG
## HỆ THỐNG WEB QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP (UTC2 - DAMS)

> **Công nghệ áp dụng:**
> - **Frontend:** Next.js 14/15 (App Router, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Zod)
> - **Backend:** NestJS (TypeScript, Modular Architecture, Prisma ORM, BullMQ, Socket.io)
> - **Database & Infra:** PostgreSQL 16+, Redis 7+, MinIO/S3 File Storage, Docker Compose

---

## 🏛️ PHẦN 1: TỔNG QUAN NGUYÊN LÝ THIẾT KẾ (DESIGN PRINCIPLES)

1. **Decoupled Architecture (Kiến trúc tách rời):**
   - **Tách biệt Hạ tầng (Infra-Agnostic):** Tầng nghiệp vụ không phụ thuộc vào CSDL cụ thể hay hạ tầng lưu trữ (dễ dàng chuyển đổi giữa PostgreSQL local $\leftrightarrow$ AWS RDS, MinIO $\leftrightarrow$ AWS S3 qua Adapter/Interfaces).
   - **Tách biệt Quy chế (Configuration-Driven):** Tiêu chí chấm điểm, công thức tính điểm tổng kết, ngưỡng đạo văn đều được cấu hình động qua database, không bị hard-code vào mã nguồn.
2. **Single Responsibility Principle (SRP):** Tránh "God Service" bằng cách chia nhỏ các tác vụ nặng (thuật toán tính điểm, check đạo văn, kiểm tra xung đột lịch) ra các Service con, Custom Validator và Queue Worker.
3. **Type-Safety từ Database đến UI:** Sử dụng TypeScript toàn diện, chia sẻ Type/Enums giữa Backend và Frontend.
4. **Bảo mật Đa lớp (Defense in Depth):** Chặn quyền tại Frontend (`middleware.ts`), chặn tại Backend Gateway (`Guards/Decorators`), và lọc dữ liệu tại Tầng Service (`Data Scoping`).

---

## 📁 PHẦN 2: CẤU TRÚC THƯ MỤC TOÀN BỘ DỰ ÁN (MONOREPO WORKSPACE)

Khuyến nghị sử dụng cấu trúc **Monorepo (pnpm / yarn workspaces)** để đồng bộ DTO và Types giữa 2 đầu:

```text
Project-Major-UTC2/
├── apps/
│   ├── backend/                       # NestJS API Application
│   └── frontend/                      # Next.js App Router Application
│
├── packages/                          # Các package dùng chung
│   ├── types/                         # Enums: Role, TrangThaiDeTai, TrangThaiDangKy, LoaiDoAn...
│   └── schemas/                       # Zod Validation Schemas (Dùng chung cho Form FE & DTO BE)
│
├── docs/                              # Tài liệu phân tích & đặc tả
│   ├── SRS_Quan_ly_do_an_UTC2.docx
│   ├── SRS_Summary_UTC2.md
│   └── SYSTEM_ARCHITECTURE_AND_RBAC.md
│
├── docker-compose.yml                 # Chạy PostgreSQL, Redis, MinIO
├── package.json
└── README.md
```

---

## ⚙️ PHẦN 3: KIẾN TRÚC BACKEND (NESTJS + PRISMA + POSTGRESQL)

### 3.1. Cấu trúc cây thư mục Backend
```text
backend/
├── prisma/
│   ├── schema.prisma                  # 25 Bảng CSDL (14 cốt lõi + 11 mở rộng) chuẩn PostgreSQL
│   ├── migrations/                    # Lịch sử migration CSDL
│   └── seed.ts                        # Dữ liệu khởi tạo (Admin, Khoa, Ngành, Tiêu chí)
│
├── src/
│   ├── common/                        # DÙNG CHUNG TOÀN HỆ THỐNG
│   │   ├── constants/                 # Enums, ErrorCodes, System Constants
│   │   ├── decorators/                # @CurrentUser(), @Roles(), @RequirePosition(), @DepartmentScope()
│   │   ├── filters/                   # HttpExceptionFilter, PrismaExceptionFilter
│   │   ├── guards/                    # JwtAuthGuard, RolesGuard, DepartmentScopeGuard
│   │   ├── interceptors/              # TransformResponseInterceptor, LoggingInterceptor, AuditLogInterceptor
│   │   ├── interfaces/                # IStorageService, IMailService, ApiResponse, JwtPayload
│   │   ├── pipes/                     # ValidationPipe
│   │   └── utils/                     # Formatters, Date helpers, Math calculators
│   │
│   ├── config/                        # Cấu hình biến môi trường (.env, Database, Redis, JWT)
│   │   └── configuration.ts
│   │
│   ├── database/                      # Quản lý kết nối Prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── modules/                       # 13 MODULES NGHIỆP VỤ THEO SRS
│   │   ├── auth/                      # 1. Xác thực (Login, JWT, OTP, Refresh Token)
│   │   ├── users/                     # 2. Quản lý Tài khoản & Hồ sơ GV, SV
│   │   ├── academic/                  # 3. Danh mục: Khoa, Ngành, Bộ môn, Lớp, Học kỳ
│   │   ├── topics/                    # 4. Quản lý Đề tài (Đề xuất, Duyệt TBM/BCN)
│   │   ├── registrations/             # 5. Đăng ký Đề tài & Check điều kiện SV
│   │   ├── progress/                  # 6. Theo dõi Tiến độ & Báo cáo tuần
│   │   ├── thesis-reports/            # 7. Nộp toàn văn, Check Trùng lặp (BullMQ Worker)
│   │   ├── councils/                  # 8. Quản lý Hội đồng & Check Xung đột Lịch
│   │   ├── grading/                   # 9. Bộ tiêu chí, Khóa phiếu điểm, Tính điểm tổng kết
│   │   ├── complaints/                # 10. Quản lý Phúc khảo / Khiếu nại điểm
│   │   ├── statistics/                # 11. Báo cáo thống kê & Xuất Excel/PDF
│   │   ├── notifications/             # 12. Thông báo In-app (Socket.io) & Email SMTP
│   │   ├── audit-logs/                # 13. Nhật ký hệ thống & Ghi vết chuyển trạng thái
│   │   └── system-settings/           # 14. Cấu hình tham số động hệ thống
│   │
│   ├── app.module.ts
│   └── main.ts
```

### 3.2. Quy tắc phân tách Service & Tránh "God Service"
Không dồn toàn bộ logic vào 1 service. Áp dụng quy tắc sau:
1. **Module đơn giản (CRUD):** Dùng 1 Service (`SystemSettingsService`, `AuditLogsService`).
2. **Module phức tạp:** Bắt buộc tách thành nhiều Service con chuyên trách:
   * **`thesis-reports/`:**
     * `thesis-reports.service.ts`: Quản lý nghiệp vụ chính và trạng thái duyệt.
     * `text-extractor.service.ts`: Trích xuất text từ file PDF/DOCX.
     * `similarity.service.ts`: Thuật toán băm N-gram và tính % tương đồng.
     * `plagiarism.processor.ts`: Worker BullMQ xử lý ngầm trong hàng đợi.
   * **`grading/`:**
     * `criteria.service.ts`: Quản lý bộ tiêu chí và kiểm tra tổng trọng số $= 100\%$ (BR-08).
     * `score-sheet.service.ts`: Nhập điểm chi tiết và cơ chế Khóa phiếu điểm (BR-09).
     * `grade-calculator.service.ts`: Thuật toán tính điểm HĐ, điểm tổng kết và cảnh báo lệch điểm (BR-10, BR-11).
   * **`councils/`:**
     * `councils.service.ts`: Quản lý Hội đồng, gán sinh viên.
     * `schedule-conflict.validator.ts`: Bộ kiểm tra cấm trùng giờ GV và trùng phòng (BR-07).
     * `council-export.service.ts`: Xuất quyết định và biên bản bảo vệ.

### 3.3. Quy tắc sử dụng `class` vs `interface` trong NestJS
| Thành phần | Dùng `class` | Dùng `interface` | Lý do kỹ thuật |
| :--- | :---: | :---: | :--- |
| **DTO (Data Transfer Object)** | **BẮT BUỘC** | ❌ | Cần giữ metadata lúc runtime cho `class-validator` và Swagger |
| **Custom Request / Payload JWT** | ❌ | **BẮT BUỘC** | Chỉ dùng lúc biên dịch, không tốn bộ nhớ runtime |
| **Hợp đồng Service (IStorage, IMail)** | ❌ | **BẮT BUỘC** | Đảm bảo nguyên lý Dependency Inversion, dễ mock khi viết Unit test |
| **Cấu trúc Chuẩn API Response** | ❌ | **BẮT BUỘC** | Định hình format `{ success, data, message, meta }` |
| **Database Entities (Prisma)** | ❌ | Import từ `@prisma/client` | Prisma tự sinh Type an toàn $100\%$ |

### 3.4. Chiến lược Data Access Layer (Repository Pattern)
* **CRUD thông thường:** Service gọi trực tiếp `this.prisma.<entity>` để code gọn gàng, tránh boilerplate thừa thãi.
* **Truy vấn phức tạp:** Tách riêng **Custom Repository** (ví dụ: `CouncilRepository` kiểm tra xung đột thời gian bằng SQL phức tạp, `StatisticsRepository` tính toán tổng hợp điểm số).

---

## 🖥️ PHẦN 4: KIẾN TRÚC FRONTEND (NEXT.JS APP ROUTER)

### 4.1. Cấu trúc cây thư mục Frontend
```text
frontend/
├── src/
│   ├── app/                           # App Router (Phân chia theo Role Groups)
│   │   ├── (auth)/                    # Nhóm trang công khai (Login, Forgot Pass)
│   │   │   ├── login/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/               # Shell Dashboard sau đăng nhập
│   │   │   ├── layout.tsx             # Gồm Header, Dynamic Sidebar, User Menu
│   │   │   ├── page.tsx               # Redirect thông minh theo Role
│   │   │   │
│   │   │   ├── student/               # 🎓 Không gian Sinh viên (/student/*)
│   │   │   │   ├── topics/page.tsx            # Tra cứu & Đăng ký đề tài
│   │   │   │   ├── progress/page.tsx          # Nộp báo cáo tuần theo timeline
│   │   │   │   ├── submission/page.tsx        # Nộp bản toàn văn & xem % trùng
│   │   │   │   └── grades/page.tsx            # Xem điểm & gửi phúc khảo
│   │   │   │
│   │   │   ├── lecturer/              # 👨‍🏫 Không gian Giảng viên (/lecturer/*)
│   │   │   │   ├── my-topics/page.tsx         # Đề xuất đề tài
│   │   │   │   ├── mentoring/page.tsx         # Nhận xét tiến độ & Duyệt bảo vệ
│   │   │   │   └── evaluation/page.tsx        # Bảng nhập điểm chi tiết HĐ
│   │   │   │
│   │   │   ├── department/            # 🏛️ Trưởng bộ môn (/department/*)
│   │   │   │   ├── topic-approval/page.tsx    # Duyệt đề tài của bộ môn
│   │   │   │   └── council-proposal/page.tsx  # Đề xuất nhân sự Hội đồng
│   │   │   │
│   │   │   ├── academic-affairs/      # 📋 Giáo vụ Khoa (/academic-affairs/*)
│   │   │   │   ├── semesters/page.tsx         # Cấu hình học kỳ & mốc hạn
│   │   │   │   ├── councils/page.tsx          # Lập HĐ & Xếp lịch bảo vệ
│   │   │   │   └── grade-management/page.tsx  # Tổng hợp & Công bố điểm
│   │   │   │
│   │   │   ├── dean/                  # 🎖️ Ban Chủ nhiệm Khoa (/dean/*)
│   │   │   │   ├── approvals/page.tsx         # Phê duyệt ngoại lệ / Mở khóa điểm
│   │   │   │   └── statistics/page.tsx        # Dashboard thống kê toàn khoa
│   │   │   │
│   │   │   └── admin/                 # ⚙️ Quản trị viên (/admin/*)
│   │   │       ├── users/page.tsx             # Quản lý tài khoản & phân quyền
│   │   │       └── audit-logs/page.tsx        # Nhật ký hệ thống
│   │   │
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── components/                    # UI Components
│   │   ├── ui/                        # shadcn/ui primitives (Button, Dialog, Table, Form...)
│   │   ├── common/                    # StatusBadge, DataTable, FileUploader, ConfirmDialog
│   │   ├── layout/                    # Header, DynamicSidebar, NotificationBell
│   │   └── widgets/                   # TopicCard, ScoreInputSheet, ConflictAlertModal
│   │
│   ├── features/                      # Feature Logic (Hooks + API Calls + Schemas)
│   │   ├── auth/                      # useAuth, auth.api.ts, auth.schema.ts
│   │   ├── topics/                    # useTopics, topics.api.ts
│   │   ├── registrations/             # useRegistrations, registrations.api.ts
│   │   ├── progress/                  # useProgress, progress.api.ts
│   │   ├── councils/                  # useCouncils, councils.api.ts
│   │   └── grading/                   # useGrading, grading.api.ts
│   │
│   ├── hooks/                         # Custom Hooks (useSocket, useDebounce, usePermission)
│   ├── lib/                           # Axios Client (tự động Refresh Token), Utils
│   ├── stores/                        # Zustand Global Store (useUserStore, useNotificationStore)
│   └── types/                         # TypeScript Types
```

---

## 🔐 PHẦN 5: CHIẾN LƯỢC PHÂN QUYỀN TOÀN DIỆN (RBAC + ABAC)

Hệ thống kết hợp **2 cấp độ phân quyền**:
1. **RBAC (Role-Based Access Control):** Xác định Role cơ sở (`SINH_VIEN`, `GIANG_VIEN`, `GIAO_VU`, `ADMIN`).
2. **ABAC / Data Scoping (Attribute-Based Access Control):** Xác định chức danh phụ trách và phạm vi đơn vị (`TRUONG_BO_MON`, `BAN_CHU_NHIEM`, `TRUONG_KHOA` gắn với `ma_bo_mon` hoặc `ma_khoa`).

```
┌────────────────────────────────────────────────────────────────────────┐
│               MÔ HÌNH PHÂN QUYỀN 3 TẦNG BẢO VỆ                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Frontend Route Guard (Next.js middleware.ts)                        │
│    -> Chặn ngay trên URL theo Route Groups                             │
│                                                                        │
│ 2. Backend Gateway Guard (NestJS Controller Guards)                    │
│    -> @UseGuards(JwtAuthGuard, RolesGuard, DepartmentScopeGuard)       │
│                                                                        │
│ 3. Database Data Scoping (NestJS Service Layer)                        │
│    -> Tự động inject điều kiện WHERE theo Scope người dùng             │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.1. Phân quyền trên Frontend (Next.js `middleware.ts`)
```typescript
// frontend/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const pathname = req.nextUrl.pathname;

  if (!token && pathname.startsWith('/(dashboard)')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const user = decodeToken(token); // Lấy role, positions, facultyId, departmentId

  // Chặn sinh viên vào route quản trị / giảng viên
  if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/403', req.url));
  }
  if (pathname.startsWith('/department') && !user.positions.includes('TRUONG_BO_MON')) {
    return NextResponse.redirect(new URL('/403', req.url));
  }
  if (pathname.startsWith('/academic-affairs') && user.role !== 'GIAO_VU') {
    return NextResponse.redirect(new URL('/403', req.url));
  }

  return NextResponse.next();
}
```

### 5.2. Phân quyền trên Backend (NestJS Controller Guards & Decorators)
Backend giữ chuẩn RESTful URL (không chia URL theo role) và bảo vệ bằng Decorators:

```typescript
@Controller('topics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TopicsController {

  // Bất kỳ user nào đã login đều có thể tra cứu danh sách đề tài đã duyệt
  @Get()
  @Roles('SINH_VIEN', 'GIANG_VIEN', 'GIAO_VU', 'ADMIN')
  findAllTopics(@CurrentUser() user: JwtPayload) {
    return this.topicsService.findAll(user);
  }

  // Chỉ Giảng viên mới được tạo đề xuất đề tài
  @Post()
  @Roles('GIANG_VIEN')
  createTopic(@Body() dto: CreateTopicDto, @CurrentUser() user: JwtPayload) {
    return this.topicsService.create(dto, user.maGiangVien);
  }

  // Chỉ Trưởng bộ môn mới được duyệt đề tài thuộc bộ môn mình
  @Patch(':id/approve')
  @Roles('GIANG_VIEN')
  @RequirePosition('TRUONG_BO_MON')
  @UseGuards(DepartmentScopeGuard)
  approveTopic(@Param('id') id: string, @Body() dto: ApproveTopicDto) {
    return this.topicsService.approve(id, dto);
  }
}
```

### 5.3. Phân quyền dữ liệu tại Tầng Service (Data Scoping)
```typescript
// backend/src/modules/topics/topics.service.ts
async findAll(user: JwtPayload) {
  // 1. Sinh viên: Chỉ thấy đề tài đã duyệt trong học kỳ hiện tại
  if (user.role === 'SINH_VIEN') {
    return this.prisma.deTai.findMany({
      where: { trangThaiDt: 'DA_DUYET' }
    });
  }

  // 2. Giảng viên thường: Thấy đề tài đã duyệt + đề tài do chính mình đề xuất
  if (user.role === 'GIANG_VIEN' && !user.positions.includes('TRUONG_BO_MON')) {
    return this.prisma.deTai.findMany({
      where: {
        OR: [
          { trangThaiDt: 'DA_DUYET' },
          { maGvDeXuat: user.maGiangVien }
        ]
      }
    });
  }

  // 3. Trưởng bộ môn: Thấy toàn bộ đề tài thuộc Bộ môn của mình quản lý
  if (user.positions.includes('TRUONG_BO_MON')) {
    return this.prisma.deTai.findMany({
      where: { maBoMon: user.departmentId }
    });
  }
}
```

---

## 🗄️ PHẦN 6: TỔ CHỨC CƠ SỞ DỮ LIỆU POSTGRESQL (28 BẢNG)

```
┌────────────────────────────────────────────────────────────────────────┐
│                  MÔ HÌNH CƠ SỞ DỮ LIỆU POSTGRESQL                      │
├────────────────────────────────────────────────────────────────────────┤
│ 15 BẢNG NGHIỆP VỤ CỐT LÕI (Từ SRS):                                    │
│  - faculties, majors, departments, lecturers, classes, students        │
│  - semesters, topics, registrations, councils, council_members         │
│  - progress_reports, rubric_sets, evaluation_criteria, detailed_scores │
│                                                                        │
│ 4 BẢNG DYNAMIC RBAC (Phân quyền động):                                 │
│  - roles (Danh mục vai trò: ADMIN, LECTURER, STUDENT, DEAN, HOD...)    │
│  - permissions (Danh mục quyền: topics.create, scores.lock...)         │
│  - role_permissions (Quan hệ N-N Vai trò & Quyền)                      │
│  - account_roles (Gán vai trò + Phạm vi Scope Khoa/Bộ môn cho Account) │
│                                                                        │
│ 9 BẢNG MỞ RỘNG CHO WEB APP:                                            │
│  - accounts (Xác thực & Thông tin tài khoản)                           │
│  - attachments (Metadata file lưu trữ MinIO/S3)                        │
│  - plagiarism_results (Chi tiết % trùng lặp văn bản)                   │
│  - status_histories (Audit log chuyển trạng thái hồ sơ)                │
│  - change_requests (Đơn xin đổi đề tài, đổi GVHD muộn)                 │
│  - grade_appeals (Tiếp nhận & xử lý phúc khảo điểm)                    │
│  - notifications (Notification in-app & Email queue)                   │
│  - audit_logs (Audit trail toàn bộ request CUD)                        │
│  - system_settings (Tham số động: ngưỡng đạo văn, hệ số điểm a/b)      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 PHẦN 7: LỘ TRÌNH VÀ CHECKLIST BẮT ĐẦU TRIỂN KHAI

* [ ] **Bước 1 (Database):** Tạo file `schema.prisma` đầy đủ 25 bảng với các quan hệ và constraint chuẩn PostgreSQL $\rightarrow$ Chạy migration tạo bảng.
* [ ] **Bước 2 (Backend Base):** Dựng khung NestJS, cấu hình global `HttpExceptionFilter`, `TransformResponseInterceptor`, cài đặt Module `Auth` (JWT/Refresh Token/Guards).
* [ ] **Bước 3 (Frontend Base):** Dựng Next.js App Router, cấu hình Tailwind + `shadcn/ui`, cài đặt `middleware.ts` và Layout Sidebar theo Role.
* [ ] **Bước 4 (Phase 1 & 2):** Xây dựng Module Đề tài (`topics`) và Đăng ký đề tài (`registrations` với Database Transaction).
* [ ] **Bước 5 (Phase 3 & 4):** Xây dựng Module Báo cáo tuần (`progress`) và Báo cáo toàn văn (`thesis-reports` với BullMQ check trùng lặp).
* [ ] **Bước 6 (Phase 5, 6 & 7):** Xây dựng Module Hội đồng (`councils` với Schedule Conflict Validator), Chấm điểm (`grading` với Khóa phiếu & Công thức điểm) và Thống kê (`statistics`).

---
*Tài liệu được thiết kế chuyên biệt cho đồ án Quản lý đồ án tốt nghiệp UTC2 – Tháng 10/2026.*
