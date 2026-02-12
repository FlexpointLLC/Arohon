# Arohon Admin Panel

Web dashboard for Arohon ride-hailing (driver app + customer app). Same Supabase project; admin-only access via `admin_users` table.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Supabase** (service role server-side; anon key for auth in browser)
- **Auth**: Email/password login; only users with an active row in `admin_users` can access dashboard.

## Setup

1. **Env**

   Copy `.env.example` to `.env.local` and set:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)

2. **Install and run**

   ```bash
   cd admin
   npm install
   npm run dev
   ```

   App runs at **http://localhost:3001**.

3. **First admin user**

   - Create a user in Supabase Auth (e.g. email/password).
   - Insert a row in `public.users` with `id = auth.users.id` and `user_type = 'admin'` (if your schema uses it).
   - Insert a row in `public.admin_users`: `user_id = that user's id`, `role = 'admin'` (or `super_admin`), `is_active = true`.

   Then log in at `/login` with that email/password.

## Tabs

- **Dashboard** – KPIs, recent rides, links to other sections.
- **Rides** – List/filter rides, ride detail (route, fare, status).
- **Users** – Drivers list and detail; verification (approve/reject), documents, vehicles.
- **Verification** – Pending drivers queue; link to user detail to verify.
- **Support** – Tickets list and detail (messages); reply as support (form can be added).
- **Payments** – Pending payment requests (approve/reject); rider weekly payments note; commission % in Config.
- **Configuration** – Rider commission %, support phone, app version control note.
- **Notifications** – Create in-app notification (user or broadcast).

## Security

- Service role key is used only in server code (API routes, Server Components). Never expose it to the client.
- Dashboard layout checks `getAdminUser()` (reads `admin_users` with service role). If not admin, redirect to `/unauthorized`.
