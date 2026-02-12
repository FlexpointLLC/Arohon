import { supabaseAdmin } from "@/lib/supabase/server";
import { FareConfigTableRow } from "./fare-config-table-row";

export default async function FareConfigPage() {
  const { data: rows } = await supabaseAdmin
    .from("fare_config")
    .select("id, vehicle_type, base_fare, per_km_rate, per_minute_rate, minimum_fare, surge_enabled, discount_enabled, promo_enabled, is_active")
    .order("vehicle_type");

  const list = rows ?? [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Fare config
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Per-vehicle fare settings. Edit a row to change base fare, per km/min rates, surge, discount, and intercity rates.
      </p>
      <div className="card mt-6 overflow-hidden">
        <table className="table-sleek">
          <thead>
            <tr>
              <th>Vehicle type</th>
              <th className="text-right">Base fare (৳)</th>
              <th className="text-right">Per km (৳)</th>
              <th className="text-right">Per min (৳)</th>
              <th className="text-right">Min fare (৳)</th>
              <th>Surge</th>
              <th>Discount</th>
              <th>Promo</th>
              <th>Active</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  No fare config rows. Add them in the database.
                </td>
              </tr>
            ) : (
              list.map((row) => (
                <FareConfigTableRow key={row.id} row={row} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
