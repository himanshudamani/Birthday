const birthdayConfig = {
  name: "Shaanu",
  fromName: "Gunnu",
  dateLabel: "17 June 2026",
  subtitle:
  "Your tech guy built something special just for you.",
  letter:
    "Happy Birthday, my love.\n\nThank you for being my safe space, my biggest headache, and my favourite person at the same time.\n\nLife kitni bhi complicated ho jaye, I always want you to be by my side.\n\n Thank you for all the love, care, fights, memories, and everything in between.",
  finalLine: "You are my best chapter. Happy Birthday.",
  timeline: [
    { date: "The day we met", text: "10 Sept 2023. One perfect beginning.", icon: "✨", image: "./images/met.jpg" },
    { date: "Everything in between", text: "Countless fights, arguments, and most importantly, memories.", icon: "📞", image: "./images/memories.jpg" },
    { date: "Our proposal", text: "14 Feb 2026. My heart beats for you.", icon: "💍", image: "./images/proposal.jpg" },
    { date: "Today", text: "Celebrating the queen of my heart.", icon: "👑", image: "./images/today.jpg" }
  ],
  images: {
    cover: "./images/cover.jpg",
    coverCaption: "My favourite person",
    finale: "./images/us.jpg",
    letter: ["./images/letter-1.jpg", "./images/letter-2.jpg"],
    gallery: [
      { src: "./images/gallery-1.jpg", caption: "Us being us", rotate: -5 },
      { src: "./images/gallery-2.jpg", caption: "Keep smiling with me", rotate: 4 },
      { src: "./images/gallery-3.jpg", caption: "The days we enjoyed", rotate: -3 },
      { src: "./images/gallery-4.jpg", caption: "Always you, always us", rotate: 6 },
      { src: "./images/gallery-5.jpg", caption: "My happy place", rotate: -2 }
    ]
  },
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
  { max: 15, text: "Itna kum?" },
  { max: 35, text: "Thoda or badha be.." },
  { max: 55, text: "Go go go ✨" },
  { max: 75, text: "Legendary birthday aura incoming.." },
  { max: 100, text: "Cosmic queen energy unlocked 👑" }
];

const SCENE_COUNT = 8;
let currentScene = 0;
let confettiParticles = [];
let skyParticles = [];
let envelopeOpened = false;
let typewriterDone = false;
let wishMaxed = false;
let galleryReady = false;

const canvas = document.getElementById("skyCanvas");
const ctx = canvas.getContext("2d");

function $(id) {
  return document.getElementById(id);
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

function openLightbox(src, caption = "") {
  $("lightboxImg").src = src;
  $("lightboxImg").alt = caption || "Memory photo";
  $("lightboxCaption").textContent = caption;
  $("lightbox").classList.remove("hidden");
}

function closeLightbox() {
  $("lightbox").classList.add("hidden");
  $("lightboxImg").src = "";
}

function photoButton(src, caption, className, onReady) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = className;
  btn.addEventListener("click", () => openLightbox(src, caption));

  const img = document.createElement("img");
  img.src = src;
  img.alt = caption || "Memory";
  img.loading = "lazy";
  img.addEventListener("error", () => btn.remove());
  img.addEventListener("load", () => {
    if (onReady) onReady();
  });

  btn.appendChild(img);
  return btn;
}

async function setupCoverPhoto() {
  const src = birthdayConfig.images?.cover;
  if (!src) return;

  const ok = await loadImage(src);
  if (!ok) return;

  const wrap = $("introPhotoWrap");
  const img = $("coverPhoto");
  img.src = src;
  const caption = birthdayConfig.images.coverCaption;
  if (caption) {
    wrap.querySelector(".polaroid-caption").textContent = caption;
  }
  wrap.hidden = false;
  img.addEventListener("click", () => openLightbox(src, caption));
  img.style.cursor = "pointer";
}

async function setupFinalePhoto() {
  const src = birthdayConfig.images?.finale;
  if (!src) return;

  const ok = await loadImage(src);
  if (!ok) return;

  const img = $("finalePhoto");
  img.src = src;
  $("finalePhotoWrap").hidden = false;
  img.addEventListener("click", () => openLightbox(src, "Us ♥"));
  img.style.cursor = "pointer";
}

async function setupLetterPhotos() {
  const photos = birthdayConfig.images?.letter || [];
  const container = $("letterPhotos");
  let loaded = 0;

  for (const src of photos) {
    const ok = await loadImage(src);
    if (!ok) continue;

    const btn = photoButton(src, "A memory with you", "letter-photo");
    container.appendChild(btn);
    loaded += 1;
  }

  if (loaded > 0) container.hidden = false;
}

function initGallery() {
  if (galleryReady) return;
  galleryReady = true;

  const strip = $("filmStrip");
  const gallery = birthdayConfig.images?.gallery || [];
  let loadedCount = 0;

  gallery.forEach((item, i) => {
    loadImage(item.src).then((ok) => {
      if (!ok) return;

      loadedCount += 1;
      const frame = document.createElement("button");
      frame.type = "button";
      frame.className = "film-frame";
      frame.style.transitionDelay = `${i * 0.12}s`;
      frame.innerHTML = `
        <div class="polaroid" style="--rot: ${item.rotate || 0}deg">
          <img src="${item.src}" alt="${item.caption || "Memory"}" loading="lazy" />
          <span class="polaroid-caption">${item.caption || ""}</span>
        </div>`;
      frame.addEventListener("click", () => openLightbox(item.src, item.caption));
      strip.appendChild(frame);

      requestAnimationFrame(() => frame.classList.add("visible"));

      if (loadedCount === 1) {
        $("galleryNext").classList.remove("hidden");
      }
    });
  });

  setTimeout(() => {
    if (loadedCount > 0) $("galleryNext").classList.remove("hidden");
  }, 1200);
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

  confettiParticles = confettiParticles.filter((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.rotation += p.rotSpeed;
    p.life -= 0.008;
    return p.life > 0;
  });

  confettiParticles.forEach((p) => {
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
}

function nextScene() {
  goToScene(currentScene + 1);
}

function onSceneEnter(index) {
  if (index === 3) animateTimeline();
  if (index === 4) initGallery();
  if (index === 5) initReasons();
  if (index === 7) {
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

    const photoHtml = entry.image
      ? `<button type="button" class="timeline-photo" data-src="${entry.image}" hidden>
           <img src="${entry.image}" alt="${entry.date}" loading="lazy" />
         </button>`
      : "";

    item.innerHTML = `
      <div class="timeline-dot">${entry.icon}</div>
      <div class="timeline-content">
        <span class="t-date">${entry.date}</span>
        <p>${entry.text}</p>
        ${photoHtml}
      </div>`;

    if (entry.image) {
      const photoBtn = item.querySelector(".timeline-photo");
      const photoImg = photoBtn.querySelector("img");
      photoImg.addEventListener("load", () => {
        photoBtn.hidden = false;
      });
      photoImg.addEventListener("error", () => photoBtn.remove());
      photoBtn.addEventListener("click", () => openLightbox(entry.image, entry.date));
    }

    track.appendChild(item);
  });

  setupCoverPhoto();
  setupFinalePhoto();
  setupLetterPhotos();
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
  const size = Math.min(window.innerWidth * 0.9, 340);
  const radius = size / 2 - 48;

  reasons.forEach((text, i) => {
    const angle = (i / reasons.length) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const star = document.createElement("button");
    star.className = "reason-star";
    star.type = "button";
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

const METER_CIRCUMFERENCE = 326.73;

function updateMeter(value) {
  const offset = METER_CIRCUMFERENCE - (value / 100) * METER_CIRCUMFERENCE;
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
  $("galleryNext").addEventListener("click", nextScene);

  $("lightboxClose").addEventListener("click", closeLightbox);
  $("lightbox").addEventListener("click", (e) => {
    if (e.target === $("lightbox")) closeLightbox();
  });

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

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    document.body.classList.add("fonts-ready");
  });
}

window.addEventListener("resize", () => {
  resizeCanvas();
  initSky();
});
