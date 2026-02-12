"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
