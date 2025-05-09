document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const closeMenu = document.getElementById("close-menu");
  const navMenu = document.getElementById("nav-menu");

  menuToggle.addEventListener("click", () => {
    navMenu.classList.add("active");
  });

  closeMenu.addEventListener("click", () => {
    console.log("Close button clicked");
    navMenu.classList.remove("active");
  });
});
//sign up/login in modal
function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
// Optional: Close when clicking outside the modal
window.onclick = function (event) {
  const login = document.getElementById("loginModal");
  const signup = document.getElementById("signupModal");
  if (event.target === login) login.style.display = "none";
  if (event.target === signup) signup.style.display = "none";
};
