(function () {
  const root = document.documentElement;

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Theme
  const THEME_KEY = "portfolio_theme";
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    localStorage.setItem(THEME_KEY, theme);
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);
  else {
    const prefersLight =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = root.getAttribute("data-theme") === "light";
      applyTheme(isLight ? "dark" : "light");
    });
  }

  // Mobile navigation
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navMenu.querySelectorAll("a.nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Project filters
  const projectsGrid = document.getElementById("projectsGrid");
  const filterButtons = document.querySelectorAll("[data-filter]");

  function setActiveFilter(button) {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  }

  function filterProjects(tag) {
    if (!projectsGrid) return;
    projectsGrid.querySelectorAll(".project").forEach((card) => {
      const tags = (card.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
      card.classList.toggle("is-hidden", tag !== "all" && !tags.includes(tag));
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveFilter(button);
      filterProjects(button.getAttribute("data-filter"));
    });
  });

  if (filterButtons.length) {
    setActiveFilter(filterButtons[0]);
    filterProjects("all");
  }

  // Scroll reveal
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -36px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Active navigation section
  const navLinks = Array.from(document.querySelectorAll(".nav-link[href^='#']"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      { rootMargin: "-35% 0px -55%", threshold: [0, 0.25, 0.5, 0.75] }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  // Contact mailto form
  const mailForm = document.getElementById("mailForm");
  const mailSubject = document.getElementById("mailSubject");
  const mailBody = document.getElementById("mailBody");

  if (mailForm && mailSubject && mailBody) {
    mailForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const subject = encodeURIComponent(mailSubject.value.trim());
      const body = encodeURIComponent(mailBody.value.trim());
      const to = "mohammadjaseem2004@gmail.com";
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }
})();
