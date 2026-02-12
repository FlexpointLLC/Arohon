import { Suspense } from "react";
import { PaymentsShell } from "./payments-shell";

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <PaymentsShell>{children}</PaymentsShell>
    </Suspense>
  );
}
