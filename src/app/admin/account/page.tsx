import type { Metadata } from "next";
import AccountForm from "./account-form";
import PageShell from "@/components/PageShell";
import { requireAdminPage } from "@/lib/admin";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  await requireAdminPage();

  return (
    <PageShell title="Account" subtitle="Manage your admin account" back={{ href: "/admin", label: "Dashboard" }}>
      <AccountForm />
    </PageShell>
  );
}
