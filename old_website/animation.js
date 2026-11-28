/**
 * HACK UTTAR PRADESH 2026 - SCENIC CANVAS ANIMATION ENGINE
 * Scene: Person coding in open greens under open skies with interactive physics
 */

class ScenicNatureCodingEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.mode = 'twilight'; // 'twilight', 'night', 'aurora'
    this.width = 0;
    this.height = 0;
    this.time = 0;

    // Mouse & Wind physics
    this.mouse = { x: -1000, y: -1000, isHovered: false, speedX: 0, lastX: 0 };
    this.wind = { current: 0.8, target: 0.8, gustTimer: 0 };

    // Scene elements
    this.stars = [];
    this.shootingStars = [];
    this.fireflies = [];
    this.codeParticles = [];
    this.grassBlades = [];
    this.clouds = [];
    this.prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Canvas Mouse listeners
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      this.mouse.speedX = currentX - this.mouse.lastX;
      this.mouse.lastX = currentX;
      this.mouse.x = currentX;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.isHovered = true;

      // Add wind impulse from mouse movement
      this.wind.target += this.mouse.speedX * 0.05;

      // Spawn starlight spark
      if (Math.random() < 0.3) {
        this.spawnMouseSpark(this.mouse.x, this.mouse.y);
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.isHovered = false;
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // Populate initial entities
    this.createStars(180);
    this.createFireflies(25);
    this.createClouds(5);
    this.createGrassBlades();

    // Mode Buttons Listener (supports both styles)
    const modeButtons = document.querySelectorAll('.mode-btn, .mode-pill-opt');
    modeButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        modeButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.setMode(btn.dataset.mode);
      });
    });

    // Start render loop
    requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    this.createGrassBlades();
  }

  setMode(mode) {
    this.mode = mode;
  }

  createStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * 2000,
        y: Math.random() * 380,
        radius: Math.random() * 1.6 + 0.4,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.05 + 0.01,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.8 ? '#a78bfa' : Math.random() > 0.6 ? '#67e8f9' : '#ffffff'
      });
    }
  }

  createClouds(count) {
    this.clouds = [];
    for (let i = 0; i < count; i++) {
      this.clouds.push({
        x: Math.random() * 1400,
        y: 40 + Math.random() * 140,
        width: 140 + Math.random() * 160,
        height: 35 + Math.random() * 30,
        speed: 0.15 + Math.random() * 0.2,
        alpha: 0.12 + Math.random() * 0.15
      });
    }
  }

  createFireflies(count) {
    this.fireflies = [];
    for (let i = 0; i < count; i++) {
      this.fireflies.push({
        x: Math.random() * 1400,
        y: 280 + Math.random() * 220,
        size: Math.random() * 2.5 + 1.2,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.4,
        pulseSpeed: 0.03 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  createGrassBlades() {
    this.grassBlades = [];
    const bladeCount = Math.floor(this.width / 4); // Dense lush grass
    for (let i = 0; i < bladeCount; i++) {
      const x = i * 4 + (Math.random() * 2 - 1);
      // Grass sits on foreground hill curve
      const baseY = this.getHillY(x, 2);
      this.grassBlades.push({
        x: x,
        baseY: baseY,
        height: 18 + Math.random() * 26,
        curve: (Math.random() - 0.5) * 8,
        swayPhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? '#10b981' : Math.random() > 0.2 ? '#059669' : '#34d399',
        width: 1.5 + Math.random() * 1.5
      });
    }
  }

  getHillY(x, layer) {
    // Math curve describing gentle rolling meadows of UP
    const normX = x / this.width;
    if (layer === 0) {
      // Distant background ridge
      return this.height * 0.62 - Math.sin(normX * 3.5 + 1) * 35;
    } else if (layer === 1) {
      // Midground rolling slope
      return this.height * 0.72 - Math.sin(normX * 2.8 + 0.5) * 45;
    } else {
      // Foreground meadow where person sits
      return this.height * 0.82 - Math.sin(normX * 2.2 - 0.4) * 35;
    }
  }

  spawnMouseSpark(x, y) {
    this.codeParticles.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      text: '✦',
      size: 10 + Math.random() * 6,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -1 - Math.random() * 1.5,
      alpha: 1,
      decay: 0.03,
      color: '#34d399'
    });
  }

  spawnCodeSnippet(coderX, coderY) {
    const snippets = [
      '<div>', 'UP_75', 'async', 'gomti()', 'riwa.build()', 'const up=true;',
      'awadh.ai()', 'ganga()', '✨', 'odop.mint()', 'namaste()', '{UP_2026}'
    ];
    const text = snippets[Math.floor(Math.random() * snippets.length)];

    this.codeParticles.push({
      x: coderX + 18,
      y: coderY - 24,
      text: text,
      size: 11,
      vx: (Math.random() - 0.5) * 0.8 + 0.2,
      vy: -1.2 - Math.random() * 1.4,
      alpha: 1,
      decay: 0.012,
      color: Math.random() > 0.5 ? '#ff6600' : Math.random() > 0.3 ? '#4ade80' : '#ffffff'
    });
  }

  spawnShootingStar() {
    this.shootingStars.push({
      x: Math.random() * (this.width * 0.8),
      y: 20 + Math.random() * 120,
      length: 80 + Math.random() * 90,
      speed: 12 + Math.random() * 6,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
      alpha: 1,
      decay: 0.02
    });
  }

  updatePhysics() {
    if (this.prefersReducedMotion) return;

    this.time += 0.025;

    // Wind dynamics
    this.wind.gustTimer += 0.01;
    this.wind.current += (this.wind.target - this.wind.current) * 0.05;
    // Natural fluctuating breeze
    this.wind.target = 0.8 + Math.sin(this.wind.gustTimer * 2) * 0.6 + Math.cos(this.wind.gustTimer * 0.8) * 0.4;

    // Trigger occasional shooting star
    if (Math.random() < 0.008) {
      this.spawnShootingStar();
    }

    // Update clouds
    this.clouds.forEach(cloud => {
      cloud.x += cloud.speed;
      if (cloud.x > this.width + 100) cloud.x = -cloud.width;
    });

    // Update fireflies
    this.fireflies.forEach(f => {
      f.x += f.speedX + Math.sin(this.time + f.phase) * 0.4;
      f.y += f.speedY + Math.cos(this.time + f.phase) * 0.3;
      if (f.x < 0) f.x = this.width;
      if (f.x > this.width) f.x = 0;
      if (f.y < this.height * 0.6) f.speedY *= -1;
      if (f.y > this.height - 20) f.speedY *= -1;
    });

    // Update code particles
    for (let i = this.codeParticles.length - 1; i >= 0; i--) {
      const p = this.codeParticles[i];
      p.x += p.vx + this.wind.current * 0.4;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        this.codeParticles.splice(i, 1);
      }
    }

    // Update shooting stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= s.decay;
      if (s.alpha <= 0) {
        this.shootingStars.splice(i, 1);
      }
    }
  }

  drawSky() {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);

    if (this.mode === 'twilight') {
      grad.addColorStop(0, '#020508');
      grad.addColorStop(0.4, '#06131c');
      grad.addColorStop(0.75, '#1a1814');
      grad.addColorStop(0.9, '#381c08');
      grad.addColorStop(1, '#1f1005');
    } else if (this.mode === 'night') {
      grad.addColorStop(0, '#010306');
      grad.addColorStop(0.5, '#040b12');
      grad.addColorStop(0.85, '#06151f');
      grad.addColorStop(1, '#030d0b');
    } else if (this.mode === 'aurora') {
      grad.addColorStop(0, '#010609');
      grad.addColorStop(0.4, '#041d1a');
      grad.addColorStop(0.7, '#073322');
      grad.addColorStop(1, '#021a10');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Aurora Waves (If mode is aurora or subtle twilight)
    if (this.mode === 'aurora' || this.mode === 'twilight') {
      ctx.save();
      const waveAlpha = this.mode === 'aurora' ? 0.35 : 0.14;
      ctx.globalAlpha = waveAlpha;

      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        ctx.moveTo(0, 100);
        for (let x = 0; x <= this.width; x += 30) {
          const y = 90 + Math.sin(x * 0.005 + this.time * 0.8 + w) * 45 + Math.cos(x * 0.003 - this.time * 0.5) * 30;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(this.width, this.height * 0.5);
        ctx.lineTo(0, this.height * 0.5);
        ctx.closePath();

        const auroraGrad = ctx.createLinearGradient(0, 50, 0, this.height * 0.5);
        auroraGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
        auroraGrad.addColorStop(0.5, w % 2 === 0 ? 'rgba(52, 211, 153, 0.4)' : 'rgba(6, 182, 212, 0.4)');
        auroraGrad.addColorStop(1, 'rgba(124, 92, 252, 0)');
        ctx.fillStyle = auroraGrad;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  drawMoon() {
    const ctx = this.ctx;
    const moonX = this.width * 0.78;
    const moonY = 85;
    const radius = 28;

    ctx.save();
    // Ambient lunar glow
    const moonGlow = ctx.createRadialGradient(moonX, moonY, radius * 0.5, moonX, moonY, radius * 3.5);
    moonGlow.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
    moonGlow.addColorStop(0.5, 'rgba(254, 240, 138, 0.08)');
    moonGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, radius * 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Crescent Moon
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(moonX, moonY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Shadow cutout for crescent
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(moonX + radius * 0.65, moonY - radius * 0.2, radius * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    ctx.restore();
  }

  drawStars() {
    const ctx = this.ctx;
    this.stars.forEach(s => {
      const twinkle = Math.sin(this.time * s.twinkleSpeed * 50 + s.phase);
      const alpha = Math.max(0.1, s.baseAlpha + twinkle * 0.3);

      ctx.fillStyle = s.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(s.x % this.width, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Draw Shooting Stars
    this.shootingStars.forEach(s => {
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length);
      ctx.stroke();
      ctx.restore();
    });
  }

  drawClouds() {
    const ctx = this.ctx;
    ctx.save();
    this.clouds.forEach(c => {
      ctx.fillStyle = 'rgba(148, 163, 184, ' + c.alpha + ')';
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.width, c.height, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawHills() {
    const ctx = this.ctx;

    // 1. Distant Hill (Dark Indigo / Forest)
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    for (let x = 0; x <= this.width; x += 15) {
      ctx.lineTo(x, this.getHillY(x, 0));
    }
    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    const hill0Grad = ctx.createLinearGradient(0, this.height * 0.5, 0, this.height);
    hill0Grad.addColorStop(0, '#061622');
    hill0Grad.addColorStop(1, '#020b12');
    ctx.fillStyle = hill0Grad;
    ctx.fill();

    // 2. Midground Hill (Deep Emerald)
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    for (let x = 0; x <= this.width; x += 15) {
      ctx.lineTo(x, this.getHillY(x, 1));
    }
    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    const hill1Grad = ctx.createLinearGradient(0, this.height * 0.6, 0, this.height);
    hill1Grad.addColorStop(0, '#063529');
    hill1Grad.addColorStop(1, '#041d17');
    ctx.fillStyle = hill1Grad;
    ctx.fill();

    // 3. Foreground Grassy Hill
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    for (let x = 0; x <= this.width; x += 10) {
      ctx.lineTo(x, this.getHillY(x, 2));
    }
    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    const hill2Grad = ctx.createLinearGradient(0, this.height * 0.7, 0, this.height);
    hill2Grad.addColorStop(0, '#054737');
    hill2Grad.addColorStop(0.5, '#032a21');
    hill2Grad.addColorStop(1, '#021812');
    ctx.fillStyle = hill2Grad;
    ctx.fill();
  }

  drawCoderUnderOpenSky() {
    const ctx = this.ctx;

    // Position of coder on the grassy knoll
    const coderX = this.width * 0.38;
    const groundY = this.getHillY(coderX, 2);
    const coderY = groundY - 2;

    ctx.save();

    // Ambient campfire / laptop radiant glow on grass
    const lapGlow = ctx.createRadialGradient(coderX + 22, coderY - 26, 6, coderX + 22, coderY - 26, 120);
    lapGlow.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    lapGlow.addColorStop(0.4, 'rgba(16, 185, 129, 0.2)');
    lapGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lapGlow;
    ctx.beginPath();
    ctx.arc(coderX + 22, coderY - 26, 120, 0, Math.PI * 2);
    ctx.fill();

    // Backrest / Camping Tree or Sloped Rock behind coder
    ctx.fillStyle = '#01120e';
    ctx.beginPath();
    ctx.ellipse(coderX - 25, coderY + 8, 30, 40, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Person Silhouette (Coding seated on lawn)
    ctx.fillStyle = '#0a1622'; // Deep silhouette
    ctx.strokeStyle = '#1e3a4e';
    ctx.lineWidth = 1;

    // Legs crossed / bent on grass
    ctx.beginPath();
    ctx.ellipse(coderX + 6, coderY + 2, 22, 10, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Torso (leaning slightly toward laptop)
    ctx.beginPath();
    ctx.ellipse(coderX - 4, coderY - 26, 14, 20, 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Head with tech headset / cap
    ctx.beginPath();
    ctx.arc(coderX - 1, coderY - 54, 11, 0, Math.PI * 2);
    ctx.fill();

    // Face / Cap Rim silhouette
    ctx.beginPath();
    ctx.ellipse(coderX + 5, coderY - 58, 8, 3, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Arms reaching toward laptop
    ctx.beginPath();
    ctx.moveTo(coderX - 2, coderY - 30);
    ctx.quadraticCurveTo(coderX + 12, coderY - 18, coderX + 22, coderY - 18);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#0a1622';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Laptop Base (resting on knees)
    ctx.save();
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(coderX + 10, coderY - 16, 26, 4);

    // Glowing Open Laptop Screen
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(coderX + 32, coderY - 16);
    ctx.lineTo(coderX + 39, coderY - 36);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#4ade80';
    ctx.stroke();

    // Screen face
    ctx.fillStyle = '#f0fdf4';
    ctx.beginPath();
    ctx.moveTo(coderX + 31, coderY - 16);
    ctx.lineTo(coderX + 38, coderY - 36);
    ctx.lineTo(coderX + 24, coderY - 34);
    ctx.lineTo(coderX + 18, coderY - 16);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Occasional code snippet emission
    if (Math.random() < 0.04) {
      this.spawnCodeSnippet(coderX, coderY);
    }

    ctx.restore();
  }

  drawGrass() {
    const ctx = this.ctx;
    const breeze = Math.sin(this.time * 2) * this.wind.current;

    this.grassBlades.forEach(blade => {
      const sway = Math.sin(this.time * 3 + blade.swayPhase) * (this.wind.current * 4) + breeze * 2;
      const tipX = blade.x + blade.curve + sway;
      const tipY = blade.baseY - blade.height;

      ctx.beginPath();
      ctx.moveTo(blade.x, blade.baseY);
      ctx.quadraticCurveTo(blade.x + blade.curve * 0.5, blade.baseY - blade.height * 0.6, tipX, tipY);
      ctx.strokeStyle = blade.color;
      ctx.lineWidth = blade.width;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
  }

  drawFireflies() {
    const ctx = this.ctx;
    ctx.save();
    this.fireflies.forEach(f => {
      const pulse = Math.sin(this.time * f.pulseSpeed * 60 + f.phase);
      const alpha = Math.max(0.1, 0.4 + pulse * 0.5);

      const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 3.5);
      glow.addColorStop(0, `rgba(52, 211, 153, ${alpha})`);
      glow.addColorStop(0.5, `rgba(52, 211, 153, ${alpha * 0.3})`);
      glow.addColorStop(1, 'rgba(52, 211, 153, 0)');

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ecfdf5';
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawCodeParticles() {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = '500 11px "JetBrains Mono", monospace';

    this.codeParticles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fillText(p.text, p.x, p.y);
    });

    ctx.restore();
  }

  loop(timestamp) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.updatePhysics();
    this.drawSky();
    this.drawClouds();
    this.drawStars();
    this.drawMoon();
    this.drawHills();
    this.drawCoderUnderOpenSky();
    this.drawGrass();
    this.drawFireflies();
    this.drawCodeParticles();

    requestAnimationFrame((t) => this.loop(t));
  }
}

// Instantiate engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.scenicEngine = new ScenicNatureCodingEngine('natureSkyCanvas');
});

