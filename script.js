const birthdayConfig = {
  name: "Shaanu",
  fromName: "Himanshu",
  dateLabel: "17 June 2026",
  subtitle:
    "I built a tiny universe in the stars — just for you. No crowd, no noise, only us.",
  letter:
    "Happy Birthday, my love.\n\nYou make ordinary days feel like celebrations. I admire your kindness, your strength, and the way you light up every room without even trying.\n\nToday I just want you to feel deeply loved, seen, and appreciated. I hope this year brings you peace, growth, laughter, and every dream you whispered about.\n\nThank you for being my favorite person.",
  finalLine: "You are my best chapter. Happy Birthday.",
  timeline: [
    { date: "The day we met", text: "Two strangers. One perfect beginning.", icon: "✨" },
    { date: "Our first long call", text: "Hours felt like minutes.", icon: "📞" },
    { date: "Our inside jokes era", text: "Still laughing at the same things.", icon: "😄" },
    { date: "Today", text: "Celebrating the queen of my heart.", icon: "👑" }
  ],
  reasons: [
    "Your smile",
    "Your laugh",
    "Your kindness",
    "Your strength",
    "Your eyes",
    "Your heart",
    "Just you"
  ]
};

const wishLevels = [
  { max: 15, text: "A soft glow of sweetness" },
  { max: 35, text: "Warm and radiant" },
  { max: 55, text: "Sparkly and magical ✨" },
  { max: 75, text: "Legendary birthday aura" },
  { max: 100, text: "Cosmic queen energy unlocked 👑" }
];

const SCENE_COUNT = 7;
let currentScene = 0;
let confettiParticles = [];
let skyParticles = [];
let envelopeOpened = false;
let typewriterDone = false;
let wishMaxed = false;

const canvas = document.getElementById("skyCanvas");
const ctx = canvas.getContext("2d");

function $(id) {
  return document.getElementById(id);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initSky() {
  skyParticles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 0.3 + 0.05,
    twinkle: Math.random() * Math.PI * 2
  }));
}

function drawSky() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const t = Date.now() * 0.001;

  skyParticles.forEach((p) => {
    const alpha = 0.3 + Math.sin(t + p.twinkle) * 0.3;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 220, 240, ${alpha})`;
    ctx.fill();
    p.y -= p.speed;
    if (p.y < -5) {
      p.y = canvas.height + 5;
      p.x = Math.random() * canvas.width;
    }
  });

  confettiParticles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.rotation += p.rotSpeed;
    p.life -= 0.008;

    if (p.life <= 0) {
      confettiParticles.splice(i, 1);
      return;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });

  requestAnimationFrame(drawSky);
}

function spawnConfetti(count = 80, originX, originY) {
  const colors = ["#ff6b9d", "#b794f6", "#ffd89b", "#ffb3d0", "#fff", "#e8d4ff"];
  const ox = originX ?? canvas.width / 2;
  const oy = originY ?? canvas.height / 2;

  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: ox,
      y: oy,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -14 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      life: 1
    });
  }
}

function spawnSparkles() {
  const field = $("sparkleField");
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.animationDelay = `${Math.random() * 3}s`;
    s.style.animationDuration = `${2 + Math.random() * 3}s`;
    field.appendChild(s);
  }
}

function spawnFloatHeart() {
  const h = document.createElement("div");
  h.className = "float-heart";
  h.textContent = ["♥", "♡", "✦", "✧"][Math.floor(Math.random() * 4)];
  h.style.left = `${Math.random() * 90 + 5}%`;
  h.style.bottom = "-20px";
  h.style.fontSize = `${Math.random() * 14 + 10}px`;
  h.style.animationDuration = `${3 + Math.random() * 3}s`;
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 6000);
}

function initProgressDots() {
  const nav = $("progressDots");
  for (let i = 0; i < SCENE_COUNT; i++) {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Scene ${i + 1}`);
    dot.addEventListener("click", () => goToScene(i));
    nav.appendChild(dot);
  }
}

function updateDots() {
  document.querySelectorAll(".progress-dots .dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentScene);
    dot.classList.toggle("done", i < currentScene);
  });
}

function goToScene(index) {
  if (index < 0 || index >= SCENE_COUNT || index === currentScene) return;

  const scenes = document.querySelectorAll(".scene");
  scenes[currentScene].classList.remove("active");
  scenes[currentScene].classList.add("passed");
  currentScene = index;
  scenes[currentScene].classList.remove("passed");
  scenes[currentScene].classList.add("active");
  updateDots();

  onSceneEnter(currentScene);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextScene() {
  goToScene(currentScene + 1);
}

function onSceneEnter(index) {
  if (index === 3) animateTimeline();
  if (index === 4) initReasons();
  if (index === 6) {
    spawnConfetti(50);
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnFloatHeart, i * 400);
    }
  }
}

function hydratePage() {
  document.title = `Happy Birthday, ${birthdayConfig.name}`;
  $("dateLine").textContent = birthdayConfig.dateLabel;
  $("nameReveal").textContent = birthdayConfig.name;
  $("subTitle").textContent = birthdayConfig.subtitle;
  $("finalLine").textContent = birthdayConfig.finalLine;
  $("signature").textContent = `With all my love, ${birthdayConfig.fromName} ♥`;

  const track = $("timelineTrack");
  birthdayConfig.timeline.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <div class="timeline-dot">${entry.icon}</div>
      <div class="timeline-content">
        <span class="t-date">${entry.date}</span>
        <p>${entry.text}</p>
      </div>`;
    track.appendChild(item);
  });

  const svg = document.querySelector(".meter-ring svg");
  const grad = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  grad.innerHTML = `<linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#ff6b9d"/>
    <stop offset="100%" stop-color="#b794f6"/>
  </linearGradient>`;
  svg.prepend(grad);
}

function animateTimeline() {
  const items = document.querySelectorAll(".timeline-item");
  items.forEach((item, i) => {
    setTimeout(() => item.classList.add("visible"), 200 * i);
  });
  setTimeout(() => $("timelineNext").classList.remove("hidden"), 200 * items.length + 400);
}

function initReasons() {
  const orbit = $("reasonOrbit");
  if (orbit.dataset.ready) return;
  orbit.dataset.ready = "1";

  const reasons = birthdayConfig.reasons;
  const radius = orbit.offsetWidth / 2 - 40;

  reasons.forEach((text, i) => {
    const angle = (i / reasons.length) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const star = document.createElement("button");
    star.className = "reason-star";
    star.textContent = text;
    star.style.setProperty("--x", `${x}px`);
    star.style.setProperty("--y", `${y}px`);
    star.style.setProperty("--delay", `${i * 0.3}s`);

    star.addEventListener("click", () => {
      document.querySelectorAll(".reason-star").forEach((s) => s.classList.remove("active"));
      star.classList.add("active");
      $("reasonCenter").textContent = `Because of your ${text.toLowerCase()} ♥`;
      spawnConfetti(15, canvas.width / 2, canvas.height / 2);
      setTimeout(nextScene, 1800);
    });

    orbit.appendChild(star);
  });
}

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  const wrap = $("envelope");
  wrap.classList.add("open");
  spawnBurstHearts();
  spawnConfetti(40, canvas.width / 2, canvas.height * 0.45);

  setTimeout(() => {
    nextScene();
    startTypewriter();
  }, 2200);
}

function spawnBurstHearts() {
  const container = $("burstHearts");
  for (let i = 0; i < 12; i++) {
    const h = document.createElement("span");
    h.className = "burst-heart";
    h.textContent = "♥";
    const angle = (i / 12) * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    h.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
    h.style.setProperty("--ty", `${Math.sin(angle) * dist - 40}px`);
    h.style.setProperty("--rot", `${Math.random() * 360}deg`);
    h.style.animationDelay = `${Math.random() * 0.2}s`;
    container.appendChild(h);
  }
}

function startTypewriter() {
  if (typewriterDone) return;
  const text = birthdayConfig.letter;
  const el = $("letterText");
  const cursor = $("typeCursor");
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      const delay = text[i - 1] === "\n" ? 120 : 28 + Math.random() * 20;
      setTimeout(type, delay);
    } else {
      typewriterDone = true;
      cursor.classList.add("hidden");
      $("letterNext").classList.remove("hidden");
    }
  }

  setTimeout(type, 400);
}

function updateMeter(value) {
  const circumference = 327;
  const offset = circumference - (value / 100) * circumference;
  $("meterFill").style.strokeDashoffset = offset;
  $("meterValue").textContent = `${value}%`;

  const level = wishLevels.find((l) => value <= l.max);
  const label = $("wishOutput");
  label.textContent = level ? level.text : wishLevels[0].text;
  label.classList.remove("bump");
  void label.offsetWidth;
  label.classList.add("bump");

  if (value >= 100 && !wishMaxed) {
    wishMaxed = true;
    spawnConfetti(100);
    for (let i = 0; i < 8; i++) setTimeout(spawnFloatHeart, i * 250);
    setTimeout(nextScene, 2500);
  }
}

function blowCandle() {
  $("flame").classList.add("out");
  spawnConfetti(120);
  for (let i = 0; i < 10; i++) setTimeout(spawnFloatHeart, i * 300);
}

function bindEvents() {
  $("startBtn").addEventListener("click", () => {
    spawnConfetti(30);
    nextScene();
  });

  const envelope = $("envelope");
  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });

  $("letterNext").addEventListener("click", nextScene);
  $("timelineNext").addEventListener("click", nextScene);

  $("wishSlider").addEventListener("input", (e) => {
    updateMeter(Number(e.target.value));
  });

  $("celebrateBtn").addEventListener("click", blowCandle);

  setInterval(() => {
    if (Math.random() > 0.6) spawnFloatHeart();
  }, 2500);
}

resizeCanvas();
initSky();
spawnSparkles();
initProgressDots();
hydratePage();
bindEvents();
drawSky();

window.addEventListener("resize", () => {
  resizeCanvas();
  initSky();
});
