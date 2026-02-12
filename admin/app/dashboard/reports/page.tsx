import { redirect } from "next/navigation";

export default function ReportsRedirect() {
  redirect("/dashboard/support?tab=reports");
}
