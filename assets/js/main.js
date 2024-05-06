(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Mobile nav dropdowns activate
   */
  on(
    "click",
    ".navbar .dropdown > a",
    function (e) {
      if (select("#navbar").classList.contains("navbar-mobile")) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle("dropdown-active");
      }
    },
    true
  );

  /**
   * Hero carousel indicators
   */
  let heroCarouselIndicators = select("#hero-carousel-indicators");
  let heroCarouselItems = select("#heroCarousel .carousel-item", true);

  heroCarouselItems.forEach((item, index) => {
    index === 0
      ? (heroCarouselIndicators.innerHTML +=
          "<li data-bs-target='#heroCarousel' data-bs-slide-to='" +
          index +
          "' class='active'></li>")
      : (heroCarouselIndicators.innerHTML +=
          "<li data-bs-target='#heroCarousel' data-bs-slide-to='" +
          index +
          "'></li>");
  });

  /* 
  Hero carousel stop change on click
  */
  document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.getElementById("heroCarousel");
    const carouselPauseButton = document.getElementById("carouselPauseButton");

    let carouselInterval;
    let isPaused = false;
    let totalSlides = carousel.querySelectorAll(".carousel-item").length; // Count slides

    const startCarousel = () => {
      carouselInterval = setInterval(() => {
        bootstrap.Carousel.getInstance(carousel).next();
      }, 5000);
    };

    const pauseCarousel = () => {
      clearInterval(carouselInterval);
      carousel.setAttribute("data-bs-pause", "true");
    };

    carouselPauseButton.addEventListener("click", () => {
      if (isPaused) {
        startCarousel();
        carouselPauseButton.textContent = "Pause";
      } else {
        pauseCarousel();
        carouselPauseButton.textContent = "Resume";
      }
      isPaused = !isPaused;
    });

    const currentSlideIndex = () =>
      bootstrap.Carousel.getInstance(carousel).slideIndex;

    carousel.addEventListener("scroll", () => {
      // Listen to carousel scroll event
      if (currentSlideIndex() === totalSlides - 1) {
        pauseCarousel();
      }
    });

    startCarousel();
  });

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  /*
   * Validate Form
   */
  document.addEventListener("DOMContentLoaded", function () {
    // Get form elements
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const messageInput = document.querySelector("textarea[name='message']");

    // Add event listeners
    nameInput.addEventListener("input", function () {
      validateName();
      enforceMaxLength(this, 100);
    });

    phoneInput.addEventListener("input", function () {
      validatePhone();
      enforceMaxLength(this, 10);
    });

    messageInput.addEventListener("input", function () {
      enforceMaxLength(this, 300);
    });

    // Function to enforce maximum length
    function enforceMaxLength(element, maxLength) {
      if (element.value.length > maxLength) {
        element.value = element.value.slice(0, maxLength);
      }
    }

    // Function to validate name
    function validateName() {
      const regex = /^[a-zA-Z. ]*$/;
      if (!regex.test(nameInput.value)) {
        displayErrorMessage(
          nameInput,
          "This field allows only letters, space, and dots for upper and lower case letters."
        );
      } else {
        removeErrorMessage(nameInput);
      }
    }

    // Function to validate phone number
    function validatePhone() {
      const regex = /^[0-9()+]*$/;
      if (!regex.test(phoneInput.value)) {
        displayErrorMessage(
          phoneInput,
          "This field allows only numbers and special characters like +, (, and )."
        );
      } else {
        removeErrorMessage(phoneInput);
      }
    }

    // Function to display error message
    function displayErrorMessage(element, message) {
      let errorMessageElement = element.nextElementSibling;
      if (
        !errorMessageElement ||
        !errorMessageElement.classList.contains("error-message")
      ) {
        errorMessageElement = document.createElement("div");
        errorMessageElement.classList.add("error-message");
        element.parentNode.insertBefore(
          errorMessageElement,
          element.nextSibling
        );
      }
      errorMessageElement.textContent = message;
    }

    // Function to remove error message
    function removeErrorMessage(element) {
      let errorMessageElement = element.nextElementSibling;
      if (
        errorMessageElement &&
        errorMessageElement.classList.contains("error-message")
      ) {
        errorMessageElement.remove();
      }
    }

    // Email validation function
    function validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }

    // Example of using email validation
    const emailForm = document.querySelector(".email-form");
    emailForm.addEventListener("submit", function (event) {
      const emailInput = document.getElementById("email");
      const email = emailInput.value.trim();
      if (!validateEmail(email)) {
        event.preventDefault();
        displayErrorMessage(emailInput, "Please enter a valid email address.");
      } else {
        removeErrorMessage(emailInput);
      }
    });
  });
})();
