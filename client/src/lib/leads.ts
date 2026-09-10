/**
 * Lead capture (contact form + demo requests) — static-site friendly.
 *
 * Submissions go straight to Supabase's REST API with the public anon key.
 * Row Level Security on the tables allows INSERT only, so the key cannot be
 * used to read leads. The admin panel reads them through password-gated
 * SECURITY DEFINER functions (see /admin).
 */
import { useCallback, useState } from "react";

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://jhkkylkqeeuxwrvbrfoz.supabase.co";
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_au6X_AMh_KO9SyJhm5haMA_-T7Za_Qk";

const headers = () => ({
  "Content-Type": "application/json",
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
});

async function insertRow(table: string, row: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase insert failed (${res.status}): ${text}`);
  }
}

export async function rpc<T = unknown>(fn: string, args: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase rpc ${fn} failed (${res.status}): ${text}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export interface ContactInput {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export interface DemoInput {
  companyName: string;
  email: string;
  phone: string;
  employeeCount: string;
}

export function submitContact(input: ContactInput) {
  return insertRow("es_contact_submissions", {
    name: input.name,
    email: input.email,
    company: input.company || null,
    message: input.message,
  });
}

export function submitDemoRequest(input: DemoInput) {
  return insertRow("es_demo_requests", {
    company_name: input.companyName,
    email: input.email,
    phone: input.phone,
    employee_count: input.employeeCount,
  });
}

/** Minimal mutation hook with the same surface the page used from tRPC. */
export function useLeadMutation<TInput>(
  fn: (input: TInput) => Promise<void>,
  opts?: { onSuccess?: () => void; onError?: (err: unknown) => void },
) {
  const [isPending, setPending] = useState(false);
  const mutateAsync = useCallback(
    async (input: TInput) => {
      setPending(true);
      try {
        await fn(input);
        opts?.onSuccess?.();
      } catch (err) {
        opts?.onError?.(err);
        throw err;
      } finally {
        setPending(false);
      }
    },
    [fn, opts?.onSuccess, opts?.onError],
  );
  const mutate = useCallback(
    (input: TInput) => {
      void mutateAsync(input).catch(() => undefined);
    },
    [mutateAsync],
  );
  return { mutate, mutateAsync, isPending };
}
