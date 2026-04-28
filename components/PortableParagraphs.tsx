import type { PortableTextBlock } from "@/lib/sanity-content";

/**
 * Minimal Portable Text renderer for paragraph-only content.
 * Supports: paragraphs, bold (mark "strong"), italic (mark "em"),
 * and inline links (markDef type "link" with href).
 */
export function PortableParagraphs({
  blocks,
  className,
}: {
  blocks: PortableTextBlock[] | undefined;
  className?: string;
}) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className={className}>
      {blocks.map((block) => {
        if (block._type !== "block") return null;
        return (
          <p key={block._key}>
            {block.children.map((child) => renderSpan(child, block.markDefs))}
          </p>
        );
      })}
    </div>
  );
}

function renderSpan(
  child: { _type: "span"; _key: string; text: string; marks: string[] },
  markDefs: unknown[]
) {
  let node: React.ReactNode = child.text;
  for (const mark of child.marks ?? []) {
    if (mark === "strong") {
      node = <strong key={`${child._key}-strong`}>{node}</strong>;
    } else if (mark === "em") {
      node = <em key={`${child._key}-em`}>{node}</em>;
    } else {
      // Look up markDef by _key for link refs
      const def = (markDefs as Array<{ _key?: string; _type?: string; href?: string }>).find(
        (m) => m?._key === mark
      );
      if (def?._type === "link" && def.href) {
        node = (
          <a
            key={`${child._key}-${def._key}`}
            href={def.href}
            target={def.href.startsWith("http") ? "_blank" : undefined}
            rel={def.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="underline decoration-slate-400 underline-offset-2 hover:text-navy-900"
          >
            {node}
          </a>
        );
      }
    }
  }
  return <span key={child._key}>{node}</span>;
}
