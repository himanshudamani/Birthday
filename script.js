const birthdayConfig = {
  name: "Aarohi", // change your girlfriend's name
  fromName: "Himanshu",
  dateLabel: "16 June 2026",
  subtitle:
    "A tiny digital universe made only for you. No crowd, no noise, just us.",
  letter:
    "Happy Birthday, my love.\n\nYou make ordinary days feel like celebrations. I admire your kindness, your strength, and the way you light up every room without even trying.\n\nToday I just want you to feel deeply loved, seen, and appreciated. I hope this year brings you peace, growth, laughter, and every dream you whispered about.\n\nThank you for being my favorite person.",
  finalLine: "You are my best chapter. Happy Birthday.",
  timeline: [
    { date: "The day we met", text: "Two strangers. One perfect beginning." },
    { date: "Our first long call", text: "Hours felt like minutes." },
    { date: "Our inside jokes era", text: "Still laughing at the same things." },
    { date: "Today", text: "Celebrating the queen of my heart." }
  ]
};

const wishLevels = [
  { max: 20, text: "Sweet and calm" },
  { max: 40, text: "Cute and glowing" },
  { max: 60, text: "Sparkly and magical" },
  { max: 80, text: "Legendary birthday aura" },
  { max: 100, text: "Cosmic queen energy unlocked" }
];

const dateLine = document.getElementById("dateLine");
const mainTitle = document.getElementById("mainTitle");
const subTitle = document.getElementById("subTitle");
const revealBtn = document.getElementById("revealBtn");
const letterCard = document.getElementById("letterCard");
const memoryCard = document.getElementById("memoryCard");
const wishCard = document.getElementById("wishCard");
const finalCard = document.getElementById("finalCard");
const letterText = document.getElementById("letterText");
const timelineList = document.getElementById("timelineList");
const wishSlider = document.getElementById("wishSlider");
const wishOutput = document.getElementById("wishOutput");
const finalLine = document.getElementById("finalLine");
const signature = document.getElementById("signature");

function hydratePage() {
  dateLine.textContent = birthdayConfig.dateLabel;
  mainTitle.textContent = `Happy Birthday, ${birthdayConfig.name}`;
  subTitle.textContent = birthdayConfig.subtitle;
  letterText.textContent = birthdayConfig.letter;
  finalLine.textContent = birthdayConfig.finalLine;
  signature.textContent = `With all my love, ${birthdayConfig.fromName}`;

  birthdayConfig.timeline.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="t-date">${entry.date}</span>${entry.text}`;
    timelineList.appendChild(li);
  });
}

function revealCards() {
  [letterCard, memoryCard, wishCard, finalCard].forEach((card, idx) => {
    setTimeout(() => {
      card.classList.remove("hidden");
      card.classList.add("reveal");
    }, 220 * idx);
  });
  revealBtn.disabled = true;
  revealBtn.textContent = "Your letter is open";
}

function updateWishText(value) {
  const selected = wishLevels.find((level) => value <= level.max);
  wishOutput.textContent = selected ? selected.text : wishLevels[0].text;
}

hydratePage();
updateWishText(Number(wishSlider.value));

revealBtn.addEventListener("click", revealCards);
wishSlider.addEventListener("input", (event) => {
  updateWishText(Number(event.target.value));
});
