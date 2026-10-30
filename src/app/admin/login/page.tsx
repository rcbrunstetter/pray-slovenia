import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import PageShell from "@/components/PageShell";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Admin Login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const { isAdmin } = await requireAdmin();
  if (isAdmin) redirect("/admin");

  const { denied } = await searchParams;

  return (
    <PageShell title="Admin Login" subtitle="Pray Slovenia team access">
      <LoginForm denied={denied === "1"} />
    </PageShell>
  );
}
