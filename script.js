/* ================================================================
   K.M. MYNURDOZA — PORTFOLIO JAVASCRIPT
   Modern Interactive Engine | High Performance & Butter-Smooth
================================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ==============================================================
  // 1. PARTICLE CANVAS ANIMATION (Space & Constellation Theme)
  // ==============================================================
  (function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    let particles = [];
    const mouse = { x: null, y: null, radius: 140 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.6;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Subtle mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.5;
            this.y -= Math.sin(angle) * force * 1.5;
          }
        }
      }

      draw(ts) {
        const dynamicAlpha = this.alpha * (0.6 + 0.4 * Math.sin(ts * this.pulseSpeed + this.pulsePhase));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${dynamicAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function createParticles() {
      particles = [];
      const density = Math.floor((width * height) / 10000);
      const count = Math.min(Math.max(density, 45), 110);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectLines() {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    function animate(ts) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ts);
      }
      connectLines();
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resize();
    requestAnimationFrame(animate);
  })();


  // ==============================================================
  // 2. SMOOTH CURSOR GLOW
  // ==============================================================
  (function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.innerWidth <= 991) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function renderGlow() {
      // Lerp smoothing
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderGlow);
    }
    requestAnimationFrame(renderGlow);
  })();


  // ==============================================================
  // 3. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
  // ==============================================================
  (function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Scroll Spy
      let currentSection = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        const height = sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < top + height) {
          currentSection = sec.getAttribute('id');
        }
      });

      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile Toggle
    if (toggle && navLinks) {
      toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      // Close menu when clicking link
      links.forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Close menu on click outside
      document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
          navLinks.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  })();


  // ==============================================================
  // 4. FEATURED PROJECT IMAGE SLIDER
  // ==============================================================
  (function initProjectSlider() {
    const slider = document.getElementById('project-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsWrap = document.getElementById('slider-dots');
    const dots = dotsWrap ? dotsWrap.querySelectorAll('.dot') : [];
    let currentIndex = 0;
    let autoplayTimer;

    function goToSlide(index) {
      slides[currentIndex].classList.remove('active');
      if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

      currentIndex = (index + slides.length) % slides.length;

      slides[currentIndex].classList.add('active');
      if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoplay();
      });
    });

    function startAutoplay() {
      autoplayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    slider.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    slider.addEventListener('mouseleave', () => startAutoplay());

    startAutoplay();
  })();


  // ==============================================================
  // 5. ANIMATED STAT COUNTERS
  // ==============================================================
  (function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-count'), 10) || 0;
            const duration = 1600; // ms
            const startTime = performance.now();

            function updateCount(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.floor(easeOut * target);

              num.textContent = currentVal;

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                num.textContent = target;
              }
            }
            requestAnimationFrame(updateCount);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });

    const statsContainer = document.querySelector('.about-stats');
    if (statsContainer) observer.observe(statsContainer);
  })();


  // ==============================================================
  // 6. SCROLL REVEAL ANIMATIONS
  // ==============================================================
  (function initScrollReveal() {
    const targets = document.querySelectorAll(
      '.about-photo-wrap, .about-text, .timeline-item, .skill-card, .project-featured, .sub-project-card, .achieve-card, .eca-card, .eca-photo-item, .contact-card'
    );

    targets.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => io.observe(el));
  })();


  // ==============================================================
  // 7. SUBTLE 3D CARD TILT EFFECT (Desktop)
  // ==============================================================
  (function initTilt() {
    if (window.innerWidth <= 991) return;

    const tiltCards = document.querySelectorAll('.skill-card, .sub-project-card, .achieve-card, .contact-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Subtle rotateX & rotateY
        card.style.transform = `translateY(-5px) perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  })();


  // ==============================================================
  // 8. DYNAMIC FOOTER YEAR
  // ==============================================================
  (function setFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  })();

});
