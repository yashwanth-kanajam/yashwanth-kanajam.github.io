(() => {
  'use strict';

  // Copy the contact address without showing it on the page.
  const copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const addr = copyBtn.dataset.address;
      const done = text => {
        copyBtn.textContent = text;
        setTimeout(() => { copyBtn.textContent = 'Copy address'; }, 2500);
      };
      try {
        navigator.clipboard.writeText(addr).then(() => done('Address copied'), () => done(addr));
      } catch (e) {
        done(addr);
      }
    });
  }

  // Chart view buttons: both series, published only, or bias-corrected only.
  // Exactly one button is selected at a time.
  const chart = document.getElementById('wape-chart');
  const views = [...document.querySelectorAll('.lg')];
  views.forEach(button => {
    button.addEventListener('click', () => {
      views.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      if (!chart) return;
      chart.classList.toggle('hide-cor', button.dataset.view === 'pub');
      chart.classList.toggle('hide-pub', button.dataset.view === 'cor');
    });
  });

  // Decorative pointer-responsive network behind the introduction.
  // It is decoration only and does not represent any data.
  const canvas = document.getElementById('net');
  const host = document.getElementById('intro');
  if (!canvas || !host || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8CDEC4';
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const RADIUS = 150, PUSH = 34, LINK = 118;
  const pointer = { x: 0, y: 0, on: false };
  let points = [], width = 0, height = 0, frame = 0, onscreen = true;

  // Fixed seed so the layout is the same on every visit.
  function seeded(seed) {
    return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  }

  function build() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = host.clientWidth;
    height = host.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const random = seeded(7);
    const step = width < 700 ? 74 : 86;
    points = [];
    for (let y = -step / 2; y < height + step; y += step) {
      for (let x = -step / 2; x < width + step; x += step) {
        const hx = x + (random() - 0.5) * step * 0.9;
        const hy = y + (random() - 0.5) * step * 0.9;
        points.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 });
      }
    }
    draw();
  }

  // Quieter behind the text column, stronger toward the right.
  function fade(x) {
    if (width < 980) return 0.55;
    return 0.4 + 0.6 * Math.min(1, Math.max(0, (x / width - 0.25) / 0.5));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = accent;
    ctx.fillStyle = accent;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          ctx.globalAlpha = 0.2 * (1 - Math.sqrt(d2) / LINK) * fade((a.x + b.x) / 2);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const p of points) {
      ctx.globalAlpha = 0.5 * fade(p.x);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function tick() {
    frame = 0;
    let moving = false;
    for (const p of points) {
      let tx = p.hx, ty = p.hy;
      if (pointer.on) {
        const dx = p.hx - pointer.x, dy = p.hy - pointer.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < RADIUS && d > 0.01) {
          const f = (1 - d / RADIUS) ** 2 * PUSH;
          tx += dx / d * f;
          ty += dy / d * f;
        }
      }
      p.vx = (p.vx + (tx - p.x) * 0.09) * 0.78;
      p.vy = (p.vy + (ty - p.y) * 0.09) * 0.78;
      p.x += p.vx;
      p.y += p.vy;
      if (Math.abs(p.vx) + Math.abs(p.vy) > 0.02 || Math.abs(tx - p.x) + Math.abs(ty - p.y) > 0.05) moving = true;
    }
    draw();
    // Stops by itself once every point has settled.
    if (moving && onscreen && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function wake() {
    if (!frame && onscreen && !document.hidden) frame = requestAnimationFrame(tick);
  }

  build();
  if ('ResizeObserver' in window) {
    let timer;
    new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(build, 120); }).observe(host);
  } else {
    window.addEventListener('resize', build);
  }

  // Static on touch devices. Reduced motion is re-read live, so turning it on
  // in the system settings freezes the network without a reload.
  if (!finePointer) return;
  const settle = () => { pointer.on = false; wake(); };
  if (reduceQuery.addEventListener) reduceQuery.addEventListener('change', settle);
  else if (reduceQuery.addListener) reduceQuery.addListener(settle);

  host.addEventListener('pointermove', e => {
    if (reduceQuery.matches) return;
    const box = host.getBoundingClientRect();
    pointer.x = e.clientX - box.left;
    pointer.y = e.clientY - box.top;
    pointer.on = true;
    wake();
  });
  host.addEventListener('pointerleave', () => { pointer.on = false; wake(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      onscreen = entries[0].isIntersecting;
      if (onscreen) wake();
    }).observe(host);
  }
})();
