/**
 * Animations et Interactions Avancees
 * Phase 5 — Animations staggerees, countUp generalise, section reveals
 * Respecte prefers-reduced-motion et appareils faibles
 */

// ========================================
// Scroll Animation Manager
// ========================================
class ScrollAnimationManager {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    // Section reveal (fade-in + slide-up)
    this.setupSectionReveal();

    // Stagger groups (enfants avec delai incremental)
    this.setupStaggerGroups();

    // Legacy fade-in (cards isolees sans parent stagger)
    this.setupFadeInObserver();

    // Counter animations
    this.setupCounterAnimations();

    // Smooth scroll
    this.setupSmoothScroll();
  }

  // ----------------------------------------
  // T5.4 — Animation d'entree des sections
  // ----------------------------------------
  setupSectionReveal() {
    const sections = document.querySelectorAll('[data-animate="reveal"]');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    sections.forEach((section) => {
      section.classList.add('animate-reveal');
      observer.observe(section);
    });

    this.observers.set('sectionReveal', observer);
  }

  // ----------------------------------------
  // T5.1 — Stagger groups
  // ----------------------------------------
  setupStaggerGroups() {
    const groups = document.querySelectorAll('[data-stagger-group]');
    if (groups.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const group = entry.target;
            const selector = group.dataset.staggerGroup || '> *';
            // Chercher les enfants a animer
            let children;
            if (selector === '> *') {
              children = group.children;
            } else {
              children = group.querySelectorAll(selector);
            }

            Array.from(children).forEach((child, index) => {
              child.style.transitionDelay = `${index * 150}ms`;
              child.classList.add('stagger-visible');
            });

            observer.unobserve(group);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    groups.forEach((group) => {
      const selector = group.dataset.staggerGroup || '> *';
      let children;
      if (selector === '> *') {
        children = group.children;
      } else {
        children = group.querySelectorAll(selector);
      }

      Array.from(children).forEach((child) => {
        child.classList.add('stagger-item');
      });

      observer.observe(group);
    });

    this.observers.set('stagger', observer);
  }

  // ----------------------------------------
  // Legacy fade-in (pour elements isoles)
  // ----------------------------------------
  setupFadeInObserver() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
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
      el.classList.add('animate-reveal');
      observer.observe(el);
    });

    this.observers.set('fadeIn', observer);
  }

  // ----------------------------------------
  // T5.2 — Counter animations (generalise)
  // ----------------------------------------
  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.counter);
      const duration = parseInt(el.dataset.duration) || 2000;
      const suffix = el.dataset.counterSuffix || '';
      const prefix = el.dataset.counterPrefix || '';
      const decimals = parseInt(el.dataset.counterDecimals) || 0;
      const start = 0;
      const startTime = performance.now();

      const formatNumber = (num) => {
        if (decimals > 0) {
          return num.toFixed(decimals).replace('.', ',');
        }
        // Pas de separateurs pour les petits nombres
        if (num >= 1000) {
          return num.toLocaleString('fr-FR');
        }
        return Math.floor(num).toString();
      };

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing: easeOutExpo
        const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = decimals > 0
          ? start + (target - start) * easing
          : Math.floor(start + (target - start) * easing);

        el.textContent = prefix + formatNumber(current) + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = prefix + formatNumber(target) + suffix;
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
    this.observers.set('counters', observer);
  }

  // ----------------------------------------
  // Smooth scroll pour ancres
  // ----------------------------------------
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
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

// ========================================
// Parallax Manager (desktop uniquement)
// ========================================
class ParallaxManager {
  constructor() {
    this.elements = [];
    this.decorElements = [];
    this.ticking = false;
    this.scrollY = 0;
    this.isDesktop = window.innerWidth >= 768;
    this.init();
  }

  init() {
    if (!this.isDesktop) return;

    this.collectElements();
    this.collectDecorElements();

    if (this.elements.length === 0 && this.decorElements.length === 0) return;

    // Set will-change for GPU acceleration
    this.elements.forEach(({ el }) => {
      el.style.willChange = 'transform';
    });
    this.decorElements.forEach(({ el }) => {
      el.style.willChange = 'transform';
    });

    this.scrollY = window.pageYOffset;
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    // Initial render
    this.update();
  }

  collectElements() {
    const els = document.querySelectorAll('[data-parallax-speed]');
    els.forEach((el) => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 0.1;
      const direction = el.dataset.parallaxDirection || 'vertical';
      // Check if the element has CSS animation (e.g. float keyframes)
      const hasAnimation = getComputedStyle(el).animationName !== 'none';
      this.elements.push({ el, speed, direction, hasAnimation });
    });
  }

  collectDecorElements() {
    const els = document.querySelectorAll('[data-parallax-decor]');
    els.forEach((el) => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 0.05;
      this.decorElements.push({ el, speed });
    });
  }

  onScroll() {
    this.scrollY = window.pageYOffset;
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.update();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  onResize() {
    this.isDesktop = window.innerWidth >= 768;
    if (!this.isDesktop) {
      // Reset transforms on mobile
      this.elements.forEach(({ el }) => {
        el.style.transform = '';
        el.style.willChange = '';
      });
      this.decorElements.forEach(({ el }) => {
        el.style.transform = '';
        el.style.willChange = '';
      });
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  update() {
    const viewportHeight = window.innerHeight;

    this.elements.forEach(({ el, speed, direction, hasAnimation }) => {
      const rect = el.getBoundingClientRect();
      // Only animate if element is in or near viewport
      if (rect.bottom < -200 || rect.top > viewportHeight + 200) return;

      const offset = this.scrollY * speed;

      if (hasAnimation) {
        // For elements with CSS keyframe animations, use a CSS variable
        // so the keyframe and parallax can combine
        el.style.setProperty('--parallax-y', `${-offset}px`);
      } else if (direction === 'horizontal') {
        el.style.transform = `translateX(${offset}px)`;
      } else {
        el.style.transform = `translateY(${-offset}px)`;
      }
    });

    this.decorElements.forEach(({ el, speed }) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -300 || rect.top > viewportHeight + 300) return;

      // Decor elements move relative to their section position
      const centerOffset = (rect.top + rect.height / 2 - viewportHeight / 2);
      const offset = centerOffset * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }
}

// ========================================
// Hover Effects Manager (desktop uniquement)
// ========================================
class HoverEffectsManager {
  constructor() {
    this.init();
  }

  init() {
    // Desactiver les effets complexes sur mobile/tactile
    if (!window.matchMedia('(hover: hover)').matches) return;
    this.setupMagneticButtons();
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
}

// ========================================
// Performance Monitor
// ========================================
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
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
}

// ========================================
// CSS pour les animations (injecte dans le DOM)
// ========================================
function injectAnimationStyles() {
  if (document.getElementById('mf-animation-styles')) return;

  const style = document.createElement('style');
  style.id = 'mf-animation-styles';
  style.textContent = `
    /* Section reveal — fade-in + slide-up */
    .animate-reveal {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    .animate-reveal.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Stagger items */
    .stagger-item {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    }
    .stagger-item.stagger-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Parallax decorative elements */
    .parallax-decor {
      position: absolute;
      pointer-events: none;
      z-index: 0;
      opacity: 0.07;
      font-size: 2rem;
      color: var(--brand-400, #a78bfa);
    }

    /* Marquee banner */
    .marquee-banner {
      overflow: hidden;
      white-space: nowrap;
      position: relative;
    }
    .marquee-track {
      display: inline-flex;
      animation: marquee-scroll 35s linear infinite;
    }
    .marquee-track:hover {
      animation-play-state: paused;
    }
    @keyframes marquee-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* Neumorphic shadows on cards */
    .neumorphic-card {
      box-shadow:
        8px 8px 16px rgba(60, 65, 124, 0.08),
        -4px -4px 12px rgba(255, 255, 255, 0.6);
      transition: box-shadow 0.3s ease, transform 0.3s ease;
    }
    .neumorphic-card:hover {
      box-shadow:
        12px 12px 24px rgba(60, 65, 124, 0.12),
        -6px -6px 16px rgba(255, 255, 255, 0.8);
    }

    /* prefers-reduced-motion : tout afficher directement */
    @media (prefers-reduced-motion: reduce) {
      .animate-reveal,
      .stagger-item {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
      .marquee-track {
        animation: none !important;
      }
      [data-parallax-speed],
      [data-parallax-decor] {
        transform: none !important;
      }
      .instrument {
        animation: none !important;
      }
    }

    /* Mobile: masquer les decorations parallax */
    @media (max-width: 767px) {
      .parallax-decor {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);
}

// ========================================
// Init principal
// ========================================
const initAnimations = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasSlowConnection = navigator.connection &&
    (navigator.connection.effectiveType === 'slow-2g' ||
     navigator.connection.effectiveType === '2g' ||
     navigator.connection.effectiveType === '3g');

  // Toujours actif
  new PerformanceMonitor();

  if (!prefersReducedMotion && !hasSlowConnection) {
    injectAnimationStyles();
    new ScrollAnimationManager();
    new ParallaxManager();
  } else {
    // Fallback : afficher les valeurs finales des compteurs sans animation
    document.querySelectorAll('[data-counter]').forEach((el) => {
      const target = parseInt(el.dataset.counter);
      const suffix = el.dataset.counterSuffix || '';
      const prefix = el.dataset.counterPrefix || '';
      const decimals = parseInt(el.dataset.counterDecimals) || 0;
      if (decimals > 0) {
        el.textContent = prefix + target.toFixed(decimals).replace('.', ',') + suffix;
      } else {
        el.textContent = prefix + (target >= 1000 ? target.toLocaleString('fr-FR') : target) + suffix;
      }
    });

    // Rendre tout visible immediatement
    document.querySelectorAll('.animate-reveal, .stagger-item').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  if (!prefersReducedMotion) {
    new HoverEffectsManager();
  }
};

// Support both DOMContentLoaded and already-loaded states
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ScrollAnimationManager,
    ParallaxManager,
    HoverEffectsManager,
    PerformanceMonitor
  };
}
