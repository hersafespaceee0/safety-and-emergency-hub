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

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "flex";
  } else {
    window.location.href = "/"; // Redirect to homepage if modal not found
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "none";
  }
}

function openLoginModal() {
  openModal("loginModal");
}

function openSignupModal() {
  openModal("signupModal");
}
// Close modal on outside click
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
