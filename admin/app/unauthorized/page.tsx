import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(10,191,139,0.2),transparent)]" />
      <div className="relative text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Access denied
        </h1>
        <p className="mt-2 text-slate-400">
          You don’t have permission to access the admin panel.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">Back to login</Link>
        </Button>
      </div>
    </div>
  );
}
