(function () {
  const root = document.documentElement;

  // Year
  document.getElementById("year").textContent = new Date().getFullYear();

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
    // Prefer system
    const prefersLight =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  themeToggle.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    applyTheme(isLight ? "dark" : "light");
  });

  // Mobile nav
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Close menu on nav link click (mobile)
  navMenu.querySelectorAll("a.nav-link").forEach((a) => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Projects filter
  const projectsGrid = document.getElementById("projectsGrid");
  const filterButtons = document.querySelectorAll("[data-filter]");

  function setActiveFilter(btn) {
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  }

  function filterProjects(tag) {
    const items = projectsGrid.querySelectorAll(".project");
    items.forEach((card) => {
      const tags = (card.getAttribute("data-tags") || "")
        .split(/\s+/)
        .filter(Boolean);
      const show = tag === "all" ? true : tags.includes(tag);
      card.classList.toggle("is-hidden", !show);
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.getAttribute("data-filter");
      setActiveFilter(btn);
      filterProjects(tag);
    });
  });

  // Default filter
  if (filterButtons.length) {
    setActiveFilter(filterButtons[0]);
    filterProjects("all");
  }

  // Skills search (filters chips + groups)
  const skillSearch = document.getElementById("skillSearch");
  const skillGroups = document.querySelectorAll(".skill-group");

  function normalize(s) {
    return (s || "").toLowerCase().trim();
  }

  function applySkillsSearch(query) {
    const q = normalize(query);

    skillGroups.forEach((group) => {
      const chips = group.querySelectorAll(".chip");
      let anyVisible = false;

      chips.forEach((chip) => {
        const match = normalize(chip.textContent).includes(q);
        const show = q === "" ? true : match;
        chip.classList.toggle("is-hidden", !show);
        if (show) anyVisible = true;
      });

      // If search is empty show all; else show group only if at least one chip visible
      group.classList.toggle("is-hidden", q !== "" && !anyVisible);
    });
  }

  skillSearch.addEventListener("input", (e) =>
    applySkillsSearch(e.target.value)
  );

  // Contact "mailto" form
  const mailForm = document.getElementById("mailForm");
  const mailSubject = document.getElementById("mailSubject");
  const mailBody = document.getElementById("mailBody");

  mailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(mailSubject.value.trim());
    const body = encodeURIComponent(mailBody.value.trim());
    const to = "you@example.com"; // CHANGE THIS
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
})();
