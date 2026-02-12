document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const year = document.getElementById("year");
  const themeToggle = document.getElementById("theme-toggle");
  const recruiterToggle = document.getElementById("recruiter-toggle");

  if (year) year.textContent = new Date().getFullYear();

  const savedTheme = localStorage.getItem("portfolio_theme");
  if (savedTheme === "light" || savedTheme === "dark") root.setAttribute("data-theme", savedTheme);

  const savedRecruiterMode = localStorage.getItem("portfolio_recruiter_mode");
  if (savedRecruiterMode === "on" || savedRecruiterMode === "off") {
    root.setAttribute("data-recruiter", savedRecruiterMode);
  }

  const syncThemeIcon = () => {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector("i");
    const isLight = root.getAttribute("data-theme") === "light";
    if (icon) icon.className = isLight ? "fa-solid fa-sun" : "fa-solid fa-moon";
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  };

  const syncRecruiterState = () => {
    if (!recruiterToggle) return;
    const isOn = root.getAttribute("data-recruiter") === "on";
    recruiterToggle.textContent = isOn ? "Recruiter Mode: On" : "Recruiter Mode: Off";
    recruiterToggle.classList.toggle("active", isOn);
    recruiterToggle.setAttribute("aria-pressed", String(isOn));
  };

  syncThemeIcon();
  syncRecruiterState();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", nextTheme);
      localStorage.setItem("portfolio_theme", nextTheme);
      syncThemeIcon();
    });
  }

  if (recruiterToggle) {
    recruiterToggle.addEventListener("click", () => {
      const nextMode = root.getAttribute("data-recruiter") === "on" ? "off" : "on";
      root.setAttribute("data-recruiter", nextMode);
      localStorage.setItem("portfolio_recruiter_mode", nextMode);
      syncRecruiterState();
    });
  }

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navAnchors = document.querySelectorAll(".nav-links a");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navAnchors.forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const sections = document.querySelectorAll("main section[id]");
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
  );
  sections.forEach((s) => spyObserver.observe(s));

  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  const typedRole = document.getElementById("typed-role");
  const roles = [
    "Data Science model building and experimentation",
    "Machine Learning deployment and optimization",
    "Cloud-based AI systems on AWS",
    "GenAI and RAG workflow development",
  ];

  if (typedRole) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeLoop = () => {
      const current = roles[roleIndex];
      if (!isDeleting) {
        typedRole.textContent = current.slice(0, charIndex + 1);
        charIndex += 1;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeLoop, 1200);
          return;
        }
      } else {
        typedRole.textContent = current.slice(0, charIndex - 1);
        charIndex -= 1;
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, isDeleting ? 30 : 58);
    };
    typeLoop();
  }

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const show = filter === "all" || (card.dataset.category || "").includes(filter);
        card.style.display = show ? "grid" : "none";
      });
    });
  });

  const extraCerts = document.querySelectorAll(".extra-cert");
  const toggleCerts = document.getElementById("toggle-certs");
  if (toggleCerts && extraCerts.length > 0) {
    let expanded = false;
    toggleCerts.addEventListener("click", () => {
      expanded = !expanded;
      extraCerts.forEach((card) => {
        card.style.display = expanded ? "block" : "none";
      });
      toggleCerts.textContent = expanded ? "Show Less" : "Show More";
    });
  }

  const modalHandles = [
    {
      openBtn: document.getElementById("open-resume-modal"),
      modal: document.getElementById("resume-modal"),
      closeBtn: document.getElementById("close-resume-modal"),
    },
    {
      openBtn: document.getElementById("view-cert-gallery"),
      modal: document.getElementById("cert-gallery-modal"),
      closeBtn: document.getElementById("close-cert-gallery"),
    },
  ];

  let activeModal = null;
  let lastFocusedElement = null;

  const getFocusable = (container) => {
    if (!container) return [];
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    );
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    activeModal = null;
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  const openModal = (modal) => {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    activeModal = modal;
    const focusable = getFocusable(modal);
    if (focusable.length > 0) focusable[0].focus();
  };

  modalHandles.forEach(({ openBtn, modal, closeBtn }) => {
    if (openBtn && modal) openBtn.addEventListener("click", () => openModal(modal));
    if (closeBtn && modal) closeBtn.addEventListener("click", () => closeModal(modal));
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeModal) {
      closeModal(activeModal);
      return;
    }

    if (e.key === "Tab" && activeModal) {
      const focusable = getFocusable(activeModal);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  const form = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");
  const submitBtn = document.getElementById("submit-btn");

  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "Name must be at least 2 characters."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address."),
    subject: (v) => (v.trim().length >= 3 ? "" : "Subject must be at least 3 characters."),
    message: (v) => (v.trim().length >= 10 ? "" : "Message must be at least 10 characters."),
  };

  const validateField = (field) => {
    const wrapper = field.closest(".field");
    const errorEl = wrapper ? wrapper.querySelector(".error") : null;
    const validate = validators[field.name];
    if (!validate) return true;

    const error = validate(field.value);
    if (wrapper) wrapper.classList.toggle("invalid", Boolean(error));
    if (errorEl) errorEl.textContent = error;
    return !error;
  };

  if (form) {
    const fields = form.querySelectorAll("input, textarea");
    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.closest(".field")?.classList.contains("invalid")) validateField(field);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      fields.forEach((f) => {
        if (!validateField(f)) valid = false;
      });

      if (!valid) {
        if (formNote) formNote.textContent = "Please correct the highlighted fields.";
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (formNote) formNote.textContent = "Preparing your email draft...";

      const data = new FormData(form);
      const name = encodeURIComponent(String(data.get("name") || ""));
      const email = encodeURIComponent(String(data.get("email") || ""));
      const subject = encodeURIComponent(String(data.get("subject") || ""));
      const message = encodeURIComponent(String(data.get("message") || ""));
      const body = `Name: ${name}%0AEmail: ${email}%0A%0A${message}`;

      setTimeout(() => {
        window.location.href = `mailto:shreyanshj5067@gmail.com?subject=${subject}&body=${body}`;
        if (formNote) formNote.textContent = "Email draft opened in your mail app.";
        form.reset();
        if (submitBtn) submitBtn.disabled = false;
      }, 300);
    });
  }
});
