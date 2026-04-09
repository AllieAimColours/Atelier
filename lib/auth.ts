// ═══════════════════════════════════════════════════════════════════════
// THE ATELIER · AUTH HELPERS
// ═══════════════════════════════════════════════════════════════════════
// Email allowlist for the Studio. Set STUDIO_ALLOWED_EMAILS in Vercel +
// .env.local as a comma-separated list. Defaults to allie@aimcolours.com.
// ═══════════════════════════════════════════════════════════════════════

export function getAllowedEmails(): string[] {
  const raw =
    process.env.STUDIO_ALLOWED_EMAILS ??
    "allie@aimcolours.com,contact@aimcolours.com";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAllowedEmails().includes(email.toLowerCase());
}
