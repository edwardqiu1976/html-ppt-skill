#!/usr/bin/env npx tsx
// html-ppt :: render.ts — render HTML slides to PNG via Playwright
//
// Usage:
//   npx html-ppt/render.ts <html-file>                     # one PNG, slide 1
//   npx html-ppt/render.ts <html-file> [N]                 # N PNGs, slides 1..N
//   npx html-ppt/render.ts <html-file> all                 # autodetect .slide count
//   npx html-ppt/render.ts <html-file> [N] [out-dir]         # custom output dir
//
// Requires: playwright (install via npm i -D playwright)

import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, Browser, Page } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function render() {
  const htmlFile = process.argv[2];
  const countArg = process.argv[3];
  const outDirArg = process.argv[4];

  if (!htmlFile) {
    console.error("usage: npx html-ppt/render.ts <html> [N|all] [out-dir]");
    process.exit(1);
  }

  if (!existsSync(htmlFile)) {
    console.error(`error: ${htmlFile} not found`);
    process.exit(1);
  }

  let count = 1;
  if (countArg === "all" || !countArg) {
    // Autodetect slide count
    const { readFileSync } = await import("node:fs");
    const content = readFileSync(htmlFile, "utf-8");
    const matches = content.match(/class="slide"/g);
    count = matches ? matches.length : 1;
  } else {
    count = parseInt(countArg, 10) || 1;
  }

  let outDir: string;
  if (outDirArg) {
    outDir = outDirArg;
  } else if (count > 1) {
    const stem = basename(htmlFile, ".html");
    outDir = join(dirname(htmlFile), `${stem}-png`);
  } else {
    outDir = dirname(htmlFile);
  }

  if (count > 1 && !existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const fileUrl = `file://${htmlFile}`;
  const stem = basename(htmlFile, ".html");

  console.log(`Launching browser...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  for (let i = 1; i <= count; i++) {
    const url = count === 1 ? fileUrl : `${fileUrl}#/${i}`;
    const outFile = count === 1
      ? join(outDir, `${stem}.png`)
      : join(outDir, `${stem}_${String(i).padStart(2, "0")}.png`);

    console.log(`  Rendering slide ${i}/${count}...`);
    await page.goto(url, { waitUntil: "networkidle" });
    await page.screenshot({ path: outFile, fullPage: false });
    console.log(`  ✔ ${outFile}`);
  }

  await browser.close();
  console.log(`done: rendered ${count} slide(s) from ${htmlFile}`);
}

render().catch((err) => {
  console.error("error:", err.message);
  process.exit(1);
});