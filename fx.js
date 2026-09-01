// GuyZ3R0 — shared FX engine: cube-grid / starfield background, click ripples,
// unpredictable [data-btn] hover reactions. Used by Home, Blog and Projects.
// Usage: GZ.initFX({canvas, mode, bgOn, [bgStyle], [exclude], [onFrame], [preOver], [preOut]}) -> {destroy}
(function () {
  var PULSE_COLS = [[255, 204, 55], [255, 139, 28], [0, 255, 144], [74, 140, 255], [255, 46, 87]];
  var HOVER_ANIMS = ['gz-jitter .35s steps(3)', 'gz-bounce .45s ease', 'gz-wobble .5s ease', 'gz-pop .4s ease'];
  var HOVER_COLS = ['#00ff90', '#ffcc37', '#ff8b1c', '#4a8cff'];

  function initFX(host) {
    var t = 0, raf = 0, now = 0, pulses = [], stars = null;
    var exclude = host.exclude || 'button, a, article, input, textarea, [data-btn], nav, footer';

    function resize() {
      var cv = host.canvas();
      if (cv) { cv.width = innerWidth; cv.height = innerHeight; }
    }

    function onClick(e) {
      // ripples spawn on background clicks only
      if (e.target.closest && e.target.closest(exclude)) return;
      if (pulses.length > 6) pulses.shift();
      pulses.push({ x: e.clientX, y: e.clientY, t0: performance.now(), c: PULSE_COLS[Math.floor(Math.random() * PULSE_COLS.length)] });
    }

    function onOver(e) {
      if (host.mode() === 'zero' || !e.target.closest) return;
      if (host.preOver && host.preOver(e)) return;
      var el = e.target.closest('[data-btn]');
      if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
      if (el._gzLast && Date.now() - el._gzLast < 900) return;
      el._gzLast = Date.now();
      el.style.animation = HOVER_ANIMS[Math.floor(Math.random() * HOVER_ANIMS.length)];
      el.style.outline = '2px solid ' + HOVER_COLS[Math.floor(Math.random() * HOVER_COLS.length)];
      el.style.outlineOffset = '3px';
      clearTimeout(el._gzT);
      el._gzT = setTimeout(function () { el.style.animation = ''; }, 650);
    }

    function onOut(e) {
      if (!e.target.closest) return;
      if (host.preOut && host.preOut(e)) return;
      var el = e.target.closest('[data-btn]');
      if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) { el.style.outline = ''; el.style.outlineOffset = ''; }
    }

    function drawCubes(ctx, cv) {
      var s = 46;
      var ox = (t % (s * 2)), oy = (t * 0.5) % (s * 1.5);
      for (var y = -2; y < cv.height / (s * 0.75) + 2; y++) {
        for (var x = -2; x < cv.width / s + 2; x++) {
          var cx = x * s + ((y % 2) ? s / 2 : 0) - ox;
          var cy = y * s * 0.75 - oy;
          var a = 0.05 + 0.04 * Math.sin((x * 7 + y * 13 + t * 0.05));
          // click ripples: colored rings that expand and fade; overlaps mix colors
          var hot = 0, hr = 0, hg = 0, hb = 0;
          for (var i = 0; i < pulses.length; i++) {
            var p = pulses[i];
            var life = (now - p.t0) / 2300;
            if (life > 1) continue;
            var radius = life * 330;
            var pd = Math.abs(Math.sqrt(Math.pow(cx - p.x, 2) + Math.pow(cy - p.y, 2)) - radius);
            if (pd < 44) {
              var k = (1 - pd / 44) * Math.pow(1 - life, 1.8);
              hot += k; hr += p.c[0] * k; hg += p.c[1] * k; hb += p.c[2] * k;
            }
          }
          if (hot > 0.04) {
            var r = Math.round(Math.min(255, hr / hot)), g = Math.round(Math.min(255, hg / hot)), b = Math.round(Math.min(255, hb / hot));
            ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + Math.min(0.6, a + hot * 0.5).toFixed(3) + ')';
            ctx.lineWidth = hot > 0.35 ? 1.6 : 1;
          } else {
            ctx.strokeStyle = 'rgba(30,30,144,' + a.toFixed(3) + ')';
            ctx.lineWidth = 1;
          }
          var h = s * 0.28;
          ctx.beginPath();
          ctx.moveTo(cx, cy - h); ctx.lineTo(cx + s / 2, cy); ctx.lineTo(cx, cy + h); ctx.lineTo(cx - s / 2, cy); ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx - s / 2, cy); ctx.lineTo(cx - s / 2, cy + h * 1.4); ctx.lineTo(cx, cy + h * 2.4); ctx.lineTo(cx, cy + h);
          ctx.moveTo(cx + s / 2, cy); ctx.lineTo(cx + s / 2, cy + h * 1.4); ctx.lineTo(cx, cy + h * 2.4);
          ctx.stroke();
        }
      }
    }

    function drawStars(ctx, cv) {
      if (!stars) {
        stars = [];
        for (var i = 0; i < 140; i++) stars.push({ x: Math.random(), y: Math.random(), z: 0.3 + Math.random() * 0.7 });
      }
      var cols = ['rgba(0,255,144,', 'rgba(255,204,55,', 'rgba(7,88,204,'];
      stars.forEach(function (st, i) {
        var x = ((st.x * cv.width + t * st.z * 2) % (cv.width + 8)) - 4;
        var y = st.y * cv.height;
        var sz = st.z > 0.7 ? 3 : 2;
        ctx.fillStyle = cols[i % 3] + (0.12 + st.z * 0.25).toFixed(2) + ')';
        ctx.fillRect(Math.round(x), Math.round(y), sz, sz);
      });
    }

    function loop() {
      raf = requestAnimationFrame(loop);
      var cv = host.canvas();
      if (!cv) return;
      var ctx = cv.getContext('2d');
      now = performance.now();
      if (pulses.length) pulses = pulses.filter(function (p) { return now - p.t0 < 2300; });
      if (host.onFrame) host.onFrame();
      var mode = host.mode();
      if (!host.bgOn() || mode === 'zero') { ctx.clearRect(0, 0, cv.width, cv.height); return; }
      t += 0.16 * (mode === 'max' ? 1 : 0.3);
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (host.bgStyle && host.bgStyle() === 'starfield') drawStars(ctx, cv);
      else drawCubes(ctx, cv);
    }

    resize();
    addEventListener('resize', resize);
    addEventListener('click', onClick);
    addEventListener('mouseover', onOver, true);
    addEventListener('mouseout', onOut, true);
    raf = requestAnimationFrame(loop);

    return {
      destroy: function () {
        cancelAnimationFrame(raf);
        removeEventListener('resize', resize);
        removeEventListener('click', onClick);
        removeEventListener('mouseover', onOver, true);
        removeEventListener('mouseout', onOut, true);
      }
    };
  }

  window.GZ = { initFX: initFX };
})();
