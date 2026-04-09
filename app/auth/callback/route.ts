import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { isEmailAllowed } from "@/lib/auth";

// Handles the magic-link redirect from Supabase Auth.
// Exchanges the ?code= for a session, verifies the email is allowed,
// and redirects to /studio (or wherever ?next= points).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/studio";

  if (!code) {
    return NextResponse.redirect(`${origin}/studio/login?error=missing_code`);
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error("[auth/callback] exchange error", error);
    return NextResponse.redirect(`${origin}/studio/login?error=exchange_failed`);
  }

  // Email allowlist check — last line of defence
  const email = data.session.user.email;
  if (!isEmailAllowed(email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/studio/login?error=not_allowed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
