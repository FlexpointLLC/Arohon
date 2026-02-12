"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import { Switch } from "@/components/ui/switch";

function num(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "number") return String(v);
  return String(v);
}
function bool(v: unknown): boolean {
  return v === true || v === "true";
}

export function FareConfigEditForm({ row }: { row: Record<string, unknown> }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [vehicleType, setVehicleType] = useState(String(row.vehicle_type ?? ""));
  const [baseFare, setBaseFare] = useState(num(row.base_fare));
  const [perKmRate, setPerKmRate] = useState(num(row.per_km_rate));
  const [perMinuteRate, setPerMinuteRate] = useState(num(row.per_minute_rate));
  const [minimumFare, setMinimumFare] = useState(num(row.minimum_fare));
  const [surgeMultiplier, setSurgeMultiplier] = useState(num(row.surge_multiplier));
  const [surgeEnabled, setSurgeEnabled] = useState(bool(row.surge_enabled) ? "true" : "false");
  const [discountPercentage, setDiscountPercentage] = useState(num(row.discount_percentage));
  const [discountEnabled, setDiscountEnabled] = useState(bool(row.discount_enabled));
  const [discountMaxAmount, setDiscountMaxAmount] = useState(num(row.discount_max_amount));
  const [roundTripDiscount, setRoundTripDiscount] = useState(num(row.round_trip_discount_percentage));
  const [waitingChargePerMinute, setWaitingChargePerMinute] = useState(num(row.waiting_charge_per_minute));
  const [freeWaitingMinutes, setFreeWaitingMinutes] = useState(num(row.free_waiting_minutes));
  const [cancellationFee, setCancellationFee] = useState(num(row.cancellation_fee));
  const [freeCancellationMinutes, setFreeCancellationMinutes] = useState(num(row.free_cancellation_minutes));
  const [isActive, setIsActive] = useState(bool(row.is_active) ? "true" : "false");
  const [promoEnabled, setPromoEnabled] = useState(bool(row.promo_enabled));
  const [promoCode, setPromoCode] = useState(String(row.promo_code ?? ""));
  const [promoPercentage, setPromoPercentage] = useState(num(row.promo_percentage));
  const [intercityBaseFare, setIntercityBaseFare] = useState(num(row.intercity_base_fare));
  const [intercityPerKmRate, setIntercityPerKmRate] = useState(num(row.intercity_per_km_rate));
  const [intercityPerMinuteRate, setIntercityPerMinuteRate] = useState(num(row.intercity_per_minute_rate));
  const [intercityMinimumFare, setIntercityMinimumFare] = useState(num(row.intercity_minimum_fare));
  const [intercitySurgeMultiplier, setIntercitySurgeMultiplier] = useState(num(row.intercity_surge_multiplier));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    const payload = {
      vehicle_type: vehicleType.trim() || null,
      base_fare: baseFare === "" ? null : Number(baseFare),
      per_km_rate: perKmRate === "" ? null : Number(perKmRate),
      per_minute_rate: perMinuteRate === "" ? null : Number(perMinuteRate),
      minimum_fare: minimumFare === "" ? null : Number(minimumFare),
      surge_multiplier: surgeMultiplier === "" ? null : Number(surgeMultiplier),
      surge_enabled: surgeEnabled === "true",
      discount_percentage: discountPercentage === "" ? null : Number(discountPercentage),
      discount_enabled: discountEnabled,
      discount_max_amount: discountMaxAmount === "" ? null : Number(discountMaxAmount),
      round_trip_discount_percentage: roundTripDiscount === "" ? null : Number(roundTripDiscount),
      waiting_charge_per_minute: waitingChargePerMinute === "" ? null : Number(waitingChargePerMinute),
      free_waiting_minutes: freeWaitingMinutes === "" ? null : Number(freeWaitingMinutes),
      cancellation_fee: cancellationFee === "" ? null : Number(cancellationFee),
      free_cancellation_minutes: freeCancellationMinutes === "" ? null : Number(freeCancellationMinutes),
      is_active: isActive === "true",
      promo_enabled: promoEnabled,
      promo_code: promoCode.trim() || null,
      promo_percentage: promoPercentage === "" ? null : Number(promoPercentage),
      intercity_base_fare: intercityBaseFare === "" ? null : Number(intercityBaseFare),
      intercity_per_km_rate: intercityPerKmRate === "" ? null : Number(intercityPerKmRate),
      intercity_per_minute_rate: intercityPerMinuteRate === "" ? null : Number(intercityPerMinuteRate),
      intercity_minimum_fare: intercityMinimumFare === "" ? null : Number(intercityMinimumFare),
      intercity_surge_multiplier: intercitySurgeMultiplier === "" ? null : Number(intercitySurgeMultiplier),
    };
    const res = await fetch(`/api/fare-config/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setMessage({ type: "ok", text: "Fare config saved." });
      router.refresh();
    } else {
      setMessage({ type: "err", text: data.error ?? "Failed to save." });
    }
  }

  const yesNo = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  const inputClass = "mt-1.5 h-10 rounded-xl border border-slate-600/80 bg-slate-800/80 px-3.5 text-sm text-white transition-colors placeholder:text-slate-500 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/30";
  const sectionTitle = "text-xs font-semibold uppercase tracking-widest text-slate-400";
  const cardClass = "rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="pb-28">
      {/* City fare & Surge */}
      <section className={cardClass}>
        <h2 className={`mb-5 ${sectionTitle}`}>City fare & surge</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label className="text-slate-300">Vehicle type</Label>
            <Input value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className={inputClass} />
          </div>
          <div>
            <Label className="text-slate-300">Base fare (৳)</Label>
            <Input type="number" min={0} step={0.01} value={baseFare} onChange={(e) => setBaseFare(e.target.value)} className={inputClass} />
          </div>
          <div>
            <Label className="text-slate-300">Per km rate (৳)</Label>
            <Input type="number" min={0} step={0.01} value={perKmRate} onChange={(e) => setPerKmRate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <Label className="text-slate-300">Per minute rate (৳)</Label>
            <Input type="number" min={0} step={0.01} value={perMinuteRate} onChange={(e) => setPerMinuteRate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <Label className="text-slate-300">Minimum fare (৳)</Label>
            <Input type="number" min={0} step={0.01} value={minimumFare} onChange={(e) => setMinimumFare(e.target.value)} className={inputClass} />
          </div>
          <div>
            <Label className="text-slate-300">Surge enabled</Label>
            <SelectNative value={surgeEnabled} onChange={(e) => setSurgeEnabled(e.target.value)} options={yesNo} className="mt-1.5" variantByValue={{ true: "success", false: "danger" }} />
          </div>
          <div>
            <Label className="text-slate-300">Surge multiplier</Label>
            <Input type="number" min={0} step={0.01} value={surgeMultiplier} onChange={(e) => setSurgeMultiplier(e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Intercity */}
      <section className={`mt-8 ${cardClass} border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-slate-800/40`}>
        <h2 className={`mb-5 ${sectionTitle} text-amber-400/90`}>Intercity</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label className="text-slate-300">Intercity base fare (৳)</Label>
            <Input type="number" min={0} step={0.01} value={intercityBaseFare} onChange={(e) => setIntercityBaseFare(e.target.value)} className="mt-1.5 h-10 rounded-xl border-amber-600/40 bg-amber-950/30 px-3.5 text-sm text-white focus:border-amber-500/60 focus:ring-amber-500/20" />
          </div>
          <div>
            <Label className="text-slate-300">Intercity per km (৳)</Label>
            <Input type="number" min={0} step={0.01} value={intercityPerKmRate} onChange={(e) => setIntercityPerKmRate(e.target.value)} className="mt-1.5 h-10 rounded-xl border-amber-600/40 bg-amber-950/30 px-3.5 text-sm text-white focus:border-amber-500/60 focus:ring-amber-500/20" />
          </div>
          <div>
            <Label className="text-slate-300">Intercity per min (৳)</Label>
            <Input type="number" min={0} step={0.01} value={intercityPerMinuteRate} onChange={(e) => setIntercityPerMinuteRate(e.target.value)} className="mt-1.5 h-10 rounded-xl border-amber-600/40 bg-amber-950/30 px-3.5 text-sm text-white focus:border-amber-500/60 focus:ring-amber-500/20" />
          </div>
          <div>
            <Label className="text-slate-300">Intercity min fare (৳)</Label>
            <Input type="number" min={0} step={0.01} value={intercityMinimumFare} onChange={(e) => setIntercityMinimumFare(e.target.value)} className="mt-1.5 h-10 rounded-xl border-amber-600/40 bg-amber-950/30 px-3.5 text-sm text-white focus:border-amber-500/60 focus:ring-amber-500/20" />
          </div>
          <div>
            <Label className="text-slate-300">Intercity surge multiplier</Label>
            <Input type="number" min={0} step={0.01} value={intercitySurgeMultiplier} onChange={(e) => setIntercitySurgeMultiplier(e.target.value)} className="mt-1.5 h-10 rounded-xl border-amber-600/40 bg-amber-950/30 px-3.5 text-sm text-white focus:border-amber-500/60 focus:ring-amber-500/20" />
          </div>
        </div>
      </section>

      {/* Discount */}
      <section className={`mt-8 ${cardClass}`}>
        <div className="flex items-center gap-3">
          <Switch checked={discountEnabled} onCheckedChange={setDiscountEnabled} />
          <h2 className={sectionTitle}>Discount</h2>
        </div>
        {discountEnabled && (
          <div className="mt-5 grid gap-5 border-t border-slate-700/50 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label className="text-slate-300">Discount %</Label>
                <Input type="number" min={0} step={0.01} value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} className={inputClass} />
              </div>
              <div>
                <Label className="text-slate-300">Discount max amount (৳)</Label>
                <Input type="number" min={0} step={0.01} value={discountMaxAmount} onChange={(e) => setDiscountMaxAmount(e.target.value)} className={inputClass} placeholder="Optional" />
              </div>
              <div>
                <Label className="text-slate-300">Round trip discount %</Label>
                <Input type="number" min={0} step={0.01} value={roundTripDiscount} onChange={(e) => setRoundTripDiscount(e.target.value)} className={inputClass} />
              </div>
            </div>
        )}
      </section>

      {/* Promo */}
      <section className={`mt-8 ${cardClass}`}>
        <div className="flex items-center gap-3">
          <Switch checked={promoEnabled} onCheckedChange={setPromoEnabled} />
          <h2 className={sectionTitle}>Promo</h2>
        </div>
        {promoEnabled && (
          <div className="mt-5 grid gap-5 border-t border-slate-700/50 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label className="text-slate-300">Promo code</Label>
                <Input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className={inputClass} placeholder="Optional" />
              </div>
              <div>
                <Label className="text-slate-300">Promo %</Label>
                <Input type="number" min={0} step={0.01} value={promoPercentage} onChange={(e) => setPromoPercentage(e.target.value)} className={inputClass} />
              </div>
            </div>
        )}
      </section>

      {/* Waiting & Cancellation — side by side */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className={cardClass}>
          <h2 className={`mb-5 ${sectionTitle}`}>Waiting</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label className="text-slate-300">Waiting charge /min</Label>
              <Input type="number" min={0} step={0.01} value={waitingChargePerMinute} onChange={(e) => setWaitingChargePerMinute(e.target.value)} className={inputClass} />
            </div>
            <div>
              <Label className="text-slate-300">Free waiting (minutes)</Label>
              <Input type="number" min={0} value={freeWaitingMinutes} onChange={(e) => setFreeWaitingMinutes(e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>
        <section className={cardClass}>
          <h2 className={`mb-5 ${sectionTitle}`}>Cancellation</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label className="text-slate-300">Cancellation fee (৳)</Label>
              <Input type="number" min={0} step={0.01} value={cancellationFee} onChange={(e) => setCancellationFee(e.target.value)} className={inputClass} />
            </div>
            <div>
              <Label className="text-slate-300">Free cancellation(min)</Label>
              <Input type="number" min={0} value={freeCancellationMinutes} onChange={(e) => setFreeCancellationMinutes(e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>
      </div>

      {/* Status */}
      <section className={`mt-8 ${cardClass}`}>
        <h2 className={`mb-5 ${sectionTitle}`}>Status</h2>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <Label className="mr-4 text-slate-300">Active</Label>
            <SelectNative
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              options={yesNo}
              className="mt-1.5 w-28"
              variantByValue={{ true: "success", false: "danger" }}
            />
          </div>
        </div>
      </section>

      {/* Sticky save bar — left-64 so it doesn't cover the sidebar (w-64) */}
      <div className="fixed bottom-0 left-64 right-0 z-20 border-t border-slate-800 bg-slate-900/95 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6">
          {message && (
            <p className={message.type === "ok" ? "text-sm font-medium text-emerald-400" : "text-sm font-medium text-red-400"}>
              {message.text}
            </p>
          )}
          {!message && <span />}
          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[var(--primary)] px-6 py-2.5 font-medium text-white shadow-lg shadow-[var(--primary)]/20 transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
