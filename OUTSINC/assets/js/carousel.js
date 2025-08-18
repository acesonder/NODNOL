//START - OUTSINC/assets/js/carousel.js

/* =====================================================
   LONDONS OUTSINCE Carousel Components
   - CTA Slider with auto-rotation
   - App showcase carousel
   - Keyboard and touch support
   ===================================================== */

(function() {
    'use strict';

    const app = window.LondonsOutsince;

    // CTA Slider Component
    app.components.ctaSlider = () => {
        const slider = app.utils.$('#ctaSlider .slides');
        const dots = app.utils.$$('#ctaSlider .dots button');
        const prevBtn = app.utils.$('#s-prev');
        const nextBtn = app.utils.$('#s-next');
        
        if (!slider) return;

        const slides = slider.children;
        const totalSlides = slides.length;
        let currentSlide = 0;
        let autoRotateTimer;
        let isUserInteracting = false;

        const goToSlide = (index) => {
            currentSlide = (index + totalSlides) % totalSlides;
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update dots
            dots.forEach((dot, idx) => {
                const isActive = idx === currentSlide;
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            // Update slide focus
            slides[currentSlide].setAttribute('tabindex', '0');
            Array.from(slides).forEach((slide, idx) => {
                if (idx !== currentSlide) {
                    slide.setAttribute('tabindex', '-1');
                }
            });
        };

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

        const startAutoRotate = () => {
            if (document.body.dataset.motion === 'off') return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            
            clearTimeout(autoRotateTimer);
            autoRotateTimer = setTimeout(() => {
                if (!isUserInteracting) {
                    nextSlide();
                    startAutoRotate();
                }
            }, 8000); // 8 second rotation
        };

        const stopAutoRotate = () => {
            clearTimeout(autoRotateTimer);
        };

        const handleUserInteraction = () => {
            isUserInteracting = true;
            stopAutoRotate();
            setTimeout(() => {
                isUserInteracting = false;
                startAutoRotate();
            }, 10000); // Resume after 10 seconds of no interaction
        };

        // Event listeners
        if (prevBtn) {
            app.utils.on(prevBtn, 'click', () => {
                prevSlide();
                handleUserInteraction();
            });
        }

        if (nextBtn) {
            app.utils.on(nextBtn, 'click', () => {
                nextSlide();
                handleUserInteraction();
            });
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            app.utils.on(dot, 'click', () => {
                goToSlide(index);
                handleUserInteraction();
            });
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        app.utils.on(slider, 'touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            handleUserInteraction();
        });

        app.utils.on(slider, 'touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const difference = touchStartX - touchEndX;
            const threshold = 50;

            if (Math.abs(difference) > threshold) {
                if (difference > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        // Pause on hover
        app.utils.on(slider.parentElement, 'mouseenter', () => {
            isUserInteracting = true;
            stopAutoRotate();
        });

        app.utils.on(slider.parentElement, 'mouseleave', () => {
            isUserInteracting = false;
            startAutoRotate();
        });

        // Pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoRotate();
            } else {
                startAutoRotate();
            }
        });

        // Initialize
        goToSlide(0);
        startAutoRotate();

        // Expose controls for accessibility
        window.ctaSlider = {
            next: nextSlide,
            prev: prevSlide,
            goto: goToSlide,
            pause: stopAutoRotate,
            resume: startAutoRotate
        };
    };

    // App Showcase Carousel
    app.components.appCarousel = () => {
        const carousel = app.utils.$('#appShow');
        if (!carousel) return;

        const slides = carousel.querySelector('.app-slides');
        const cards = carousel.querySelectorAll('.app-card');
        const dots = carousel.querySelectorAll('.app-dots button');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');

        let currentIndex = 0;

        const updateCarousel = () => {
            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update dots
            dots.forEach((dot, idx) => {
                const isActive = idx === currentIndex;
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            // Update card focus
            cards.forEach((card, idx) => {
                card.setAttribute('tabindex', idx === currentIndex ? '0' : '-1');
            });
        };

        const goToSlide = (index) => {
            currentIndex = (index + cards.length) % cards.length;
            updateCarousel();
        };

        const nextSlide = () => goToSlide(currentIndex + 1);
        const prevSlide = () => goToSlide(currentIndex - 1);

        // Event listeners
        app.utils.on(prevBtn, 'click', prevSlide);
        app.utils.on(nextBtn, 'click', nextSlide);

        dots.forEach((dot, index) => {
            app.utils.on(dot, 'click', () => goToSlide(index));
        });

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        app.utils.on(slides, 'touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        app.utils.on(slides, 'touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const difference = touchStartX - touchEndX;
            const threshold = 50;

            if (Math.abs(difference) > threshold) {
                if (difference > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        // Initialize
        updateCarousel();

        // Expose controls
        window.appCarousel = {
            next: nextSlide,
            prev: prevSlide,
            goto: goToSlide
        };
    };

    // Marquee Controls
    app.components.marqueeControls = () => {
        const marquee = app.utils.$('#marq');
        const track = marquee?.querySelector('.marquee-track');
        const pauseBtn = app.utils.$('#mar-pause');
        const slowBtn = app.utils.$('#mar-slow');
        
        if (!marquee || !track) return;

        let isPaused = false;
        let isSlow = false;

        const updateMarquee = () => {
            track.style.animationPlayState = isPaused ? 'paused' : 'running';
            track.style.animationDuration = isSlow ? '36s' : '22s';
            
            if (pauseBtn) {
                pauseBtn.setAttribute('aria-pressed', isPaused.toString());
                pauseBtn.textContent = isPaused ? 'Play' : 'Pause';
            }
            
            if (slowBtn) {
                slowBtn.setAttribute('aria-pressed', isSlow.toString());
                slowBtn.textContent = isSlow ? 'Normal' : 'Slow';
            }
        };

        // Control buttons
        app.utils.on(pauseBtn, 'click', () => {
            isPaused = !isPaused;
            updateMarquee();
        });

        app.utils.on(slowBtn, 'click', () => {
            isSlow = !isSlow;
            updateMarquee();
        });

        // Pause on hover
        app.utils.on(marquee, 'mouseenter', () => {
            if (!isPaused) {
                track.style.animationPlayState = 'paused';
            }
        });

        app.utils.on(marquee, 'mouseleave', () => {
            if (!isPaused) {
                track.style.animationPlayState = 'running';
            }
        });

        // Pause on focus
        app.utils.on(marquee, 'focusin', () => {
            if (!isPaused) {
                track.style.animationPlayState = 'paused';
            }
        });

        app.utils.on(marquee, 'focusout', () => {
            if (!isPaused) {
                track.style.animationPlayState = 'running';
            }
        });

        // Initialize
        updateMarquee();
    };

    // Auto-initialize carousel components
    const initCarousels = () => {
        app.components.ctaSlider();
        app.components.appCarousel();
        app.components.marqueeControls();
        
        console.log('Carousel components initialized');
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousels);
    } else {
        initCarousels();
    }

})();

//END - OUTSINC/assets/js/carousel.js