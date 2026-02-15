/* ==========================================
   Nature's Hidden Hugs — Hero Canvas Animation
   Breathtaking floating animals & nature particles
   ========================================== */

(function () {
    'use strict';

    // Wait for DOM
    document.addEventListener('DOMContentLoaded', initHeroAnimation);

    function initHeroAnimation() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'hero-nature-canvas';
        canvas.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 0;
      pointer-events: none;
    `;
        // Insert before hero-content so it sits behind text
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            hero.insertBefore(canvas, heroContent);
        } else {
            hero.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        let W, H;
        let animationId;
        let mouseX = 0.5, mouseY = 0.5;

        // ==========================================
        // Resize handler
        // ==========================================
        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = canvas.clientWidth;
            H = canvas.clientHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();
        window.addEventListener('resize', resize);

        // Subtle mouse tracking for parallax
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;
        });

        // ==========================================
        // Color Palette
        // ==========================================
        const COLORS = {
            birdDark: 'rgba(20, 30, 25, 0.7)',
            birdMid: 'rgba(40, 60, 45, 0.5)',
            birdLight: 'rgba(60, 90, 70, 0.35)',
            butterfly1: 'rgba(228, 255, 122, 0.7)',
            butterfly2: 'rgba(244, 162, 97, 0.6)',
            butterfly3: 'rgba(255, 255, 255, 0.5)',
            firefly: 'rgba(228, 255, 122, 0.9)',
            fireflyGlow: 'rgba(228, 255, 122, 0.15)',
            leaf1: 'rgba(74, 124, 92, 0.4)',
            leaf2: 'rgba(45, 90, 61, 0.35)',
            leaf3: 'rgba(196, 163, 90, 0.3)',
            dustMote: 'rgba(255, 255, 255, 0.15)',
        };

        // ==========================================
        // Bird class — graceful soaring silhouettes
        // ==========================================
        class Bird {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = -50 + Math.random() * (W + 100);
                this.y = Math.random() * H * 0.6; // Upper portion
                this.size = 8 + Math.random() * 18;
                this.speed = 0.3 + Math.random() * 0.8;
                this.vx = this.speed * (Math.random() > 0.3 ? 1 : -1);
                this.vy = Math.sin(Math.random() * Math.PI * 2) * 0.15;
                this.wingPhase = Math.random() * Math.PI * 2;
                this.wingSpeed = 0.03 + Math.random() * 0.03;
                this.soarTime = 0;
                this.soaring = false;
                this.soarDuration = 120 + Math.random() * 200;
                this.nextSoar = 60 + Math.random() * 180;
                this.opacity = 0.3 + Math.random() * 0.5;
                this.layer = Math.random(); // depth
                this.color = this.layer > 0.6 ? COLORS.birdDark :
                    this.layer > 0.3 ? COLORS.birdMid : COLORS.birdLight;
            }

            update() {
                // Soaring logic
                this.nextSoar--;
                if (this.nextSoar <= 0 && !this.soaring) {
                    this.soaring = true;
                    this.soarTime = 0;
                }
                if (this.soaring) {
                    this.soarTime++;
                    if (this.soarTime > this.soarDuration) {
                        this.soaring = false;
                        this.nextSoar = 60 + Math.random() * 180;
                    }
                }

                // Wing flap (slower when soaring)
                if (!this.soaring) {
                    this.wingPhase += this.wingSpeed;
                } else {
                    this.wingPhase += this.wingSpeed * 0.15;
                }

                // Movement with gentle sine wave
                this.x += this.vx * (0.8 + this.layer * 0.5);
                this.y += this.vy + Math.sin(this.wingPhase * 0.5) * 0.2;

                // Mouse parallax
                this.x += (mouseX - 0.5) * this.layer * 0.3;
                this.y += (mouseY - 0.5) * this.layer * 0.15;

                // Reset if offscreen
                if (this.vx > 0 && this.x > W + 60) {
                    this.x = -50;
                    this.y = Math.random() * H * 0.6;
                } else if (this.vx < 0 && this.x < -60) {
                    this.x = W + 50;
                    this.y = Math.random() * H * 0.6;
                }
            }

            draw() {
                const wingAngle = this.soaring
                    ? Math.sin(this.wingPhase) * 0.15 + 0.35
                    : Math.sin(this.wingPhase) * 0.8;

                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.globalAlpha = this.opacity;

                const s = this.size;
                const flip = this.vx > 0 ? 1 : -1;
                ctx.scale(flip, 1);

                // Body
                ctx.beginPath();
                ctx.ellipse(0, 0, s * 0.35, s * 0.08, 0, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();

                // Left wing
                ctx.save();
                ctx.rotate(-wingAngle);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(-s * 0.3, -s * 0.5, -s * 0.7, -s * 0.15);
                ctx.quadraticCurveTo(-s * 0.4, -s * 0.1, 0, 0);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();

                // Right wing
                ctx.save();
                ctx.rotate(wingAngle);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(s * 0.3, -s * 0.5, s * 0.7, -s * 0.15);
                ctx.quadraticCurveTo(s * 0.4, -s * 0.1, 0, 0);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();

                // Tail
                ctx.beginPath();
                ctx.moveTo(-s * 0.3, 0);
                ctx.lineTo(-s * 0.55, s * 0.08);
                ctx.lineTo(-s * 0.55, -s * 0.04);
                ctx.closePath();
                ctx.fill();

                ctx.restore();
            }
        }

        // ==========================================
        // Butterfly class — delicate fluttering
        // ==========================================
        class Butterfly {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * W;
                this.y = H * 0.2 + Math.random() * H * 0.6;
                this.size = 4 + Math.random() * 8;
                this.wingPhase = Math.random() * Math.PI * 2;
                this.wingSpeed = 0.08 + Math.random() * 0.06;
                this.angle = Math.random() * Math.PI * 2;
                this.turnSpeed = 0.005 + Math.random() * 0.015;
                this.speed = 0.2 + Math.random() * 0.5;
                this.wobble = Math.random() * Math.PI * 2;
                this.opacity = 0.35 + Math.random() * 0.4;
                const colors = [COLORS.butterfly1, COLORS.butterfly2, COLORS.butterfly3];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.wingPhase += this.wingSpeed;
                this.wobble += 0.02;
                this.angle += Math.sin(this.wobble) * this.turnSpeed;

                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed + Math.sin(this.wobble * 1.5) * 0.3;

                // Gentle mouse avoidance
                this.x += (mouseX - 0.5) * 0.2;
                this.y += (mouseY - 0.5) * 0.1;

                // Wrap around
                if (this.x > W + 20) this.x = -20;
                if (this.x < -20) this.x = W + 20;
                if (this.y > H + 20) this.y = -20;
                if (this.y < -20) this.y = H + 20;
            }

            draw() {
                const wing = Math.abs(Math.sin(this.wingPhase));

                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.globalAlpha = this.opacity;

                const s = this.size;

                // Upper wings
                ctx.beginPath();
                ctx.ellipse(-s * 0.15, -s * wing * 0.3, s * 0.35, s * wing * 0.5, -0.3, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();

                ctx.beginPath();
                ctx.ellipse(s * 0.15, -s * wing * 0.3, s * 0.35, s * wing * 0.5, 0.3, 0, Math.PI * 2);
                ctx.fill();

                // Lower wings (smaller)
                ctx.beginPath();
                ctx.ellipse(-s * 0.1, s * wing * 0.15, s * 0.2, s * wing * 0.3, -0.2, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.ellipse(s * 0.1, s * wing * 0.15, s * 0.2, s * wing * 0.3, 0.2, 0, Math.PI * 2);
                ctx.fill();

                // Body
                ctx.beginPath();
                ctx.ellipse(0, 0, s * 0.04, s * 0.2, 0, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(30, 50, 35, 0.5)';
                ctx.fill();

                ctx.restore();
            }
        }

        // ==========================================
        // Firefly class — magical glowing dots
        // ==========================================
        class Firefly {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * W;
                this.y = H * 0.3 + Math.random() * H * 0.6;
                this.size = 1.5 + Math.random() * 3;
                this.pulsePhase = Math.random() * Math.PI * 2;
                this.pulseSpeed = 0.015 + Math.random() * 0.025;
                this.driftAngle = Math.random() * Math.PI * 2;
                this.driftSpeed = 0.1 + Math.random() * 0.2;
                this.wobble = Math.random() * Math.PI * 2;
                this.maxOpacity = 0.5 + Math.random() * 0.5;
            }

            update() {
                this.pulsePhase += this.pulseSpeed;
                this.wobble += 0.008;
                this.driftAngle += Math.sin(this.wobble) * 0.02;

                this.x += Math.cos(this.driftAngle) * this.driftSpeed;
                this.y += Math.sin(this.driftAngle) * this.driftSpeed * 0.6;

                // Mouse attraction (very subtle)
                const dx = mouseX * W - this.x;
                const dy = mouseY * H - this.y;
                this.x += dx * 0.0005;
                this.y += dy * 0.0005;

                // Wrap
                if (this.x > W + 10) this.x = -10;
                if (this.x < -10) this.x = W + 10;
                if (this.y > H + 10) this.y = H * 0.3;
                if (this.y < H * 0.2) this.y = H * 0.9;
            }

            draw() {
                const pulse = (Math.sin(this.pulsePhase) + 1) * 0.5;
                const opacity = pulse * this.maxOpacity;

                if (opacity < 0.05) return;

                ctx.save();

                // Outer glow
                const glowRadius = this.size * 8 * pulse;
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, glowRadius
                );
                gradient.addColorStop(0, `rgba(228, 255, 122, ${opacity * 0.6})`);
                gradient.addColorStop(0.3, `rgba(228, 255, 122, ${opacity * 0.2})`);
                gradient.addColorStop(1, 'rgba(228, 255, 122, 0)');

                ctx.beginPath();
                ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Core dot
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 240, ${opacity})`;
                ctx.fill();

                ctx.restore();
            }
        }

        // ==========================================
        // Floating Leaf — drifting down gently
        // ==========================================
        class Leaf {
            constructor() {
                this.reset(true);
            }

            reset(initial) {
                this.x = Math.random() * W;
                this.y = initial ? Math.random() * H : -20;
                this.size = 4 + Math.random() * 10;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = 0.01 + Math.random() * 0.025;
                this.fallSpeed = 0.15 + Math.random() * 0.3;
                this.swayPhase = Math.random() * Math.PI * 2;
                this.swayAmp = 0.3 + Math.random() * 0.8;
                this.opacity = 0.2 + Math.random() * 0.3;
                const leafColors = [COLORS.leaf1, COLORS.leaf2, COLORS.leaf3];
                this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
            }

            update() {
                this.rotation += this.rotSpeed;
                this.swayPhase += 0.015;
                this.y += this.fallSpeed;
                this.x += Math.sin(this.swayPhase) * this.swayAmp;

                // Wind from mouse
                this.x += (mouseX - 0.5) * 0.4;

                if (this.y > H + 20) this.reset(false);
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.opacity;

                const s = this.size;

                // Leaf shape
                ctx.beginPath();
                ctx.moveTo(0, -s * 0.5);
                ctx.bezierCurveTo(s * 0.4, -s * 0.3, s * 0.4, s * 0.3, 0, s * 0.5);
                ctx.bezierCurveTo(-s * 0.4, s * 0.3, -s * 0.4, -s * 0.3, 0, -s * 0.5);
                ctx.fillStyle = this.color;
                ctx.fill();

                // Stem
                ctx.beginPath();
                ctx.moveTo(0, -s * 0.5);
                ctx.lineTo(0, s * 0.5);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 0.5;
                ctx.stroke();

                ctx.restore();
            }
        }

        // ==========================================
        // Dust Mote — floating light particles
        // ==========================================
        class DustMote {
            constructor() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.size = 0.5 + Math.random() * 2;
                this.speed = 0.02 + Math.random() * 0.08;
                this.phase = Math.random() * Math.PI * 2;
                this.opacity = 0.05 + Math.random() * 0.15;
            }

            update() {
                this.phase += 0.005;
                this.y -= this.speed;
                this.x += Math.sin(this.phase) * 0.15;

                if (this.y < -10) {
                    this.y = H + 10;
                    this.x = Math.random() * W;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        // ==========================================
        // Initialize particles
        // ==========================================
        const birds = [];
        const butterflies = [];
        const fireflies = [];
        const leaves = [];
        const dustMotes = [];

        // Responsive particle counts
        const isMobile = W < 768;
        const birdCount = isMobile ? 3 : 7;
        const butterflyCount = isMobile ? 3 : 6;
        const fireflyCount = isMobile ? 8 : 20;
        const leafCount = isMobile ? 5 : 12;
        const dustCount = isMobile ? 15 : 40;

        for (let i = 0; i < birdCount; i++) birds.push(new Bird());
        for (let i = 0; i < butterflyCount; i++) butterflies.push(new Butterfly());
        for (let i = 0; i < fireflyCount; i++) fireflies.push(new Firefly());
        for (let i = 0; i < leafCount; i++) leaves.push(new Leaf());
        for (let i = 0; i < dustCount; i++) dustMotes.push(new DustMote());

        // ==========================================
        // Animation loop
        // ==========================================
        let frameCount = 0;

        function animate() {
            ctx.clearRect(0, 0, W, H);
            frameCount++;

            // Update & draw in layers (back to front)

            // Layer 1: Dust motes (far background)
            dustMotes.forEach(d => { d.update(); d.draw(); });

            // Layer 2: Distant birds (smaller, slower)
            birds.filter(b => b.layer < 0.3).forEach(b => { b.update(); b.draw(); });

            // Layer 3: Leaves
            leaves.forEach(l => { l.update(); l.draw(); });

            // Layer 4: Butterflies
            butterflies.forEach(b => { b.update(); b.draw(); });

            // Layer 5: Mid-distance birds
            birds.filter(b => b.layer >= 0.3 && b.layer < 0.6).forEach(b => { b.update(); b.draw(); });

            // Layer 6: Fireflies (foreground glow)
            fireflies.forEach(f => { f.update(); f.draw(); });

            // Layer 7: Close birds (largest, most opaque)
            birds.filter(b => b.layer >= 0.6).forEach(b => { b.update(); b.draw(); });

            animationId = requestAnimationFrame(animate);
        }

        // Start with a fade-in
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 2s ease-in';
        requestAnimationFrame(() => {
            canvas.style.opacity = '1';
        });

        // Use IntersectionObserver to pause when not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animationId) animate();
                } else {
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            });
        }, { threshold: 0.1 });

        observer.observe(hero);
        animate();
    }
})();
