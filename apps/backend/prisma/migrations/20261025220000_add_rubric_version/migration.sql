-- Add the version number required for versioned rubric sets.
ALTER TABLE "rubric_sets"
  ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;
