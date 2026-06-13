'use strict';

// Signals CSS that JS is running (enables reveal transitions; no-JS gets full content)
document.documentElement.classList.add('js');

var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Hero Living Data Field ───────────────────────────────────────────────────
// Full-viewport constellation with depth: far nodes are smaller, dimmer, and
// slower; the whole field shifts gently with the pointer (parallax) and bright
// pulses travel along links like data in flight. Purely decorative (canvas is
// aria-hidden); reduced-motion renders one still frame with no parallax.
(function () {
  var canvas = document.querySelector('.hero-canvas');
  var hero = canvas && canvas.parentElement;
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var nodes = [];
  var pulses = [];
  var width = 0, height = 0;
  var LINK_DIST = 150;
  var MAX_PULSES = 6;
  var COLORS = ['rgba(81, 232, 255, ', 'rgba(91, 140, 255, ', 'rgba(168, 127, 251, '];
  // pointer parallax target/current, normalized to [-1, 1]
  var ptx = 0, pty = 0, px = 0, py = 0;

  function resize() {
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.min(110, Math.floor((width * height) / 14000));
    nodes = [];
    pulses = [];
    for (var i = 0; i < count; i++) {
      var z = 0.3 + Math.random() * 0.7; // depth: 0.3 far … 1 near
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.24 * z,
        vy: (Math.random() - 0.5) * 0.24 * z,
        r: (0.8 + Math.random() * 1.6) * (0.45 + z * 0.8),
        z: z,
        c: COLORS[i % COLORS.length]
      });
    }
  }

  // node position including its depth-scaled parallax offset
  function nx(n) { return n.x + px * 18 * n.z; }
  function ny(n) { return n.y + py * 12 * n.z; }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j];
        var dx = nx(a) - nx(b), dy = ny(a) - ny(b);
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          var depth = 0.35 + 0.65 * (a.z + b.z) / 2;
          ctx.strokeStyle = 'rgba(105, 180, 255, ' + (0.15 * (1 - d / LINK_DIST) * depth).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nx(a), ny(a));
          ctx.lineTo(nx(b), ny(b));
          ctx.stroke();
        }
      }
    }
    for (var k = 0; k < nodes.length; k++) {
      var n = nodes[k];
      ctx.fillStyle = n.c + (0.25 + 0.4 * n.z).toFixed(2) + ')';
      ctx.beginPath();
      ctx.arc(nx(n), ny(n), n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (var p = 0; p < pulses.length; p++) {
      var u = pulses[p];
      var a2 = nodes[u.a], b2 = nodes[u.b];
      var x = nx(a2) + (nx(b2) - nx(a2)) * u.t;
      var y = ny(a2) + (ny(b2) - ny(a2)) * u.t;
      var fade = Math.sin(Math.PI * u.t); // ease in/out along the link
      ctx.fillStyle = 'rgba(140, 240, 255, ' + (0.12 * fade).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(190, 248, 255, ' + (0.85 * fade).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function spawnPulse() {
    var i = Math.floor(Math.random() * nodes.length);
    var a = nodes[i];
    for (var j = 0; j < nodes.length; j++) {
      if (j === i) continue;
      var dx = a.x - nodes[j].x, dy = a.y - nodes[j].y;
      if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) {
        pulses.push({ a: i, b: j, t: 0, speed: 0.008 + Math.random() * 0.012 });
        return;
      }
    }
  }

  function step() {
    px += (ptx - px) * 0.04;
    py += (pty - py) * 0.04;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -10) n.x = width + 10; else if (n.x > width + 10) n.x = -10;
      if (n.y < -10) n.y = height + 10; else if (n.y > height + 10) n.y = -10;
    }
    if (pulses.length < MAX_PULSES && Math.random() < 0.035) spawnPulse();
    for (var p = pulses.length - 1; p >= 0; p--) {
      pulses[p].t += pulses[p].speed;
      if (pulses[p].t >= 1) pulses.splice(p, 1);
    }
    draw();
  }

  var running = false;
  var rafId = null;
  function loop() {
    if (!running) return;
    step();
    rafId = requestAnimationFrame(loop);
  }

  resize();
  draw();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { resize(); draw(); }, 150);
  });

  if (prefersReducedMotion) return; // still frame only, no parallax

  hero.addEventListener('pointermove', function (e) {
    var rect = hero.getBoundingClientRect();
    ptx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pty = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  });
  hero.addEventListener('pointerleave', function () { ptx = 0; pty = 0; });

  // animate only while the hero is on screen
  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !running) {
        running = true;
        loop();
      } else if (!e.isIntersecting && running) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      }
    });
  }).observe(hero);
})();

// ─── Mobile Nav Toggle ────────────────────────────────────────────────────────
var navToggle = document.querySelector('.nav-toggle');
var navLinks = document.querySelector('.navbar-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ─── Active Nav Link ──────────────────────────────────────────────────────────
(function () {
  var sections = document.querySelectorAll('section[id], footer[id]');
  var anchors = document.querySelectorAll('.navbar-links a[href^="#"]');
  if (!sections.length || !anchors.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      anchors.forEach(function (a) { a.classList.remove('active'); });
      var match = document.querySelector('.navbar-links a[href="#' + e.target.id + '"]');
      if (match) match.classList.add('active');
    });
  }, { rootMargin: '-35% 0px -60% 0px' });
  sections.forEach(function (s) { obs.observe(s); });
})();

// ─── Reveal on Scroll ─────────────────────────────────────────────────────────
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { rootMargin: '0px 0px -8% 0px' });

function observeReveals(root) {
  (root || document).querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) {
    revealObserver.observe(el);
  });
}
observeReveals();

// ─── KPI Node Count-Up ────────────────────────────────────────────────────────
// Final values live in the HTML; animation only runs with JS + motion allowed.
(function () {
  var stats = document.querySelectorAll('.kpi-value[data-count]');
  if (!stats.length || prefersReducedMotion) return;

  function animate(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var finalText = el.textContent;
    var duration = 900;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var value = Math.round(target * eased);
      el.textContent = prefix + value.toLocaleString('en-US') + suffix;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = finalText;
      }
    }
    requestAnimationFrame(step);
  }

  var statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      animate(e.target);
      statObserver.unobserve(e.target);
    });
  }, { threshold: 0.4 });

  stats.forEach(function (el) { statObserver.observe(el); });
})();

// ─── Projects: Fetch → Render ─────────────────────────────────────────────────
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// Decorative luminous sparkline, deterministic per project id so it is stable
// across loads. Inline SVG keeps everything local (no images, no libraries).
function sparklineFor(id) {
  var seed = 0;
  for (var i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0;
  function rand() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  var w = 72, h = 20, steps = 9;
  var pts = [];
  for (var s = 0; s <= steps; s++) {
    var x = (w / steps) * s;
    // upward drift with noise — every KPI trends the right way
    var y = h - 3 - (h - 8) * (s / steps) * (0.55 + rand() * 0.45) - rand() * 3;
    pts.push(x.toFixed(1) + ',' + Math.max(2, y).toFixed(1));
  }
  var last = pts[pts.length - 1].split(',');
  return '<svg class="figure-spark" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true" focusable="false">' +
    '<defs><linearGradient id="spark-' + esc(id) + '" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="#51e8ff" stop-opacity="0.25"/>' +
    '<stop offset="1" stop-color="#a87ffb"/></linearGradient></defs>' +
    '<polyline points="' + pts.join(' ') + '" fill="none" stroke="url(#spark-' + esc(id) + ')" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="' + last[0] + '" cy="' + last[1] + '" r="2.4" fill="#51e8ff"/>' +
    '</svg>';
}

function badgeFor(p) {
  if (p.type === 'enterprise') return '<span class="badge-enterprise">industry</span>';
  if (p.type === 'open-source') return '<span class="badge-oss">open source</span>';
  return '';
}

function linksFor(p) {
  var html = '<a href="projects/' + esc(p.id) + '.html">Read the case study</a>';
  if (p.github) {
    html += '<a href="' + esc(p.github) + '" target="_blank" rel="noopener">Source</a>';
  } else if (p.type === 'enterprise') {
    html += '<span class="code-proprietary">code proprietary</span>';
  }
  if (p.demo) {
    html += '<a href="' + esc(p.demo) + '" target="_blank" rel="noopener">Live</a>';
  }
  return html;
}

fetch('data/projects.json')
  .then(function (res) { return res.json(); })
  .then(function (projects) {
    var grid = document.getElementById('projects-grid');
    var featured = projects.filter(function (p) { return p.featured; });

    featured.forEach(function (p, idx) {
      var row = document.createElement('article');
      row.className = 'case-node reveal';
      var num = String(idx + 1).padStart(2, '0');
      var kpiChip = p.kpi
        ? '<span class="case-kpi">' +
            sparklineFor(p.id) +
            '<span class="case-kpi-value">' + esc(p.kpi.value) + '</span>' +
            '<span class="case-kpi-label">' + esc(p.kpi.label) + '</span>' +
          '</span>'
        : '';
      row.innerHTML =
        '<header class="case-head">' +
          '<span class="case-id">FILE ' + num + '</span>' +
          badgeFor(p) +
          kpiChip +
        '</header>' +
        '<h3><a href="projects/' + esc(p.id) + '.html">' + esc(p.title) + '</a></h3>' +
        '<p class="case-summary">' + esc(p.summary) + '</p>' +
        '<p class="case-tags">' + p.stack.map(esc).join(' · ') + '</p>' +
        '<div class="case-links">' + linksFor(p) + '</div>';
      grid.appendChild(row);
    });

    var otherGrid = document.getElementById('other-projects-grid');
    var other = projects.filter(function (p) { return !p.featured; });
    other.forEach(function (p, idx) {
      var card = document.createElement('article');
      card.className = 'appendix-card reveal';
      var ref = 'AUX ' + String(idx + 1).padStart(2, '0');
      var kpi = p.kpi
        ? ' &mdash; <span class="appendix-kpi">' + esc(p.kpi.value) + ' ' + esc(p.kpi.label) + '</span>'
        : '';
      card.innerHTML =
        '<p class="appendix-no">' + ref + kpi + '</p>' +
        '<h3><a href="projects/' + esc(p.id) + '.html">' + esc(p.title) + '</a></h3>' +
        '<p>' + esc(p.summary) + '</p>' +
        '<p class="case-tags">' + p.stack.map(esc).join(' · ') + '</p>' +
        '<div class="case-links">' + linksFor(p) + '</div>';
      otherGrid.appendChild(card);
    });

    observeReveals();
  })
  .catch(function (err) {
    console.error('Failed to load projects:', err);
  });
