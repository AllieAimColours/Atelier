import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { isEmailAllowed } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

// POST /api/upload
// multipart/form-data with field "file"
// Returns: { ok: true, url, path } on success
//
// Auth required + email allowlist enforced.
// Uses the service role to write to the media bucket so we don't depend
// on the user's session token having storage permissions.
export async function POST(request: NextRequest) {
  // ─── auth check ───
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isEmailAllowed(user.email)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // ─── parse upload ───
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form data" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Missing 'file' field" },
      { status: 400 }
    );
  }

  // ─── validate ───
  const ALLOWED = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: `Unsupported file type: ${file.type}` },
      { status: 400 }
    );
  }
  const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "File too large (max 10 MB)" },
      { status: 400 }
    );
  }

  // ─── generate path: yyyy-mm/randomid-filename ───
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const randomId = crypto.randomUUID().slice(0, 8);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${yearMonth}/${randomId}-${safeName}`;

  // ─── upload via service role client ───
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json(
      { ok: false, error: "Server not configured (missing service role key)" },
      { status: 500 }
    );
  }
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { persistSession: false } }
  );

  const { error: uploadErr } = await adminClient.storage
    .from("media")
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadErr) {
    console.error("[/api/upload] storage error", uploadErr);
    return NextResponse.json(
      { ok: false, error: uploadErr.message },
      { status: 500 }
    );
  }

  // ─── public URL ───
  const { data: publicData } = adminClient.storage
    .from("media")
    .getPublicUrl(path);

  // Optional: also insert a record into the media table so the asset
  // shows up in a future media library.
  await adminClient.from("media").insert({
    kind: file.type === "image/svg+xml" ? "svg"
        : file.type === "image/gif"     ? "gif"
        : "image",
    storage_path: path,
    public_url: publicData.publicUrl,
    alt_text: file.name,
  });

  return NextResponse.json({
    ok: true,
    url: publicData.publicUrl,
    path,
  });
}
