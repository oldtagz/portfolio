const app = {
  // constant
  numberOfImages: 10,

  // image
  get image() {
    return parseInt(localStorage.getItem("image")) || 1;
  },
  set image(image) {
    localStorage.setItem("image", image);

    if (image < 1) app.image = app.numberOfImages;
    else if (image > app.numberOfImages) app.image = 1;
    else app.page = "image";
  },

  // page
  get page() {
    return localStorage.getItem("page") || "image";
  },
  set page(page) {
    app.overlay = "";
    setActiveButton(page);
    document.getElementById("info-button").disabled = page === "index";

    const infoClient = document.getElementById("info-client");
    const infoProject = document.getElementById("info-project");
    const infoCredits = document.getElementById("info-credits");

    if (page === "video") {
      infoClient.innerHTML = "Partout Partout Collectif";
      infoProject.innerHTML =
        "Video Shoot for Claus<br>Cam: Sony A7IV<br>Objectiv: Sony FE 35mm 1.4, Sony FE 24mm 1.4";
      infoCredits.innerHTML =
        "Extra: Mia, Emma, Zoe, Lua<br>Organisation: Partout Partout Collectif";

      animate({
        element: document.getElementById("video-button"),
        animationClass: "slide-out",
        duration: 1000,
      });
      animate({
        element: document.getElementById("video"),
        animationClass: "slide-in",
        duration: 1000,
      });
    } else {
      const isNewPage = app.page !== page;

      if (isNewPage)
        for (const element of document.querySelector(
          "main > section:not(.hidden)"
        ).children)
          animate({ element, animationClass: "out" });

      if (page === "image") {
        const modelDesigner = app.image > 5 ? "Skye" : "Kim";
        infoClient.innerHTML = "Tripity Lab";
        infoProject.innerHTML =
          "Portrait Shoot for UFS<br>Cam: Sony A7IV<br>Objectiv: Sigma dgdn 35mm 1.4";
        infoCredits.innerHTML = `Model: ${modelDesigner}<br>Organisation: Tripity-Kollektiv<br>Designer: ${modelDesigner}`;

        const imageEl = document.querySelector("#image img");
        imageEl.src = `photos/${app.image}.jpg`;
        imageEl.alt = `Portrait ${app.image}`;
        imageEl.onload = () => (imageEl.classList = "enter");
      }

      setTimeout(
        () => {
          for (const element of document.querySelectorAll("main > section")) {
            if (element.id === page) element.classList = "";
            else if (
              element.id === "video" &&
              !element.classList.contains("hidden")
            )
              animate({
                element,
                animationClass: "slide-out",
                afterAnimationClass: "hidden",
                duration: 1000,
              });
            else element.classList = "hidden";
          }
          if (isNewPage && page === "index")
            for (const element of document.getElementById(page).children)
              animate({ element, animationClass: "enter" });
        },
        isNewPage ? 500 : 0
      );
      localStorage.setItem("page", page);
    }
  },

  // overlay
  get overlay() {
    return localStorage.getItem("overlay");
  },
  set overlay(overlay) {
    setActiveButton(overlay);
    const dialog = document.querySelector("dialog");
    const isDialogOpen = dialog.open;

    if (overlay && app.overlay !== overlay) {
      for (const element of dialog.children)
        if (element.id !== overlay)
          animate({
            element,
            animationClass: "disappear",
            afterAnimationClass: "hidden",
            duration: isDialogOpen ? undefined : 0,
          });
        else
          animate({
            element,
            animationClass: "appear",
            duration: isDialogOpen ? undefined : 0,
            delay: isDialogOpen ? 500 : 0,
          });

      if (!isDialogOpen) {
        animate({
          element: dialog,
          animationClass: "appear",
          after: () => (dialog.open = true),
        });
        animate({
          element: document.getElementById("close-button"),
          animationClass: "appear",
        });
      }
    } else if (!overlay && isDialogOpen) {
      animate({
        element: dialog,
        animationClass: "disappear",
        afterAnimationClass: "hidden",
        after: () => (dialog.open = false),
      });
      animate({
        element: document.getElementById("close-button"),
        animationClass: "disappear",
        afterAnimationClass: "invisible",
      });
    }

    localStorage.setItem("overlay", overlay || "");
  },

  // cursor on image page
  get cursor() {
    return document.getElementById("cursor");
  },
  set cursor(event) {
    // only show cursor on desktop
    if (
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    )
      if (event && event.target) {
        const text = event.target.id === "next" ? "NEXT" : "PREVIOUS";

        let cursor = app.cursor;
        if (!cursor) {
          cursor = document.createElement("span");
          cursor.id = "cursor";
          cursor.hidden = true;
          document.body.appendChild(cursor);
        }
        cursor.innerHTML = text;

        const setCursorPosition = (event) => {
          setTimeout(() => {
            if (cursor.hidden) cursor.hidden = false;
            cursor.style.top = `${event.clientY + 15}px`;
            cursor.style.left = `${
              event.clientX - (event.target.id === "next" ? 25 : 40)
            }px`;
          }, 100);
        };

        setCursorPosition(event);
        document.onmousemove = setCursorPosition;
      } else if (app.cursor) {
        app.cursor.remove();
        delete document.onmousemove;
      }
  },

  // theme
  get theme() {
    return localStorage.getItem("theme") || "white";
  },
  set theme(theme) {
    const invertedTheme = theme === "black" ? "white" : "black";

    document.body.classList = theme;
    document.getElementById(theme).innerHTML = "•";
    document.getElementById(invertedTheme).innerHTML = "-";

    localStorage.setItem("theme", theme);
  },
};

// helper function to set active button
const setActiveButton = (name) => {
  for (const button of document.querySelectorAll("nav button"))
    if (button.id === `${name}-button`)
      animate({
        element: button,
        animationClass: "active",
        afterAnimationClass: "active",
      });
    else button.classList = "";
};
// animation helper function
const animate = ({
  element,
  animationClass,
  afterAnimationClass,
  duration,
  delay,
  after,
}) =>
  setTimeout(() => {
    element.classList = animationClass;
    setTimeout(
      () => {
        element.classList = afterAnimationClass || "";
        if (after) after();
      },
      isFinite(duration) ? duration : 500
    );
  }, delay || 0);

// initialize app on load
(() => {
  app.page = app.page;
  app.theme = app.theme;
  app.overlay = "";

  // add images to index page
  document.body.onload = () => {
    let images = [];
    for (let i = 1; i <= app.numberOfImages; i++) {
      const div = document.createElement("div");
      div.innerHTML = `<img class="hidden" src="photos/${i}.jpg" alt="Portrait ${i}" onclick="app.image = ${i}" onload="this.classList = 'enter'" />`;
      images.push(div);
    }
    document.getElementById("index").append(...images);
  };
})();
