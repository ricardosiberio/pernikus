import { createClient } from "next-sanity";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

export const sanityClient = createClient({
  projectId: projectId || "missing",
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = createImageUrlBuilder({ projectId: projectId || "missing", dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export { isSanityConfigured };
