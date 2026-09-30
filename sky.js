/*
 * sky.js
 *
 * The night sky behind Alex's look. The stars are drawn once and never move.
 * The shooting stars are real, in the sense that they're real canvas lines.
 * Make a wish anyway.
 */

const METEOR_GAP_MS = [8000, 12000];  // One every ten seconds or so. More looks like an air raid.
const FIREBALL_FIRST_MS = 25000;      // The green one, early enough that people actually see it,
const FIREBALL_GAP_MS = 60000;        // then once a minute.

const calm = matchMedia('(prefers-reduced-motion: reduce)');
const small = matchMedia('(max-width: 640px), (pointer: coarse)');

const between = ([min, max]) => min + Math.random() * (max - min);

function fit(canvas) {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  const context = canvas.getContext('2d');
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return context;
}

// Seeded, so the constellations stay put between visits. Astronomers appreciate consistency.
function drawStars(canvas) {
  const context = fit(canvas);
  let seed = 7;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const count = Math.round((innerWidth * innerHeight) / 9000);

  context.fillStyle = '#FFFFFF';
  for (let i = 0; i < count; i++) {
    context.globalAlpha = 0.25 + random() * 0.6;
    context.beginPath();
    context.arc(random() * innerWidth, random() * innerHeight * 0.85, 0.3 + random() * 0.9, 0, Math.PI * 2);
    context.fill();
  }
}

/* ---------- Shooting stars ----------
 * A bright head and a fading tail, gone in under a second.
 * Once a minute a green fireball goes by slower, brightens, and bursts. */

export function startSky({ stars, meteors, isVisible }) {
  let context = fit(meteors);
  const streaks = [];
  const bursts = [];
  let running = false;
  let last = 0;

  const quiet = () => !isVisible() || calm.matches || small.matches || document.hidden;

  function launch(fireball) {
    const leftward = Math.random() < 0.5;
    const angle = (leftward ? 155 : 25) * Math.PI / 180 + (Math.random() - 0.5) * 0.25;
    streaks.push({
      fireball,
      x: innerWidth * (leftward ? 0.35 + Math.random() * 0.65 : Math.random() * 0.65),
      y: innerHeight * Math.random() * 0.4,
      dx: Math.cos(angle),
      dy: Math.sin(angle),
      speed: fireball ? 420 + Math.random() * 120 : 700 + Math.random() * 600,
      length: fireball ? 200 : 90 + Math.random() * 140,
      life: fireball ? 1.5 : 0.6 + Math.random() * 0.6,
      age: 0
    });
    if (!running) {
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    }
  }

  function burst(x, y) {
    const sparks = Array.from({ length: 12 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 90;
      return { dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed };
    });
    bursts.push({ x, y, age: 0, life: 0.9, sparks });
  }

  function drawStreak(s, brightness) {
    const tailX = s.x - s.dx * s.length;
    const tailY = s.y - s.dy * s.length;
    const tint = s.fireball ? '120, 255, 170' : '190, 215, 255';
    const trail = context.createLinearGradient(s.x, s.y, tailX, tailY);
    trail.addColorStop(0, s.fireball ? `rgba(215, 255, 225, ${brightness})` : `rgba(255, 255, 255, ${0.9 * brightness})`);
    trail.addColorStop(0.3, `rgba(${tint}, ${(s.fireball ? 0.55 : 0.35) * brightness})`);
    trail.addColorStop(1, `rgba(${tint}, 0)`);

    context.strokeStyle = trail;
    context.lineWidth = s.fireball ? 2.2 : 1.4;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(s.x, s.y);
    context.lineTo(tailX, tailY);
    context.stroke();

    context.fillStyle = s.fireball ? `rgba(200, 255, 215, ${brightness})` : `rgba(255, 255, 255, ${brightness})`;
    context.beginPath();
    context.arc(s.x, s.y, s.fireball ? 2 : 1.3, 0, Math.PI * 2);
    context.fill();
  }

  function drawBurst(b) {
    const progress = b.age / b.life;
    const fade = 1 - progress;
    const radius = 14 + 46 * progress;
    const glow = context.createRadialGradient(b.x, b.y, 0, b.x, b.y, radius);
    glow.addColorStop(0, `rgba(210, 255, 220, ${0.9 * fade})`);
    glow.addColorStop(1, 'rgba(90, 255, 150, 0)');
    context.fillStyle = glow;
    context.beginPath();
    context.arc(b.x, b.y, radius, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = `rgba(160, 255, 190, ${fade})`;
    for (const spark of b.sparks) {
      context.beginPath();
      context.arc(b.x + spark.dx * b.age, b.y + spark.dy * b.age + 20 * b.age * b.age, 1, 0, Math.PI * 2);
      context.fill();
    }
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    context.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = streaks.length - 1; i >= 0; i--) {
      const s = streaks[i];
      s.age += dt;
      if (s.age >= s.life) {
        streaks.splice(i, 1);
        if (s.fireball) burst(s.x, s.y);
        continue;
      }
      s.x += s.dx * s.speed * dt;
      s.y += s.dy * s.speed * dt;
      // The fireball brightens until it bursts. The others fade in and out.
      drawStreak(s, s.fireball ? Math.min(1, 0.3 + s.age / s.life) : Math.sin(Math.PI * (s.age / s.life)));
    }

    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.age += dt;
      if (b.age >= b.life) bursts.splice(i, 1);
      else drawBurst(b);
    }

    if (streaks.length || bursts.length) requestAnimationFrame(frame);
    else running = false;
  }

  function every(delay, gap, fireball) {
    setTimeout(() => {
      if (!quiet()) launch(fireball);
      every(gap(), gap, fireball);
    }, delay);
  }

  drawStars(stars);
  addEventListener('resize', () => {
    drawStars(stars);
    context = fit(meteors);
  });

  every(2000, () => between(METEOR_GAP_MS), false);
  every(FIREBALL_FIRST_MS, () => FIREBALL_GAP_MS, true);
}
