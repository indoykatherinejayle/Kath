// Loader
const loader = document.querySelector(".loader");
const menuToggle = document.querySelector(".menu-toggle");
const sideRail = document.querySelector(".side-rail");
const navItems = document.querySelectorAll(".rail-nav a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const skillTiles = document.querySelectorAll(".skill-tile");
const toast = document.querySelector(".toast");
const form = document.querySelector(".contact-form");

// Hide loader after page load
window.addEventListener("load", () => {
  if (loader) loader.classList.add("hidden");
});

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Handle image fallbacks
const profileImg = document.querySelector(".profile-photo");
if (profileImg) {
  const checkImage = () => {
    if (profileImg.complete && profileImg.naturalWidth === 0) {
      profileImg.closest(".portrait-frame")?.classList.add("image-missing");
    }
  };
  profileImg.addEventListener("error", () => {
    profileImg.closest(".portrait-frame")?.classList.add("image-missing");
  });
  checkImage();
}

// Mobile menu toggle
if (menuToggle && sideRail) {
  menuToggle.addEventListener("click", () => {
    const isOpen = sideRail.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      sideRail.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Set active navigation link based on scroll position
function setActiveLink() {
  let currentId = "home";
  const scrollPosition = window.scrollY + 200;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      currentId = section.getAttribute("id");
    }
  });

  if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
    const lastSection = sections[sections.length - 1];
    if (lastSection) currentId = lastSection.getAttribute("id");
  }

  navItems.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${currentId}`);
  });
}

// Reveal animations on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Skill bars animation on scroll
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const level = entry.target.getAttribute("data-level");
        const indicator = entry.target.querySelector("i");
        if (indicator && level && !isNaN(parseInt(level))) {
          indicator.style.width = `${parseInt(level)}%`;
        }
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.35 }
);

skillTiles.forEach((tile) => skillObserver.observe(tile));

// Toast notification function
let toastTimeout;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// Data-toast buttons for "coming soon" messages
document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(button.getAttribute("data-toast"));
  });
});

// Form validation
function setError(input, message) {
  const label = input.closest("label");
  if (label) {
    label.classList.add("error");
    const small = label.querySelector("small");
    if (small) small.textContent = message;
  }
}

function clearError(input) {
  const label = input.closest("label");
  if (label) {
    label.classList.remove("error");
    const small = label.querySelector("small");
    if (small) small.textContent = "";
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const message = form.querySelector("#message");
    let valid = true;

    [name, email, message].forEach(clearError);

    if (!name.value.trim() || name.value.trim().length < 2) {
      setError(name, "Please enter your full name.");
      valid = false;
    }

    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      setError(email, "Please enter a valid email address.");
      valid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      setError(message, "Please write a message with at least 10 characters.");
      valid = false;
    }

    const statusDiv = form.querySelector(".form-status");

    if (!valid) {
      if (statusDiv) {
        statusDiv.textContent = "❌ Please fix the errors above.";
        statusDiv.style.color = "#fda4af";
        setTimeout(() => {
          if (statusDiv.textContent.includes("fix")) statusDiv.textContent = "";
        }, 3000);
      }
      return;
    }

    form.reset();
    if (statusDiv) {
      statusDiv.textContent = "✅ Message sent! I'll get back to you soon.";
      statusDiv.style.color = "var(--mint)";
      setTimeout(() => {
        statusDiv.textContent = "";
      }, 4000);
    }
    showToast("Thank you for reaching out!");
  });
}

// Scroll and resize listeners
window.addEventListener("scroll", setActiveLink);
window.addEventListener("resize", setActiveLink);
setActiveLink();

// Dynamic spotlight effect
window.addEventListener("pointermove", (event) => {
  const x = `${(event.clientX / window.innerWidth) * 100}%`;
  const y = `${(event.clientY / window.innerHeight) * 100}%`;
  document.documentElement.style.setProperty("--spot-x", x);
  document.documentElement.style.setProperty("--spot-y", y);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#" || targetId === "") return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});