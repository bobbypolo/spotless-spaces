/* ============================================
   SPOTLESS SPACES — Main JavaScript
   ============================================ */

(function () {
  "use strict";

  // ---- DOM Elements ----
  const navbar = document.getElementById("navbar");
  const navToggle = document.querySelector(".navbar__toggle");
  const navMenu = document.querySelector(".navbar__menu");
  const navLinks = document.querySelectorAll(".navbar__link");

  // ---- Navbar: solid background on scroll ----
  function handleNavScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll(); // run on load

  // ---- Mobile hamburger menu ----
  function toggleMenu() {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    navMenu.classList.toggle("open");
    document.body.style.overflow = isOpen ? "" : "hidden";
  }

  navToggle.addEventListener("click", toggleMenu);

  // Close mobile menu when a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (navMenu.classList.contains("open")) {
        toggleMenu();
      }
    });
  });

  // Close mobile menu on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      toggleMenu();
      navToggle.focus();
    }
  });

  // ---- Smooth scroll with navbar offset ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var offset = navbar.offsetHeight;
      var top =
        target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  // ---- Scroll animations with IntersectionObserver ----
  var animElements = document.querySelectorAll(".animate-on-scroll");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    animElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // ---- Active nav link highlight on scroll ----
  var sections = document.querySelectorAll("main .section");

  function highlightNav() {
    var scrollPos = window.scrollY + navbar.offsetHeight + 60;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute("id");
      var link = document.querySelector('.navbar__link[href="#' + id + '"]');
      if (link) {
        if (scrollPos >= top && scrollPos < bottom) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }

  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();

  // ---- Contact form submission (Web3Forms, AJAX) ----
  var contactForm = document.getElementById("contact-form");

  if (contactForm) {
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    var statusEl = contactForm.querySelector(".form-status");
    var btnDefaultText = submitBtn
      ? submitBtn.textContent.trim()
      : "Send Request";

    function setStatus(message, state) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.remove("form-status--success", "form-status--error");
      if (state) {
        statusEl.classList.add("form-status--" + state);
      }
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Let the browser surface native validation messages first.
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      setStatus("", null);

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data.success) {
            contactForm.reset();
            setStatus(
              "Thanks! Your request was sent — we’ll be in touch shortly.",
              "success",
            );
          } else {
            setStatus(
              (result.data && result.data.message) ||
                "Something went wrong. Please call us at (224) 424-9573.",
              "error",
            );
          }
        })
        .catch(function () {
          setStatus(
            "Network error — please try again, or call us at (224) 424-9573.",
            "error",
          );
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = btnDefaultText;
        });
    });
  }
})();
