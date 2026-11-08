// Vanilla JavaScript only — no frameworks or animation libraries.
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

if (menuToggle && nav) {
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
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Scroll-linked device transforms. The progress is calculated from each
// stage's position in the viewport, so scrolling upward reverses the effect.
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (start, end, amount) => start + (end - start) * amount;
const easeOutBack = (value) => {
  const c1 = 1.35;
  const c3 = c1 + 1;
  return 1 + c3 * (value - 1) ** 3 + c1 * (value - 1) ** 2;
};

function getPhoneProgress(element) {
  const rect = element.getBoundingClientRect();
  const sectionTop = rect.top + window.scrollY;
  if (window.innerWidth <= 800) {
    const mobileStart = window.innerHeight * 0.18;
    const mobileDistance = Math.max(rect.height - window.innerHeight * 0.42, window.innerHeight * 1.1);
    return clamp((window.scrollY - sectionTop + mobileStart) / mobileDistance, 0, 1);
  }
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
  miniTabs.forEach((tab) => {
    const isActive = tab.dataset.miniView === viewId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
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
    const rotationProgress = easeOutBack(clamp(p / (isDesktop ? 0.76 : 0.82), 0, 1));
    const rotation = isDesktop
      ? lerp(-90, 0, rotationProgress)
      : lerp(-6, 0, rotationProgress);
    const approachProgress = clamp(p / 0.55, 0, 1);
    const expandProgress = isDesktop
      ? clamp((p - 0.62) / 0.38, 0, 1)
      : clamp((p - 0.72) / 0.28, 0, 1);
    const scale = p < 0.55
      ? lerp(isDesktop ? 0.68 : 0.82, 1, approachProgress)
      : lerp(1, 1, expandProgress);
    if (isDesktop) {
      phoneDevice.style.width = `${lerp(260, desktopWidth, expandProgress)}px`;
      phoneDevice.style.height = `${lerp(520, Math.min(620, window.innerHeight * 0.72), expandProgress)}px`;
    } else {
      phoneDevice.style.width = "";
      phoneDevice.style.height = "";
    }
    const y = p < 0.55
      ? lerp(isDesktop ? 100 : 20, -5, approachProgress)
      : lerp(-5, 0, expandProgress);
    phoneDevice.style.transform = `translateY(${y}px) rotate(${rotation}deg) scale(${scale})`;
    phoneDevice.style.setProperty("--phone-expand", String(expandProgress));

    if (phoneScreens.length) {
      const screenProgress = isDesktop
        ? clamp((p / 0.55) * phoneScreens.length, 0, phoneScreens.length - 0.001)
        : clamp((p / 0.72) * phoneScreens.length, 0, phoneScreens.length - 1);
      const activeIndex = Math.floor(screenProgress);
      const fadeProgress = activeIndex === phoneScreens.length - 1
        ? 0
        : screenProgress - activeIndex;

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
const contactForm = document.getElementById("contact-form");
contactForm?.addEventListener("submit", (event) => {
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
