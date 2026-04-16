---
name: html-ppt
description: HTML PPT Studio — 用 HTML/CSS/JS 创建专业的静态演示文稿。支持 36 种主题、14 种全 deck 模板、31 种布局、27 种 CSS 动画和 20 种 Canvas 特效。生成可交互的网页版幻灯片，支持键盘导航、全屏、演讲者模式。触发词：presentation, ppt, slides, deck, 幻灯片, 演讲稿, 做 PPT
metadata:
  openclaw:
    homepage: https://github.com/edwardqiu1976/html-ppt-skill
    requires:
      anyBins:
        - npx
        - playwright
---

# html-ppt — HTML PPT Studio

用 HTML/CSS/JS 创建专业的静态演示文稿。

## 功能概览

- **36 种主题** — minimal-white, editorial-serif, soft-pastel, sharp-mono, arctic-cool, sunset-warm, catppuccin-latte/mocha, dracula, tokyo-night, nord, solarized-light, gruvbox-dark, rose-pine, neo-brutalism, glassmorphism, bauhaus, swiss-grid, terminal-green, xiaohongshu-white, rainbow-gradient, aurora, blueprint, memphis-pop, cyberpunk-neon, y2k-chrome, retro-tv, japanese-minimal, vaporwave, midcentury, corporate-clean, academic-paper, news-broadcast, pitch-deck-vc, magazine-bold, engineering-whiteprint
- **14 种全 deck 模板** — pitch-deck, product-launch, tech-sharing, weekly-report, xhs-post 3:4, course-module 等
- **31 种布局** — 封面、标题、正文、列表、网格、图表等
- **27 种 CSS 动画** — fade-up, slide-in, zoom 等
- **20 种 Canvas 特效** — particle-burst, confetti, firework, starfield, matrix-rain 等
- **键盘运行时** — 方向键导航，T 切换主题，A 切换动画，F 全屏，S 演讲者模式，O 幻灯片概览

## 使用方法

### 1. 创建新演示文稿

```bash
/html-ppt create "我的演讲"
```

这会在当前目录创建一个新文件夹，包含基础 HTML 文件。

### 2. 选择主题

打开生成的 HTML 文件，修改主题链接：

```html
<link rel="stylesheet" id="theme-link" href="../assets/themes/tokyo-night.css">
```

可用主题列表见 `references/themes.md`

### 3. 选择布局

从 `templates/single-page/` 目录复制布局到你的演示文稿中。

可用布局列表见 `references/layouts.md`

### 4. 添加动画

在元素上添加 `data-anim` 属性：

```html
<div data-anim="fade-up">
  <h1>标题</h1>
</div>
```

可用动画列表见 `references/animations.md`

### 5. 导出为 PNG

```bash
/html-ppt render path/to/slides.html 10
```

导出前 10 页为 PNG 图片。

## 文件结构

```
html-ppt/
├── assets/
│   ├── base.css          # 设计系统 token
│   ├── fonts.css         # Web 字体
│   ├── runtime.js        # 键盘运行时
│   ├── themes/           # 36 种主题
│   └── animations/       # CSS 动画 + Canvas 特效
├── templates/
│   ├── single-page/       # 31 种单页布局
│   └── full-decks/        # 14 种全 deck 模板
├── references/            # 详细目录
│   ├── themes.md
│   ├── layouts.md
│   ├── animations.md
│   └── full-decks.md
└── scripts/               # 执行脚本
```

## 键盘快捷键

| 按键 | 功能 |
|------|------|
| ← → | 上一页/下一页 |
| Space | 下一页 |
| Home / End | 第一页/最后一页 |
| F | 全屏模式 |
| S | 演讲者模式（显示备注） |
| O | 幻灯片概览 |
| T | 循环切换主题 |
| A | 循环切换动画 |
| #/N | 跳转到第 N 页 |

## 主题推荐

| 场景 | 推荐主题 |
|------|----------|
| 技术分享 | tokyo-night, dracula, catppuccin-mocha, terminal-green, blueprint |
| 小红书图文 | xiaohongshu-white, soft-pastel, rainbow-gradient, magazine-bold |
| 商业路演 | pitch-deck-vc, corporate-clean, swiss-grid |
| 学术报告 | academic-paper, editorial-serif, minimal-white |
| 发布会 | cyberpunk-neon, vaporwave, y2k-chrome, neo-brutalism |

## 执行脚本

**Agent 执行说明**:
1. 确定本 SKILL.md 文件所在目录为 `{baseDir}`
2. 脚本路径 = `{baseDir}/scripts/<script-name>.ts`
3. 解析 `${BUN_X}` 运行时: 如果安装了 `bun` → `bun`; 如果有 `npx` → `npx -y bun`; 否则建议安装 bun

| 脚本 | 用途 |
|------|------|
| `scripts/main.ts` | 创建新演示文稿 |
| `scripts/render.ts` | 导出 PNG |
| `scripts/theme-preview.ts` | 预览主题 |

## 触发条件

当用户提到以下关键词时使用此 skill：
- presentation, ppt, slides, deck, keynote
- 幻灯片, 演讲稿, 做 PPT, 做 slides
- reveal, slideshow, 小红书图文
- tech sharing, pitch deck, 分享稿
