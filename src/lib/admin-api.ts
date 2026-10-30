export async function adminRequest<T = unknown>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown
): Promise<{ ok: boolean; error?: string; data?: T }> {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => null);
    if (res.status === 401) return { ok: false, error: "Your session expired. Please sign in again." };
    if (!res.ok) return { ok: false, error: json?.error ?? "Something went wrong. Please try again." };
    return { ok: true, data: json?.data };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
