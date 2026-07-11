/* ==========================================================================
   Robert Williamson — Portfolio JS
   Vanilla JS, no dependencies. GitHub Pages friendly.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Config ---------- */
  // Relative path so it works on user pages
  var projectsJsonUrl = "./data/projects.json";

  var LANG_META = {
    rust: { label: "Rust", cls: "lang-rust" },
    cpp: { label: "C++", cls: "lang-cpp" },
    javascript: { label: "JavaScript", cls: "lang-js" },
    python: { label: "Python", cls: "lang-py" },
    java: { label: "Java", cls: "lang-java" },
  };

  // Skills — matches the tags in the original site.
  var SKILLS = [
    "C++",
    "Rust",
    "Java",
    "Python",
    "JavaScript",
    "React",
    "Node.js",
    "HTML/CSS",
    "Git",
  ];

  var EDUCATION = [
    {
      year: "1",
      label: "Year 1",
      modules: [
        { name: "Databases" },
        { name: "Procedural Programming" },
        { name: "Fundamentals of Maths for CS" },
        { name: "Object-Oriented Programming" },
        { name: "Intro to Cyber Security" },
        { name: "Intro to Computer Architecture" },
      ],
    },
    {
      year: "2",
      label: "Year 2",
      modules: [
        { name: "Software Engineering & Systems Design" },
        { name: "Data Structures & Algorithms" },
        { name: "Theory of Computation" },
        { name: "Intro to Artificial Intelligence" },
        { name: "Professional & Transferable Skills" },
      ],
    },
    {
      year: "3",
      label: "Year 3",
      modules: [
        { name: "Concurrent Programming" },
        { name: "Malware Analysis" },
        { name: "Network Security" },
        { name: "Cloud Computing" },
      ],
      note: true,
    },
  ];

  /* ---------- Helpers ---------- */
  /**
   * @arg {any} tag
   * @arg {any} attrs
   * @arg {any} children
   */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") node.className = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else if (k.indexOf("on") === 0 && typeof attrs[k] === "function")
          node.addEventListener(k.slice(2), attrs[k]);
        else if (attrs[k] != null) node.setAttribute(k, attrs[k]);
      });
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c == null) return;
        node.appendChild(
          typeof c === "string" ? document.createTextNode(c) : c,
        );
      });
    }
    return node;
  }

  /* ---------- Skills chips ---------- */
  function renderSkills() {
    var wrap = document.getElementById("skill-chips");
    if (!wrap) return;
    SKILLS.forEach(function (s) {
      wrap.appendChild(el("span", { class: "chip", text: s }, undefined));
    });
  }

  /* ---------- Education tabs + modules ---------- */
  function renderEducation() {
    var tabs = document.getElementById("year-tabs");
    var grid = document.getElementById("modules-grid");
    var note = document.getElementById("year3-note");
    if (!tabs || !grid) return;

    var activeIndex = 0;

    /**
     * @param {number} index
     * @param {boolean} moveFocus
     */
    function selectYear(index, moveFocus) {
      activeIndex = index;
      paintTabs();
      paintModules();
      if (moveFocus) {
        var activeTab = tabs.querySelector('[aria-selected="true"]');
        if (activeTab) activeTab.focus();
      }
    }

    function paintTabs() {
      tabs.innerHTML = "";
      EDUCATION.forEach(function (y, index) {
        var isActive = index === activeIndex;
        var t = el(
          "button",
          {
            class: "tab" + (isActive ? " active" : ""),
            text: y.label,
            type: "button",
            role: "tab",
            id: "year-tab-" + y.year,
            "aria-controls": "modules-grid",
            "aria-selected": isActive ? "true" : "false",
            tabindex: isActive ? "0" : "-1",
          },
          undefined,
        );
        t.addEventListener("click", function () {
          selectYear(index, true);
        });
        t.addEventListener("keydown", function (event) {
          var nextIndex = activeIndex;
          if (event.key === "ArrowRight") {
            nextIndex = (activeIndex + 1) % EDUCATION.length;
          } else if (event.key === "ArrowLeft") {
            nextIndex = (activeIndex - 1 + EDUCATION.length) % EDUCATION.length;
          } else if (event.key === "Home") {
            nextIndex = 0;
          } else if (event.key === "End") {
            nextIndex = EDUCATION.length - 1;
          } else {
            return;
          }
          event.preventDefault();
          selectYear(nextIndex, true);
        });
        tabs.appendChild(t);
      });
    }

    function paintModules() {
      var active = EDUCATION[activeIndex];
      grid.innerHTML = "";
      grid.setAttribute("aria-labelledby", "year-tab-" + active.year);
      active.modules.forEach(function (m) {
        var card = el("article", { class: "module-card" });
        card.appendChild(el("h3", { text: m.name }));
        grid.appendChild(card);
      });
      if (note) note.hidden = !active.note;
    }

    paintTabs();
    paintModules();
  }

  /* ---------- Projects ---------- */
  function createProjectElement(project) {
    var card = el("article", { class: "project-card reveal" });
    if (project.language) card.setAttribute("data-language", project.language);

    var head = el("div", { class: "project-head" });
    var heading = el("h3");
    var name = el(project.url ? "a" : "span", {
      class: "project-name",
      text: project.name || "Unnamed Project",
    });
    if (project.url) {
      name.href = project.url;
      name.target = "_blank";
      name.rel = "noopener noreferrer";
      name.setAttribute(
        "aria-label",
        "Open " + (project.name || "project") + " (opens in a new tab)",
      );
    }
    heading.appendChild(name);
    head.appendChild(heading);

    var meta = LANG_META[(project.language || "").toLowerCase()];
    if (meta) {
      var badge = el("span", { class: "project-lang " + meta.cls });
      badge.appendChild(el("span", { class: "lang-dot" }));
      badge.appendChild(document.createTextNode(meta.label));
      head.appendChild(badge);
    }
    card.appendChild(head);

    if (project.description) {
      card.appendChild(
        el("p", { class: "project-description", text: project.description }),
      );
    }

    if (Array.isArray(project.links) && project.links.length > 0) {
      var links = el("nav", {
        class: "project-links",
        "aria-label": "Project links",
      });
      project.links.forEach(function (link) {
        if (!link || !link.url || !link.label) return;
        links.appendChild(
          el("a", {
            text: link.label + " ↗",
            href: link.url,
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": link.label + " (opens in a new tab)",
          }),
        );
      });
      if (links.children.length > 0) card.appendChild(links);
    }

    if (project.codeSnippet && project.codeSnippet.length > 0) {
      var wrap = el("div", { class: "project-code-snippet-container" });
      wrap.appendChild(el("p", { text: "Sample code:" }));
      var pre = el("pre");
      var code = el("code");
      if (project.language)
        code.className = "language-" + project.language.toLowerCase();
      code.textContent = Array.isArray(project.codeSnippet)
        ? project.codeSnippet.join("\n")
        : project.codeSnippet;
      pre.appendChild(code);
      wrap.appendChild(pre);
      card.appendChild(wrap);
    }

    if (project.imageSources && project.imageSources.length > 0) {
      var imgs = el("div", { class: "project-images-container" });
      project.imageSources.forEach(function (src, index) {
        var img = el("img", {
          class: "project-image",
          src: src,
          alt:
            (project.imageAlts && project.imageAlts[index]) ||
            project.imageAlt ||
            "Screenshot of " + (project.name || "the project"),
          loading: "lazy",
          decoding: "async",
        });
        img.addEventListener("error", function () {
          img.style.display = "none";
        });
        imgs.appendChild(img);
      });
      card.appendChild(imgs);
    }

    return card;
  }

  function renderProjects(projects) {
    var container = document.getElementById("projects-container");
    if (!container) return;
    container.innerHTML = "";
    container.setAttribute("aria-busy", "false");
    if (projects.length === 0) {
      container.appendChild(
        el("p", { class: "loading-message", text: "No projects found." }),
      );
      return;
    }
    projects.forEach(function (p) {
      container.appendChild(createProjectElement(p));
    });
    highlightCode();
    observeReveal();
  }

  function setupLanguageFiltering(projects) {
    var tabs = document.getElementById("language-tabs");
    if (!tabs) return;
    tabs.innerHTML = "";

    var langs = [];
    projects.forEach(function (p) {
      if (p.language && langs.indexOf(p.language) === -1)
        langs.push(p.language);
    });
    langs.sort();

    function makeTab(label, key, active) {
      var t = el("button", {
        class: "tab" + (active ? " active" : ""),
        text: label,
        type: "button",
        "aria-pressed": active ? "true" : "false",
      });
      t.addEventListener("click", function () {
        tabs.querySelectorAll(".tab").forEach(function (x) {
          x.classList.remove("active");
          x.setAttribute("aria-pressed", "false");
        });
        t.classList.add("active");
        t.setAttribute("aria-pressed", "true");
        var filtered =
          key === "all"
            ? projects
            : projects.filter(function (p) {
                return p.language === key;
              });
        renderProjects(filtered);
      });
      return t;
    }

    tabs.appendChild(makeTab("All", "all", true));
    langs.forEach(function (l) {
      var label = (LANG_META[l.toLowerCase()] || {}).label || l;
      tabs.appendChild(makeTab(label, l, false));
    });
  }

  function highlightCode() {
    if (window.Prism) {
      try {
        Prism.highlightAll();
      } catch (e) {
        /* noop */
      }
    }
  }

  function fetchProjects() {
    var container = document.getElementById("projects-container");
    var loading = container
      ? container.querySelector(".loading-message")
      : null;
    fetch(projectsJsonUrl, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (projects) {
        if (!Array.isArray(projects)) throw new Error("Bad data");
        if (loading) loading.remove();
        renderProjects(projects);
        setupLanguageFiltering(projects);
      })
      .catch(function (err) {
        console.error("Could not load projects:", err);
        if (container) {
          container.innerHTML = `<p class="error-message">Failed to load projects. Please try again later.</p>`;
          container.setAttribute("aria-busy", "false");
        }
      });
  }

  /* ---------- Navigation: mobile toggle + scroll spy + smooth anchor ---------- */
  function setupNavigation() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.getElementById("primary-navigation");
    var header = document.getElementById("header");

    if (toggle && nav) {
      function closeMenu(returnFocus) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
        if (returnFocus) toggle.focus();
      }

      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute(
          "aria-label",
          open ? "Close navigation" : "Open navigation",
        );
      });
      nav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          closeMenu(false);
        });
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && nav.classList.contains("open")) {
          closeMenu(true);
        }
      });
      document.addEventListener("click", function (event) {
        if (
          nav.classList.contains("open") &&
          !nav.contains(event.target) &&
          !toggle.contains(event.target)
        ) {
          closeMenu(false);
        }
      });
    }

    // Header shadow on scroll
    window.addEventListener(
      "scroll",
      function () {
        if (header) header.classList.toggle("scrolled", window.scrollY > 8);
      },
      { passive: true },
    );

    // Scroll spy
    var links = Array.prototype.slice.call(
      document.querySelectorAll('#primary-navigation a[href^="#"]'),
    );
    var sections = links
      .map(function (l) {
        return document.querySelector(l.getAttribute("href"));
      })
      .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              var id = "#" + e.target.id;
              links.forEach(function (l) {
                var isActive = l.getAttribute("href") === id;
                l.classList.toggle("active", isActive);
                if (isActive) l.setAttribute("aria-current", "page");
                else l.removeAttribute("aria-current");
              });
            }
          });
        },
        { rootMargin: "-45% 0px -50% 0px" },
      );
      sections.forEach(function (s) {
        spy.observe(s);
      });
    }

    // Hash routing (smooth scroll + active state)
    var routes = {
      "#home": "#hero",
      "#portfolio": "#portfolio",
      "#about": "#about",
      "#education": "#education",
      "#contact": "#contact",
    };
    function handleRoute() {
      var hash = window.location.hash;
      var target = routes[hash] || hash || "#hero";
      var section = document.querySelector(target);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
    window.addEventListener("hashchange", handleRoute);
  }

  /* ---------- Theme toggle ---------- */
  function setupTheme() {
    var toggle = document.getElementById("theme-toggle");
    var themeColour = document.querySelector('meta[name="theme-color"]');

    /** @arg {"light" | "dark"}  theme */
    function apply(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {}
      if (toggle) {
        var nextTheme = theme === "dark" ? "light" : "dark";
        toggle.setAttribute("aria-label", "Dark theme");
        toggle.setAttribute("title", "Switch to " + nextTheme + " theme");
        toggle.setAttribute(
          "aria-pressed",
          theme === "dark" ? "true" : "false",
        );
      }
      if (themeColour) {
        themeColour.setAttribute(
          "content",
          theme === "dark" ? "#0c1311" : "#f7faf9",
        );
      }
    }

    var saved = document.documentElement.getAttribute("data-theme") || "light";
    try {
      saved = localStorage.getItem("theme") || saved;
    } catch (e) {}
    apply(saved);

    if (toggle)
      toggle.addEventListener("click", function () {
        var cur = document.documentElement.getAttribute("data-theme");
        apply(cur === "dark" ? "light" : "dark");
      });
  }

  /* ---------- Back to top ---------- */
  function setupBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        btn.hidden = window.scrollY <= 400;
      },
      { passive: true },
    );
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll reveal ---------- */
  /** @type {{ unobserve: (a0:any)=>any, observe: (a0:any)=>any }} */
  var revealObserver;
  function observeReveal() {
    var items = document.querySelectorAll(".reveal:not(.in)");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (i) {
        i.classList.add("in");
      });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              revealObserver.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
    }
    items.forEach(function (i) {
      revealObserver.observe(i);
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var year = document.getElementById("current-year");
    if (year) {
      year.textContent = `${new Date().getFullYear()}`;
    }

    setupTheme();
    setupNavigation();
    setupBackToTop();
    renderSkills();
    renderEducation();
    fetchProjects();
    observeReveal();
  });
})();
