/**
 * The Sanity Studio is mounted at /studio.
 * Log in at /studio with the Sanity account that owns NEXT_PUBLIC_SANITY_PROJECT_ID.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
