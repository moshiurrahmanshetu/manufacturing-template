/**
 * Vanguard Industrial & Manufacturing Company HTML Template
 * Premium JS Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initStickyHeader();
  initStatsCounter();
  initProjectsFilter();
  initBackToTop();
  initHeroCaptionAnimations();
  initTeamInteractions();
  initGalleryFilter();
  initGalleryLightbox();
  initGalleryMouseParallax();
});

/* ========================================================
   1. DAY / NIGHT THEME TOGGLE (DESKTOP & MOBILE)
   ======================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const toggleBtnMobile = document.getElementById('themeToggleMobile');
  if (!toggleBtn && !toggleBtnMobile) return;

  // Check local storage or system preferences
  const currentTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  // Apply initial theme
  setTheme(currentTheme);

  [toggleBtn, toggleBtnMobile].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
      });
    }
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    [toggleBtn, toggleBtnMobile].forEach(btn => {
      if (btn) {
        const icon = btn.querySelector('i');
        if (icon) {
          if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            btn.setAttribute('title', 'Switch to Light Mode');
          } else {
            icon.className = 'fa-solid fa-moon';
            btn.setAttribute('title', 'Switch to Dark Mode');
          }
        }
      }
    });
  }
}

/* ========================================================
   2. STICKY HEADER & NAVBAR SHRINK
   ======================================================== */
function initStickyHeader() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Initial check on load
  handleScroll();
}

/* ========================================================
   3. ANIMATED STATISTICS COUNTER
   ======================================================== */
function initStatsCounter() {
  const statsSection = document.getElementById('statsSection');
  if (!statsSection) return;

  const counterElements = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animateCounters();
        animated = true;
        observer.unobserve(statsSection);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(statsSection);

  function animateCounters() {
    counterElements.forEach(el => {
      const targetStr = el.getAttribute('data-target');
      // Extract numeric value and suffix (like '+' or '%')
      const targetNum = parseInt(targetStr.replace(/[^0-9]/g, ''), 10);
      const suffix = targetStr.replace(/[0-9]/g, '');
      
      const duration = 2000; // 2 seconds
      const start = 0;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function outQuad
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * targetNum);
        
        el.textContent = currentValue + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = targetStr; // Ensure precise final state
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }
}

/* ========================================================
   4. PROJECTS FILTER GALLERY
   ======================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-grid-item-wrap');

  if (filterBtns.length === 0 || projectItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const projectItemInner = item.querySelector('.project-grid-item');
        const projectCategory = projectItemInner.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === projectCategory) {
          // Show with layout transition
          item.style.display = 'block';
          // Force reflow
          void item.offsetHeight;
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          // Hide with smooth fade out
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          // Delay display none slightly to allow animation
          setTimeout(() => {
            if (btn.getAttribute('data-filter') !== 'all' && btn.getAttribute('data-filter') !== projectCategory) {
              item.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
}

/* ========================================================
   5. BACK TO TOP SCROLL
   ======================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ========================================================
   6. HERO CAROUSEL CAPTION ANIMATIONS RESET
   ======================================================== */
function initHeroCaptionAnimations() {
  const heroCarousel = document.getElementById('heroCarousel');
  if (!heroCarousel) return;

  // On slide transition, we re-trigger animation styles on active elements
  heroCarousel.addEventListener('slide.bs.carousel', (event) => {
    const nextItem = event.relatedTarget;
    const animatedElements = nextItem.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-btns');
    
    animatedElements.forEach(el => {
      // Remove animation and restart it
      el.style.animation = 'none';
      // Trigger a reflow
      void el.offsetHeight;
      el.style.animation = '';
    });
  });
}

/* ========================================================
   7. PREMIUM TEAM PAGE INTERACTION LOOPS
   ======================================================== */
function initTeamInteractions() {
  // 7.1. Animated Progress Bars via Intersection Observer
  const progressFills = document.querySelectorAll('.skill-progress-bar-fill');
  if (progressFills.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetWidth = el.getAttribute('data-width') || '0';
          el.style.width = targetWidth + '%';
          observer.unobserve(el); // Animate once
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    progressFills.forEach(fill => observer.observe(fill));
  }

  // 7.2. 3D Mouse Move Tilt Effect on Team Cards (Premium ThemeForest feel)
  const tiltCards = document.querySelectorAll('.team-card-premium');
  if (window.innerWidth > 991 && tiltCards.length > 0) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Max tilt of 6 degrees for organic professional look
        const tiltX = ((centerY - y) / centerY) * 6;
        const tiltY = ((x - centerX) / centerX) * 6;
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });
  }
}

/* ========================================================
   8. PREMIUM GALLERY FILTERING (VANILLA JS)
   ======================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid-item-wrap');

  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === itemCategory) {
          // Show with layout transition
          item.style.display = 'block';
          // Force reflow
          void item.offsetHeight;
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          // Hide with smooth fade out
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          // Delay display none slightly to allow animation
          setTimeout(() => {
            if (btn.getAttribute('data-filter') !== 'all' && btn.getAttribute('data-filter') !== itemCategory) {
              item.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
}

/* ========================================================
   9. FILTERING-AWARE PREMIUM LIGHTBOX GALLERY
   ======================================================== */
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxCat = lightbox.querySelector('.lightbox-cat');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');
  const prevBtn = lightbox.querySelector('.lightbox-prev-btn');
  const nextBtn = lightbox.querySelector('.lightbox-next-btn');

  let visibleCards = [];
  let currentIndex = 0;

  // Function to gather only currently visible cards (filtering-aware)
  function updateVisibleCards() {
    const allCards = document.querySelectorAll('.gallery-grid-item-wrap');
    visibleCards = Array.from(allCards).filter(item => {
      return window.getComputedStyle(item).display !== 'none';
    });
  }

  // Open Lightbox
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.gallery-zoom-btn');
    if (!trigger) return;

    e.preventDefault();
    updateVisibleCards();

    const currentItemWrap = trigger.closest('.gallery-grid-item-wrap');
    currentIndex = visibleCards.indexOf(currentItemWrap);

    if (currentIndex > -1) {
      openLightbox(currentIndex);
    }
  });

  function openLightbox(index) {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop page scrolling
    loadSlide(index);
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxImg) {
      lightboxImg.classList.remove('loaded');
      lightboxImg.src = '';
    }
  }

  function loadSlide(index) {
    if (!visibleCards[index] || !lightboxImg) return;

    lightboxImg.classList.remove('loaded');
    
    const card = visibleCards[index].querySelector('.gallery-card');
    const imgSrc = card.querySelector('.gallery-img-container img').src;
    const titleText = card.querySelector('.gallery-card-title').textContent.trim();
    const catText = card.querySelector('.gallery-category-badge').textContent.trim();

    // Set content
    lightboxImg.src = imgSrc;
    if (lightboxTitle) lightboxTitle.textContent = titleText;
    if (lightboxCat) lightboxCat.textContent = catText;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${index + 1} of ${visibleCards.length}`;
    }

    lightboxImg.onload = () => {
      lightboxImg.classList.add('loaded');
    };
  }

  function nextSlide() {
    if (visibleCards.length <= 1) return;
    currentIndex = (currentIndex + 1) % visibleCards.length;
    loadSlide(currentIndex);
  }

  function prevSlide() {
    if (visibleCards.length <= 1) return;
    currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
    loadSlide(currentIndex);
  }

  // Event Listeners
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Close when clicking outside the content area
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-container')) {
      closeLightbox();
    }
  });

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}

/* ========================================================
   10. MOUSE MOVE PARALLAX ON FEATURED IMAGES
   ======================================================== */
function initGalleryMouseParallax() {
  const parallaxContainers = document.querySelectorAll('.gallery-parallax-container');
  if (window.innerWidth < 992 || parallaxContainers.length === 0) return;

  parallaxContainers.forEach(container => {
    const target = container.querySelector('.gallery-parallax-target');
    if (!target) return;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Parallax shifts (deliberately kept gentle and elegant)
      const moveX = ((x - centerX) / centerX) * 15; // Max 15px shift
      const moveY = ((y - centerY) / centerY) * 15;

      target.style.transform = `scale(1.05) translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    container.addEventListener('mouseleave', () => {
      target.style.transform = `scale(1) translate3d(0, 0, 0)`;
    });
  });
}

