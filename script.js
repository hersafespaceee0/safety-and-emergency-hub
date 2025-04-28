const toggleButton = document.querySelector(".menu-toggle");
const navMenu = document.getElementById("navMenu");
const navLinks = navMenu.querySelectorAll("a");
const closeBtn = navMenu.querySelector(".close-menu");

toggleButton.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

closeBtn.addEventListener("click", () => {
  navMenu.classList.remove("active");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});
