-- Add the execution period fields used by the current Semester model and demo seed.
ALTER TABLE "semesters"
  ADD COLUMN IF NOT EXISTS "execution_start" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "execution_end" TIMESTAMPTZ;
