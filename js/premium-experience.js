/* ==========================================
   Nature's Hidden Hugs — Premium Experience
   Smooth scroll, GSAP, page transitions,
   glow design, text splitting, ambient sound,
   scroll-driven storytelling
   ========================================== */

(function () {
    'use strict';

    // ==========================================
    // 1. LENIS SMOOTH SCROLL
    // ==========================================
    let lenis = null;

    function initSmoothScroll() {
        if (typeof Lenis === 'undefined') return;

        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 1.5,
        });

        // Connect Lenis to GSAP ScrollTrigger
        if (typeof gsap !== 'undefined' && gsap.ticker) {
            lenis.on('scroll', () => {
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.update();
                }
            });

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        } else {
            // Fallback: standalone RAF
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }

        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    lenis.scrollTo(target, { offset: -80 });
                }
            });
        });

        // Handle back-to-top
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                lenis.scrollTo(0);
            });
        }
    }

    // ==========================================
    // 2. GSAP SCROLL-TRIGGERED ANIMATIONS
    // ==========================================
    function initGSAPAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // --- Hero parallax depth ---
        const heroBg = document.querySelector('.hero-bg img');
        if (heroBg) {
            gsap.to(heroBg, {
                yPercent: 20,
                scale: 1.1,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                }
            });
        }

        // --- Hero content fade out on scroll ---
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            gsap.to(heroContent, {
                y: -80,
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: '60% top',
                    end: 'bottom top',
                    scrub: 1,
                }
            });
        }

        // --- Stats bar counter animation ---
        document.querySelectorAll('.stat-number').forEach(stat => {
            const text = stat.textContent;
            const num = parseFloat(text.replace(/[^0-9.]/g, ''));
            const suffix = text.replace(/[0-9.,\s]/g, '');

            gsap.from(stat, {
                textContent: 0,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                onUpdate: function () {
                    const val = Math.round(parseFloat(stat.textContent));
                    if (text.includes('M')) {
                        stat.textContent = (val / 1).toFixed(0) + suffix;
                    } else if (text.includes('K')) {
                        stat.textContent = val + suffix;
                    } else {
                        stat.textContent = val.toLocaleString() + suffix;
                    }
                }
            });
        });

        // (Section headings are animated by initCharSplitting instead)        

        // --- Cards stagger in ---
        document.querySelectorAll('.features-grid, .story-grid, .stories-grid, .product-grid, .rescue-grid').forEach(grid => {
            const cards = grid.children;
            if (cards.length === 0) return;

            gsap.from(cards, {
                y: 80,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                }
            });
        });

        // --- CTA banner cinematic reveal ---
        const ctaBanner = document.querySelector('.cta-banner');
        if (ctaBanner) {
            gsap.from(ctaBanner, {
                scale: 0.9,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: ctaBanner,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                }
            });
        }

        // --- Newsletter section glow pulse ---
        const newsletter = document.querySelector('.newsletter-section');
        if (newsletter) {
            gsap.from(newsletter, {
                y: 40,
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: newsletter,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            });
        }

        // --- Footer reveal ---
        const footer = document.querySelector('.footer');
        if (footer) {
            gsap.from(footer, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: footer,
                    start: 'top 95%',
                    toggleActions: 'play none none none',
                }
            });
        }

        // --- Parallax floating elements ---
        document.querySelectorAll('.feature-card .icon').forEach((icon, i) => {
            gsap.to(icon, {
                y: -15 + (i % 3) * 5,
                ease: 'none',
                scrollTrigger: {
                    trigger: icon,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                }
            });
        });
    }

    // ==========================================
    // 3. PAGE TRANSITIONS
    // ==========================================
    function initPageTransitions() {
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML = `
      <div class="transition-paw">🐾</div>
    `;
        document.body.appendChild(overlay);

        // Entrance animation
        setTimeout(() => {
            overlay.classList.add('transition-enter');
        }, 50);

        // Intercept all internal links
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');

            // Skip external links, anchors, javascript:, mailto:, etc.
            if (!href ||
                href.startsWith('#') ||
                href.startsWith('http') ||
                href.startsWith('mailto:') ||
                href.startsWith('javascript:') ||
                href.startsWith('tel:') ||
                link.target === '_blank') return;

            link.addEventListener('click', (e) => {
                // Don't transition for modal triggers or buttons
                if (link.closest('.card') && !link.classList.contains('btn')) return;

                e.preventDefault();
                const destination = href;

                // Trigger exit animation
                overlay.classList.remove('transition-enter');
                overlay.classList.add('transition-exit');

                // Navigate after animation
                setTimeout(() => {
                    window.location.href = destination;
                }, 500);
            });
        });
    }

    // ==========================================
    // 4. GLOW DESIGN — Dynamic lighting effects
    // ==========================================
    function initGlowDesign() {
        // Add glow to section headings on scroll
        document.querySelectorAll('h2, .hero-title, .section-title').forEach(heading => {
            heading.classList.add('glow-text');
        });

        // Add ambient glow orbs to sections
        document.querySelectorAll('.content-section, .cta-banner, .newsletter-section').forEach(section => {
            const orb1 = document.createElement('div');
            orb1.className = 'glow-orb glow-orb-1';
            const orb2 = document.createElement('div');
            orb2.className = 'glow-orb glow-orb-2';
            section.style.position = 'relative';
            section.style.overflow = 'hidden';
            section.appendChild(orb1);
            section.appendChild(orb2);
        });
    }

    // ==========================================
    // 5. CHARACTER-LEVEL TEXT SPLITTING
    // ==========================================
    function initCharSplitting() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        // Apply to section headings (not hero title which uses word-reveal)
        const targets = document.querySelectorAll('h2, .section-title');

        targets.forEach(el => {
            if (el.dataset.charSplit) return;
            if (el.closest('.hero')) return; // Skip hero — has its own animation
            el.dataset.charSplit = 'true';

            const text = el.textContent;
            // Skip very short text or emoji-only
            if (text.length < 3) return;

            // Split into individual characters
            el.innerHTML = text.split('').map((char, i) =>
                char === ' '
                    ? `<span class="split-char" style="--char-index: ${i};">&nbsp;</span>`
                    : `<span class="split-char" style="--char-index: ${i};">${char}</span>`
            ).join('');

            // Animate with GSAP on scroll
            const chars = el.querySelectorAll('.split-char');
            gsap.from(chars, {
                y: 30,
                opacity: 0,
                rotateX: -60,
                stagger: 0.02,
                duration: 0.6,
                ease: 'back.out(1.4)',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            });
        });
    }
    // ==========================================
    // 6. AMBIENT FOREST SOUNDSCAPE
    // ==========================================
    function initAmbientSound() {
        let audioCtx = null;
        let isPlaying = false;
        let masterGain = null;
        let nodes = [];

        // Create sound toggle button
        const soundBtn = document.createElement('button');
        soundBtn.className = 'sound-toggle';
        soundBtn.setAttribute('aria-label', 'Toggle ambient sound');
        soundBtn.innerHTML = `<span class="sound-icon-on">🔊</span><span class="sound-icon-off">🔇</span>`;
        // Use !important to override any CSS containment from Lenis transforms
        soundBtn.setAttribute('style',
            'position:fixed !important;bottom:160px !important;right:24px !important;z-index:99999 !important;'
        );
        document.body.appendChild(soundBtn);

        function createForestAmbience() {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioCtx.createGain();
            masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
            masterGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 2);
            masterGain.connect(audioCtx.destination);

            // Wind — brown noise through bandpass
            const windBufferSize = 2 * audioCtx.sampleRate;
            const windBuffer = audioCtx.createBuffer(1, windBufferSize, audioCtx.sampleRate);
            const windData = windBuffer.getChannelData(0);
            let windLast = 0;
            for (let i = 0; i < windBufferSize; i++) {
                const white = Math.random() * 2 - 1;
                windData[i] = (windLast + (0.02 * white)) / 1.02;
                windLast = windData[i];
                windData[i] *= 3.5;
            }
            const windSource = audioCtx.createBufferSource();
            windSource.buffer = windBuffer;
            windSource.loop = true;
            const windFilter = audioCtx.createBiquadFilter();
            windFilter.type = 'bandpass';
            windFilter.frequency.setValueAtTime(300, audioCtx.currentTime);
            windFilter.Q.setValueAtTime(0.5, audioCtx.currentTime);
            const windGain = audioCtx.createGain();
            windGain.gain.setValueAtTime(0.6, audioCtx.currentTime);
            windSource.connect(windFilter);
            windFilter.connect(windGain);
            windGain.connect(masterGain);
            windSource.start();
            nodes.push(windSource);

            // Wind modulation (slow LFO)
            const windLfo = audioCtx.createOscillator();
            const windLfoGain = audioCtx.createGain();
            windLfo.frequency.setValueAtTime(0.15, audioCtx.currentTime);
            windLfoGain.gain.setValueAtTime(100, audioCtx.currentTime);
            windLfo.connect(windLfoGain);
            windLfoGain.connect(windFilter.frequency);
            windLfo.start();
            nodes.push(windLfo);

            // Bird chirps — periodic sine bursts
            function scheduleBirdChirp() {
                if (!isPlaying || !audioCtx) return;

                const chirpOsc = audioCtx.createOscillator();
                const chirpGain = audioCtx.createGain();
                const freq = 2000 + Math.random() * 3000;
                const now = audioCtx.currentTime;

                chirpOsc.type = 'sine';
                chirpOsc.frequency.setValueAtTime(freq, now);
                chirpOsc.frequency.exponentialRampToValueAtTime(freq * (0.7 + Math.random() * 0.6), now + 0.15);

                chirpGain.gain.setValueAtTime(0, now);
                chirpGain.gain.linearRampToValueAtTime(0.03 + Math.random() * 0.04, now + 0.02);
                chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + Math.random() * 0.1);

                chirpOsc.connect(chirpGain);
                chirpGain.connect(masterGain);
                chirpOsc.start(now);
                chirpOsc.stop(now + 0.25);

                // Double chirp sometimes
                if (Math.random() > 0.5) {
                    const chirp2 = audioCtx.createOscillator();
                    const chirp2Gain = audioCtx.createGain();
                    chirp2.type = 'sine';
                    chirp2.frequency.setValueAtTime(freq * 1.2, now + 0.12);
                    chirp2Gain.gain.setValueAtTime(0, now + 0.12);
                    chirp2Gain.gain.linearRampToValueAtTime(0.025, now + 0.14);
                    chirp2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                    chirp2.connect(chirp2Gain);
                    chirp2Gain.connect(masterGain);
                    chirp2.start(now + 0.12);
                    chirp2.stop(now + 0.3);
                }

                // Schedule next chirp
                const delay = 2000 + Math.random() * 6000;
                setTimeout(scheduleBirdChirp, delay);
            }

            // Cricket/insect hum — filtered noise
            const cricketBufferSize = audioCtx.sampleRate * 2;
            const cricketBuffer = audioCtx.createBuffer(1, cricketBufferSize, audioCtx.sampleRate);
            const cricketData = cricketBuffer.getChannelData(0);
            for (let i = 0; i < cricketBufferSize; i++) {
                cricketData[i] = Math.random() * 2 - 1;
            }
            const cricketSource = audioCtx.createBufferSource();
            cricketSource.buffer = cricketBuffer;
            cricketSource.loop = true;
            const cricketFilter = audioCtx.createBiquadFilter();
            cricketFilter.type = 'bandpass';
            cricketFilter.frequency.setValueAtTime(4500, audioCtx.currentTime);
            cricketFilter.Q.setValueAtTime(15, audioCtx.currentTime);
            const cricketGain = audioCtx.createGain();
            cricketGain.gain.setValueAtTime(0.015, audioCtx.currentTime);
            cricketSource.connect(cricketFilter);
            cricketFilter.connect(cricketGain);
            cricketGain.connect(masterGain);
            cricketSource.start();
            nodes.push(cricketSource);

            // Stream/water — filtered white noise
            const streamBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
            const streamData = streamBuffer.getChannelData(0);
            for (let i = 0; i < streamData.length; i++) {
                streamData[i] = Math.random() * 2 - 1;
            }
            const streamSource = audioCtx.createBufferSource();
            streamSource.buffer = streamBuffer;
            streamSource.loop = true;
            const streamFilter = audioCtx.createBiquadFilter();
            streamFilter.type = 'lowpass';
            streamFilter.frequency.setValueAtTime(800, audioCtx.currentTime);
            streamFilter.Q.setValueAtTime(1, audioCtx.currentTime);
            const streamGain = audioCtx.createGain();
            streamGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            streamSource.connect(streamFilter);
            streamFilter.connect(streamGain);
            streamGain.connect(masterGain);
            streamSource.start();
            nodes.push(streamSource);

            // Start bird chirps after a delay
            setTimeout(scheduleBirdChirp, 1500);
        }

        function toggleSound() {
            if (!isPlaying) {
                isPlaying = true;
                soundBtn.classList.add('sound-active');
                if (!audioCtx) {
                    createForestAmbience();
                } else {
                    audioCtx.resume();
                    masterGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 1);
                }
            } else {
                isPlaying = false;
                soundBtn.classList.remove('sound-active');
                if (masterGain) {
                    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
                }
            }
        }

        soundBtn.addEventListener('click', toggleSound);
    }

    // ==========================================
    // 7. SCROLL-DRIVEN STORYTELLING SECTIONS
    // ==========================================
    function initScrollStorytelling() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        // --- Horizontal scroll for features on desktop ---
        const featuresGrid = document.querySelector('.features-grid');
        if (featuresGrid && window.innerWidth > 1024) {
            const featureCards = featuresGrid.querySelectorAll('.feature-card');
            if (featureCards.length >= 3) {
                // Create a horizontal scroll wrapper
                const wrapper = document.createElement('div');
                wrapper.className = 'horizontal-scroll-wrapper';
                featuresGrid.parentNode.insertBefore(wrapper, featuresGrid);
                wrapper.appendChild(featuresGrid);

                featuresGrid.style.display = 'flex';
                featuresGrid.style.gap = '2rem';
                featuresGrid.style.width = `${featureCards.length * 380}px`;
                featuresGrid.style.flexWrap = 'nowrap';

                featureCards.forEach(card => {
                    card.style.minWidth = '340px';
                    card.style.flex = '0 0 340px';
                });

                gsap.to(featuresGrid, {
                    x: () => -(featuresGrid.scrollWidth - wrapper.offsetWidth),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrapper,
                        start: 'top 20%',
                        end: () => `+=${featuresGrid.scrollWidth - wrapper.offsetWidth}`,
                        scrub: 1,
                        pin: true,
                        anticipatePin: 1,
                    }
                });
            }
        }

        // --- Reveal on scroll — individual story page sections ---
        document.querySelectorAll('.content-section').forEach((section, i) => {
            gsap.from(section, {
                x: i % 2 === 0 ? -60 : 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                }
            });
        });

        // --- Pinned hero text reveal ---
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroTitle && heroSubtitle) {
            // Subtle scale effect on hero
            gsap.fromTo(heroTitle,
                { scale: 0.95, opacity: 0.7 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1.5,
                    ease: 'power2.out',
                    delay: 1.3
                }
            );
        }
    }

    // ==========================================
    // 8. SECTION WAVE DIVIDERS
    // ==========================================
    function initWaveDividers() {
        const sections = document.querySelectorAll('.content-section, .stats-bar, .cta-banner, .newsletter-section');

        sections.forEach((section, i) => {
            // Only add between sections, not all
            if (i % 2 !== 0) return;

            const wave = document.createElement('div');
            wave.className = 'wave-divider';
            wave.innerHTML = `
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,60 L0,60 Z" 
                fill="currentColor" opacity="0.08"/>
          <path d="M0,50 C480,10 960,70 1440,30 L1440,60 L0,60 Z" 
                fill="currentColor" opacity="0.05"/>
        </svg>
      `;
            section.style.position = 'relative';
            section.prepend(wave);
        });
    }

    // ==========================================
    // INITIALIZE
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        initSmoothScroll();
        initGSAPAnimations();
        initPageTransitions();
        initGlowDesign();

        // Delay char splitting slightly so word splitting runs first
        setTimeout(() => {
            initCharSplitting();
        }, 100);

        initAmbientSound();
        initScrollStorytelling();
        initWaveDividers();
    });

})();
