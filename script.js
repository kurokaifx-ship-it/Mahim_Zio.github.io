/* =========================================================
   KAZI MAHIM — MAIN SCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
  ======================================================= */

  const track = document.querySelector(".horizontal-track");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const navButtons = Array.from(document.querySelectorAll(".nav-btn"));

  const currentSlide = document.getElementById("current-slide");
  const totalSlides = document.getElementById("total-slides");

  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  /* =======================================================
     SLIDE COUNT
  ======================================================= */

  if (totalSlides) {
    totalSlides.textContent = slides.length;
  }

  let activeIndex = 0;

  function updateSlide(index) {

    if (!slides.length || !track) return;

    activeIndex = Math.max(
      0,
      Math.min(index, slides.length - 1)
    );

    slides[activeIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });

    navButtons.forEach((button, i) => {
      button.classList.toggle(
        "active",
        i === activeIndex
      );
    });

    if (currentSlide) {
      currentSlide.textContent =
        String(activeIndex + 1).padStart(2, "0");
    }
  }


  /* =======================================================
     NAVIGATION BUTTONS
  ======================================================= */

  navButtons.forEach((button, index) => {

    button.addEventListener("click", () => {
      updateSlide(index);
    });

  });


  /* =======================================================
     KEYBOARD NAVIGATION
  ======================================================= */

  document.addEventListener("keydown", (event) => {

    if (
      event.target.tagName === "INPUT" ||
      event.target.tagName === "TEXTAREA"
    ) {
      return;
    }

    if (
      event.key === "ArrowRight" ||
      event.key === "PageDown"
    ) {

      event.preventDefault();

      updateSlide(activeIndex + 1);

    }

    if (
      event.key === "ArrowLeft" ||
      event.key === "PageUp"
    ) {

      event.preventDefault();

      updateSlide(activeIndex - 1);

    }

    if (event.key === "Home") {

      event.preventDefault();

      updateSlide(0);

    }

    if (event.key === "End") {

      event.preventDefault();

      updateSlide(slides.length - 1);

    }

  });


  /* =======================================================
     MOUSE WHEEL → HORIZONTAL SLIDE
  ======================================================= */

  let wheelLock = false;

  if (track) {

    track.addEventListener(
      "wheel",
      (event) => {

        if (Math.abs(event.deltaY) < 5) return;

        event.preventDefault();

        if (wheelLock) return;

        wheelLock = true;

        if (event.deltaY > 0) {
          updateSlide(activeIndex + 1);
        } else {
          updateSlide(activeIndex - 1);
        }

        setTimeout(() => {
          wheelLock = false;
        }, 650);

      },
      { passive: false }
    );

  }


  /* =======================================================
     TOUCH SWIPE
  ======================================================= */

  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {

    track.addEventListener("touchstart", (event) => {

      touchStartX = event.changedTouches[0].screenX;

    }, { passive: true });


    track.addEventListener("touchend", (event) => {

      touchEndX = event.changedTouches[0].screenX;

      const difference =
        touchStartX - touchEndX;

      if (Math.abs(difference) < 50) return;

      if (difference > 0) {
        updateSlide(activeIndex + 1);
      } else {
        updateSlide(activeIndex - 1);
      }

    }, { passive: true });

  }


  /* =======================================================
     DETECT CURRENT SLIDE WHILE SCROLLING
  ======================================================= */

  if (track) {

    let scrollTimer;

    track.addEventListener("scroll", () => {

      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {

        const index = Math.round(
          track.scrollLeft / window.innerWidth
        );

        if (
          index >= 0 &&
          index < slides.length
        ) {

          activeIndex = index;

          navButtons.forEach((button, i) => {
            button.classList.toggle(
              "active",
              i === activeIndex
            );
          });

          if (currentSlide) {
            currentSlide.textContent =
              String(activeIndex + 1).padStart(2, "0");
          }

        }

      }, 80);

    });

  }


  /* =======================================================
     CUSTOM CURSOR
  ======================================================= */

  if (
    cursorDot &&
    cursorRing &&
    window.matchMedia("(pointer:fine)").matches
  ) {

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;

    document.addEventListener("mousemove", (event) => {

      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorDot.style.left =
        mouseX + "px";

      cursorDot.style.top =
        mouseY + "px";

    });


    function animateCursor() {

      ringX +=
        (mouseX - ringX) * 0.15;

      ringY +=
        (mouseY - ringY) * 0.15;

      cursorRing.style.left =
        ringX + "px";

      cursorRing.style.top =
        ringY + "px";

      requestAnimationFrame(
        animateCursor
      );

    }

    animateCursor();


    document.addEventListener(
      "mouseover",
      (event) => {

        const target =
          event.target.closest(
            "button, a, .interest-item, .click-area"
          );

        if (target) {

          cursorRing.style.width = "52px";
          cursorRing.style.height = "52px";
          cursorRing.style.borderColor = "red";

        }

      }
    );


    document.addEventListener(
      "mouseout",
      (event) => {

        const target =
          event.target.closest(
            "button, a, .interest-item, .click-area"
          );

        if (target) {

          cursorRing.style.width = "34px";
          cursorRing.style.height = "34px";
          cursorRing.style.borderColor =
            "rgba(255,0,0,.75)";

        }

      }
    );

  }


  /* =======================================================
     MAGNETIC BUTTON EFFECT
  ======================================================= */

  const magneticElements =
    document.querySelectorAll(
      ".nav-btn, .game-start, .contact-card"
    );

  magneticElements.forEach((element) => {

    element.addEventListener(
      "mousemove",
      (event) => {

        if (!window.matchMedia("(pointer:fine)").matches) {
          return;
        }

        const rect =
          element.getBoundingClientRect();

        const x =
          event.clientX -
          (rect.left + rect.width / 2);

        const y =
          event.clientY -
          (rect.top + rect.height / 2);

        element.style.transform =
          `translate(${x * 0.12}px, ${y * 0.12}px)`;

      }
    );


    element.addEventListener(
      "mouseleave",
      () => {

        element.style.transform = "";

      }
    );

  });


  /* =======================================================
     IMAGE PARALLAX
  ======================================================= */

  const hero =
    document.querySelector(".hero-slide");

  if (
    hero &&
    window.matchMedia("(pointer:fine)").matches
  ) {

    document.addEventListener(
      "mousemove",
      (event) => {

        const x =
          (event.clientX / window.innerWidth - 0.5);

        const y =
          (event.clientY / window.innerHeight - 0.5);

        hero.style.backgroundPosition =
          `calc(50% + ${x * 18}px) calc(50% + ${y * 18}px)`;

      }
    );

  }


  /* =======================================================
     IMAGE / CARD TILT
  ======================================================= */

  const tiltElements =
    document.querySelectorAll(
      ".interest-item, .contact-card"
    );

  tiltElements.forEach((element) => {

    element.addEventListener(
      "mousemove",
      (event) => {

        if (!window.matchMedia("(pointer:fine)").matches) {
          return;
        }

        const rect =
          element.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        const rotateY =
          ((x / rect.width) - 0.5) * 8;

        const rotateX =
          ((y / rect.height) - 0.5) * -8;

        element.style.transform =
          `perspective(700px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)
           translateY(-4px)`;

      }
    );


    element.addEventListener(
      "mouseleave",
      () => {

        element.style.transform = "";

      }
    );

  });


  /* =======================================================
     RED WATER RIPPLE
  ======================================================= */

  document.addEventListener(
    "pointerdown",
    (event) => {

      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      const ripple =
        document.createElement("span");

      ripple.className =
        "click-ripple";

      ripple.style.left =
        event.clientX + "px";

      ripple.style.top =
        event.clientY + "px";

      const size =
        70 + Math.random() * 45;

      ripple.style.width =
        size + "px";

      ripple.style.height =
        size + "px";

      document.body.appendChild(ripple);

      ripple.addEventListener(
        "animationend",
        () => ripple.remove(),
        { once: true }
      );

    }
  );


  /* =======================================================
     LOADER
  ======================================================= */

  const loader =
    document.getElementById("loader");

  if (loader) {

    setTimeout(() => {

      loader.classList.add("hide");

    }, 1500);

  }


  /* =======================================================
     INITIAL STATE
  ======================================================= */

  updateSlide(0);

});
