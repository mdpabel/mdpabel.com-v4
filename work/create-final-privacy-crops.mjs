import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const dir = path.join(root, "public", "wordpress-threats");
const originals = path.join(
  root,
  ".private-evidence",
  "wordpress-threats",
  "final-batch-sensitive-originals",
);

await sharp(path.join(originals, "malware-index.php_evidence-1.png"))
  .extract({ left: 0, top: 100, width: 1432, height: 749 })
  .png()
  .toFile(path.join(dir, "malware-index.php_evidence-safe.png"));

await sharp(path.join(originals, "db-spam-malware_evidence-1.png"))
  .extract({ left: 290, top: 170, width: 940, height: 540 })
  .png()
  .toFile(path.join(dir, "db-spam-malware_evidence-safe.png"));

console.log("Created two privacy-safe screenshot crops.");
