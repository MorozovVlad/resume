const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const isMobile = window.innerWidth <= 768;
  if (scrollTop === 0) {
    nav.classList.remove("to-left");
    nav.classList.remove("hidden");
  } else {
    if (isMobile) {
      nav.classList.add("hidden");
    }else{
      nav.classList.add("to-left");
    }    
  }
});
