-- Run in Supabase SQL Editor if admin_users was created without an "id" column.
-- The admin app expects admin_users.id (PK) for getAdminUser and PATCH /api/admin/users/[id].
-- If your table already has "id" as primary key, skip this.

-- Add id column if missing. After running, ensure id is unique (e.g. primary key).
-- If your current PK is user_id, you may need to: add id, backfill, then change PK in the dashboard.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'admin_users' AND column_name = 'id'
  ) THEN
    ALTER TABLE public.admin_users
      ADD COLUMN id uuid DEFAULT gen_random_uuid() NOT NULL;
  END IF;
END $$;
