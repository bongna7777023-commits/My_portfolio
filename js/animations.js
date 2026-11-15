/* ============================================================
   Scroll reveal, counters, and skill bars
   ============================================================ */

(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsObserver = 'IntersectionObserver' in window;

    /* ---------- Scroll reveal ---------- */

    const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));

    if (revealItems.length > 0) {
        if (reduceMotion || !supportsObserver) {
            revealItems.forEach(function (item) {
                item.classList.add('is-revealed');
            });
        } else {
            document.body.classList.add('reveal-init');

            const revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('is-revealed');
                    revealObserver.unobserve(entry.target);
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            });

            revealItems.forEach(function (item) {
                revealObserver.observe(item);
            });
        }
    }

    /* ---------- Hero counters ---------- */

    const counters = Array.from(document.querySelectorAll('[data-count]'));

    function animateCounter(element) {
        const target = Number(element.getAttribute('data-count'));
        const suffix = element.getAttribute('data-suffix') || '';

        if (!Number.isFinite(target)) {
            return;
        }

        if (reduceMotion) {
            element.textContent = target + suffix;
            return;
        }

        const duration = 1400;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            element.textContent = Math.round(target * eased) + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(tick);
            }
        }

        window.requestAnimationFrame(tick);
    }

    if (counters.length > 0) {
        if (reduceMotion || !supportsObserver) {
            counters.forEach(animateCounter);
        } else {
            const counterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                });
            }, { threshold: 0.4 });

            counters.forEach(function (counter) {
                counterObserver.observe(counter);
            });
        }
    }

    /* ---------- Skill bars ---------- */

    const bars = Array.from(document.querySelectorAll('.skill-bar-fill'));
    const skillsSection = document.getElementById('skills');

    function fillSkillBars() {
        bars.forEach(function (bar, index) {
            const percentage = Number(bar.getAttribute('data-percentage'));

            if (!Number.isFinite(percentage)) {
                return;
            }

            if (reduceMotion) {
                bar.style.width = percentage + '%';
                return;
            }

            window.setTimeout(function () {
                bar.style.width = percentage + '%';
            }, Math.min(index * 55, 440));
        });
    }

    if (bars.length > 0) {
        if (reduceMotion || !supportsObserver || !skillsSection) {
            fillSkillBars();
        } else {
            const skillObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    fillSkillBars();
                    skillObserver.disconnect();
                });
            }, { threshold: 0.2 });

            skillObserver.observe(skillsSection);
        }
    }
})();
