//START - OUTSINC/assets/js/accessibility.js

/* =====================================================
   LONDONS OUTSINCE Accessibility Features
   - Theme switching and user preferences
   - Keyboard navigation enhancements
   - Screen reader support
   ===================================================== */

(function() {
    'use strict';

    const app = window.LondonsOutsince;

    // Accessibility preferences storage
    const prefs = {
        get: (key, defaultValue = false) => {
            return app.utils.storage.get(`a11y_${key}`, defaultValue);
        },
        set: (key, value) => {
            return app.utils.storage.set(`a11y_${key}`, value);
        }
    };

    // Theme and accessibility toggles
    app.components.accessibilityToggles = () => {
        const motionToggle = app.utils.$('#tog-motion');
        const contrastToggle = app.utils.$('#tog-contrast');
        const textToggle = app.utils.$('#tog-text');

        // Motion toggle
        if (motionToggle) {
            const motionPref = prefs.get('reduced_motion') || 
                             window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (motionPref) {
                document.body.classList.add('theme-reduced-motion');
                document.body.dataset.motion = 'off';
                motionToggle.setAttribute('aria-pressed', 'true');
            }

            app.utils.on(motionToggle, 'click', () => {
                const isPressed = motionToggle.getAttribute('aria-pressed') === 'true';
                const newState = !isPressed;
                
                motionToggle.setAttribute('aria-pressed', newState.toString());
                document.body.classList.toggle('theme-reduced-motion', newState);
                document.body.dataset.motion = newState ? 'off' : 'on';
                
                prefs.set('reduced_motion', newState);
                
                // Announce change
                app.components.announceToScreenReader(
                    `Motion ${newState ? 'reduced' : 'enabled'}`
                );
            });
        }

        // High contrast toggle
        if (contrastToggle) {
            const contrastPref = prefs.get('high_contrast');
            
            if (contrastPref) {
                document.body.classList.add('theme-high-contrast', 'high-contrast');
                contrastToggle.setAttribute('aria-pressed', 'true');
            }

            app.utils.on(contrastToggle, 'click', () => {
                const isPressed = contrastToggle.getAttribute('aria-pressed') === 'true';
                const newState = !isPressed;
                
                contrastToggle.setAttribute('aria-pressed', newState.toString());
                document.body.classList.toggle('theme-high-contrast', newState);
                document.body.classList.toggle('high-contrast', newState);
                
                prefs.set('high_contrast', newState);
                
                app.components.announceToScreenReader(
                    `High contrast ${newState ? 'enabled' : 'disabled'}`
                );
            });
        }

        // Large text toggle
        if (textToggle) {
            const textPref = prefs.get('large_text');
            
            if (textPref) {
                document.body.classList.add('theme-large-text', 'large-text');
                textToggle.setAttribute('aria-pressed', 'true');
            }

            app.utils.on(textToggle, 'click', () => {
                const isPressed = textToggle.getAttribute('aria-pressed') === 'true';
                const newState = !isPressed;
                
                textToggle.setAttribute('aria-pressed', newState.toString());
                document.body.classList.toggle('theme-large-text', newState);
                document.body.classList.toggle('large-text', newState);
                
                prefs.set('large_text', newState);
                
                app.components.announceToScreenReader(
                    `Large text ${newState ? 'enabled' : 'disabled'}`
                );
            });
        }
    };

    // Screen reader announcements
    app.components.announceToScreenReader = (message, priority = 'polite') => {
        const announcement = document.createElement('div');
        announcement.className = 'sr-only';
        announcement.setAttribute('aria-live', priority);
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    };

    // Live region for dynamic content
    app.components.createLiveRegion = () => {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        
        document.body.appendChild(liveRegion);
        
        return liveRegion;
    };

    // Enhanced keyboard navigation
    app.components.keyboardNavigation = () => {
        let focusOutlineEnabled = true;

        // Show focus outlines when navigating with keyboard
        app.utils.on(document, 'keydown', (e) => {
            if (e.key === 'Tab') {
                focusOutlineEnabled = true;
                document.body.classList.add('keyboard-nav');
            }
        });

        // Hide focus outlines when using mouse
        app.utils.on(document, 'mousedown', () => {
            focusOutlineEnabled = false;
            document.body.classList.remove('keyboard-nav');
        });

        // Skip links navigation
        const skipLinks = app.utils.$$('.skip, .skip-link');
        skipLinks.forEach(link => {
            app.utils.on(link, 'click', (e) => {
                e.preventDefault();
                const target = app.utils.$(link.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                    app.components.announceToScreenReader(`Skipped to ${target.textContent || 'main content'}`);
                }
            });
        });

        // Roving tabindex for carousel dots
        const initRovingTabindex = (container, itemSelector) => {
            const items = container.querySelectorAll(itemSelector);
            if (items.length === 0) return;

            let focusedIndex = 0;

            const setFocusedItem = (index) => {
                items.forEach((item, i) => {
                    item.setAttribute('tabindex', i === index ? '0' : '-1');
                });
                focusedIndex = index;
            };

            app.utils.on(container, 'keydown', (e) => {
                const activeElement = document.activeElement;
                const currentIndex = Array.from(items).indexOf(activeElement);

                if (currentIndex === -1) return;

                let newIndex = currentIndex;

                switch (e.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        newIndex = (currentIndex - 1 + items.length) % items.length;
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        newIndex = (currentIndex + 1) % items.length;
                        break;
                    case 'Home':
                        e.preventDefault();
                        newIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        newIndex = items.length - 1;
                        break;
                    default:
                        return;
                }

                setFocusedItem(newIndex);
                items[newIndex].focus();
            });

            // Initialize
            setFocusedItem(0);
        };

        // Apply roving tabindex to carousel controls
        const ctaSlider = app.utils.$('#ctaSlider .dots');
        if (ctaSlider) {
            initRovingTabindex(ctaSlider, 'button');
        }

        const appCarousel = app.utils.$('#appShow .app-dots');
        if (appCarousel) {
            initRovingTabindex(appCarousel, 'button');
        }
    };

    // Form accessibility enhancements
    app.components.formAccessibility = () => {
        // Add aria-describedby to form fields with error messages
        const forms = app.utils.$$('form');
        
        forms.forEach(form => {
            const fields = form.querySelectorAll('input, textarea, select');
            
            fields.forEach(field => {
                const fieldName = field.name || field.id;
                const errorElement = form.querySelector(`#err-${fieldName}, .err[data-field="${fieldName}"]`);
                
                if (errorElement) {
                    field.setAttribute('aria-describedby', errorElement.id || `err-${fieldName}`);
                    
                    // Add invalid state when error is visible
                    const observer = new MutationObserver(() => {
                        const isVisible = errorElement.style.display !== 'none' && 
                                        !errorElement.hasAttribute('hidden');
                        field.setAttribute('aria-invalid', isVisible.toString());
                    });
                    
                    observer.observe(errorElement, { 
                        attributes: true, 
                        attributeFilter: ['style', 'hidden'] 
                    });
                }
            });

            // Announce form submission results
            app.utils.on(form, 'submit', (e) => {
                setTimeout(() => {
                    const errors = form.querySelectorAll('.err:not([style*="display: none"])');
                    if (errors.length > 0) {
                        app.components.announceToScreenReader(
                            `Form has ${errors.length} error${errors.length > 1 ? 's' : ''}. Please review and correct.`,
                            'assertive'
                        );
                        // Focus first error field
                        const firstErrorField = errors[0].closest('.field')?.querySelector('input, textarea, select');
                        if (firstErrorField) {
                            firstErrorField.focus();
                        }
                    }
                }, 100);
            });
        });
    };

    // Dynamic content announcements
    app.components.dynamicContentAnnouncements = () => {
        // Announce carousel slide changes
        const observeCarouselChanges = (carousel, slideSelector) => {
            const slides = carousel.querySelectorAll(slideSelector);
            
            const observer = new MutationObserver(() => {
                const activeSlide = carousel.querySelector('[aria-current="true"]');
                if (activeSlide) {
                    const slideIndex = Array.from(slides).indexOf(activeSlide.closest(slideSelector)) + 1;
                    const totalSlides = slides.length;
                    const slideTitle = activeSlide.closest(slideSelector)?.querySelector('h1, h2, h3')?.textContent;
                    
                    app.components.announceToScreenReader(
                        `Slide ${slideIndex} of ${totalSlides}${slideTitle ? ': ' + slideTitle : ''}`
                    );
                }
            });
            
            observer.observe(carousel, { 
                attributes: true, 
                subtree: true, 
                attributeFilter: ['aria-current'] 
            });
        };

        const ctaSlider = app.utils.$('#ctaSlider');
        if (ctaSlider) {
            observeCarouselChanges(ctaSlider, '.slide');
        }

        const appCarousel = app.utils.$('#appShow');
        if (appCarousel) {
            observeCarouselChanges(appCarousel, '.app-card');
        }

        // Announce KPI counter updates
        const kpiCounters = app.utils.$$('.kpi .num');
        kpiCounters.forEach(counter => {
            const observer = new MutationObserver(() => {
                const label = counter.nextElementSibling?.textContent;
                if (label) {
                    app.components.announceToScreenReader(
                        `${label}: ${counter.textContent}`
                    );
                }
            });
            
            observer.observe(counter, { childList: true, characterData: true });
        });
    };

    // Color blind friendly themes
    app.components.colorBlindSupport = () => {
        // Detect if user might benefit from colorblind-friendly palette
        const userAgent = navigator.userAgent.toLowerCase();
        const hasColorBlindExtension = userAgent.includes('colorblind') || 
                                     userAgent.includes('dalton');
        
        if (hasColorBlindExtension || prefs.get('colorblind_friendly')) {
            document.body.classList.add('theme-colorblind');
        }

        // Add manual toggle (could be added to accessibility menu)
        window.toggleColorBlindFriendly = () => {
            const isEnabled = document.body.classList.contains('theme-colorblind');
            document.body.classList.toggle('theme-colorblind', !isEnabled);
            prefs.set('colorblind_friendly', !isEnabled);
            
            app.components.announceToScreenReader(
                `Color blind friendly mode ${!isEnabled ? 'enabled' : 'disabled'}`
            );
        };
    };

    // Font preference support
    app.components.fontPreferences = () => {
        const dyslexiaFriendly = prefs.get('dyslexia_friendly');
        
        if (dyslexiaFriendly) {
            document.body.classList.add('theme-dyslexia');
        }

        // Manual toggle for dyslexia-friendly font
        window.toggleDyslexiaFont = () => {
            const isEnabled = document.body.classList.contains('theme-dyslexia');
            document.body.classList.toggle('theme-dyslexia', !isEnabled);
            prefs.set('dyslexia_friendly', !isEnabled);
            
            app.components.announceToScreenReader(
                `Dyslexia friendly font ${!isEnabled ? 'enabled' : 'disabled'}`
            );
        };
    };

    // Media query listeners for system preferences
    app.components.systemPreferenceListeners = () => {
        // Reduced motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionChange = (e) => {
            if (e.matches && !prefs.get('reduced_motion')) {
                document.body.classList.add('theme-reduced-motion');
                document.body.dataset.motion = 'off';
                
                const motionToggle = app.utils.$('#tog-motion');
                if (motionToggle) {
                    motionToggle.setAttribute('aria-pressed', 'true');
                }
            }
        };
        
        motionQuery.addListener(handleMotionChange);
        handleMotionChange(motionQuery);

        // High contrast
        const contrastQuery = window.matchMedia('(prefers-contrast: high)');
        const handleContrastChange = (e) => {
            if (e.matches && !prefs.get('high_contrast')) {
                document.body.classList.add('theme-high-contrast', 'high-contrast');
                
                const contrastToggle = app.utils.$('#tog-contrast');
                if (contrastToggle) {
                    contrastToggle.setAttribute('aria-pressed', 'true');
                }
            }
        };
        
        contrastQuery.addListener(handleContrastChange);
        handleContrastChange(contrastQuery);

        // Color scheme
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleColorSchemeChange = (e) => {
            // The default theme is already dark, but could add light theme support here
            if (!e.matches && !document.body.classList.contains('theme-light')) {
                // Could enable light theme automatically
            }
        };
        
        darkQuery.addListener(handleColorSchemeChange);
        handleColorSchemeChange(darkQuery);
    };

    // Initialize all accessibility features
    const initAccessibility = () => {
        app.components.accessibilityToggles();
        app.components.createLiveRegion();
        app.components.keyboardNavigation();
        app.components.formAccessibility();
        app.components.dynamicContentAnnouncements();
        app.components.colorBlindSupport();
        app.components.fontPreferences();
        app.components.systemPreferenceListeners();
        
        // Add CSS for keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-nav *:focus {
                outline: 3px solid var(--glow) !important;
                outline-offset: 2px !important;
            }
            
            .keyboard-nav *:focus:not(:focus-visible) {
                outline: none !important;
            }
        `;
        document.head.appendChild(style);
        
        console.log('Accessibility features initialized');
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibility);
    } else {
        initAccessibility();
    }

})();

//END - OUTSINC/assets/js/accessibility.js