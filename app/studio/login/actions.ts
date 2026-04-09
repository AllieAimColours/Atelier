"use server";

import { headers } from "next/headers";
import { createServerSupabase } from "@/lib/supabase-server";
import { isEmailAllowed } from "@/lib/auth";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function sendMagicLink(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (!isEmailAllowed(email)) {
    // Don't reveal whether the email is in the allowlist — just say generic.
    return {
      ok: false,
      error: "This email is not authorized to access The Atelier.",
    };
  }

  const supabase = await createServerSupabase();
  const headerList = await headers();
  const origin =
    headerList.get("origin") ??
    `https://${headerList.get("host") ?? "atelier-one-pi.vercel.app"}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/studio`,
    },
  });

  if (error) {
    console.error("[sendMagicLink]", error);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
