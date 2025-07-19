const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  if (scrollTop === 0) {
    // в самом верху — меню сверху
    nav.classList.remove("to-left");
  } else {
    // скролл хотя бы на 1px — меню уходит влево
    nav.classList.add("to-left");
  }
});
