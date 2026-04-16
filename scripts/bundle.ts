#!/usr/bin/env npx tsx
// Bundle all assets into a single self-contained HTML file (with all themes for hot-swapping)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function bundle(inputFile: string, outputFile: string) {
  const baseDir = join(__dirname, "..");
  let html = readFileSync(inputFile, "utf-8");
  
  console.log("Reading source files...");
  
  const fontsCss = readFileSync(join(baseDir, "assets/fonts.css"), "utf-8");
  const baseCss = readFileSync(join(baseDir, "assets/base.css"), "utf-8");
  const animCss = readFileSync(join(baseDir, "assets/animations/animations.css"), "utf-8");
  const runtimeJs = readFileSync(join(baseDir, "assets/runtime.js"), "utf-8");
  
  // Read all themes
  const themesDir = join(baseDir, "assets/themes");
  const themeFiles = [
    "minimal-white", "editorial-serif", "soft-pastel", "sharp-mono", "arctic-cool", 
    "sunset-warm", "catppuccin-latte", "catppuccin-mocha", "dracula", "tokyo-night",
    "nord", "solarized-light", "gruvbox-dark", "rose-pine", "neo-brutalism",
    "glassmorphism", "bauhaus", "swiss-grid", "terminal-green", "xiaohongshu-white",
    "rainbow-gradient", "aurora", "blueprint", "memphis-pop", "cyberpunk-neon",
    "y2k-chrome", "retro-tv", "japanese-minimal", "vaporwave", "midcentury",
    "corporate-clean", "academic-paper", "news-broadcast", "pitch-deck-vc",
    "magazine-bold", "engineering-whiteprint"
  ];
  
  const themes: Record<string, string> = {};
  for (const t of themeFiles) {
    const path = join(themesDir, `${t}.css`);
    if (existsSync(path)) {
      themes[t] = readFileSync(path, "utf-8");
    }
  }
  
  // Build the bundled HTML
  let bundled = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="minimal-white">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>html-ppt · Deck</title>
<style>
/* fonts.css */
${fontsCss}

/* base.css */
${baseCss}

/* animations.css */
${animCss}
</style>
`;
  
  // Add all themes as inline styles with data-theme attribute
  for (const [name, css] of Object.entries(themes)) {
    bundled += `<style data-theme="${name}">\n/* ${name}.css */\n${css}\n</style>\n`;
  }
  
  // Keep the body and slides, but update asset paths
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  const bodyContent = bodyMatch ? bodyMatch[1] : "";
  
  // Update data-theme-base to use inline themes
  let updatedBody = bodyContent
    .replace(/data-theme-base="[^"]*"/, 'data-theme-base=""')
    .replace(/href="\.\.\/\.\.\/assets\//g, 'href=""');
  
  bundled += `</head>
<body data-themes="${Object.keys(themes).join(",")}" data-theme-base="">
${updatedBody}
<script>
${runtimeJs}
</script>
</body></html>`;
  
  writeFileSync(outputFile, bundled);
  const size = (bundled.length / 1024).toFixed(1);
  console.log(`✓ Bundled to: ${outputFile} (${size} KB)`);
  console.log(`  ${Object.keys(themes).length} themes included`);
}

const input = process.argv[2] || join(__dirname, "../examples/test-presentation/index.html");
const output = process.argv[3] || input.replace(".html", ".bundle.html");

if (!existsSync(input)) {
  console.error(`Error: ${input} not found`);
  process.exit(1);
}

bundle(input, output);