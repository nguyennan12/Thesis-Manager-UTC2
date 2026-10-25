-- Complete schema fields and tables added after the initial deployed migrations.
ALTER TABLE "accounts"
  ADD COLUMN IF NOT EXISTS "must_change_password" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "rubric_sets"
  ADD COLUMN IF NOT EXISTS "parent_id" UUID;

CREATE TABLE IF NOT EXISTS "lecturer_semester_quotas" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "lecturer_id" UUID NOT NULL,
  "semester_id" UUID NOT NULL,
  "max_quota" INTEGER NOT NULL DEFAULT 5,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "lecturer_semester_quotas_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "lecturer_semester_quotas_lecturer_id_semester_id_key"
  ON "lecturer_semester_quotas"("lecturer_id", "semester_id");
CREATE INDEX IF NOT EXISTS "lecturer_semester_quotas_semester_id_idx"
  ON "lecturer_semester_quotas"("semester_id");

ALTER TABLE "lecturer_semester_quotas"
  ADD CONSTRAINT "lecturer_semester_quotas_lecturer_id_fkey"
  FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lecturer_semester_quotas"
  ADD CONSTRAINT "lecturer_semester_quotas_semester_id_fkey"
  FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rubric_sets"
  ADD CONSTRAINT "rubric_sets_parent_id_fkey"
  FOREIGN KEY ("parent_id") REFERENCES "rubric_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
