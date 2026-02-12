# Admin vs database – gap analysis

This doc compares your full DB schema with what the admin dashboard currently uses. Tables and features marked **Missing** are good candidates to add.

---

## Covered in admin (you’re good)

| Table | Where it’s used |
|-------|------------------|
| **users** | Profile/joins everywhere; Users list & detail |
| **admin_users** | Auth, Admins list & onboard |
| **riders** | Users (drivers), Verification queue, rider APIs |
| **rider_documents** | Driver detail: Documents section (view links, type, verification_status) |
| **rides** | Rides list, filters, detail, ride actions |
| **payment_requests** | Payments: list, approve, reject |
| **support_tickets** | Support: list, ticket detail |
| **support_ticket_messages** | Support ticket detail + reply form |
| **system_settings** | Config: commission, support phone, settings |
| **fare_config** | Fare config: list + edit per vehicle type |
| **app_version_control** | Config → App versions |
| **notifications** | Notifications: list, create, edit |
| **vehicles** | Driver detail: vehicles list (type, make, model, plate, color) |

---

## Missing or partial – worth adding

### High impact (finance & operations)

| Table | What’s missing | Suggestion |
|-------|----------------|------------|
| **invoices** | No list/detail in admin | Add **Invoices** (e.g. under Payments or its own sidebar): list by date/ride/customer, show breakdown (base_fare, distance_fare, time_fare, surge, discount, tax, final_amount), invoice_number, payment_status. Link to ride. |
| **rider_weekly_payments** | Only mentioned in copy; no list or “mark as paid” | Add **Rider weekly payments** (Payments tab or driver detail): list by rider/week, show week range, total_rides, commission, net_earnings, payment_status, paid_at, bkash. Allow marking as paid and setting paid_at / paid_amount / bkash_reference. |
| **transactions** | No list in admin | Add **Transactions** (e.g. under Payments or Rides): list by ride_id / customer_id / rider_id, filter by status/date. Useful for audit and support. |

### Medium impact (support & safety)

| Table | What’s missing | Suggestion |
|-------|----------------|------------|
| **reports** | No dedicated Reports UI; tickets created from reports but report_type/description not surfaced | Add **Reports** (sidebar or under Support): list by status/report_type, show reported_by, reported_user, ride_id, report_type, description, status, admin_notes, link to linked ticket. Resolve/dismiss and add admin_notes. Optionally show on ticket detail (report_id, report_type). |
| **vehicle_documents** | Driver detail shows vehicles but not registration/fitness/insurance/tax_token or expiry | On driver detail (or a vehicle sub-view): list **vehicle_documents** per vehicle (document_type, document_url, expiry_date, verification_status). |

### Lower priority (growth & analytics)

| Table | What’s missing | Suggestion |
|-------|----------------|------------|
| **referral_usage** | No admin UI | Optional **Referrals** section: list referral_usage (referrer, referred_user, referral_code, status, reward_amount, completed_at, rewarded_at). Filter by status. |
| **referrals** | No admin UI | Same section: show referrals (user_id, referral_code, total_referrals, total_earnings). Often combined with referral_usage in one “Referrals” page. |
| **rider_earnings** | Not shown per ride or per rider | Optional: on **Ride detail** show rider_earnings row for that ride (gross, commission, net, tip). On **Driver detail** optional “Earnings” tab: list rider_earnings for that rider. |

---

## Not needed in admin (or already implied)

| Table | Note |
|-------|------|
| **user_profiles** | Used for customer/driver profile data; can be shown in User/Driver detail if needed (dob, gender, emergency contact). No separate “table” UI needed. |
| **user_roles** | Used for auth (customer/rider/admin). Admins managed via **admin_users**. No separate role list needed unless you want to edit user_roles. |
| **user_recent_locations** | App UX (pickup/destination history). Only add to admin if support needs to see “last used addresses”. |
| **location_cache** | Referenced by user_recent_locations; internal geocoding. Skip in admin. |

---

## Doc vs schema fixes

- **support_ticket_messages**: DB column is **ticket_id** (FK to support_tickets). Our doc said `support_ticket_id`; will match DB in DATABASE-SCHEMA.md.
- **rider_weekly_payments**: Appears twice in your DDL; same table. No duplicate table.

---

## Suggested order to implement

1. **Invoices** – list + detail + filters (and link to ride).
2. **Rider weekly payments** – list + mark as paid (and optionally link from Payments to this).
3. **Reports** – list + detail + link to ticket; show report on ticket detail.
4. **Transactions** – read-only list + filters.
5. **Vehicle documents** – on driver/vehicle detail.
6. **Referrals / referral_usage** – single “Referrals” page if you use the referral product.

If you tell me which of these you want first (e.g. Invoices + Rider weekly payments), I can outline exact API routes and dashboard pages next.
