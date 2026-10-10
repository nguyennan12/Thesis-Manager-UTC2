-- DropForeignKey
ALTER TABLE "assigned_roles" DROP CONSTRAINT IF EXISTS "assigned_roles_account_id_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT IF EXISTS "classes_homeroom_lecturer_id_fkey";

-- DropForeignKey
ALTER TABLE "topics" DROP CONSTRAINT IF EXISTS "topics_target_major_id_fkey";

-- DropIndex
DROP INDEX IF EXISTS "councils_defense_date_idx";

-- DropIndex
DROP INDEX IF EXISTS "registrations_semester_id_idx";

-- DropIndex
DROP INDEX IF EXISTS "registrations_student_id_idx";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "role";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN IF EXISTS "homeroom_lecturer_id",
DROP COLUMN IF EXISTS "student_count",
ADD COLUMN IF NOT EXISTS "homeroom_advisor_id" UUID;

-- AlterTable
ALTER TABLE "council_members" DROP CONSTRAINT IF EXISTS "council_members_pkey",
DROP COLUMN IF EXISTS "confirmed_at",
DROP COLUMN IF EXISTS "is_confirmed",
ADD COLUMN IF NOT EXISTS "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "role" SET DEFAULT 'MEMBER',
ADD CONSTRAINT "council_members_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "councils" DROP COLUMN IF EXISTS "location",
DROP COLUMN IF EXISTS "max_students",
ADD COLUMN IF NOT EXISTS "decision_date" DATE,
ADD COLUMN IF NOT EXISTS "decision_number" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "defense_room" VARCHAR(50) NOT NULL DEFAULT 'A1-101',
ALTER COLUMN "code" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "start_time" TYPE VARCHAR(10),
ALTER COLUMN "end_time" TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "progress_reports" DROP COLUMN IF EXISTS "report_content",
ADD COLUMN IF NOT EXISTS "report_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "registrations" DROP COLUMN IF EXISTS "advisor_score",
DROP COLUMN IF EXISTS "council_score",
DROP COLUMN IF EXISTS "defense_attempt",
DROP COLUMN IF EXISTS "final_score",
DROP COLUMN IF EXISTS "notes",
DROP COLUMN IF EXISTS "registration_date",
DROP COLUMN IF EXISTS "report_file_url",
DROP COLUMN IF EXISTS "similarity_percentage",
DROP COLUMN IF EXISTS "submission_date",
ADD COLUMN IF NOT EXISTS "advisor_feedback" TEXT,
ADD COLUMN IF NOT EXISTS "grade_scale_4" DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS "is_qualified_for_defense" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "report_submission_url" TEXT,
ADD COLUMN IF NOT EXISTS "score_council_avg" DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS "score_final" DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS "score_process" DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS "score_reviewer" DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS "submitted_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "semesters" DROP COLUMN IF EXISTS "defense_deadline",
DROP COLUMN IF EXISTS "is_active",
DROP COLUMN IF EXISTS "is_locked",
DROP COLUMN IF EXISTS "registration_deadline",
DROP COLUMN IF EXISTS "semester_number",
DROP COLUMN IF EXISTS "submission_deadline",
ADD COLUMN IF NOT EXISTS "defense_end" TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS "defense_start" TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS "is_current" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "thesis_submission_end" TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS "topic_registration_end" TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS "topic_registration_start" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "students" DROP COLUMN IF EXISTS "accumulated_credits",
DROP COLUMN IF EXISTS "accumulated_gpa",
DROP COLUMN IF EXISTS "date_of_birth",
ADD COLUMN IF NOT EXISTS "credits_accumulated" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "dob" DATE,
ADD COLUMN IF NOT EXISTS "gpa_cumulative" DECIMAL(3,2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "topics" DROP COLUMN IF EXISTS "name",
DROP COLUMN IF EXISTS "reviewed_at",
DROP COLUMN IF EXISTS "target_major_id",
ADD COLUMN IF NOT EXISTS "major_id" UUID,
ADD COLUMN IF NOT EXISTS "objectives" TEXT,
ADD COLUMN IF NOT EXISTS "title_en" VARCHAR(300),
ADD COLUMN IF NOT EXISTS "title_vi" VARCHAR(300) NOT NULL DEFAULT '',
ALTER COLUMN "code" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "topic_type" SET DEFAULT 'MAJOR',
ALTER COLUMN "max_students" SET DATA TYPE INTEGER;

-- DropTable
DROP TABLE IF EXISTS "assigned_roles";

-- DropEnum
DROP TYPE IF EXISTS "AcademicPosition";

-- DropEnum
DROP TYPE IF EXISTS "AccountRole";

-- CreateTable roles
CREATE TABLE IF NOT EXISTS "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable permissions
CREATE TABLE IF NOT EXISTS "permissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "module" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable role_permissions
CREATE TABLE IF NOT EXISTS "role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable account_roles
CREATE TABLE IF NOT EXISTS "account_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "account_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "scope_type" VARCHAR(30),
    "scope_id" VARCHAR(50),
    "valid_from" DATE,
    "valid_to" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "roles_code_key" ON "roles"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "permissions_code_key" ON "permissions"("code");
CREATE INDEX IF NOT EXISTS "account_roles_account_id_idx" ON "account_roles"("account_id");
CREATE INDEX IF NOT EXISTS "account_roles_role_id_idx" ON "account_roles"("role_id");
CREATE UNIQUE INDEX IF NOT EXISTS "council_members_council_id_lecturer_id_key" ON "council_members"("council_id", "lecturer_id");
CREATE INDEX IF NOT EXISTS "councils_semester_id_idx" ON "councils"("semester_id");
CREATE INDEX IF NOT EXISTS "councils_defense_date_defense_room_idx" ON "councils"("defense_date", "defense_room");
CREATE INDEX IF NOT EXISTS "lecturers_department_id_idx" ON "lecturers"("department_id");
CREATE INDEX IF NOT EXISTS "registrations_council_id_idx" ON "registrations"("council_id");
CREATE INDEX IF NOT EXISTS "students_class_id_idx" ON "students"("class_id");
CREATE INDEX IF NOT EXISTS "students_status_idx" ON "students"("status");

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_homeroom_advisor_id_fkey" FOREIGN KEY ("homeroom_advisor_id") REFERENCES "lecturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "topics" ADD CONSTRAINT "topics_major_id_fkey" FOREIGN KEY ("major_id") REFERENCES "majors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account_roles" ADD CONSTRAINT "account_roles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account_roles" ADD CONSTRAINT "account_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
