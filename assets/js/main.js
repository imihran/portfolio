'use strict';
gsap.registerPlugin(ScrollTrigger);

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
var progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', function () {
  var pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  if (progressBar) progressBar.style.width = pct + '%';
}, { passive: true });

// ─── Mobile Nav Toggle ────────────────────────────────────────────────────────
document.querySelector('.nav-toggle').addEventListener('click', function () {
  document.querySelector('.navbar-links').classList.toggle('open');
});

// ─── Active Nav Link (IntersectionObserver) ───────────────────────────────────
(function () {
  var sections = document.querySelectorAll('section[id], footer[id]');
  var anchors  = document.querySelectorAll('.navbar-links a[href^="#"]');
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

// ─── Hero Particle Canvas ─────────────────────────────────────────────────────
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  var ctx  = canvas.getContext('2d');
  var hero = document.querySelector('.hero');
  var W, H;
  var mouse = { x: null, y: null };
  var N = 48, MAX = 120, CLR = '245,158,11';

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function Particle() {
    var self = this;
    self.reset = function () {
      self.x  = Math.random() * W;
      self.y  = Math.random() * H;
      self.vx = (Math.random() - 0.5) * 0.32;
      self.vy = (Math.random() - 0.5) * 0.32;
      self.r  = Math.random() * 1.2 + 0.6;
    };
    self.update = function () {
      self.x += self.vx;
      self.y += self.vy;
      if (self.x < 0 || self.x > W) self.vx *= -1;
      if (self.y < 0 || self.y > H) self.vy *= -1;
      if (mouse.x !== null) {
        var dx = self.x - mouse.x, dy = self.y - mouse.y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 85 && d > 0) { self.x += dx / d * 1.5; self.y += dy / d * 1.5; }
      }
    };
    self.draw = function () {
      ctx.beginPath();
      ctx.arc(self.x, self.y, self.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + CLR + ',0.55)';
      ctx.fill();
    };
    self.reset();
  }

  resize();
  var pts = Array.from({ length: N }, function () { return new Particle(); });

  (function frame() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      pts[i].update();
      pts[i].draw();
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = 'rgba(' + CLR + ',' + ((1 - d / MAX) * 0.13) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  })();

  window.addEventListener('resize', resize, { passive: true });
  hero.addEventListener('mousemove', function (e) {
    var r  = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });
  hero.addEventListener('mouseleave', function () { mouse.x = null; mouse.y = null; });
})();

// ─── Typewriter ───────────────────────────────────────────────────────────────
(function () {
  var el = document.getElementById('typewriter');
  if (!el) return;
  var phrases = [
    'Senior Data Engineer',
    'Pipeline Architect',
    'Cloud Platform Expert',
    'Real-Time Data Expert'
  ];
  var pi = 0, ci = 0, del = false;

  function tick() {
    var phrase = phrases[pi];
    if (!del) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { del = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, del ? 38 : 65);
  }
  setTimeout(tick, 400);
})();

// ─── Hero Entrance Animation ──────────────────────────────────────────────────
gsap.timeline({ delay: 0.1 })
  .from('#hero-canvas',          { opacity: 0,                duration: 1.2                             })
  .from('.hero-avatar-wrap',     { opacity: 0, scale: 0.82,   duration: 0.7, ease: 'back.out(1.5)'      }, '-=0.9')
  .from('.hero-overline',        { opacity: 0, y: 10,         duration: 0.45, ease: 'power2.out'         }, '-=0.5')
  .from('.hero h1',              { opacity: 0, y: 22,         duration: 0.65, ease: 'power3.out'         }, '-=0.3')
  .from('.hero .subtitle',       { opacity: 0, y: 14,         duration: 0.5,  ease: 'power2.out'         }, '-=0.3')
  .from('.hero .tagline',        { opacity: 0, y: 12,         duration: 0.5,  ease: 'power2.out'         }, '-=0.2')
  .from('.hero-links .btn',      { opacity: 0, y: 8, stagger: 0.1, duration: 0.42, ease: 'power2.out'   }, '-=0.2');

// ─── Section Overline + Title + Subtitle Scroll Reveals ───────────────────────
gsap.utils.toArray('.section-overline').forEach(function (el) {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 90%' },
    opacity: 0, y: 8, duration: 0.4, ease: 'power2.out'
  });
});
gsap.utils.toArray('.section-title').forEach(function (el) {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 0, x: -16, duration: 0.55, ease: 'power2.out', delay: 0.05
  });
});
gsap.utils.toArray('.section-subtitle').forEach(function (el) {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 0, y: 8, duration: 0.45, ease: 'power2.out', delay: 0.1
  });
});

// ─── Skills Grid Reveal ───────────────────────────────────────────────────────
gsap.from('.skill-group', {
  scrollTrigger: { trigger: '#skills', start: 'top 82%' },
  opacity: 0, y: 20, stagger: 0.08, duration: 0.5, ease: 'power2.out'
});

// ─── Projects: Fetch → Render → Animate ──────────────────────────────────────
fetch('data/projects.json')
  .then(function (res) { return res.json(); })
  .then(function (projects) {
    var grid = document.getElementById('projects-grid');
    var featured = projects.filter(function (p) { return p.featured; });
    featured.forEach(function (p, idx) {
      var card = document.createElement('div');
      card.className = 'project-card';
      var num = String(idx + 1).padStart(2, '0');
      card.innerHTML =
        '<p class="project-number">' + num + '</p>' +
        '<h3><a href="projects/' + p.id + '.html">' + p.title + '</a></h3>' +
        '<p>' + p.summary + '</p>' +
        '<div class="project-tags">' +
          p.stack.map(function (s) { return '<span class="tag">' + s + '</span>'; }).join('') +
        '</div>' +
        '<div class="project-links">' +
          '<a href="projects/' + p.id + '.html">View details &rarr;</a>' +
          (p.github ? '<a href="' + p.github + '" target="_blank">Source &rarr;</a>' : '') +
        '</div>';
      grid.appendChild(card);
    });

    gsap.from('.project-card', {
      scrollTrigger: { trigger: '#projects', start: 'top 82%' },
      opacity: 0, y: 28, stagger: 0.09, duration: 0.6, ease: 'power2.out'
    });
    ScrollTrigger.refresh();
  });
