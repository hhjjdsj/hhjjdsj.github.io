/* ==========================================================================
   hhjjdsj — personal portfolio behaviour
   Vanilla JavaScript, no dependencies. Three small features:
     1. light / dark theme with localStorage persistence,
     2. scroll-reveal animation with IntersectionObserver,
     3. active navigation link highlighting.
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "hhjjdsj-theme";

  /* ------------------------------------------------------------- 1. theme */
  function preferredTheme() {
    /* ?theme=light|dark forces a theme; used for reproducible report screenshots */
    var forced = new URLSearchParams(window.location.search).get("theme");
    if (forced === "light" || forced === "dark") {
      return forced;
    }
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      /* private mode: fall through to the OS preference */
    }
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      toggle.querySelector(".theme-icon").textContent = theme === "dark" ? "\u25D0" : "\u25D1";
    }
  }

  applyTheme(preferredTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (err) {
          /* storage disabled — the toggle still works for this visit */
        }
      });
    }

    var year = document.getElementById("year");
    if (year) {
      year.textContent = String(new Date().getFullYear());
    }

    /* -------------------------------------------------- 2. scroll reveal */
    var revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

      revealItems.forEach(function (item) {
        revealObserver.observe(item);
      });
    } else {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
    }

    /* ----------------------------------------- 3. active nav highlighting */
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
    var sections = links
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
      var navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          links.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });

      sections.forEach(function (section) {
        navObserver.observe(section);
      });
    }
  });
})();
