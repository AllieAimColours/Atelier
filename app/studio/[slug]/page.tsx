import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { getDeckBySlugAuthed } from "@/lib/deck";
import { isEmailAllowed } from "@/lib/auth";
import StudioClient from "./StudioClient";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StudioEditorPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  // Auth check (middleware already redirects, but defence in depth)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isEmailAllowed(user.email)) {
    redirect("/studio/login");
  }

  const bundle = await getDeckBySlugAuthed(supabase, slug);
  if (!bundle) notFound();

  return <StudioClient bundle={bundle} userEmail={user.email ?? ""} />;
}
