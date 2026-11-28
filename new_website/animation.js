/**
 * HACK UTTAR PRADESH 2026 | HIGH-ENERGY ANIMATION ENGINE
 * Features:
 *  - 60FPS Interactive 3D Perspective Grid + Starlit Code Sparks (< / >, //, up-2026)
 *  - Mouse Hover Physics & Tilt Reflex
 *  - Live Ticking Countdown to Unstop Registration Milestone
 *  - Interactive 5 Building Arenas Switcher
 *  - Smooth Accordion Controller for FAQs
 *  - Mobile Drawer Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initTiltPoster();
  initCountdown();
  initArenasSwitcher();
  initFaqAccordion();
  initMobileNav();
  initScrollReveal();
  initDockObserver();
  initCustomCursor();
  initStampCardInteractions();
});

/**
 * 1. 60FPS INTERACTIVE 3D PERSPECTIVE GRID & CODE PARTICLES CANVAS
 */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let time = 0;

  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    isHovered: false
  };

  function resize() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  resize();
  window.addEventListener('resize', resize);

  // Mouse Listener
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
    mouse.isHovered = true;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.isHovered = false;
    mouse.targetX = width / 2;
    mouse.targetY = height / 2;
  });

  // Code Symbols & Starlit Particles
  const codeSymbols = ['< / >', '//', 'up-2026', '{ }', '01', '10', 'fn()', 'build.local', '75-UP', 'ODOP', 'AI'];
  const particles = [];
  const particleCount = Math.min(36, Math.floor(width / 35));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -0.2 - Math.random() * 0.4,
      symbol: codeSymbols[Math.floor(Math.random() * codeSymbols.length)],
      size: 11 + Math.random() * 6,
      opacity: 0.15 + Math.random() * 0.45,
      color: Math.random() > 0.45 ? '#ef6627' : '#169855',
      pulseSpeed: 0.02 + Math.random() * 0.03,
      isFirefly: Math.random() > 0.5
    });
  }

  // Energy-efficient render loop management
  let isCanvasVisible = true;
  let heroRafId = null;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const wasVisible = isCanvasVisible;
        isCanvasVisible = entry.isIntersecting;
        if (isCanvasVisible && !wasVisible && !heroRafId) {
          heroRafId = requestAnimationFrame(render);
        }
      });
    }, { threshold: 0.02 });
    observer.observe(canvas);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isCanvasVisible && !heroRafId) {
      heroRafId = requestAnimationFrame(render);
    }
  });

  function render() {
    if (!isCanvasVisible || document.hidden) {
      heroRafId = null;
      return;
    }

    time += 0.015;
    ctx.clearRect(0, 0, width, height);

    // Smooth Mouse Lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;

    // --- A. Draw 3D Perspective Retro Grid on Horizon ---
    const horizonY = height * 0.72;
    const gridOffset = (time * 28) % 36;
    
    ctx.save();
    ctx.strokeStyle = 'rgba(12, 27, 42, 0.045)';
    ctx.lineWidth = 1;

    // Vanishing perspective point influenced by mouse
    const vanishX = (width / 2) + (mouse.x - width / 2) * 0.1;

    // Perspective lines
    const lineCount = 20;
    for (let i = -lineCount; i <= lineCount; i++) {
      const bottomX = (width / 2) + i * 55;
      ctx.beginPath();
      ctx.moveTo(vanishX, horizonY);
      ctx.lineTo(bottomX, height);
      ctx.stroke();
    }

    // Horizontal rolling grid lines
    for (let y = horizonY; y <= height; y += 12) {
      const p = (y - horizonY) / (height - horizonY);
      const curvedY = horizonY + Math.pow(p, 1.8) * (height - horizonY) + gridOffset * p;
      if (curvedY <= height) {
        ctx.beginPath();
        ctx.moveTo(0, curvedY);
        ctx.lineTo(width, curvedY);
        ctx.stroke();
      }
    }
    ctx.restore();

    // --- B. Floating Code Particles & Starlit Embers ---
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Mouse repulsion / wind
      if (mouse.isHovered) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (140 - dist) / 140;
          p.x += (dx / dist) * force * 2.2;
          p.y += (dy / dist) * force * 2.2;
        }
      }

      // Loop boundaries
      if (p.y < -30) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }
      if (p.x < -30) p.x = width + 20;
      if (p.x > width + 30) p.x = -20;

      // Pulse opacity
      const dynamicAlpha = p.opacity + Math.sin(time * 3 + p.x) * 0.12;

      ctx.save();
      ctx.globalAlpha = Math.max(0.08, Math.min(1, dynamicAlpha));

      if (p.isFirefly) {
        // Glowing ember dot
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.22, 0, Math.PI * 2);
        ctx.fill();

        // Glow ring
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Code symbol typography
        ctx.font = `700 ${p.size}px 'Space Grotesk', monospace`;
        ctx.fillStyle = p.color;
        ctx.fillText(p.symbol, p.x, p.y);
      }
      ctx.restore();
    });

    heroRafId = requestAnimationFrame(render);
  }

  heroRafId = requestAnimationFrame(render);
}

/**
 * 2. 3D INTERACTIVE CARD TILT ON POSTER
 */
function initTiltPoster() {
  const card = document.getElementById('tiltPosterCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/**
 * 3. LIVE TICKING COUNTDOWN TIMER
 */
function initCountdown() {
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMins');
  const secsEl = document.getElementById('cdSecs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Primary Milestone: Registration Deadline Dec 31, 2026 23:59:59 IST
  function getTargetTime() {
    const currentYear = new Date().getFullYear();
    let target = new Date(`${currentYear}-12-31T23:59:59+05:30`).getTime();
    const now = Date.now();
    if (target - now <= 0) {
      // If end of year passed, target Grand Finale January
      target = new Date(`${currentYear + 1}-01-15T21:00:00+05:30`).getTime();
    }
    if (target - now <= 0) {
      // Rolling sprint fallback
      target = now + (33 * 24 * 60 * 60 * 1000);
    }
    return target;
  }

  const targetDate = getTargetTime();

  function update() {
    const now = Date.now();
    let diff = targetDate - now;

    if (diff <= 0) {
      diff = 0;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/**
 * 4. INTERACTIVE 5 BUILDING ARENAS SWITCHER
 */
function initArenasSwitcher() {
  const tabs = document.querySelectorAll('.arena-tab-item');
  const cardBadge = document.getElementById('arenaBadge');
  const cardCounter = document.getElementById('arenaCounter');
  const cardTitle = document.getElementById('arenaTitle');
  const cardLead = document.getElementById('arenaLead');
  const cardTags = document.getElementById('arenaTags');

  if (!tabs.length || !cardTitle) return;

  const arenasData = [
    {
      badge: 'ARENA 01 // FEATURED TRACK',
      counter: 'NO. 01 / 05',
      title: 'AI FOR BHARAT + VERNACULAR TECH',
      lead: 'Harness Generative AI, multimodal vision models, and Indic linguistic datasets to empower Bharat. Build vernacular voice assistants, automated public service navigators, healthcare triage systems, and document simplifiers tuned to Hindi, Urdu, Awadhi, and Bhojpuri.',
      tags: ['Indic LLMs', 'Voice AI', 'Bhasha Engine', 'GovTech', 'Multimodal']
    },
    {
      badge: 'ARENA 02 // ODOP CRAFT',
      counter: 'NO. 02 / 05',
      title: 'ODOP + CULTURAL HERITAGE',
      lead: 'Uttar Pradesh is the cultural heartbeat of India—from Varanasi silk weaving and Bhadohi carpets to Kannauj perfumery and Moradabad brassware. Build next-gen digital provenance systems, direct artisan-to-global commerce platforms, AR/VR virtual temple and ghat experiences, and AI-powered authenticity verifiers.',
      tags: ['ODOP Artisans', 'Provenance', 'Spatial Heritage', 'Tourism 2.0', 'Craft Commerce']
    },
    {
      badge: 'ARENA 03 // AGRARIAN TECH',
      counter: 'NO. 03 / 05',
      title: 'AGRITECH + CLIMATE RESILIENCE',
      lead: 'Power the agrarian spine of Uttar Pradesh. Build real-time APMC mandi price arbitrage dashboards, hyper-local microclimate weather prediction, farm IoT sensor networks, soil nutrient diagnostics via computer vision, and supply chain tracking that minimizes crop wastage.',
      tags: ['Mandi Telemetry', 'Farm IoT', 'Drone Analytics', 'Kisan AI', 'Cold Chain']
    },
    {
      badge: 'ARENA 04 // SPATIAL & CIVIC',
      counter: 'NO. 04 / 05',
      title: 'SPATIAL WEB + SMART CIVIC SYSTEMS',
      lead: 'Combine high-octane engineering with public utility. Build city mapping tools, pothole and municipal waste telemetry, crowd density heatmaps for religious and cultural gatherings, and interactive 3D WebGL civic interfaces that make urban navigation seamless.',
      tags: ['Spatial UI', 'WebGL / 3D', 'Civic Telemetry', 'Smart Cities', 'Clean UP']
    },
    {
      badge: 'ARENA 05 // FRONTIER FINTECH',
      counter: 'NO. 05 / 05',
      title: 'OPEN INNOVATION + NEXT-GEN FINTECH',
      lead: 'Have a breakthrough idea outside the defined tracks? This open arena welcomes bold, unconventional creations—from micro-lending networks for rural street vendors to decentralized public goods infrastructure, open-source developer tooling, and automated fraud shields.',
      tags: ['Open Innovation', 'Bharat Fintech', 'UPI 2.0', 'Public Goods', 'Zero Knowledge']
    }
  ];

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const index = parseInt(tab.dataset.arena, 10);
      const data = arenasData[index];
      if (!data) return;

      // Smooth micro-fade
      const displayCard = document.getElementById('arenaDetailCard');
      displayCard.style.opacity = '0.5';

      setTimeout(() => {
        cardBadge.textContent = data.badge;
        cardCounter.textContent = data.counter;
        cardTitle.textContent = data.title;
        cardLead.textContent = data.lead;

        cardTags.innerHTML = data.tags.map((t) => `<span class="tag-pill">${t}</span>`).join('');
        displayCard.style.opacity = '1';

        // On mobile screens (<1024px), smooth scroll detail card into comfortable view
        if (window.innerWidth < 1024) {
          setTimeout(() => {
            displayCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 80);
        }
      }, 120);
    });
  });
}

/**
 * 5. ACCORDION CONTROLLER FOR FAQS
 */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close siblings for clean accordion behavior
      items.forEach((other) => {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-question-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 6. MOBILE NAVIGATION DRAWER
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });

  const links = drawer.querySelectorAll('.mobile-nav-link');
  links.forEach((l) => {
    l.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });
}

/**
 * 7. INTERSECTION OBSERVER SCROLL REVEAL
 */
function initScrollReveal() {
  const cards = document.querySelectorAll('.postage-stamp, .bounties-merch-banner, .become-sponsor-card, .route-cta-banner');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  cards.forEach((c) => {
    c.style.opacity = '0';
    c.style.transition = 'opacity 0.4s ease-out';
    observer.observe(c);
  });
}

/**
 * 8. FLOATING DOCK AUTO-HIDE ON FOOTER INTERSECTION
 */
function initDockObserver() {
  const dock = document.getElementById('floatingDock');
  const footer = document.getElementById('siteFooter');
  if (!dock || !footer || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        dock.classList.add('dock-hidden');
      } else {
        dock.classList.remove('dock-hidden');
      }
    });
  }, { threshold: 0.1 });

  observer.observe(footer);
}

/**
 * 9. TACTILE NEO-BRUTALIST CUSTOM CURSOR (FLUID PHYSICS, MOTION STRETCH & TAP)
 */
function initCustomCursor() {
  // Only activate on devices with fine pointer (desktop mouse/trackpad)
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  // Real mouse coordinates
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Fluid physics coordinates
  let dotX = mouseX;
  let dotY = mouseY;
  let ringX = mouseX;
  let ringY = mouseY;

  // Fluid velocity & directional stretching
  let vx = 0;
  let vy = 0;
  let speed = 0;
  let angle = 0;
  let stretch = 0;

  // State flags
  let isHovered = false;
  let isPressed = false;
  let isVisible = false;
  let lastTrailTime = 0;

  // Initial opacity
  dot.style.opacity = '0';
  ring.style.opacity = '0';

  // Dynamic Trail Emitter State
  let lastEmitX = mouseX;
  let lastEmitY = mouseY;
  let lastEmitTime = 0;
  let activeParticleCount = 0;
  const MAX_TRAIL_PARTICLES = 28;

  // Mouse Move Event
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      dotX = mouseX;
      dotY = mouseY;
      ringX = mouseX;
      ringY = mouseY;
      lastEmitX = mouseX;
      lastEmitY = mouseY;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }

    // Dynamic Trail Text Emission on cursor movement
    const now = Date.now();
    const moveDist = Math.hypot(mouseX - lastEmitX, mouseY - lastEmitY);

    if (moveDist > 16 || (moveDist > 6 && now - lastEmitTime > 36)) {
      if (activeParticleCount < MAX_TRAIL_PARTICLES) {
        spawnTrailParticle(mouseX, mouseY, moveDist);
        // Extra spark on fast sweep
        if (moveDist > 40 && activeParticleCount < MAX_TRAIL_PARTICLES - 1) {
          spawnTrailParticle(mouseX - (mouseX - lastEmitX) * 0.4, mouseY - (mouseY - lastEmitY) * 0.4, moveDist * 0.7);
        }
      }
      lastEmitX = mouseX;
      lastEmitY = mouseY;
      lastEmitTime = now;
    }
  }, { passive: true });

  // Tap / Click Shockwave & Token Constellation Burst
  window.addEventListener('mousedown', (e) => {
    isPressed = true;
    document.body.classList.add('cursor-pressed');
    createTapRipple(e.clientX, e.clientY);

    // Click burst: spawn 3 energetic hacker tokens radiating outward
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        spawnTrailParticle(e.clientX, e.clientY, 35);
      }, i * 35);
    }
  });

  window.addEventListener('mouseup', () => {
    isPressed = false;
    document.body.classList.remove('cursor-pressed');
  });

  // Leave & Enter Window Visibility
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
    isVisible = true;
  });

  window.addEventListener('blur', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    isVisible = false;
  });

  // Interactive Hover Detection (Buttons, Links, Cards, Inputs, Postage Stamps)
  const interactiveSelectors = 'a, button, input, select, textarea, .btn-neo, .arena-tab-item, .faq-question-btn, .metric-ticket-card, .route-card, .postage-stamp, [role="button"]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      isHovered = true;
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      isHovered = false;
      document.body.classList.remove('cursor-hover');
    }
  });

  // 60FPS Fluid Physics Loop
  function updateCursor() {
    if (isVisible) {
      // 1. High-response precision tracking for center dot
      dotX += (mouseX - dotX) * 0.85;
      dotY += (mouseY - dotY) * 0.85;

      // 2. Liquid trailing physics for reticle ring
      const prevRingX = ringX;
      const prevRingY = ringY;
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      // Elastic tether: clamp max offset so ring dynamically bounds the dot
      const dist = Math.hypot(dotX - ringX, dotY - ringY);
      if (dist > 28) {
        ringX = dotX - (dotX - ringX) * (28 / dist);
        ringY = dotY - (dotY - ringY) * (28 / dist);
      }

      // 3. Compute velocity for organic movement stretching
      vx = ringX - prevRingX;
      vy = ringY - prevRingY;
      speed = Math.sqrt(vx * vx + vy * vy);

      // Angle of travel
      if (speed > 0.8) {
        angle = Math.atan2(vy, vx) * 180 / Math.PI;
      } else {
        // Smoothly return to 0deg (upright crosshairs) when resting
        angle += (0 - angle) * 0.12;
      }

      // Smooth stretch factor based on speed (organic liquid squash & stretch)
      const targetStretch = isHovered ? 0 : Math.min(speed * 0.03, 0.4);
      stretch += (targetStretch - stretch) * 0.2;

      // 4. Scale states (Hover, Press, Rest)
      let baseScale = isHovered ? 1.5 : 1.0;
      if (isPressed) {
        baseScale *= 0.72;
      }

      const scaleX = (baseScale * (1 + stretch)).toFixed(3);
      const scaleY = (baseScale * (1 - stretch * 0.55)).toFixed(3);

      // Precise 3D transforms with self-centered geometry
      dot.style.transform = `translate3d(${dotX.toFixed(2)}px, ${dotY.toFixed(2)}px, 0) scale(${isPressed ? 1.4 : (isHovered ? 0.75 : 1)})`;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) rotate(${angle.toFixed(1)}deg) scale(${scaleX}, ${scaleY})`;
    }

    requestAnimationFrame(updateCursor);
  }

  requestAnimationFrame(updateCursor);

  // Click Tap Shockwave Generator
  function createTapRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 450);
  }

  // High-Energy Hacker & Neo-Brutalist Cursor Trail Token Engine
  const trailTokens = [
    '< / >', '//', '{ }', '=>', '✦', '⚡', 'up-2026', '75-UP', 'build.local',
    'fn()', '01', '10', 'git:push', 'ODOP', 'AI', 'LKO', 'NOIDA', 'AWADH',
    'const', 'return', 'async', 'npm run dev', 'HTTP:200', 'SHIP_IT', '✦',
    'OPEN_GREENS', '45K_BOUNTY', 'UNSTOP', 'RIWA'
  ];

  const trailColors = ['#ef6627', '#169855', '#0c1b2a', '#ff7438', '#0D7A36', '#ffc50f'];

  function spawnTrailParticle(x, y, intensity = 15) {
    const p = document.createElement('div');
    const isBadge = Math.random() > 0.42;
    p.className = isBadge ? 'cursor-trail-particle trail-badge' : 'cursor-trail-particle trail-raw';

    const token = trailTokens[Math.floor(Math.random() * trailTokens.length)];
    p.textContent = token;

    const color = trailColors[Math.floor(Math.random() * trailColors.length)];
    p.style.color = color;

    // Thermal floating drift vectors
    const angleRad = Math.random() * Math.PI * 2;
    const driftDist = 12 + Math.min(intensity, 40) * 0.45;
    const dx = (Math.cos(angleRad) * driftDist).toFixed(1);
    const dy = (-14 - Math.random() * 20).toFixed(1); // upwards thermal float
    const rot = (Math.random() * 26 - 13).toFixed(1);

    p.style.setProperty('--dx', `${dx}px`);
    p.style.setProperty('--dy', `${dy}px`);
    p.style.setProperty('--rot', `${rot}deg`);

    // Position around cursor pointer
    p.style.left = `${x + (Math.random() * 18 - 9)}px`;
    p.style.top = `${y + (Math.random() * 18 - 9)}px`;

    document.body.appendChild(p);
    activeParticleCount++;

    setTimeout(() => {
      p.remove();
      activeParticleCount = Math.max(0, activeParticleCount - 1);
    }, 600);
  }
}

/**
 * 10. TACTILE POSTAGE STAMP INTERACTION ENGINE
 * - Soft, magnetic 3D perspective micro-tilt tracking on hover (perspective 900px)
 * - Rubber-stamp tactile ink imprint wave expansion on click
 * - Prismatic collector micro-foil sparkle burst on click
 */
function initStampCardInteractions() {
  const cards = document.querySelectorAll('.postage-stamp');
  if (!cards.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const sparkleSymbols = ['✦', '★', '•', '✧', '⚡', '✦'];
  const sparkleColors = ['#F96315', '#FACC15', '#16A34A', '#0F172A', '#C84600'];

  cards.forEach((card) => {
    let bounds = null;
    let isHovering = false;
    let tiltRafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Smooth 3D Magnetic Micro-Tilt on Hover (Non-touch only)
    if (!isTouch && !prefersReduced) {
      card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
        isHovering = true;
        card.style.transition = 'box-shadow 320ms cubic-bezier(0.2, 0.9, 0.4, 1), border-color 240ms ease-out';
      });

      card.addEventListener('mousemove', (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const px = (e.clientX - bounds.left) / bounds.width - 0.5; // -0.5 to 0.5
        const py = (e.clientY - bounds.top) / bounds.height - 0.5; // -0.5 to 0.5

        targetX = px * 8;   // rotateY max ~4deg
        targetY = -py * 8;  // rotateX max ~4deg

        if (!tiltRafId) {
          tiltRafId = requestAnimationFrame(updateTilt);
        }
      });

      function updateTilt() {
        if (!isHovering) {
          tiltRafId = null;
          return;
        }

        currentX += (targetX - currentX) * 0.16;
        currentY += (targetY - currentY) * 0.16;

        card.style.transform = `perspective(900px) translateY(-9px) rotateX(${currentY.toFixed(2)}deg) rotateY(${currentX.toFixed(2)}deg) scale(1.025)`;

        tiltRafId = requestAnimationFrame(updateTilt);
      }

      card.addEventListener('mouseleave', () => {
        isHovering = false;
        if (tiltRafId) {
          cancelAnimationFrame(tiltRafId);
          tiltRafId = null;
        }
        card.style.transition = 'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 360ms cubic-bezier(0.2, 0.9, 0.4, 1)';
        card.style.transform = '';
      });
    }

    // Click / Tap Event: Rubber-Stamp Ink Imprint Wave & Prismatic Sparkle Burst
    card.addEventListener('click', (e) => {
      const rect = card.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Keep DOM lean under rapid repeated clicks
      const existingRipples = card.querySelectorAll('.stamp-ink-ripple');
      if (existingRipples.length > 2) {
        existingRipples[0].remove();
      }

      // 1. Ink Imprint Ripple Wave
      const ripple = document.createElement('div');
      ripple.className = 'stamp-ink-ripple';
      const size = Math.max(rect.width, rect.height) * 1.5;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${clickX}px`;
      ripple.style.top = `${clickY}px`;
      card.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 560);

      // 2. Collector Foil Sparkle Burst (5 delicate floating sparkles)
      const count = 5;
      for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'stamp-click-sparkle';
        sparkle.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
        sparkle.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        sparkle.style.left = `${clickX}px`;
        sparkle.style.top = `${clickY}px`;

        const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
        const dist = 28 + Math.random() * 38;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const rot = (Math.random() * 260 - 130).toFixed(0);

        sparkle.style.setProperty('--dx', `${dx.toFixed(1)}px`);
        sparkle.style.setProperty('--dy', `${dy.toFixed(1)}px`);
        sparkle.style.setProperty('--rot', `${rot}deg`);

        card.appendChild(sparkle);

        setTimeout(() => {
          sparkle.remove();
        }, 520);
      }
    });
  });
}
