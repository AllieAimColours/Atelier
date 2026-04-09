import { notFound } from "next/navigation";
import { getDeckBySlug } from "@/lib/deck";
import Deck from "@/components/deck/Deck";
import type { Metadata } from "next";

// Always render fresh from the database. Phase 1 — no caching.
// Once we add a Studio publish flow, we can revalidate on demand.
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getDeckBySlug(slug);
  if (!bundle) return { title: "Deck not found · The Atelier" };
  const audience = bundle.audience?.name;
  return {
    title: audience
      ? `Aim Colours · for ${audience}`
      : `Aim Colours · ${bundle.deck.name}`,
    description:
      "Dynamic electronic materials for luxury accessories. The house that moves first owns the category.",
  };
}

export default async function PitchPage({ params }: PageProps) {
  const { slug } = await params;
  const bundle = await getDeckBySlug(slug);

  if (!bundle || bundle.slides.length === 0) {
    notFound();
  }

  return <Deck bundle={bundle} />;
}
