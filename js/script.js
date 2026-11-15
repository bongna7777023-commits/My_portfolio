/* ============================================================
   Theme, navigation, active links, back-to-top, and contact form
   ============================================================ */

(function () {
    'use strict';

    const root = document.documentElement;
    const body = document.body;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const THEME_KEY = 'portfolio-theme';

    /* ============================================================
       Theme
       ============================================================ */

    const themeToggle = document.getElementById('themeToggle');
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function setTheme(theme) {
        const isLight = theme === 'light';

        root.setAttribute('data-theme', isLight ? 'light' : 'dark');
        root.style.colorScheme = isLight ? 'light' : 'dark';

        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', String(isLight));
            themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
        }

        if (themeMeta) {
            themeMeta.setAttribute('content', isLight ? '#f6f7fc' : '#05060f');
        }

        try {
            localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
        } catch (error) {
            /* Storage can be unavailable in private browsing; ignore. */
        }
    }

    setTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
        });
    }

    window.addEventListener('storage', function (event) {
        if (event.key === THEME_KEY) {
            setTheme(event.newValue === 'light' ? 'light' : 'dark');
        }
    });

    /* ============================================================
       Mobile navigation
       ============================================================ */

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navBackdrop = document.getElementById('navBackdrop');

    function closeNav(restoreFocus) {
        if (!navToggle || !navMenu) {
            return;
        }

        const wasOpen = navToggle.getAttribute('aria-expanded') === 'true';

        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
        navMenu.classList.remove('is-open');
        body.classList.remove('nav-open');

        if (navBackdrop) {
            navBackdrop.classList.remove('is-visible');
        }

        if (wasOpen && restoreFocus) {
            navToggle.focus();
        }
    }

    function openNav() {
        if (!navToggle || !navMenu) {
            return;
        }

        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close navigation menu');
        navMenu.classList.add('is-open');
        body.classList.add('nav-open');

        if (navBackdrop) {
            navBackdrop.classList.add('is-visible');
        }

        const firstLink = navMenu.querySelector('a');
        if (firstLink) {
            window.setTimeout(function () {
                firstLink.focus({ preventScroll: true });
            }, 60);
        }
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            if (navToggle.getAttribute('aria-expanded') === 'true') {
                closeNav(true);
            } else {
                openNav();
            }
        });

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeNav(false);
            });
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', function () {
            closeNav(true);
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
            closeNav(true);
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024) {
            closeNav(false);
        }
    });

    /* ============================================================
       Active navigation link
       ============================================================ */

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));

    function updateActiveLink() {
        if (sections.length === 0 || navLinks.length === 0) {
            return;
        }

        const navHeight = parseInt(window.getComputedStyle(root).getPropertyValue('--nav-h'), 10) || 76;
        const probe = window.scrollY + navHeight + 120;
        let current = sections[0];

        sections.forEach(function (section) {
            const top = section.getBoundingClientRect().top + window.scrollY;

            if (top <= probe) {
                current = section;
            }
        });

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
            current = sections[sections.length - 1];
        }

        navLinks.forEach(function (link) {
            const isActive = link.getAttribute('href') === '#' + current.id;

            link.classList.toggle('is-active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    /* ============================================================
       Scroll state: navbar, back-to-top, active link
       ============================================================ */

    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    let scrollTicking = false;

    function updateScrollState() {
        if (navbar) {
            navbar.classList.toggle('is-scrolled', window.scrollY > 16);
        }

        if (backToTop) {
            backToTop.hidden = window.scrollY < 600;
        }

        updateActiveLink();
    }

    function onScroll() {
        if (scrollTicking) {
            return;
        }

        scrollTicking = true;
        window.requestAnimationFrame(function () {
            scrollTicking = false;
            updateScrollState();
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
        });
    }

    /* ============================================================
       Anchor links: keep keyboard focus in sync
       ============================================================ */

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function () {
            const hash = anchor.getAttribute('href');

            if (!hash || hash === '#') {
                return;
            }

            const target = document.getElementById(hash.slice(1));

            if (!target) {
                return;
            }

            if (!target.hasAttribute('tabindex')) {
                target.setAttribute('tabindex', '-1');
            }

            window.setTimeout(function () {
                try {
                    target.focus({ preventScroll: true });
                } catch (error) {
                    target.focus();
                }
            }, reduceMotion ? 30 : 500);
        });
    });

    /* ============================================================
       Contact form
       ============================================================ */

    const form = document.getElementById('contactForm');

    if (form) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const websiteInput = document.getElementById('website');
        const statusBox = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitBtn');
        const emailFallback = form.getAttribute('data-contact-email') || '';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function clearStatus() {
            if (!statusBox) {
                return;
            }

            statusBox.className = 'form-status';
            statusBox.textContent = '';
        }

        function showStatus(type, message, includeEmailLink) {
            if (!statusBox) {
                return;
            }

            clearStatus();
            statusBox.classList.add('is-visible', 'is-' + type);
            statusBox.appendChild(document.createTextNode(message));

            if (includeEmailLink && emailFallback) {
                const link = document.createElement('a');
                link.href = 'mailto:' + emailFallback;
                link.textContent = 'email me directly';

                statusBox.appendChild(document.createTextNode(' '));
                statusBox.appendChild(link);
                statusBox.appendChild(document.createTextNode('.'));
            }
        }

        function setLoading(isLoading) {
            if (!submitBtn) {
                return;
            }

            const label = submitBtn.querySelector('.btn-label');

            submitBtn.disabled = isLoading;
            submitBtn.classList.toggle('is-loading', isLoading);

            if (label) {
                label.textContent = isLoading ? 'Sending...' : 'Send message';
            }
        }

        function markInvalid(field, message) {
            if (field) {
                field.setAttribute('aria-invalid', 'true');
                field.focus();
            }

            showStatus('error', message);
        }

        function clearInvalidState() {
            [nameInput, emailInput, messageInput].forEach(function (field) {
                if (field) {
                    field.removeAttribute('aria-invalid');
                }
            });
        }

        form.addEventListener('input', function () {
            if (statusBox && statusBox.classList.contains('is-error')) {
                clearStatus();
            }
        });

        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            clearInvalidState();

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            const honeypot = websiteInput ? websiteInput.value.trim() : '';

            /* Bots that fill the hidden field receive a normal-looking response. */
            if (honeypot) {
                showStatus('success', 'Message sent successfully. Thank you!');
                form.reset();
                return;
            }

            if (!name) {
                markInvalid(nameInput, 'Please enter your name.');
                return;
            }

            if (name.length < 2) {
                markInvalid(nameInput, 'Please enter at least 2 characters for your name.');
                return;
            }

            if (!emailPattern.test(email)) {
                markInvalid(emailInput, 'Please enter a valid email address.');
                return;
            }

            if (!message) {
                markInvalid(messageInput, 'Please write a message.');
                return;
            }

            if (message.length < 10) {
                markInvalid(messageInput, 'Please write at least 10 characters so I can help.');
                return;
            }

            const controller = new AbortController();
            const timeoutId = window.setTimeout(function () {
                controller.abort();
            }, 15000);

            setLoading(true);
            clearStatus();

            try {
                const response = await fetch('api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        website: honeypot
                    }),
                    signal: controller.signal
                });

                let payload = null;

                try {
                    payload = await response.json();
                } catch (parseError) {
                    payload = null;
                }

                if (!response.ok || (payload && payload.ok === false)) {
                    if (response.status === 404 || response.status === 405) {
                        throw new Error('unavailable');
                    }

                    throw new Error('send-failed');
                }

                showStatus('success', 'Message sent successfully. Thank you for reaching out!');
                form.reset();
            } catch (error) {
                if (error.name === 'AbortError') {
                    showStatus('error', 'The request timed out. Please try again, or', true);
                } else if (error.message === 'unavailable') {
                    showStatus('error', 'The contact service is not available on this deployment yet. Please', true);
                } else {
                    showStatus('error', 'Your message could not be sent right now. Please try again, or', true);
                }
            } finally {
                window.clearTimeout(timeoutId);
                setLoading(false);
            }
        });
    }

    /* ============================================================
       Footer year and initial state
       ============================================================ */

    const year = document.getElementById('year');

    if (year) {
        year.textContent = String(new Date().getFullYear());
    }

    updateScrollState();
})();
