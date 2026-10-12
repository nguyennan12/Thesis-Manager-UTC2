
# Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)

> **UTC2 Degree Project & Thesis Advisory Management System (UTC2-DAMS)**  
> Phân hiệu Trường Đại học Giao thông Vận tải tại TP. Hồ Chí Minh (UTC2)

[![pnpm](https://img.shields.io/badge/pnpm-workspace-orange.svg)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-blue?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue?logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## 📖 1. Giới thiệu tổng quan

Hệ thống **UTC2-DAMS** được xây dựng nhằm số hóa toàn diện quy trình quản lý đồ án tốt nghiệp từ khâu khởi tạo học kỳ, đăng ký đề tài, duyệt đề tài, báo cáo tiến độ tuần, nộp báo cáo toàn văn, kiểm tra trùng lặp (đạo văn), chấm điểm hội đồng (với công thức chuẩn và khóa phiếu điểm), cho đến tiếp nhận & xử lý phúc khảo điểm.

### Các tác nhân chính trong hệ thống (8 Roles):
1. **🎓 Sinh viên (`STUDENT`):** Tra cứu, đăng ký đề tài, nộp báo cáo tuần/toàn văn, xem điểm, gửi đơn khiếu nại.
2. **👨‍🏫 Giảng viên hướng dẫn (`LECTURER`):** Đề xuất đề tài, duyệt sinh viên, nhận xét tiến độ tuần, đánh giá đủ điều kiện bảo vệ.
3. **🔍 Giảng viên phản biện (`REVIEWER`):** Đọc báo cáo, chấm điểm phản biện và ghi nhận xét.
4. **⚖️ Thành viên Hội đồng (`COUNCIL_MEMBER` / `CHAIRMAN` / `SECRETARY`):** Nhập điểm chi tiết theo rubric tiêu chí, khóa phiếu điểm cá nhân.
5. **🏛️ Trưởng Bộ môn (`HEAD_OF_DEPARTMENT`):** Thẩm định & duyệt đề tài thuộc bộ môn, đề xuất nhân sự hội đồng.
6. **📋 Giáo vụ Khoa (`ACADEMIC_AFFAIRS`):** Thiết lập học kỳ, mốc thời gian, lập hội đồng, phân công sinh viên, tổng hợp công bố điểm.
7. **🎖️ Ban Chủ nhiệm Khoa (`FACULTY_DEAN`):** Phê duyệt danh sách đề tài toàn khoa, duyệt ngoại lệ / mở khóa điểm, giải quyết phúc khảo.
8. **⚙️ Quản trị viên (`ADMIN`):** Quản trị tài khoản, danh mục phân quyền động (Dynamic RBAC), theo dõi audit log, cấu hình tham số hệ thống.

---

## 🏛️ 2. Kiến trúc Monorepo (pnpm Workspace)

```text
Project-Major-UTC2/
├── apps/
│   ├── backend/                       # NestJS Application
│   │   ├── prisma/
│   │   │   ├── schema/                # Multi-file Prisma Schema (8 files)
│   │   │   │   ├── base.prisma        # Datasource, Generator & Domain Enums
│   │   │   │   ├── auth-rbac.prisma   # Account, Role, Permission, AccountRole
│   │   │   │   ├── academic.prisma    # Faculty, Major, Department, Lecturer, Class, Student, Semester
│   │   │   │   ├── topics.prisma      # Topic, Registration
│   │   │   │   ├── progress.prisma    # ProgressReport, PlagiarismResult
│   │   │   │   ├── councils.prisma    # Council, CouncilMember
│   │   │   │   ├── grading.prisma     # RubricSet, EvaluationCriterion, DetailedScore, GradeAppeal
│   │   │   │   └── system.prisma      # Notification, AuditLog, SystemSetting, Attachment, ChangeRequest
│   │   │   ├── migrations/            # SQL Migration History
│   │   │   └── seed.ts                # Database Seed Script
│   │   ├── src/
│   │   │   ├── common/                # Constants, Decorators, Filters, Guards, Interceptors, Pipes
│   │   │   ├── config/                # Environment & App Configuration
│   │   │   ├── database/              # PrismaService & PrismaModule
│   │   │   └── modules/               # 14 Business Modules (Skeleton Architecture)
│   │   └── prisma.config.ts           # Prisma 7 Configuration
│   │
│   └── frontend/                      # Next.js 15 App Router
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/            # Public Auth Pages (Login, Forgot Password)
│       │   │   └── (dashboard)/       # Role-based Dashboard Spaces
│       │   │       ├── student/       # Sinh viên (/student/*)
│       │   │       ├── lecturer/      # Giảng viên (/lecturer/*)
│       │   │       ├── department/    # Trưởng bộ môn (/department/*)
│       │   │       ├── academic-affairs/ # Giáo vụ (/academic-affairs/*)
│       │   │       ├── dean/          # Ban chủ nhiệm (/dean/*)
│       │   │       └── admin/         # Quản trị hệ thống (/admin/*)
│       │   ├── components/            # UI Primitives & Common Components (shadcn/ui)
│       │   ├── features/              # Feature Logic (Hooks, API Queries, Schemas)
│       │   ├── lib/                   # Axios HTTP Client & Helpers
│       │   └── middleware.ts          # Route Guard theo vai trò & Auth
│       └── package.json
│
├── packages/                          # Shared Packages
│   ├── types/                         # Re-exported Prisma types, Enums & Interfaces
│   └── schemas/                       # Shared Zod Validation Schemas
│
├── docs/                              # Tài liệu phân tích & Thiết kế hệ thống
│   ├── SRS_Quan_ly_do_an_UTC2.docx    # Tài liệu SRS gốc
│   ├── SRS_Summary_UTC2.md            # Tóm tắt 7 giai đoạn, 8 roles, 13 business rules
│   ├── SYSTEM_ARCHITECTURE_AND_RBAC.md# Thiết kế kiến trúc tổng thể, Monorepo & Phân quyền
│   └── DATABASE_DESIGN_SPEC.md        # Đặc tả 28 bảng CSDL & sơ đồ quan hệ ERD
│
├── docker-compose.yml                 # Định nghĩa dịch vụ hạ tầng Docker
├── .env.example                       # Biến môi trường mẫu
├── pnpm-workspace.yaml                # Cấu hình pnpm workspace
└── README.md
```

---

## 🗄️ 3. Cơ sở dữ liệu & Dynamic RBAC (28 Bảng)

Hệ thống được thiết kế theo chuẩn CSDL quan hệ PostgreSQL 16+ với 28 bảng:

1. **15 Bảng Nghiệp vụ cốt lõi:** `faculties`, `majors`, `departments`, `lecturers`, `classes`, `students`, `semesters`, `topics`, `registrations`, `councils`, `council_members`, `progress_reports`, `rubric_sets`, `evaluation_criteria`, `detailed_scores`.
2. **4 Bảng Dynamic RBAC:** `roles`, `permissions`, `role_permissions`, `account_roles` (Hỗ trợ phân quyền động theo vai trò và phạm vi Khoa/Bộ môn).
3. **9 Bảng Mở rộng Web Application:** `accounts`, `attachments`, `plagiarism_results`, `status_histories`, `change_requests`, `grade_appeals`, `notifications`, `audit_logs`, `system_settings`.

---

## 🚀 4. Hướng dẫn cài đặt & Khởi chạy (Local Development)

### Yêu cầu môi trường (Prerequisites)
* **Node.js:** `>= 20.x`
* **pnpm:** `>= 9.x` (`npm i -g pnpm`)
* **Docker & Docker Compose**
* **PostgreSQL:** `16+`

### Bước 1: Clone dự án và cài đặt dependencies
```bash
git clone https://github.com/nguyennan12/Thesis-Manager-UTC2.git
cd Thesis-Manager-UTC2

# Cài đặt toàn bộ dependencies trong monorepo
pnpm install
```

### Bước 2: Thiết lập biến môi trường
```bash
# Tạo file .env từ template mẫu
cp .env.example .env
```
Cấu hình các thông số kết nối CSDL, Redis, JWT trong `.env`.

### Bước 3: Khởi chạy Database & Áp dụng Migration
```bash
# 1. Sinh mã Prisma Client từ Multi-file schema
pnpm --filter backend exec prisma generate

# 2. Áp dụng Migration vào Database PostgreSQL
pnpm --filter backend exec prisma migrate deploy
```

### Bước 4: Khởi chạy ứng dụng
```bash
# Chạy đồng thời cả Backend (NestJS: port 3001) và Frontend (Next.js: port 3000)
pnpm dev

# Hoặc chạy riêng lẻ từng ứng dụng:
pnpm --filter backend dev    # http://localhost:3001
pnpm --filter frontend dev   # http://localhost:3000
```

---

## 📚 5. Tài liệu tham khảo chi tiết

Mọi thông tin chi tiết về quy tắc nghiệp vụ, ma trận phân quyền, thiết kế bảng và tiêu chuẩn code đều được lưu tại thư mục `docs/`:
* [🗺️ Lộ trình Triển khai Dự án Chi tiết (Project Roadmap - 10 Sprints)](docs/PROJECT_ROADMAP.md)
* [📘 Toàn văn Đặc tả Yêu cầu Phần mềm (Full SRS 9 Chương)](docs/SRS_Quan_ly_do_an_UTC2.md)
* [🔐 Ma trận Phân quyền & Danh mục mã Permission (RBAC Matrix)](docs/RBAC_PERMISSION_MATRIX.md)
* [🌐 Đặc tả Danh mục Endpoints RESTful API (87 Endpoints)](docs/API_ENDPOINTS_SPECIFICATION.md)
* [📜 Quy tắc phát triển & Tiêu chuẩn kiến trúc Code (Coding Guidelines)](docs/CODING_GUIDELINES_AND_ARCHITECTURE_RULES.md)
* [📋 Tóm tắt đặc tả yêu cầu SRS (13 Business Rules BR-01 $\rightarrow$ BR-13)](docs/SRS_Summary_UTC2.md)
* [🏛️ Kiến trúc hệ thống & Mô hình phân quyền 3 tầng](docs/SYSTEM_ARCHITECTURE_AND_RBAC.md)
* [🗺️ Đặc tả 28 bảng CSDL & Sơ đồ ERD](docs/DATABASE_DESIGN_SPEC.md)

---

## 👥 Tác giả
* **Nhóm phát triển Đồ án Tốt nghiệp UTC2** (Phân hiệu Trường Đại học GTVT tại TP.HCM)
* Repository: [Thesis-Manager-UTC2](https://github.com/nguyennan12/Thesis-Manager-UTC2)
