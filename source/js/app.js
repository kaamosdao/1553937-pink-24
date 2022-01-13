const app = () => {
  const mainNavButton = document.querySelector(".main-nav__toggle");
  const mainNav = document.querySelector(".main-nav");
  mainNav.classList.remove("main-nav--nojs");
  mainNavButton.addEventListener("click", (e) => {
    e.preventDefault();
    mainNav.classList.toggle("main-nav--closed");
    mainNav.classList.toggle("main-nav--opened");
  });
};

app();
