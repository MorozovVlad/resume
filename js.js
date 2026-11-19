const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const progressBar = document.querySelector(".scroll-progress span");
const navLinks = Array.from(document.querySelectorAll(".site-nav__link"));
const yearEl = document.getElementById("year");

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// The nav docks to the left only where there is enough room for it (see style.scss)
const DOCK_MIN_WIDTH = 1400;
const DOCK_OFFSET = 40;

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActive(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* ---------- Scroll state ---------- */

let ticking = false;

function updateScrollState() {
  ticking = false;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  header.classList.toggle("is-scrolled", scrollTop > 40);

  const canDock = window.innerWidth >= DOCK_MIN_WIDTH;
  nav.classList.toggle("to-left", canDock && scrollTop > DOCK_OFFSET);

  if (progressBar) {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  }

  const atBottom =
    window.innerHeight + scrollTop >= document.documentElement.scrollHeight - 4;
  if (atBottom && sections.length) {
    setActive(sections[sections.length - 1].id);
  }
}

function requestScrollUpdate() {
  if (!ticking) {
    ticking = true;
    window.requestAnimationFrame(updateScrollState);
  }
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

/* ---------- Active section ---------- */

if (sections.length && "IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActive(visible.target.id);
      }
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
  );

  sections.forEach((section) => spy.observe(section));
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActive(link.getAttribute("href").slice(1));
  });
});

/* ---------- Reveal on scroll ---------- */

const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));

if (revealTargets.length && !reduceMotion && "IntersectionObserver" in window) {
  revealTargets.forEach((el) => {
    el.classList.add("reveal");

    const siblings = Array.from(el.parentElement.children).filter((child) =>
      child.hasAttribute("data-reveal"),
    );
    const index = siblings.indexOf(el);

    if (index > 0) {
      el.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 90}ms`);
    }
  });

  const reveal = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  revealTargets.forEach((el) => reveal.observe(el));
}

/* ---------- Footer year ---------- */

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

updateScrollState();
