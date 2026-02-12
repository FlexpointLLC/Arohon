# Admin app – expected database schema

This document lists tables and columns the admin dashboard expects. Ensure your Supabase (PostgreSQL) schema matches so nothing is missed.

For a **gap analysis** (tables in DB but not yet in admin), see [SCHEMA-GAP-ANALYSIS.md](./SCHEMA-GAP-ANALYSIS.md).

---

## Full table index (public schema)

| Table | Admin usage |
|-------|-------------|
| admin_users | ✅ Auth, Admins |
| app_version_control | ✅ Config → App versions |
| fare_config | ✅ Fare config list + edit |
| invoices | ❌ Not in admin (see gap analysis) |
| notifications | ✅ Notifications list/create/edit |
| payment_requests | ✅ Payments approve/reject |
| referral_usage | ❌ Not in admin |
| referrals | ❌ Not in admin |
| reports | ❌ Not in admin |
| rider_documents | ✅ Driver detail – documents |
| rider_earnings | ❌ Not in admin |
| rider_weekly_payments | ❌ Not in admin (see gap analysis) |
| riders | ✅ Users (drivers), Verification |
| rides | ✅ Rides list + detail |
| support_ticket_messages | ✅ Ticket detail + reply (column: **ticket_id**) |
| support_tickets | ✅ Support list + detail |
| system_settings | ✅ Config (commission, support, settings) |
| transactions | ❌ Not in admin |
| user_profiles | Optional on user detail |
| user_recent_locations | ❌ Not in admin |
| user_roles | Implicit (auth) |
| users | ✅ Everywhere (profile, joins) |
| vehicle_documents | ❌ Not in admin (suggest on driver/vehicle detail) |
| vehicles | ✅ Driver detail – vehicles list |

---

## auth (Supabase built-in)

- **auth.users** – Used for login. Admin app joins to `public.users` and `public.admin_users`.

---

## public.users

Used for admin profile (name, email, phone) and for rider/driver profile joins.

| Column        | Type    | Notes                    |
|---------------|---------|---------------------------|
| id            | uuid    | PK, matches auth.users.id |
| email         | text    |                          |
| full_name     | text    |                          |
| phone         | text    | optional                 |
| user_type     | text    | e.g. 'admin', 'rider'    |
| is_verified   | boolean |                          |
| is_active     | boolean |                          |
| updated_at    | timestamptz |                    |

---

## public.admin_users

Admin dashboard access. Must have **id** as primary key for the app (auth and PATCH use it).

| Column     | Type         | Notes                          |
|------------|--------------|--------------------------------|
| id         | uuid         | PK (e.g. default gen_random_uuid()) |
| user_id    | uuid         | UNIQUE, FK → auth.users / users |
| role       | text         | e.g. 'admin'                   |
| is_active  | boolean      |                                |
| created_at | timestamptz  | optional, for list order       |
| updated_at | timestamptz  |                                |

---

## public.riders

Drivers (riders). Joined with `users` for name/phone.

| Column               | Type         | Notes              |
|----------------------|--------------|--------------------|
| id                   | uuid         | PK                 |
| user_id              | uuid         | FK → users         |
| verification_status  | text         | pending, approved, rejected |
| verification_reason  | text         | optional           |
| is_active            | boolean      |                    |
| is_blocked           | boolean      | optional           |
| payment_tier         | numeric      | optional           |
| unpaid_amount        | numeric      | optional           |
| total_completed_trips| numeric      | optional           |
| total_earnings       | numeric      | optional           |
| created_at           | timestamptz  |                    |
| updated_at           | timestamptz  |                    |

---

## public.rides

| Column              | Type         | Notes                    |
|---------------------|--------------|--------------------------|
| id                  | uuid         | PK                       |
| status              | text         | requested, completed, …  |
| ride_type           | text         |                          |
| pickup_address      | text         |                          |
| dropoff_address     | text         |                          |
| final_fare          | numeric      | optional                 |
| payment_status      | text         | pending, paid, …        |
| customer_id         | uuid         | optional                 |
| rider_id            | uuid         | optional                 |
| created_at          | timestamptz  |                          |
| completed_at        | timestamptz  | optional                 |
| cancelled_at        | timestamptz  | optional                 |
| cancellation_reason | text         | optional                 |
| cancelled_by        | text         | optional                 |
| updated_at          | timestamptz  |                          |

---

## public.payment_requests

| Column           | Type         | Notes                    |
|------------------|--------------|--------------------------|
| id               | uuid         | PK                       |
| rider_id         | uuid         | FK → riders              |
| amount           | numeric      |                          |
| status           | text         | pending, approved, rejected |
| rider_phone_number | text       | optional                 |
| notes            | text         | optional                 |
| reviewed_by      | uuid         | optional (admin user_id) |
| reviewed_at      | timestamptz  | optional                 |
| created_at       | timestamptz  |                          |

---

## public.support_tickets

| Column    | Type        | Notes   |
|-----------|-------------|---------|
| id        | uuid        | PK      |
| ticket_number | text    |         |
| subject   | text        | optional |
| status    | text        | open, in_progress, resolved, closed |
| user_id   | uuid        | optional |
| ride_id   | uuid        | optional |
| created_at| timestamptz |         |
| updated_at| timestamptz |         |

---

## public.support_ticket_messages

| Column     | Type        | Notes  |
|------------|-------------|--------|
| id         | uuid        | PK     |
| ticket_id  | uuid        | FK → support_tickets.id |
| sender_type| text        | e.g. 'customer', 'support' |
| body       | text        |        |
| created_at | timestamptz | optional |

---

## public.system_settings

Commission, support phone, and other key/value settings.

| Column        | Type         | Notes                        |
|---------------|--------------|-----------------------------|
| setting_key   | text         | PK or UNIQUE                |
| setting_value | text/numeric | optional (null for support_phone row) |
| support_phone | text         | optional (only for setting_key = 'support_phone') |
| description   | text         | optional                    |
| updated_at    | timestamptz  |                             |

Required/optional rows (upserted by app):

- `setting_key = 'rider_commission_percentage'` → use **setting_value** (number 0–100).
- `setting_key = 'support_phone'` → use **support_phone** (string).
- Fare config (optional): `base_fare`, `fare_per_km`, `fare_per_minute` → **setting_value** (number).  
  (Fare config is also stored in **fare_config** table; see below.)

---

## public.fare_config

Per-vehicle fare configuration. Used by the **Fare config** dashboard (sidebar, below Rides).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| vehicle_type | text | e.g. car, micro, cng, bike, hiace, ambulance |
| base_fare | numeric | |
| per_km_rate | numeric | |
| per_minute_rate | numeric | |
| minimum_fare | numeric | |
| surge_multiplier | numeric | |
| surge_enabled | boolean | |
| discount_percentage | numeric | |
| discount_enabled | boolean | |
| discount_max_amount | numeric | optional |
| round_trip_discount_percentage | numeric | |
| waiting_charge_per_minute | numeric | |
| free_waiting_minutes | numeric | |
| cancellation_fee | numeric | |
| free_cancellation_minutes | numeric | |
| is_active | boolean | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| updated_by | uuid | optional |
| promo_enabled | boolean | |
| promo_code | text | optional |
| promo_percentage | numeric | |
| intercity_base_fare | numeric | |
| intercity_per_km_rate | numeric | |
| intercity_per_minute_rate | numeric | |
| intercity_minimum_fare | numeric | |
| intercity_surge_multiplier | numeric | |

---

## public.app_version_control

| Column                | Type         | Notes   |
|-----------------------|--------------|---------|
| id                    | uuid         | PK      |
| app_key               | text         | e.g. 'driver_app', 'customer_app' |
| platform              | text         | e.g. 'android' |
| min_required_version  | text         |         |
| latest_version        | text         |         |
| store_url_android     | text         | optional |
| store_url_ios         | text         | optional |
| change_log            | jsonb        | array of strings |
| updated_at            | timestamptz  |         |

---

## public.notifications

| Column            | Type    | Notes   |
|-------------------|---------|---------|
| id                | uuid    | PK (auto) |
| user_id           | uuid    | optional (null = broadcast) |
| notification_type | text    | e.g. general, promotion |
| title             | text    |         |
| body              | text    |         |
| data              | jsonb   | optional (app sends `{}`) |
| created_at        | timestamptz | optional |

---

## Relationships

- **admin_users.user_id** → users.id (or auth.users.id)
- **riders.user_id** → users.id
- **payment_requests.rider_id** → riders.id
- **support_ticket_messages.ticket_id** → support_tickets.id

Use these in Supabase for foreign keys and joins (e.g. `riders ( users ( full_name, phone ) )`).

---

## Other tables (reference only – not yet in admin UI)

These exist in your schema; see [SCHEMA-GAP-ANALYSIS.md](./SCHEMA-GAP-ANALYSIS.md) for what to add.

- **invoices** – ride_id, invoice_number, customer_id, rider_id, base_fare, distance_fare, time_fare, surge_amount, discount_amount, cancellation_fee, total_amount, tax_amount, final_amount, payment_method, payment_status, issued_at. Unique: ride_id, invoice_number.
- **referral_usage** – referrer_id, referred_user_id, referral_code, status (pending/completed/rewarded), reward_amount, completed_at, rewarded_at.
- **referrals** – user_id, referral_code, total_referrals, total_earnings. Unique: user_id, referral_code.
- **reports** – reported_by_user_id, reported_user_id, ride_id, report_type (driver_behavior, vehicle_issue, payment_issue, safety_concern, route_issue, other), description, status (pending, under_review, resolved, dismissed), admin_notes, resolved_by, resolved_at, ticket_id (FK support_tickets).
- **rider_earnings** – ride_id, rider_id, weekly_payment_id, gross_earnings, commission_percentage, commission_amount, net_earnings, tip_amount. One row per ride.
- **rider_weekly_payments** – rider_id, week_start_date, week_end_date, total_rides, total_fare_collected, commission_percentage, commission_amount, net_earnings, payment_status (pending, paid, overdue, deactivated), payment_deadline, paid_at, paid_amount, bkash_reference, bkash_phone_number, verified_by. Unique: (rider_id, week_start_date).
- **transactions** – ride_id, customer_id, rider_id, transaction_type ('ride_payment'), amount, currency, payment_method, status (pending, completed, cancelled), payment_received_at.
- **user_profiles** – user_id, date_of_birth, gender, emergency_contact_name, emergency_contact_phone, bio, preferences (jsonb).
- **user_recent_locations** – user_id (auth.users), location_cache_id, place_id, formatted_address, lat, lng, location_type (pickup, destination), used_at.
- **user_roles** – user_id, role (customer, rider, admin), is_active. Unique: (user_id, role). Trigger: single active role per user.
- **vehicle_documents** – vehicle_id, document_type (registration, fitness, insurance, tax_token), document_url, expiry_date, verification_status (pending, approved, rejected), verified_by, verified_at.
- **vehicles** – rider_id, vehicle_type (same as ride_type), make, model, year, color, license_plate, registration_number, registration_expiry, fitness_expiry, insurance_expiry, vehicle_photos[], is_active, is_verified, fuel_type (petrol, diesel, cng, lpg).
