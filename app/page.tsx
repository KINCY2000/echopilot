import { redirect } from "next/navigation";

export default function Home() {
  // Auth/organization gating happens in middleware.ts and
  // app/dashboard/layout.tsx — this route never renders anything itself.
  redirect("/dashboard");
}
