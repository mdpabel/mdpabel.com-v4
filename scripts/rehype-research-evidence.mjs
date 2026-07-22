import fs from "node:fs";
import path from "node:path";

function readPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG")
    return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function visitChildren(node) {
  if (!Array.isArray(node.children)) return;

  node.children = node.children.map((child) => {
    if (
      child?.type === "element" &&
      child.tagName === "p" &&
      child.children?.length === 1 &&
      child.children[0]?.type === "element" &&
      child.children[0].tagName === "img"
    ) {
      const image = child.children[0];
      const src = image.properties?.src;
      const alt = image.properties?.alt || "";
      const caption = image.properties?.title;

      if (
        typeof src === "string" &&
        src.startsWith("/wordpress-threats/") &&
        typeof caption === "string"
      ) {
        const publicPath = path.join(
          process.cwd(),
          "public",
          src.replace(/^\//, ""),
        );
        const dimensions = fs.existsSync(publicPath)
          ? readPngDimensions(publicPath)
          : null;
        delete image.properties.title;
        image.properties = {
          ...image.properties,
          width: dimensions?.width,
          height: dimensions?.height,
          sizes:
            "(max-width: 768px) calc(100vw - 28px), (max-width: 1200px) calc(100vw - 360px), 760px",
          loading: "lazy",
          decoding: "async",
        };

        return {
          type: "element",
          tagName: "figure",
          properties: { className: ["research-evidence-figure"] },
          children: [
            {
              type: "element",
              tagName: "a",
              properties: {
                href: src,
                ariaLabel: alt
                  ? `Open full-size evidence image: ${alt}`
                  : "Open full-size evidence image",
              },
              children: [image],
            },
            {
              type: "element",
              tagName: "figcaption",
              properties: {},
              children: [{ type: "text", value: caption }],
            },
          ],
        };
      }
    }

    visitChildren(child);
    return child;
  });
}

export default function rehypeResearchEvidence() {
  return (tree) => visitChildren(tree);
}
