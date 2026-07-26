# GuyZ3R0 — Personal Website Brief

> A build spec for **Claude Design**. Multi-page personal site: dark, neon, pixel-art, cube/block-driven. Interactive but not overwhelming. Everything here is a directive unless marked **[confirm]** (a default I chose that GuyZ3R0 may adjust).

---

## 1. Purpose & Voice

- **Owner / brand:** GuyZ3R0 (this is the identity — front it prominently).
- **Goals:** build a personal brand, catch opportunities, and act as a hub that showcases work and shares what he's up to through a blog.
- **Not** a pure portfolio or a sales page. **No tagline, motto, or catchy one-liner.**
- **Tone:** professional with bits of playfulness — serious substance delivered in a fun, game-flavored way.

---

## 2. Visual Identity

- **Wordmark:** "GuyZ3R0".
- **Avatar:** the pixel-art character (blue hoodie, neon-green accents, dark blocky head) is the hero centerpiece and a recurring motif.
- **Aesthetic:** dark, neon-lit, pixel-art + modern. **Cube / block geometry is the core motif.** Retro-futuristic but clean, not cluttered.
- **Signature device:** the avatar's layered "sticker shadow" (white outline → dark → offset colored shadow). Reuse it on cards and buttons — chunky offset pixel shadow that **shifts on hover/press** for a tactile, pop-off-the-screen feel.
- **Mode:** **dark only.**

### Color palette

| Role | Hex |
|---|---|
| Deepest base | `#0a040d` |
| Elevated dark (panels/cards) | `#1b123e` |
| Primary accent — yellow | `#ffcc37` |
| Primary accent — orange | `#ff8b1c` |
| Electric — neon green | `#00ff90` |
| Electric — blue | `#0758cc` |
| Electric — deep blue | `#1e1e90` |

**Category colors** (for the "What I'm up to" cards):
- Experience → `#00ff90`
- Achievement → **[confirm]** a theme-matching red — proposed `#ff2e57` (neon crimson). Swap for a purer red like `#ff2e2e` if preferred.
- Right Now → `#ffcc37`

---

## 3. Global Elements (shared across pages)

- **Nav bar** (persistent): GuyZ3R0 wordmark/logo + links to **Home · Blog · Projects**.
- **Animation mode switch:** three modes — **Max / Subtle / Zero.** Global, and **remembered across pages and visits** (localStorage on the live site). Default: **Subtle**.
- **Animated background:** its own **on/off toggle**, independent of the mode switch (so the background can be killed even in Max, or kept in Subtle).
- **Reduced motion:** if the visitor's device requests reduced motion (an OS accessibility setting), auto-default to **Subtle** unless they choose otherwise.
- **Footer:** social row + small wordmark / copyright.
- **File structure** (organized & customizable — important): separate HTML per page, a shared CSS + a per-page CSS, JS split by concern, `/posts/` for blog markdown, `/assets/` for images and fonts. Example:
  ```
  index.html        projects.html      blog.html
  /css   → base.css, home.css, projects.css, blog.css
  /js    → main.js, deck.js, blog.js, projects.js, anim.js
  /posts → my-first-post.md, ...
  /assets → images, icons, fonts
  ```

---

## 4. Pages

### 4.1 Home

**Hero** — **[confirm]** avatar as centerpiece + "GuyZ3R0" wordmark + a short *factual* descriptor line (what he does, e.g. "Developer & game-asset creator" — **not** a slogan) + two CTA buttons (**View Projects**, **Read Blog**) + a small social-icon row. If GuyZ3R0 wants it barer, drop the descriptor and keep just avatar + wordmark + CTAs.

**About Me** — short (2–3 sentences), professional-with-playful tone.

**"What I'm up to" deck** — the signature section.
- A **horizontal, snap-scrolling RPG-style card deck** (swipe / scroll / arrow-nav; cards magnetically snap).
- **Start with 5 cards; trivially add more** (data-driven — a simple array/config so new cards are easy to append).
- **3 card types**, each color-coded and carrying a small **labeled tag with a background in the top-right corner**:
  - `Experience` → green `#00ff90`
  - `Achievement` → red (`#ff2e57`)
  - `Right Now` → yellow `#ffcc37`
- **Card interactions:** hover lift + slight 3D tilt toward the cursor + neon edge-glow (the "picking a card" feel); the sticker-shadow shifts. Longer entries may expand for more detail. **[confirm]**

**Socials section** — small configurable cards, each with an icon + label. Per-card behavior:
- **Copy to clipboard** (with a "Copied!" confirmation): **Discord**, **Email**
- **Open link** (new tab): **GitHub**, **LinkedIn**, **X (x.com)**, **Codeforces**
- Handles / URLs: leave as placeholders for GuyZ3R0 to fill.
- Make it easy to add/remove/reconfigure a card and its behavior (copy vs link).

**"Wanna see more?"** — a closing section with prominent links/cards to the **Blog** and **Projects** pages.

### 4.2 Blog

- **File-based markdown, no CMS.** Each post is a `.md` file in `/posts/` with frontmatter (`title`, `date`, `cover`, optional `tags`). The site fetches + renders it client-side (e.g. `marked` or `markdown-it`).
- **Rendering supports:** images, varied heading sizes, styled text, blockquotes, code blocks, lists — all themed to match the site.
- **Blog index:** a list/grid of posts (cover image, title, date, short excerpt).
- **Post view:** rendered markdown in a clean, readable layout consistent with the dark/neon theme.
- **Topics:** the work he's doing, problems he's solving, and his opinions.

### 4.3 Projects

- **Fully configurable**, supports **variable-size cards / sections** (a featured project can take a bigger card).
- **Lead projects:** ORS Hub, Golem, Statmaxxer (more added over time).
- **Project card:** thumbnail + title + a small **category tag in the top-right corner**.
- **Interaction:** clicking a project **opens a panel / modal** containing images and a description of the project (plus optional links — store / repo / live).
- Make adding a project (and its images/description) a simple config edit.

---

## 5. Animations & Effects

Governed by the **Max / Subtle / Zero** switch. **No hover or click sounds.** Bias toward *many small tactile moments* over a few big flashy ones.

**Buttons (cube focus)**
- Cube-flip on hover — button rotates like a die to reveal a second face (label → arrow/icon). CSS 3D (`perspective` + `preserve-3d`).
- Arcade press — the sticker-shadow compresses on click, like pressing a physical key.

**Cards**
- Snap-scroll deck (CSS `scroll-snap`).
- Hover: lift + slight tilt-toward-cursor + neon edge-glow.
- Optional "selected" state (rises higher, brighter frame).

**Scroll**
- Block build-in — elements assemble from pixel blocks as they enter view (Minecraft-place vibe).
- Parallax depth — background cube/pixel layers drift slower than the foreground.

**Background (own toggle)**
- Slow-drifting isometric cube grid **or** a faint pixel starfield — kept low so it never fights the content.
- Optional subtle CRT scanline / vignette overlay for full retro.

**Cursor / micro**
- Custom pixel/crosshair cursor + faint neon trail; a tiny pixel-spark on click.

**Page transitions**
- Pixel-dissolve / dither wipe between pages (or the View Transitions API).
- A short, **skippable** "boot-up" intro on first load only.

**Mode behavior**
- **Max** — everything on.
- **Subtle** — gentle fades + hover states, minimal motion, no heavy parallax, no boot intro. (Also the reduced-motion default.)
- **Zero** — essentially static, instant state changes, no ambient motion.

---

## 6. Typography — pick one **[confirm]**

Give GuyZ3R0 the options; all are freely available (Google Fonts / Fontshare).

- **A · Pixel-forward** — `Pixelify Sans` or `Silkscreen` for headings (used sparingly) + `Inter` body + `JetBrains Mono` accents. Most "gamey."
- **B · Modern-geometric** — `Space Grotesk` or `Sora` headings + `Inter` body + `JetBrains Mono` accents. Clean and punchy.
- **C · Terminal / hacker** — `IBM Plex Mono` or `JetBrains Mono` headings + sans body. Techy, code-forward.
- **D · Hybrid (recommended default)** — a **pixel font for the GuyZ3R0 wordmark/logo only**, modern sans (`Space Grotesk`/`Inter`) everywhere else. Keeps the pixel flavor without hurting readability.

---

## 7. Tech, Hosting & Accessibility

- Static site → **GitHub Pages**, paired with GuyZ3R0's **own domain**.
- **Vanilla HTML/CSS/JS**, organized into separate files (see §3). Small libraries OK for markdown rendering and, if needed, scroll choreography (GSAP is now fully free) — but keep it **lightweight and easy to customize**.
- Honor `prefers-reduced-motion`; maintain strong contrast (dark base, bright accents); keyboard-navigable nav and controls.

---

## 8. Open items for GuyZ3R0 to confirm

1. Achievement red hex (proposed `#ff2e57`).
2. Hero: keep the factual descriptor line + CTAs, or bare avatar + wordmark + CTAs?
3. Typography pick (A–D).
4. Social handles / URLs.
5. Thumbnails + descriptions for ORS Hub, Golem, Statmaxxer.
