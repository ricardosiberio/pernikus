import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId } from "./sanity/env";

const SINGLETON_TYPES = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "wholesalePage",
  "credentialsPage",
]);
const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  basePath: "/studio",
  name: "pernikus",
  title: "Pernikus LLC — Content Studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton: Site Settings
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site Settings")
              ),
            // Singleton: Homepage
            S.listItem()
              .title("Homepage")
              .id("homePage")
              .child(
                S.document()
                  .schemaType("homePage")
                  .documentId("homePage")
                  .title("Homepage")
              ),
            // Singleton: About Page
            S.listItem()
              .title("About Page")
              .id("aboutPage")
              .child(
                S.document()
                  .schemaType("aboutPage")
                  .documentId("aboutPage")
                  .title("About Page")
              ),
            // Singleton: Wholesale Page
            S.listItem()
              .title("Wholesale Page")
              .id("wholesalePage")
              .child(
                S.document()
                  .schemaType("wholesalePage")
                  .documentId("wholesalePage")
                  .title("Wholesale Page")
              ),
            // Singleton: Credentials Page
            S.listItem()
              .title("Credentials Page")
              .id("credentialsPage")
              .child(
                S.document()
                  .schemaType("credentialsPage")
                  .documentId("credentialsPage")
                  .title("Credentials Page")
              ),
            S.divider(),
            // Regular collections
            ...S.documentTypeListItems().filter(
              (listItem) => !SINGLETON_TYPES.has(listItem.getId() ?? "")
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    // Prevent singletons from appearing in "Create new" dropdowns
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    // Restrict actions on singletons (no delete, no duplicate, no unpublish)
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : input,
  },
});
