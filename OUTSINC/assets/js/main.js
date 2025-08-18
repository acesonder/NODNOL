//START - OUTSINC/assets/js/main.js

/* =====================================================
   LONDONS OUTSINCE Main JavaScript
   - Core functionality and utilities
   - Route handling and form management
   ===================================================== */

(function() {
    'use strict';

    // Global app object
    window.LondonsOutsince = {
        config: {
            version: '1.0.0',
            debug: false
        },
        utils: {},
        components: {}
    };

    const app = window.LondonsOutsince;

    // Utility Functions
    app.utils = {
        // DOM utilities
        $: (selector, context = document) => context.querySelector(selector),
        $$: (selector, context = document) => context.querySelectorAll(selector),
        
        // Event handling
        on: (element, event, handler, options = {}) => {
            if (typeof element === 'string') {
                element = app.utils.$(element);
            }
            if (element) {
                element.addEventListener(event, handler, options);
            }
        },

        // Local storage helpers
        storage: {
            get: (key, defaultValue = null) => {
                try {
                    const value = localStorage.getItem(key);
                    return value ? JSON.parse(value) : defaultValue;
                } catch {
                    return defaultValue;
                }
            },
            set: (key, value) => {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch {
                    return false;
                }
            },
            remove: (key) => {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch {
                    return false;
                }
            }
        },

        // Animation helpers
        animate: {
            countUp: (element, target, duration = 2000) => {
                const start = 0;
                const increment = target / (duration / 16);
                let current = start;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    element.textContent = Math.floor(current).toLocaleString();
                }, 16);
            }
        },

        // Debounce function
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Show/hide elements
        show: (element) => {
            if (typeof element === 'string') {
                element = app.utils.$(element);
            }
            if (element) {
                element.style.display = '';
                element.removeAttribute('hidden');
            }
        },

        hide: (element) => {
            if (typeof element === 'string') {
                element = app.utils.$(element);
            }
            if (element) {
                element.style.display = 'none';
                element.setAttribute('hidden', '');
            }
        },

        // Toast notifications
        toast: (message, type = 'info', duration = 3000) => {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--surface);
                border: 1px solid var(--line);
                color: var(--ink);
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: var(--shadow);
                z-index: 10000;
                animation: slideInUp 0.3s ease;
            `;

            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideOutDown 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    };

    // KPI Counter Animation
    app.components.kpiCounters = () => {
        const counters = app.utils.$$('.kpi .num');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    app.utils.animate.countUp(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(counter => observer.observe(counter));

        // Auto-refresh demo (every 2 minutes)
        setInterval(() => {
            counters.forEach(counter => {
                const current = parseInt(counter.dataset.target);
                const increment = Math.max(1, Math.round(current * 0.002));
                counter.dataset.target = (current + increment).toString();
            });
        }, 120000);
    };

    // Route Handler
    app.components.routeHandler = () => {
        const routes = {
            'start-care': '/client/momcare/',
            'learn-care': '/about/momcare',
            'explore-apps': '/#platforms',
            'compare': '/apps/compare',
            'survey': '/client/assessment',
            'survey-info': '/about/assessment',
            'partner': '/providers/apply',
            'partner-learn': '/providers/guide',
            'resources': '/resources/',
            'resources-info': '/resources/categories'
        };

        app.utils.on(document, 'click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            e.preventDefault();
            const action = btn.getAttribute('data-action');
            const route = routes[action];

            if (route) {
                if (route.startsWith('#')) {
                    // Smooth scroll to section
                    const target = app.utils.$(route);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    // Show route info (replace with actual navigation)
                    app.utils.toast(`Navigating to: ${route}`, 'info');
                    console.log(`Action: ${action}, Route: ${route}`);
                }
            }
        });
    };

    // Report Form Handler
    app.components.reportForm = () => {
        const form = app.utils.$('#issue-form');
        if (!form) return;

        app.utils.on(form, 'submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const issue = formData.get('issue').trim();
            const category = formData.get('cat');
            
            // Validation
            const issueError = app.utils.$('#err-issue');
            const catError = app.utils.$('#err-cat');
            
            let isValid = true;
            
            if (issue.length < 5) {
                app.utils.show(issueError);
                isValid = false;
            } else {
                app.utils.hide(issueError);
            }
            
            if (!category) {
                app.utils.show(catError);
                isValid = false;
            } else {
                app.utils.hide(catError);
            }
            
            if (!isValid) return;
            
            // Show success message
            app.utils.toast('Report submitted. Thank you for helping keep our community safe.', 'success');
            form.reset();
        });
    };

    // Resource Directory
    app.components.resourceDirectory = () => {
        const categoryFilter = app.utils.$('#category-filter');
        const openNowFilter = app.utils.$('#open-now');
        const resourceGrid = app.utils.$('#resource-grid');
        
        if (!categoryFilter || !resourceGrid) return;

        const filterResources = () => {
            const selectedCategory = categoryFilter.value;
            const openNowOnly = openNowFilter?.checked;
            const resources = app.utils.$$('.resource-card', resourceGrid);
            
            resources.forEach(resource => {
                const category = resource.dataset.category;
                const isOpen = resource.querySelector('.resource-hours')?.textContent.includes('24/7') || 
                              new Date().getHours() >= 9 && new Date().getHours() < 17;
                
                let show = true;
                
                if (selectedCategory && category !== selectedCategory) {
                    show = false;
                }
                
                if (openNowOnly && !isOpen) {
                    show = false;
                }
                
                resource.style.display = show ? '' : 'none';
            });
        };

        app.utils.on(categoryFilter, 'change', filterResources);
        app.utils.on(openNowFilter, 'change', filterResources);

        // Save favorites functionality
        app.utils.on(resourceGrid, 'click', (e) => {
            if (e.target.classList.contains('save-favorite')) {
                const resourceId = e.target.dataset.resource;
                const favorites = app.utils.storage.get('favorites', []);
                
                if (favorites.includes(resourceId)) {
                    // Remove from favorites
                    const index = favorites.indexOf(resourceId);
                    favorites.splice(index, 1);
                    e.target.textContent = 'Save';
                    e.target.classList.remove('saved');
                    app.utils.toast('Removed from favorites', 'info');
                } else {
                    // Add to favorites
                    favorites.push(resourceId);
                    e.target.textContent = 'Saved';
                    e.target.classList.add('saved');
                    app.utils.toast('Added to favorites', 'success');
                }
                
                app.utils.storage.set('favorites', favorites);
            }
        });

        // Load saved favorites
        const favorites = app.utils.storage.get('favorites', []);
        favorites.forEach(resourceId => {
            const btn = app.utils.$(`[data-resource="${resourceId}"]`);
            if (btn) {
                btn.textContent = 'Saved';
                btn.classList.add('saved');
            }
        });
    };

    // Contact Form Handlers
    app.components.contactHandlers = () => {
        // Open Chat
        app.utils.on('#open-chat', 'click', () => {
            const chatBubble = app.utils.$('#chatBubble');
            if (chatBubble) {
                chatBubble.click();
            }
        });

        // Send Message Modal
        app.utils.on('#send-message', 'click', () => {
            app.utils.toast('Message form would open here', 'info');
        });

        // Call Back Form
        app.utils.on('#call-back', 'click', () => {
            const name = prompt('Your name:');
            const phone = prompt('Your phone number:');
            
            if (name && phone) {
                app.utils.toast(`Thank you ${name}. We'll call you back at ${phone} within 2 hours.`, 'success');
            }
        });

        // Suggest Update Form
        app.utils.on('#suggest-update', 'click', () => {
            app.utils.toast('Resource update form would open here', 'info');
        });
    };

    // Privacy Modal
    app.components.privacyModal = () => {
        const modal = app.utils.$('#privacy-modal');
        const privacyLink = app.utils.$('.privacy-link');
        const closeBtn = app.utils.$('.modal-close', modal);
        
        if (!modal || !privacyLink) return;

        app.utils.on(privacyLink, 'click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            // Focus first focusable element
            const firstFocusable = modal.querySelector('button, a, input, textarea, select');
            if (firstFocusable) firstFocusable.focus();
        });

        app.utils.on(closeBtn, 'click', () => {
            modal.style.display = 'none';
            privacyLink.focus(); // Return focus
        });

        app.utils.on(modal, 'click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                privacyLink.focus();
            }
        });

        // Escape key to close
        app.utils.on(document, 'keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                privacyLink.focus();
            }
        });
    };

    // Keyboard Navigation
    app.components.keyboardNav = () => {
        // Arrow key navigation for carousels
        app.utils.on(document, 'keydown', (e) => {
            const activeCarousel = e.target.closest('.slider, .app-carousel');
            if (!activeCarousel) return;

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevBtn = activeCarousel.querySelector('.sbtn, .car-btn.prev');
                if (prevBtn) prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextBtn = activeCarousel.querySelector('#s-next, .car-btn.next');
                if (nextBtn) nextBtn.click();
            }
        });
    };

    // Initialize all components
    app.init = () => {
        console.log('Initializing LONDONS OUTSINCE v' + app.config.version);
        
        // Initialize components
        app.components.kpiCounters();
        app.components.routeHandler();
        app.components.reportForm();
        app.components.resourceDirectory();
        app.components.contactHandlers();
        app.components.privacyModal();
        app.components.keyboardNav();
        
        console.log('LONDONS OUTSINCE initialized successfully');
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', app.init);
    } else {
        app.init();
    }

})();

//END - OUTSINC/assets/js/main.js