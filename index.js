// ===============================
// PRELOADER
// ===============================
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  preloader.classList.add("hide-preloader");

  setTimeout(() => {
    preloader.style.display = "none";
  }, 800);
});

// ===============================
// MOBILE MENU TOGGLE
// ===============================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuToggle.classList.toggle("open");
});

// Close menu on link click (for mobile)
document.querySelectorAll(".nav-link").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle.classList.remove("open");
  })
);

// ===============================
// STICKY NAVBAR
// ===============================
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  navbar.classList.toggle("sticky", window.scrollY > 50);
});

// ===============================
// SCROLL TO TOP BUTTON
// ===============================
const scrollTopBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  scrollTopBtn.classList.toggle("show", window.scrollY > 400);
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===============================
// STATS COUNT UP ANIMATION
// ===============================
const statNumbers = document.querySelectorAll(".stat-number");
let statsPlayed = false;

function animateStats() {
  if (statsPlayed) return;

  const section = document.querySelector(".hero-stats");
  const position = section.getBoundingClientRect().top;

  if (position < window.innerHeight - 100) {
    statsPlayed = true;

    statNumbers.forEach((num) => {
      let countTo = num.getAttribute("data-count");
      let count = 0;

      const updateCounter = () => {
        count += Math.ceil(countTo / 100);
        if (count < countTo) {
          num.innerText = count;
          requestAnimationFrame(updateCounter);
        } else {
          num.innerText = countTo;
        }
      };

      updateCounter();
    });
  }
}
window.addEventListener("scroll", animateStats);

// ===============================
// RESTAURANT FILTERS
// ===============================
const filterBtns = document.querySelectorAll(".filter-btn");
const restaurantCards = document.querySelectorAll(".restaurant-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    restaurantCards.forEach((card) => {
      const category = card.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        card.style.display = "block";
        card.classList.add("fade-in");
      } else {
        card.style.display = "none";
      }
    });
  });
});

// ===============================
// FAVORITE HEART TOGGLE
// ===============================
document.querySelectorAll(".favorite-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const icon = btn.querySelector("i");

    if (btn.classList.contains("active")) {
      icon.classList.replace("far", "fas");
    } else {
      icon.classList.replace("fas", "far");
    }
  });
});

// ===============================
// QUICK ADD TO CART BUTTON
// ===============================
document.querySelectorAll(".quick-add").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.add("added");

    setTimeout(() => {
      btn.classList.remove("added");
    }, 800);
  });
});

// ===============================
// TESTIMONIALS SLIDER
// ===============================
const track = document.getElementById("testimonialsTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const sliderDotsContainer = document.getElementById("sliderDots");

let currentIndex = 0;
const slides = Array.from(track.children);
const totalSlides = slides.length;

// Create slider dots
slides.forEach((_, index) => {
  const dot = document.createElement("span");
  dot.classList.add("dot");
  if (index === 0) dot.classList.add("active");
  sliderDotsContainer.appendChild(dot);

  dot.addEventListener("click", () => goToSlide(index));
});

const dots = document.querySelectorAll(".slider-dots .dot");

function updateSlider() {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentIndex].classList.add("active");
}

function goToSlide(index) {
  currentIndex = index;
  updateSlider();
}

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlider();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlider();
});

// Auto-slide every 5 seconds
setInterval(() => {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlider();
}, 5000);

// ===============================
// NEWSLETTER FORM
// ===============================
document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thanks for subscribing! 🎉");
});

// ===============================
// AOS Animation Init (fallback)
// ===============================
if (window.AOS) {
  AOS.init({
    once: true,
    duration: 1000,
  });
}
