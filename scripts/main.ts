#!/usr/bin/env npx tsx
// html-ppt :: main.ts — scaffold a new deck from templates/deck.html
//
// Usage:
//   npx html-ppt/main.ts <name> [output-parent-dir]
//
// Creates <parent>/<name>/index.html with paths rewritten to point at the
// skill's shared assets/themes/animations.

import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function main() {
  const name = process.argv[2];
  const parent = process.argv[3] || "examples";

  if (!name) {
    console.error("usage: npx html-ppt/main.ts <name> [parent-dir]");
    process.exit(1);
  }

  const templatePath = join(__dirname, "../templates/deck.html");
  if (!existsSync(templatePath)) {
    console.error(`error: template not found at ${templatePath}`);
    process.exit(1);
  }

  const outDir = join(__dirname, "../", parent, name);
  if (existsSync(outDir)) {
    console.error(`error: ${outDir} already exists`);
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });

  // Read template and rewrite asset paths
  // templates/deck.html references ../assets/...; for examples/<name>/index.html
  // that same relative path (../../assets/...) needs one more ../
  let content = readFileSync(templatePath, "utf-8");
  content = content.split('href="../assets/').join('href="../../assets/');
  content = content.split('src="../assets/').join('src="../../assets/');
  content = content.split('data-theme-base="../assets/').join('data-theme-base="../../assets/');

  writeFileSync(join(outDir, "index.html"), content);

  console.log(`✔ created ${outDir}/index.html`);
  console.log("");
  console.log("next steps:");
  console.log(`  open   ${outDir}/index.html`);
  console.log("  # press T to cycle themes, ← → to navigate, O for overview");
  console.log("");
  console.log("  # render to PNG:");
  console.log(`  npx html-ppt/render.ts ${outDir}/index.html all`);
}

main();