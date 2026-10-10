-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('STUDYING', 'RESERVED', 'DROPPED', 'GRADUATED');

-- CreateEnum
CREATE TYPE "TopicType" AS ENUM ('FOUNDATION', 'MAJOR');

-- CreateEnum
CREATE TYPE "TopicStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ASSIGNED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'LOCKED', 'IN_PROGRESS', 'SUBMITTED', 'QUALIFIED_DEFENSE', 'DISQUALIFIED', 'DEFENDED', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('PENDING', 'REVIEWED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "CouncilStatus" AS ENUM ('PREPARING', 'IN_PROGRESS', 'COMPLETED', 'LOCKED');

-- CreateEnum
CREATE TYPE "CouncilRole" AS ENUM ('CHAIRMAN', 'SECRETARY', 'MEMBER', 'REVIEWER');

-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('STUDENT', 'LECTURER', 'STAFF', 'ADMIN');

-- CreateEnum
CREATE TYPE "AcademicPosition" AS ENUM ('HEAD_OF_DEPARTMENT', 'FACULTY_DEAN', 'ACADEMIC_AFFAIRS', 'UNIVERSITY_BOARD');

-- CreateEnum
CREATE TYPE "ChangeRequestType" AS ENUM ('CHANGE_TOPIC', 'CHANGE_ADVISOR', 'EXTENSION');

-- CreateEnum
CREATE TYPE "ChangeRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AppealStatus" AS ENUM ('PENDING', 'PROCESSING', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'TOPIC', 'REGISTRATION', 'PROGRESS', 'DEFENSE', 'GRADE');

-- CreateEnum
CREATE TYPE "SettingDataType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'JSON');

-- CreateTable
CREATE TABLE "faculties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faculties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "majors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "faculty_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "majors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "faculty_id" UUID NOT NULL,
    "head_lecturer_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecturers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(20) NOT NULL,
    "full_name" VARCHAR(250) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "degree" VARCHAR(50),
    "department_id" UUID NOT NULL,
    "max_advising_quota" INTEGER NOT NULL DEFAULT 5,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lecturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "major_id" UUID NOT NULL,
    "homeroom_lecturer_id" UUID NOT NULL,
    "student_count" INTEGER NOT NULL DEFAULT 0,
    "academic_year" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(20) NOT NULL,
    "full_name" VARCHAR(250) NOT NULL,
    "date_of_birth" DATE,
    "gender" "Gender" NOT NULL DEFAULT 'OTHER',
    "email" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "class_id" UUID NOT NULL,
    "accumulated_credits" INTEGER NOT NULL DEFAULT 0,
    "accumulated_gpa" DECIMAL(3,2),
    "status" "StudentStatus" NOT NULL DEFAULT 'STUDYING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semesters" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "academic_year" VARCHAR(20) NOT NULL,
    "semester_number" SMALLINT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "registration_deadline" TIMESTAMPTZ,
    "submission_deadline" TIMESTAMPTZ,
    "defense_deadline" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_locked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "requirements" TEXT,
    "topic_type" "TopicType" NOT NULL,
    "proposer_lecturer_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "target_major_id" UUID,
    "max_students" SMALLINT NOT NULL DEFAULT 1,
    "status" "TopicStatus" NOT NULL DEFAULT 'DRAFT',
    "reviewer_lecturer_id" UUID,
    "reviewed_at" TIMESTAMPTZ,
    "rejection_reason" TEXT,
    "semester_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "councils" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "defense_date" DATE NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "location" VARCHAR(200) NOT NULL,
    "department_id" UUID NOT NULL,
    "semester_id" UUID NOT NULL,
    "max_students" SMALLINT NOT NULL DEFAULT 5,
    "status" "CouncilStatus" NOT NULL DEFAULT 'PREPARING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "councils_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "council_members" (
    "council_id" UUID NOT NULL,
    "lecturer_id" UUID NOT NULL,
    "role" "CouncilRole" NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "council_members_pkey" PRIMARY KEY ("council_id","lecturer_id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(30) NOT NULL,
    "student_id" UUID NOT NULL,
    "topic_id" UUID NOT NULL,
    "semester_id" UUID NOT NULL,
    "advisor_lecturer_id" UUID NOT NULL,
    "council_id" UUID,
    "registration_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submission_date" TIMESTAMPTZ,
    "defense_attempt" SMALLINT NOT NULL DEFAULT 1,
    "report_file_url" TEXT,
    "similarity_percentage" DECIMAL(5,2),
    "advisor_score" DECIMAL(4,2),
    "council_score" DECIMAL(4,2),
    "final_score" DECIMAL(4,2),
    "grade_letter" VARCHAR(5),
    "status" "RegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "registration_id" UUID NOT NULL,
    "week_number" SMALLINT NOT NULL,
    "report_content" TEXT NOT NULL,
    "tasks_completed" TEXT,
    "next_week_plan" TEXT,
    "attachment_url" TEXT,
    "reviewer_lecturer_id" UUID NOT NULL,
    "advisor_feedback" TEXT,
    "completion_level" VARCHAR(50),
    "reviewed_at" TIMESTAMPTZ,
    "status" "ProgressStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rubric_sets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "topic_type" "TopicType" NOT NULL,
    "academic_year" VARCHAR(20) NOT NULL,
    "total_weight" DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rubric_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_criteria" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rubric_set_id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "weight" DECIMAL(5,2) NOT NULL,
    "topic_type" "TopicType" NOT NULL,
    "order_index" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluation_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detailed_scores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "registration_id" UUID NOT NULL,
    "criterion_id" UUID NOT NULL,
    "lecturer_id" UUID NOT NULL,
    "score" DECIMAL(4,2) NOT NULL,
    "notes" TEXT,
    "is_locked" BOOLEAN NOT NULL DEFAULT false,
    "scored_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detailed_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "role" "AccountRole" NOT NULL,
    "student_id" UUID,
    "lecturer_id" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMPTZ,
    "refresh_token_hash" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assigned_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "account_id" UUID NOT NULL,
    "position" "AcademicPosition" NOT NULL,
    "scope_type" VARCHAR(20) NOT NULL,
    "scope_id" VARCHAR(50) NOT NULL,
    "valid_from" DATE NOT NULL,
    "valid_to" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assigned_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "original_name" VARCHAR(255) NOT NULL,
    "storage_path" TEXT NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "file_size_bytes" BIGINT NOT NULL,
    "md5_checksum" VARCHAR(64),
    "uploaded_by_id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plagiarism_results" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "registration_id" UUID NOT NULL,
    "source_registration_id" UUID,
    "similarity_percentage" DECIMAL(5,2) NOT NULL,
    "matching_details" JSONB,
    "analyzed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plagiarism_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" VARCHAR(50) NOT NULL,
    "from_status" VARCHAR(50) NOT NULL,
    "to_status" VARCHAR(50) NOT NULL,
    "actor_account_id" UUID,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "registration_id" UUID NOT NULL,
    "request_type" "ChangeRequestType" NOT NULL,
    "reason" TEXT NOT NULL,
    "requested_data" JSONB,
    "status" "ChangeRequestStatus" NOT NULL DEFAULT 'PENDING',
    "approved_by_id" UUID,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "change_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_appeals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "registration_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "AppealStatus" NOT NULL DEFAULT 'PENDING',
    "old_score" DECIMAL(4,2) NOT NULL,
    "new_score" DECIMAL(4,2),
    "resolution_notes" TEXT,
    "resolved_by_id" UUID,
    "resolved_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grade_appeals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "recipient_account_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "link_url" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_email_sent" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "account_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "endpoint" VARCHAR(255) NOT NULL,
    "http_method" VARCHAR(10) NOT NULL,
    "ip_address" VARCHAR(50),
    "user_agent" TEXT,
    "payload" JSONB,
    "response_status" SMALLINT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" VARCHAR(100) NOT NULL,
    "value" TEXT NOT NULL,
    "data_type" "SettingDataType" NOT NULL DEFAULT 'STRING',
    "faculty_id" UUID,
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "faculties_code_key" ON "faculties"("code");

-- CreateIndex
CREATE UNIQUE INDEX "majors_code_key" ON "majors"("code");

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_code_key" ON "lecturers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_email_key" ON "lecturers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "classes_code_key" ON "classes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "students_code_key" ON "students"("code");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "semesters_code_key" ON "semesters"("code");

-- CreateIndex
CREATE UNIQUE INDEX "topics_code_key" ON "topics"("code");

-- CreateIndex
CREATE INDEX "topics_semester_id_idx" ON "topics"("semester_id");

-- CreateIndex
CREATE INDEX "topics_department_id_idx" ON "topics"("department_id");

-- CreateIndex
CREATE INDEX "topics_status_idx" ON "topics"("status");

-- CreateIndex
CREATE UNIQUE INDEX "councils_code_key" ON "councils"("code");

-- CreateIndex
CREATE INDEX "councils_defense_date_idx" ON "councils"("defense_date");

-- CreateIndex
CREATE INDEX "councils_department_id_idx" ON "councils"("department_id");

-- CreateIndex
CREATE INDEX "council_members_lecturer_id_idx" ON "council_members"("lecturer_id");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_code_key" ON "registrations"("code");

-- CreateIndex
CREATE INDEX "registrations_student_id_idx" ON "registrations"("student_id");

-- CreateIndex
CREATE INDEX "registrations_topic_id_idx" ON "registrations"("topic_id");

-- CreateIndex
CREATE INDEX "registrations_semester_id_idx" ON "registrations"("semester_id");

-- CreateIndex
CREATE INDEX "registrations_advisor_lecturer_id_idx" ON "registrations"("advisor_lecturer_id");

-- CreateIndex
CREATE INDEX "registrations_status_idx" ON "registrations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_student_id_semester_id_key" ON "registrations"("student_id", "semester_id");

-- CreateIndex
CREATE INDEX "progress_reports_registration_id_idx" ON "progress_reports"("registration_id");

-- CreateIndex
CREATE INDEX "progress_reports_status_idx" ON "progress_reports"("status");

-- CreateIndex
CREATE UNIQUE INDEX "progress_reports_registration_id_week_number_key" ON "progress_reports"("registration_id", "week_number");

-- CreateIndex
CREATE UNIQUE INDEX "rubric_sets_code_key" ON "rubric_sets"("code");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_criteria_rubric_set_id_code_key" ON "evaluation_criteria"("rubric_set_id", "code");

-- CreateIndex
CREATE INDEX "detailed_scores_registration_id_idx" ON "detailed_scores"("registration_id");

-- CreateIndex
CREATE INDEX "detailed_scores_lecturer_id_idx" ON "detailed_scores"("lecturer_id");

-- CreateIndex
CREATE UNIQUE INDEX "detailed_scores_registration_id_criterion_id_lecturer_id_key" ON "detailed_scores"("registration_id", "criterion_id", "lecturer_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_username_key" ON "accounts"("username");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_student_id_key" ON "accounts"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_lecturer_id_key" ON "accounts"("lecturer_id");

-- CreateIndex
CREATE INDEX "accounts_username_idx" ON "accounts"("username");

-- CreateIndex
CREATE INDEX "assigned_roles_account_id_idx" ON "assigned_roles"("account_id");

-- CreateIndex
CREATE INDEX "attachments_entity_type_entity_id_idx" ON "attachments"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "plagiarism_results_registration_id_idx" ON "plagiarism_results"("registration_id");

-- CreateIndex
CREATE INDEX "status_histories_entity_type_entity_id_idx" ON "status_histories"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "change_requests_registration_id_idx" ON "change_requests"("registration_id");

-- CreateIndex
CREATE INDEX "grade_appeals_registration_id_idx" ON "grade_appeals"("registration_id");

-- CreateIndex
CREATE INDEX "notifications_recipient_account_id_is_read_idx" ON "notifications"("recipient_account_id", "is_read");

-- CreateIndex
CREATE INDEX "audit_logs_account_id_idx" ON "audit_logs"("account_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- AddForeignKey
ALTER TABLE "majors" ADD CONSTRAINT "majors_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_head_lecturer_id_fkey" FOREIGN KEY ("head_lecturer_id") REFERENCES "lecturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturers" ADD CONSTRAINT "lecturers_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_major_id_fkey" FOREIGN KEY ("major_id") REFERENCES "majors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_homeroom_lecturer_id_fkey" FOREIGN KEY ("homeroom_lecturer_id") REFERENCES "lecturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_proposer_lecturer_id_fkey" FOREIGN KEY ("proposer_lecturer_id") REFERENCES "lecturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_target_major_id_fkey" FOREIGN KEY ("target_major_id") REFERENCES "majors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_reviewer_lecturer_id_fkey" FOREIGN KEY ("reviewer_lecturer_id") REFERENCES "lecturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "councils" ADD CONSTRAINT "councils_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "councils" ADD CONSTRAINT "councils_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "council_members" ADD CONSTRAINT "council_members_council_id_fkey" FOREIGN KEY ("council_id") REFERENCES "councils"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "council_members" ADD CONSTRAINT "council_members_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_advisor_lecturer_id_fkey" FOREIGN KEY ("advisor_lecturer_id") REFERENCES "lecturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_council_id_fkey" FOREIGN KEY ("council_id") REFERENCES "councils"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_reports" ADD CONSTRAINT "progress_reports_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_reports" ADD CONSTRAINT "progress_reports_reviewer_lecturer_id_fkey" FOREIGN KEY ("reviewer_lecturer_id") REFERENCES "lecturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_criteria" ADD CONSTRAINT "evaluation_criteria_rubric_set_id_fkey" FOREIGN KEY ("rubric_set_id") REFERENCES "rubric_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detailed_scores" ADD CONSTRAINT "detailed_scores_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detailed_scores" ADD CONSTRAINT "detailed_scores_criterion_id_fkey" FOREIGN KEY ("criterion_id") REFERENCES "evaluation_criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detailed_scores" ADD CONSTRAINT "detailed_scores_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_roles" ADD CONSTRAINT "assigned_roles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plagiarism_results" ADD CONSTRAINT "plagiarism_results_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plagiarism_results" ADD CONSTRAINT "plagiarism_results_source_registration_id_fkey" FOREIGN KEY ("source_registration_id") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_histories" ADD CONSTRAINT "status_histories_actor_account_id_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_appeals" ADD CONSTRAINT "grade_appeals_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_appeals" ADD CONSTRAINT "grade_appeals_resolved_by_id_fkey" FOREIGN KEY ("resolved_by_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_account_id_fkey" FOREIGN KEY ("recipient_account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
