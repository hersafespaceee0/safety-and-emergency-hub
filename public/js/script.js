document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const closeMenu = document.getElementById("close-nav");
  const navMenu = document.getElementById("nav-menu");

  if (menuToggle && closeMenu && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.add("active");
      menuToggle.setAttribute("aria-expanded", "true");
    });

    closeMenu.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });

    document
      .querySelectorAll(".nav-items a, .auth-buttons button")
      .forEach((item) => {
        item.addEventListener("click", () => {
          navMenu.classList.remove("active");
          menuToggle.setAttribute("aria-expanded", "false");
        });
      });
  }
});

function openModal(idOrType) {
  // Handle single modal with login/signup forms (volunteer.html, alerts.html)
  const authModal = document.getElementById("authModal");
  if (authModal) {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    authModal.style.display = "flex";
    if (idOrType === "signup") {
      loginForm.classList.remove("active");
      signupForm.classList.add("active");
    } else {
      signupForm.classList.remove("active");
      loginForm.classList.add("active");
    }
    return;
  }

  // Handle separate modals (homepage)
  const modal = document.getElementById(idOrType);
  if (modal) {
    modal.style.display = "flex";
  } else {
    window.location.href = "/";
  }
}

function closeModal(id) {
  // Handle single modal (volunteer.html, alerts.html)
  const authModal = document.getElementById("authModal");
  if (authModal && !id) {
    authModal.style.display = "none";
    return;
  }

  // Handle separate modals (homepage)
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "none";
  }
}

function toggleForm(formType) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  if (loginForm && signupForm) {
    if (formType === "signup") {
      loginForm.classList.remove("active");
      signupForm.classList.add("active");
    } else {
      signupForm.classList.remove("active");
      loginForm.classList.add("active");
    }
  }
}

// Close modal on outside click
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
