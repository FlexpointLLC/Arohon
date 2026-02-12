-- Run this in Supabase Dashboard → SQL Editor to make ashik@arohon.co an admin.
-- Requires: public.users and public.admin_users tables, and the user already in auth.users.
-- admin_users must have: id (PK), user_id (UNIQUE), role, is_active, created_at, updated_at.
-- See admin/docs/DATABASE-SCHEMA.md for full expected schema.

-- 1) Ensure public.users has a row for this auth user (admin type)
INSERT INTO public.users (id, email, full_name, user_type, is_verified, is_active, updated_at)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  'admin',
  true,
  true,
  now()
FROM auth.users
WHERE email = 'ashik@arohon.co'
ON CONFLICT (id) DO UPDATE SET
  user_type = 'admin',
  is_verified = true,
  is_active = true,
  email = EXCLUDED.email,
  full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
  updated_at = now();

-- 2) Ensure admin_users has a row so the user can access the dashboard
INSERT INTO public.admin_users (user_id, role, is_active, updated_at)
SELECT id, 'admin', true, now()
FROM auth.users
WHERE email = 'ashik@arohon.co'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  is_active = true,
  updated_at = now();
