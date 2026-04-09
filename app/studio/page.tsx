import { redirect } from "next/navigation";

// /studio → /studio/default
// In the future this could show a deck picker if there are multiple variants.
export default function StudioIndex() {
  redirect("/studio/default");
}
