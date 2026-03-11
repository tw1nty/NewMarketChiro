document.addEventListener('DOMContentLoaded', () => {
  // ===== HEADER SCROLL EFFECT =====
  const header = document.querySelector('.header');
  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ===== MOBILE MENU =====
  const mobileToggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ===== SMOOTH SCROLL FOR NAV LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== INTERSECTION OBSERVER (SCROLL ANIMATIONS) =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  const activateNavLink = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', activateNavLink, { passive: true });

  // ===== REVIEWS CAROUSEL =====
  const reviewsTrack = document.querySelector('.reviews-track');
  if (reviewsTrack) {
    const cards = reviewsTrack.querySelectorAll('.review-card');
    let currentIndex = 0;
    const totalCards = cards.length;

    const getCardsPerView = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    };

    const updateCarousel = () => {
      const cardsPerView = getCardsPerView();
      const maxIndex = Math.max(0, totalCards - cardsPerView);
      if (currentIndex > maxIndex) currentIndex = 0;

      const cardWidth = cards[0].offsetWidth + 24; // 24px gap
      reviewsTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    };

    setInterval(() => {
      const cardsPerView = getCardsPerView();
      const maxIndex = Math.max(0, totalCards - cardsPerView);
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      updateCarousel();
    }, 5000);

    window.addEventListener('resize', updateCarousel);
  }

  // ===== ALERT BANNER =====
  const closeAlert = document.querySelector('.close-alert');
  if (closeAlert) {
    closeAlert.addEventListener('click', () => {
      const banner = closeAlert.closest('.alert-banner');
      banner.style.display = 'none';
    });
  }

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.hero-stat .number');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easeOut * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
});
