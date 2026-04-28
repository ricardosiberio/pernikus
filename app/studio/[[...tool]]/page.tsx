/**
 * The Sanity Studio is mounted at /studio.
 * Log in at /studio with the Sanity account that owns NEXT_PUBLIC_SANITY_PROJECT_ID.
 *
 * Renders as a fixed full-viewport overlay so the Studio's bottom action
 * bar (with the Publish button) is never clipped by the site's Navbar/Footer.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0f172a",
      }}
    >
      <NextStudio config={config} />
    </div>
  );
}
