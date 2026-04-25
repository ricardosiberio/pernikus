export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const isSanityConfigured = projectId.length > 0;

if (!isSanityConfigured && typeof window === "undefined") {
  console.warn(
    "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. " +
      "Catalog pages will render empty until you configure Sanity (see README)."
  );
}
