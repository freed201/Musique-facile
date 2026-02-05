/**
 * Animations et Interactions Avancées
 * Améliore l'expérience utilisateur avec des animations fluides
 */

// Intersection Observer pour animations au scroll
class ScrollAnimationManager {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    // Fade In animations
    this.setupFadeInObserver();

    // Parallax effects
    this.setupParallaxEffects();

    // Counter animations
    this.setupCounterAnimations();

    // Smooth scroll
    this.setupSmoothScroll();
  }

  setupFadeInObserver() {
    const fadeElements = document.querySelectorAll(
      '.fade-in, .card, .testimonial, .blog-card, .course-card'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 100);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    fadeElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(el);
    });

    this.observers.set('fadeIn', observer);
  }

  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
      const scrollTop = window.pageYOffset;

      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        const distance = scrollTop - elementTop;
        const translateY = distance * speed;

        el.style.transform = `translateY(${translateY}px)`;
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.counter);
      const duration = parseInt(el.dataset.duration) || 2000;
      const start = 0;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (easeOutExpo)
        const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(start + (target - start) * easing);

        el.textContent = current.toLocaleString('fr-FR');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target.toLocaleString('fr-FR');
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  setupSmoothScroll() {
    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip empty hashes
        if (href === '#' || href === '#!') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    });
  }
}

// Hover Effects Manager
class HoverEffectsManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupCardTilt();
    this.setupMagneticButtons();
    this.setupCursorFollower();
  }

  setupCardTilt() {
    const cards = document.querySelectorAll('.card, .pricing-card, .bento-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  setupMagneticButtons() {
    const buttons = document.querySelectorAll('.cta-button, .pricing-cta, .quiz-cta-button');

    buttons.forEach((button) => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 50;

        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          const moveX = x * strength * 0.3;
          const moveY = y * strength * 0.3;

          button.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-5px)`;
        }
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });
  }

  setupCursorFollower() {
    // Only on desktop
    if (window.innerWidth < 768) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--theme-current);
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.15s ease;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '0.5';
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    // Smooth follow animation
    const animateCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;

      cursorX += dx * 0.15;
      cursorY += dy * 0.15;

      cursor.style.left = cursorX - 10 + 'px';
      cursor.style.top = cursorY - 10 + 'px';

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Scale on clickable elements
    const clickables = document.querySelectorAll('a, button, [role="button"]');
    clickables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
      });
    });
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images
    this.setupLazyLoading();

    // Preload critical resources
    this.preloadCriticalResources();

    // Monitor Core Web Vitals
    this.monitorWebVitals();
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              imageObserver.unobserve(img);
            }
          });
        },
        { rootMargin: '50px' }
      );

      images.forEach((img) => imageObserver.observe(img));
    }
  }

  preloadCriticalResources() {
    // Preload hero image
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImage.src;
      document.head.appendChild(link);
    }
  }

  monitorWebVitals() {
    // Log Core Web Vitals for debugging
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Silently fail if not supported
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Silently fail if not supported
      }
    }
  }
}

// Initialize all managers on DOM ready with performance checks
document.addEventListener('DOMContentLoaded', () => {
  // Détection des préférences utilisateur pour animations réduites
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Détection de la performance du device
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  const hasSlowConnection = navigator.connection &&
    (navigator.connection.effectiveType === 'slow-2g' ||
     navigator.connection.effectiveType === '2g' ||
     navigator.connection.effectiveType === '3g');

  // Initialiser les managers en fonction des capacités
  new PerformanceMonitor(); // Toujours actif

  if (!prefersReducedMotion && !hasSlowConnection) {
    new ScrollAnimationManager();
  }

  if (!isLowEndDevice && !prefersReducedMotion) {
    new HoverEffectsManager();
  }

  // Log pour debug (retiré en production via terser)
  console.log('Animations initialized', {
    reducedMotion: prefersReducedMotion,
    lowEndDevice: isLowEndDevice,
    slowConnection: hasSlowConnection
  });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ScrollAnimationManager,
    HoverEffectsManager,
    PerformanceMonitor
  };
}
