// script.js

/* ============================================================
   BACK TO TOP — Fixed Implementation
   ============================================================ */
(function() {
  const backToTopBtn = document.getElementById('backToTop');
  
  if (!backToTopBtn) {
    console.warn('Back-to-top button not found in DOM');
    return;
  }

  // Toggle visibility based on scroll position
  function toggleBackToTop() {
    if (window.scrollY > 300 || document.documentElement.scrollTop > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  // Scroll to top smoothly
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Attach listeners
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  backToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    scrollToTop();
  });

  // Run once on load in case the page starts scrolled
  toggleBackToTop();
})();

/* ============================================================
   NAVBAR — Scroll shadow effect
   ============================================================ */
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 30px rgba(13, 148, 136, 0.12)';
  } else {
    navbar.style.boxShadow = '0 2px 20px rgba(13, 148, 136, 0.06)';
  }
}, { passive: true });

/* ============================================================
   ACTIVE NAV LINK — Highlights based on section in view
   ============================================================ */
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', function() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
})();

/* ============================================================
   SMOOTH SCROLL — For anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        new bootstrap.Collapse(navbarCollapse).hide();
      }
    }
  });
});

/* ============================================================
   FAB (Floating Action Button) — Toggle options
   ============================================================ */
(function() {
  const fabMain = document.getElementById('fabMain');
  const fabOptions = document.getElementById('fabOptions');

  if (!fabMain || !fabOptions) return;

  function closeFab() {
    fabOptions.classList.remove('show');
    fabMain.classList.remove('active');
    fabMain.setAttribute('aria-expanded', 'false');
    fabMain.innerHTML = '<i class="fas fa-headset"></i>';
  }

  function openFab() {
    fabOptions.classList.add('show');
    fabMain.classList.add('active');
    fabMain.setAttribute('aria-expanded', 'true');
    fabMain.innerHTML = '<i class="fas fa-times"></i>';
  }

  fabMain.addEventListener('click', function(e) {
    e.stopPropagation();
    if (fabOptions.classList.contains('show')) {
      closeFab();
    } else {
      openFab();
    }
  });

  document.addEventListener('click', function(e) {
    if (!fabMain.contains(e.target) && !fabOptions.contains(e.target)) {
      if (fabOptions.classList.contains('show')) closeFab();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && fabOptions.classList.contains('show')) {
      closeFab();
    }
  });
})();

/* ============================================================
   FLOATING BADGES — Extra animation variation
   ============================================================ */
document.querySelectorAll('.floating-badge').forEach((badge, index) => {
  badge.style.animationDelay = `${index * 1.2}s`;
});

/* ============================================================
   COUNTERS — Animate stat numbers on scroll
   ============================================================ */
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const stepTime = 16;
  const steps = duration / stepTime;
  const increment = target / steps;

  function update() {
    start += increment;
    if (start >= target) {
      element.textContent = target + (element.dataset.suffix || '');
      return;
    }
    if (target >= 1000) {
      element.textContent = Math.floor(start / 1000) + 'K+';
    } else if (element.dataset.suffix === '%') {
      element.textContent = Math.floor(start) + '%';
    } else {
      element.textContent = Math.floor(start) + (element.dataset.suffix || '');
    }
    requestAnimationFrame(update);
  }
  update();
}

(function() {
  const statNumbers = document.querySelectorAll('.about-stat .stat-number');
  if (!statNumbers.length) return;

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();

        if (!el.dataset.original) {
          el.dataset.original = text;
        }

        let number = parseFloat(text.replace(/[^0-9.]/g, ''));
        let suffix = '';

        if (text.includes('K+')) {
          number = number * 1000;
          suffix = 'K+';
        } else if (text.includes('%')) {
          suffix = '%';
        } else if (text.includes('+')) {
          suffix = '+';
        } else if (text.includes('/')) {
          statObserver.unobserve(el);
          return;
        }

        if (!isNaN(number) && number > 0 && number < 10000) {
          el.dataset.suffix = suffix;
          animateCounter(el, number, 2000);
        }

        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => statObserver.observe(stat));
})();

/* ============================================================
   PARALLAX — Hero floating badges follow the mouse
   ============================================================ */
document.addEventListener('mousemove', function(e) {
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroVisual) return;

  const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  const mouseY = (e.clientY / window.innerHeight) * 2 - 1;

  const badges = document.querySelectorAll('.floating-badge');
  badges.forEach((badge, index) => {
    const speed = 8 + index * 4;
    const x = mouseX * speed;
    const y = mouseY * speed;
    badge.style.transform = `translate(${x}px, ${y}px)`;
    badge.style.transition = 'transform 0.1s ease-out';
  });
});

/* ============================================================
   SCROLL REVEAL — Fade up cards on scroll
   ============================================================ */
(function() {
  const revealElements = document.querySelectorAll('.service-card, .about-stat, .cta-visual, .about-img');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });
})();

/* ============================================================
   CONSOLE WELCOME
   ============================================================ */
console.log('%c🛡️ CyberGuard — Advanced Cybersecurity', 'font-size: 20px; font-weight: bold; color: #0d9488;');
console.log('%cProtecting your digital world with AI-powered security.', 'font-size: 14px; color: #4b6b6d;');