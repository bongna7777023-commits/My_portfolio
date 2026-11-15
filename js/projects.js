/* ============================================================
   Project filtering
   ============================================================ */

(function () {
    'use strict';

    const grid = document.getElementById('projectsGrid');
    const status = document.getElementById('projectsStatus');
    const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));

    if (!grid || filterButtons.length === 0) {
        return;
    }

    const cards = Array.from(grid.querySelectorAll('.project-card'));
    const labels = {
        all: 'projects',
        web: 'web projects',
        design: 'app design projects'
    };

    function setFilter(filter) {
        filterButtons.forEach(function (button) {
            const isActive = button.getAttribute('data-filter') === filter;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });

        let visibleCount = 0;

        cards.forEach(function (card) {
            const matches = filter === 'all' || card.getAttribute('data-category') === filter;

            card.classList.toggle('is-hidden', !matches);
            card.classList.remove('is-appearing');

            if (!matches) {
                return;
            }

            visibleCount += 1;

            /* Restart the entrance animation for visible cards. */
            void card.offsetWidth;
            card.classList.add('is-appearing');

            window.setTimeout(function () {
                card.classList.remove('is-appearing');
            }, 450);
        });

        if (status) {
            status.textContent = 'Showing ' + visibleCount + ' ' + (labels[filter] || 'projects');
        }
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            setFilter(button.getAttribute('data-filter'));
        });
    });
})();
