/* ==========================================
   Nature's Hidden Hugs — Interactions System
   Fantastical, immersive micro-interactions
   ========================================== */

(function () {
    'use strict';

    // ==========================================
    // 1. CUSTOM CURSOR — Paw print with trailing particles
    // ==========================================
    function initCustomCursor() {
        // Skip on touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

        document.body.classList.add('custom-cursor-active');

        // Main cursor dot
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);

        // Cursor ring (outer)
        const cursorRing = document.createElement('div');
        cursorRing.className = 'cursor-ring';
        document.body.appendChild(cursorRing);

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let dotX = 0, dotY = 0;
        let isHovering = false;
        let isClicking = false;

        // Trail particles
        const trailParticles = [];
        const MAX_TRAIL = 12;
        let trailTimer = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Hover state for interactive elements
        const hoverTargets = 'a, button, .btn, .card, .nav-link, input, .story-card, .product-card, .feature-card';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) {
                isHovering = true;
                cursorDot.classList.add('cursor-hover');
                cursorRing.classList.add('cursor-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) {
                isHovering = false;
                cursorDot.classList.remove('cursor-hover');
                cursorRing.classList.remove('cursor-hover');
            }
        });

        // Click state
        document.addEventListener('mousedown', () => {
            isClicking = true;
            cursorDot.classList.add('cursor-click');
            cursorRing.classList.add('cursor-click');
            spawnClickBurst(mouseX, mouseY);
        });
        document.addEventListener('mouseup', () => {
            isClicking = false;
            cursorDot.classList.remove('cursor-click');
            cursorRing.classList.remove('cursor-click');
        });

        // Spawn trail particle
        function spawnTrail(x, y) {
            const particle = document.createElement('div');
            particle.className = 'cursor-trail';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--size', (2 + Math.random() * 4) + 'px');
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 600);
        }

        // Click burst effect — small paw-shaped explosion
        function spawnClickBurst(x, y) {
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'cursor-burst';
                const angle = (Math.PI * 2 / 8) * i;
                const dist = 20 + Math.random() * 30;
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
                particle.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 500);
            }
        }

        // Animation loop — spring physics
        function updateCursor() {
            // Dot follows immediately with slight damping
            dotX += (mouseX - dotX) * 0.35;
            dotY += (mouseY - dotY) * 0.35;
            cursorDot.style.transform = `translate(${dotX - 5}px, ${dotY - 5}px)`;

            // Ring follows with more lag (springy)
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;

            // Spawn trail particles (throttled)
            trailTimer++;
            const speed = Math.hypot(mouseX - dotX, mouseY - dotY);
            if (trailTimer % 3 === 0 && speed > 2) {
                spawnTrail(mouseX, mouseY);
            }

            requestAnimationFrame(updateCursor);
        }
        updateCursor();
    }

    // ==========================================
    // 2. MAGNETIC BUTTONS — Attract toward cursor
    // ==========================================
    function initMagneticButtons() {
        if ('ontouchstart' in window) return;

        const buttons = document.querySelectorAll('.btn, .back-to-top, .theme-toggle');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                btn.style.transition = 'transform 0.2s ease-out';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
        });
    }

    // ==========================================
    // 3. CLICK RIPPLE — Radial ripple on buttons
    // ==========================================
    function initRippleEffect() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn, button');
            if (!btn) return;

            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';

            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    }

    // ==========================================
    // 4. 3D CARD TILT — Perspective tilt on hover
    // ==========================================
    function initCardTilt() {
        if ('ontouchstart' in window) return;

        const cards = document.querySelectorAll('.card, .story-card, .product-card, .feature-card');

        cards.forEach(card => {
            card.style.transformStyle = 'preserve-3d';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                const tiltX = (y - 0.5) * -8;   // Max 8 degrees
                const tiltY = (x - 0.5) * 8;

                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
                card.style.transition = 'transform 0.1s ease-out';

                // Dynamic shine/light reflection
                const shine = card.querySelector('.card-shine') || createShine(card);
                shine.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';

                const shine = card.querySelector('.card-shine');
                if (shine) shine.style.background = 'transparent';
            });
        });

        function createShine(card) {
            const shine = document.createElement('div');
            shine.className = 'card-shine';
            card.appendChild(shine);
            return shine;
        }
    }

    // ==========================================
    // 5. TEXT REVEAL — Word-by-word animation
    // ==========================================
    function initTextReveal() {
        const headings = document.querySelectorAll('.hero-title, .hero-subtitle, .section-title, h2.reveal');

        headings.forEach(heading => {
            // Don't re-process
            if (heading.dataset.textRevealed) return;
            heading.dataset.textRevealed = 'true';

            const text = heading.textContent.trim();
            const words = text.split(/\s+/);

            heading.innerHTML = words.map((word, i) =>
                `<span class="reveal-word" style="--word-index: ${i};">${word}</span>`
            ).join(' ');

            heading.classList.add('text-reveal-ready');
        });

        // Observer to trigger animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('text-reveal-active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.text-reveal-ready').forEach(el => observer.observe(el));
    }

    // ==========================================
    // 6. SCROLL PROGRESS BAR
    // ==========================================
    function initScrollProgress() {
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        document.body.appendChild(bar);

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / scrollHeight) * 100;
            bar.style.width = progress + '%';
        }, { passive: true });
    }

    // ==========================================
    // 7. STATS COUNTER — Animate numbers
    // ==========================================
    function initStatsCounter() {
        const statElements = document.querySelectorAll('.stat-number, [data-count]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    animateCount(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statElements.forEach(el => observer.observe(el));

        function animateCount(el) {
            const target = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
            const suffix = el.textContent.replace(/[0-9,.\s]/g, '');
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing: cubic ease-out
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * eased);

                el.textContent = current.toLocaleString() + suffix;

                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }
    }

    // ==========================================
    // 8. LOADING SCREEN
    // ==========================================
    function initLoadingScreen() {
        // Create loading screen
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-paw">
          <svg viewBox="0 0 100 100" width="60" height="60">
            <ellipse cx="50" cy="65" rx="18" ry="22" fill="currentColor" opacity="0.9"/>
            <ellipse cx="28" cy="38" rx="10" ry="13" fill="currentColor" opacity="0.8" transform="rotate(-15 28 38)"/>
            <ellipse cx="72" cy="38" rx="10" ry="13" fill="currentColor" opacity="0.8" transform="rotate(15 72 38)"/>
            <ellipse cx="38" cy="22" rx="8" ry="10" fill="currentColor" opacity="0.7" transform="rotate(-5 38 22)"/>
            <ellipse cx="62" cy="22" rx="8" ry="10" fill="currentColor" opacity="0.7" transform="rotate(5 62 22)"/>
          </svg>
        </div>
        <div class="loader-text">Nature's Hidden Hugs</div>
        <div class="loader-bar">
          <div class="loader-bar-fill"></div>
        </div>
      </div>
    `;
        document.body.prepend(loader);

        // Fade out once page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loader-hidden');
                setTimeout(() => loader.remove(), 600);
            }, 800);
        });
    }

    // ==========================================
    // 9. PARALLAX SECTIONS — Depth on scroll
    // ==========================================
    function initParallaxSections() {
        const parallaxElements = document.querySelectorAll('.cta-banner, .newsletter-section, .page-header');

        window.addEventListener('scroll', () => {
            parallaxElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const visible = rect.top < window.innerHeight && rect.bottom > 0;
                if (visible) {
                    const offset = (rect.top / window.innerHeight) * 30;
                    el.style.backgroundPosition = `center ${50 + offset}%`;
                }
            });
        }, { passive: true });
    }

    // ==========================================
    // 10. IMAGE HOVER ZOOM
    // ==========================================
    function initImageHoverZoom() {
        const thumbnails = document.querySelectorAll('.card-thumbnail, .product-image');

        thumbnails.forEach(thumb => {
            thumb.style.overflow = 'hidden';
            const img = thumb.querySelector('img');
            if (img) {
                img.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';

                thumb.addEventListener('mouseenter', () => {
                    img.style.transform = 'scale(1.08)';
                });
                thumb.addEventListener('mouseleave', () => {
                    img.style.transform = 'scale(1)';
                });
            }
        });
    }

    // ==========================================
    // 11. SMOOTH SECTION REVEALS (enhanced)
    // ==========================================
    function initEnhancedReveals() {
        // Add stagger to grid children
        document.querySelectorAll('.reveal-stagger').forEach(parent => {
            const children = parent.children;
            Array.from(children).forEach((child, i) => {
                child.style.setProperty('--stagger-index', i);
                child.classList.add('stagger-child');
            });
        });
    }

    // ==========================================
    // 12. NAV SCROLL EFFECT — Glass morphism on scroll
    // ==========================================
    function initNavScrollEffect() {
        const nav = document.querySelector('.nav');
        if (!nav) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            if (scrollY > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }

            // Hide/show on scroll direction
            if (scrollY > lastScroll && scrollY > 300) {
                nav.classList.add('nav-hidden');
            } else {
                nav.classList.remove('nav-hidden');
            }
            lastScroll = scrollY;
        }, { passive: true });
    }

    // ==========================================
    // 13. HOVER SOUND EFFECT (subtle)
    // ==========================================
    function initButtonSounds() {
        // Create audio context lazily on first interaction
        let audioCtx = null;

        function playHoverTone() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        }

        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', playHoverTone);
        });
    }

    // ==========================================
    // INITIALIZE ALL
    // ==========================================
    // Loading screen first (before DOMContentLoaded)
    initLoadingScreen();

    document.addEventListener('DOMContentLoaded', () => {
        initCustomCursor();
        initMagneticButtons();
        initRippleEffect();
        initCardTilt();
        initTextReveal();
        initScrollProgress();
        initStatsCounter();
        initParallaxSections();
        initImageHoverZoom();
        initEnhancedReveals();
        initNavScrollEffect();
        // initButtonSounds(); // Uncomment to enable hover sounds
    });

})();
