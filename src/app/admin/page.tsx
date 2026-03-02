import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export default async function AdminHome() {
  const { isAdmin, user } = await requireAdmin();

  if (!user) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p>You’re not signed in. Please <Link className="underline" href="/auth">sign in</Link> with an admin email.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p>Your account <code>{user.email}</code> is not an admin. Ask the owner to add your email to <code>admin_users</code>.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <ul className="list-disc pl-5 space-y-2">
        <li><Link className="underline" href="/admin/updates">Manage Ministry Updates</Link></li>
        <li><Link className="underline" href="/admin/prompts">Manage Daily Prompts</Link></li>
      </ul>
    </div>
  );
}