// Vanilla JavaScript only — no frameworks or animation libraries.
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Scroll-linked device transforms. The progress is calculated from each
// stage's position in the viewport, so scrolling upward reverses the effect.
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (start, end, amount) => start + (end - start) * amount;

function getProgress(element) {
  const rect = element.getBoundingClientRect();
  const travel = window.innerHeight + rect.height;
  return clamp((window.innerHeight - rect.top) / travel, 0, 1);
}

function getFocusedProgress(element) {
  const rect = element.getBoundingClientRect();
  const start = window.innerHeight * 0.9;
  const end = window.innerHeight * 0.05;
  return clamp((start - rect.top) / (start - end), 0, 1);
}

function getPhoneProgress(element) {
  const rect = element.getBoundingClientRect();
  const sectionTop = rect.top + window.scrollY;
  const startOffset = Math.min(window.innerHeight * 0.62, 620);
  const scrollDistance = Math.max(rect.height - startOffset, window.innerHeight * 0.9);
  return clamp((window.scrollY - sectionTop + startOffset) / scrollDistance, 0, 1);
}

const phoneStage = document.getElementById("phone-stage");
const phoneDevice = document.querySelector(".phone-device");
const phoneScreens = document.querySelectorAll(".phone-screen");
const expandedInterface = document.querySelector(".phone-expanded-interface");
const miniTabs = document.querySelectorAll(".mini-tab");
const miniViews = document.querySelectorAll(".mini-view");
const miniProjectList = document.querySelector(".mini-project-list");

const miniProjects = [
  ["01", "Interpersonal", "Full-stack social platform"],
  ["02", "Task Priority", "Spring Boot REST API"],
  ["03", "FinTrack", "Financial analytics desktop app"]
];

if (miniProjectList) {
  miniProjectList.innerHTML = miniProjects.map(([number, title, description]) => `
    <button class="mini-project" type="button">
      <span class="mini-project-number">${number}</span>
      <span><strong>${title}</strong><small>${description}</small></span>
      <span class="mini-project-arrow">↗</span>
    </button>
  `).join("");
}

function showMiniView(viewId) {
  miniTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.miniView === viewId));
  miniViews.forEach((view) => view.classList.toggle("is-visible", view.id === viewId));
}

document.querySelectorAll("[data-mini-view]").forEach((control) => {
  control.addEventListener("click", () => showMiniView(control.dataset.miniView));
});

let ticking = false;

function updateScrollAnimations() {
  if (phoneStage && phoneDevice) {
    const p = getPhoneProgress(phoneStage);
    const isDesktop = window.innerWidth > 800;
    const desktopWidth = Math.min(1100, Math.max(620, window.innerWidth * 0.76));
    const rotation = lerp(-90, 0, Math.min(p / 0.7, 1));
    const approachProgress = clamp(p / 0.55, 0, 1);
    const expandProgress = clamp((p - 0.62) / 0.38, 0, 1);
    const scale = p < 0.55
      ? lerp(0.68, 1, approachProgress)
      : lerp(1, isDesktop ? 1 : 2.2, expandProgress);
    if (isDesktop) {
      phoneDevice.style.width = `${lerp(260, desktopWidth, expandProgress)}px`;
      phoneDevice.style.height = `${lerp(520, Math.min(620, window.innerHeight * 0.72), expandProgress)}px`;
    } else {
      phoneDevice.style.width = "";
      phoneDevice.style.height = "";
    }
    const y = p < 0.55
      ? lerp(100, -5, approachProgress)
      : lerp(-5, isDesktop ? 0 : -30, expandProgress);
    phoneDevice.style.transform = `translateY(${y}px) rotate(${rotation}deg) scale(${scale})`;
    phoneDevice.style.setProperty("--phone-expand", String(expandProgress));

    if (phoneScreens.length) {
      const screenProgress = clamp((p / 0.55) * phoneScreens.length, 0, phoneScreens.length - 0.001);
      const activeIndex = Math.floor(screenProgress);
      const fadeProgress = screenProgress - activeIndex;

      phoneScreens.forEach((screen, index) => {
        let opacity = 0;
        if (index === activeIndex) opacity = (1 - fadeProgress) * (1 - expandProgress);
        if (index === activeIndex + 1) opacity = fadeProgress * (1 - expandProgress);
        screen.style.opacity = String(opacity);
      });
    }

    if (expandedInterface) {
      expandedInterface.style.opacity = String(expandProgress);
      expandedInterface.style.pointerEvents = expandProgress > 0.9 ? "auto" : "none";
      expandedInterface.setAttribute("aria-hidden", String(expandProgress <= 0.9));
    }
  }

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollAnimations);
    ticking = true;
  }
}, { passive: true });

window.addEventListener("resize", updateScrollAnimations);
updateScrollAnimations();

// Front-end contact form: opens a pre-filled email draft.
// Replace the email address if you want to use a different inbox.
document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = form.get("name");
  const email = form.get("email");
  const subject = form.get("subject");
  const message = form.get("message");

  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto = `mailto:Mubeenamir96@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
});
