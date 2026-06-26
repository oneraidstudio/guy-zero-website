/* =========================================================
   GuyZ3R0 — shared scripts
   - Pixel ripple hero animation (canvas)
   - Social card behaviors (link vs copy)
   - Mobile nav toggle
   ========================================================= */

/* ---------- Mobile nav toggle ---------- */
(function navInit() {
  const burger = document.querySelector('.nav-burger');
  const links = document.querySelector('.nav-links');
  if (!burger || !links) return;
  burger.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

/* ---------- Pixel ripple hero ---------- */
(function pixelHero() {
  const canvas = document.getElementById('pixel-hero');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  // Colors (pull from spec palette)
  const COLORS = {
    base: { r: 26, g: 17, b: 62 },     // deep indigo dot
    cyan: { r: 163, g: 242, b: 249 },
    green: { r: 13, g: 209, b: 111 },
  };

  const CELL = 22;          // grid spacing
  const DOT = 2;            // base dot radius
  const RIPPLE_SPEED = 320; // px per second
  const RIPPLE_WIDTH = 70;  // band thickness
  const RIPPLE_LIFE = 1.6;  // seconds

  let cols = 0, rows = 0, dpr = 1;
  let width = 0, height = 0;
  let mouse = { x: -9999, y: -9999, inside: false, lastMove: 0 };
  let ripples = [];
  let ambientT = 0;
  let lastT = performance.now();
  let rafId = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(width / CELL) + 1;
    rows = Math.ceil(height / CELL) + 1;
  }
  resize();
  window.addEventListener('resize', resize);

  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (mouse.inside) {
      // Throw a ripple occasionally as the mouse moves
      const now = performance.now();
      if (now - mouse.lastMove > 60) {
        ripples.push({ x, y, t: 0 });
        mouse.lastMove = now;
      }
    }
    mouse.x = x;
    mouse.y = y;
    mouse.inside = true;
  }
  function onLeave() {
    mouse.inside = false;
    mouse.x = -9999; mouse.y = -9999;
  }
  function onClick(e) {
    const rect = canvas.getBoundingClientRect();
    ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, t: 0, strong: true });
  }

  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseleave', onLeave);
  canvas.addEventListener('click', onClick);

  // Ambient ripples (touch / no-hover / reduced motion fallback)
  let ambientTimer = 0;
  function spawnAmbient() {
    ripples.push({
      x: Math.random() * width,
      y: Math.random() * height,
      t: 0,
      ambient: true,
    });
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;

    // Spawn ambient ripples on touch / reduced motion / when mouse hasn't moved
    ambientTimer += dt;
    const needAmbient = isTouch || reduced || !mouse.inside;
    const interval = reduced ? 3.2 : (isTouch ? 1.2 : 2.0);
    if (needAmbient && ambientTimer > interval) {
      spawnAmbient();
      ambientTimer = 0;
    }

    // Advance ripples
    ripples.forEach(r => r.t += dt);
    ripples = ripples.filter(r => r.t < RIPPLE_LIFE);

    // Draw
    ctx.clearRect(0, 0, width, height);

    const mx = mouse.x, my = mouse.y;
    const hoverR = 130;
    const hoverR2 = hoverR * hoverR;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * CELL + (CELL / 2);
        const y = j * CELL + (CELL / 2);

        // Subtle base shimmer
        let intensity = 0;
        let mixR = COLORS.base.r;
        let mixG = COLORS.base.g;
        let mixB = COLORS.base.b;
        let radius = DOT;
        let alpha = 0.28;

        // Hover halo
        if (mouse.inside) {
          const dx = x - mx, dy = y - my;
          const d2 = dx*dx + dy*dy;
          if (d2 < hoverR2) {
            const d = Math.sqrt(d2);
            const k = 1 - d / hoverR;
            intensity = Math.max(intensity, k);
          }
        }

        // Ripples
        for (let r of ripples) {
          const dx = x - r.x, dy = y - r.y;
          const d = Math.sqrt(dx*dx + dy*dy);
          const radius_t = r.t * RIPPLE_SPEED;
          const band = Math.abs(d - radius_t);
          if (band < RIPPLE_WIDTH) {
            const fade = 1 - (r.t / RIPPLE_LIFE);
            const k = (1 - band / RIPPLE_WIDTH) * fade * (r.strong ? 1.3 : (r.ambient ? 0.55 : 0.9));
            intensity = Math.max(intensity, k);
          }
        }

        if (intensity > 0) {
          // mix base -> cyan -> green based on intensity
          const c1 = COLORS.cyan, c2 = COLORS.green;
          const t = Math.min(1, intensity);
          // base -> cyan
          const stepA = Math.min(1, t * 1.4);
          let r0 = COLORS.base.r + (c1.r - COLORS.base.r) * stepA;
          let g0 = COLORS.base.g + (c1.g - COLORS.base.g) * stepA;
          let b0 = COLORS.base.b + (c1.b - COLORS.base.b) * stepA;
          // cyan -> green at high intensity
          const stepB = Math.max(0, (t - 0.55) / 0.45);
          mixR = r0 + (c2.r - r0) * stepB;
          mixG = g0 + (c2.g - g0) * stepB;
          mixB = b0 + (c2.b - b0) * stepB;

          radius = DOT + t * 2.4;
          alpha = 0.35 + t * 0.6;
        }

        ctx.fillStyle = `rgba(${mixR|0}, ${mixG|0}, ${mixB|0}, ${alpha})`;
        // Draw as small square (pixel feel)
        const s = radius;
        ctx.fillRect(x - s/2, y - s/2, s, s);

        // Glow for high-intensity dots
        if (intensity > 0.5) {
          ctx.fillStyle = `rgba(${mixR|0}, ${mixG|0}, ${mixB|0}, ${(intensity - 0.5) * 0.5})`;
          const g = s * 2.2;
          ctx.fillRect(x - g/2, y - g/2, g, g);
        }
      }
    }

    rafId = requestAnimationFrame(frame);
  }
  rafId = requestAnimationFrame(frame);

  // Pause when offscreen
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else { lastT = performance.now(); rafId = requestAnimationFrame(frame); }
  });
})();

/* ---------- Social cards =====================================
   Easy to add/remove socials: edit the SOCIALS array below.
   Card schema:
     { platform, type: "link" | "copy", value, icon }
   "link" cards open `value` in a new tab.
   "copy" cards copy `value` to clipboard and show a "Copied!" hint.
   ============================================================ */
window.GZ_SOCIALS = [
  { platform: "Discord",  type: "copy", value: "discordtag#0000",        icon: "discord" },
  { platform: "Email",    type: "copy", value: "hello@guyzero.example",  icon: "mail"    },
  { platform: "GitHub",   type: "link", value: "https://github.com/",    icon: "github"  },
  { platform: "Twitter",  type: "link", value: "https://x.com/",         icon: "x"       },
];

// Inline SVG icon set — keep tiny + monochrome (currentColor)
const ICONS = {
  discord: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M20 5.5a14 14 0 0 0-4-1.2l-.3.7a12 12 0 0 0-3.4-.4 12 12 0 0 0-3.4.4l-.3-.7a14 14 0 0 0-4 1.2C2 9.6 1.4 13.5 1.7 17.4a14 14 0 0 0 4.5 2.3l.9-1.4a9 9 0 0 1-1.5-.8M22.3 17.4a14 14 0 0 1-4.5 2.3l-.9-1.4a9 9 0 0 0 1.5-.8"/><circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 1.5A10.5 10.5 0 0 0 1.5 12a10.5 10.5 0 0 0 7.18 9.97c.52.1.7-.23.7-.5v-1.78c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.55-1.17-1.55-.96-.66.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.62 2.47 1.15 3.08.88.09-.68.37-1.15.67-1.42-2.33-.27-4.78-1.17-4.78-5.2 0-1.15.41-2.09 1.08-2.83-.11-.27-.47-1.35.1-2.8 0 0 .89-.28 2.9 1.08a10 10 0 0 1 5.28 0c2-1.36 2.89-1.08 2.89-1.08.58 1.45.22 2.53.11 2.8.67.74 1.08 1.68 1.08 2.83 0 4.04-2.46 4.93-4.8 5.19.38.32.71.96.71 1.93v2.87c0 .28.18.61.71.5A10.5 10.5 0 0 0 22.5 12 10.5 10.5 0 0 0 12 1.5Z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.828l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>`,
};

function renderSocials(targetSelector, socials = window.GZ_SOCIALS) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  target.innerHTML = socials.map(s => {
    const icon = ICONS[s.icon] || ICONS.arrow;
    const actionIco = s.type === 'link' ? ICONS.arrow : ICONS.copy;
    const actionLbl = s.type === 'link' ? 'Open' : 'Copy';
    return `
      <div class="social-card" role="button" tabindex="0"
           data-type="${s.type}" data-value="${s.value}"
           aria-label="${s.platform}: ${s.type === 'link' ? 'open link' : 'copy ' + s.value}">
        <div class="s-ico">${icon}</div>
        <div>
          <div class="s-name">${s.platform}</div>
          <div class="s-value">${s.value.replace(/^https?:\/\//, '')}</div>
        </div>
        <div class="s-action">${actionIco}<span style="margin-left:6px">${actionLbl}</span></div>
      </div>
    `;
  }).join('');

  target.querySelectorAll('.social-card').forEach(card => {
    const act = () => handleSocialClick(card);
    card.addEventListener('click', act);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); }
    });
  });
}

function handleSocialClick(card) {
  const type = card.dataset.type;
  const value = card.dataset.value;
  if (type === 'link') {
    window.open(value, '_blank', 'noopener,noreferrer');
    return;
  }
  // Copy
  const showCopied = () => {
    const action = card.querySelector('.s-action');
    if (!action) return;
    const original = action.innerHTML;
    action.innerHTML = `${ICONS.copy}<span style="margin-left:6px">Copied!</span>`;
    card.classList.add('copied');
    setTimeout(() => {
      action.innerHTML = original;
      card.classList.remove('copied');
    }, 1400);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value).then(showCopied).catch(() => fallbackCopy(value, showCopied));
  } else {
    fallbackCopy(value, showCopied);
  }
}

function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) { /* noop */ }
  document.body.removeChild(ta);
  cb && cb();
}

window.renderSocials = renderSocials;

/* ---------- Smooth scroll for in-page anchors ---------- */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const top = el.getBoundingClientRect().top + window.pageYOffset - 56;
  window.scrollTo({ top, behavior: 'smooth' });
});
