/* =========================================================
   Header, mobile menu, theme toggle, register dock
   Owner: Parthvi + Pushkar
   ========================================================= */

(function () {
    'use strict';

    const header = document.getElementById('site-header');
    const progress = document.getElementById('scroll-progress');
    const menu = document.getElementById('menu');
    const menuBtn = document.getElementById('menu-btn');
    const themeBtn = document.getElementById('theme-toggle');
    const dock = document.getElementById('dock');
    const main = document.getElementById('main');
    const footer = document.getElementById('site-footer');

    if (!header) {
        return;
    }


    /* ---------- Glass header + scroll progress ---------- */

    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 8);
        if (progress) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();


    /* ---------- Theme toggle ---------- */

    function syncThemeLabel() {
        if (!themeBtn) return;
        const next = IEEEDay.getTheme() === 'dark' ? 'light' : 'dark';
        themeBtn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            IEEEDay.setTheme(IEEEDay.getTheme() === 'dark' ? 'light' : 'dark', true);
        });
        document.addEventListener('ieeeday:themechange', syncThemeLabel);
        syncThemeLabel();
    }


    /* ---------- Mobile menu ---------- */

    let closeTimer = null;

    function isMenuOpen() {
        return menuBtn && menuBtn.getAttribute('aria-expanded') === 'true';
    }

    function setBackgroundInert(value) {
        [main, footer, dock].forEach(function (el) {
            if (el) el.inert = value;
        });
    }

    function openMenu() {
        clearTimeout(closeTimer);
        menu.hidden = false;
        void menu.offsetHeight; // commit the closed state so the reveal animates
        menu.classList.add('is-open');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.setAttribute('aria-label', 'Close menu');
        header.classList.add('is-menu-open');
        document.body.classList.add('is-menu-open');
        setBackgroundInert(true);
        const first = menu.querySelector('a');
        if (first) first.focus({ preventScroll: true });
    }

    function closeMenu(returnFocus) {
        menu.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open menu');
        header.classList.remove('is-menu-open');
        document.body.classList.remove('is-menu-open');
        setBackgroundInert(false);
        updateDock();
        closeTimer = setTimeout(function () { menu.hidden = true; }, 550);
        if (returnFocus) menuBtn.focus();
    }

    if (menu && menuBtn) {
        menuBtn.addEventListener('click', function () {
            if (isMenuOpen()) {
                closeMenu(false);
            } else {
                openMenu();
            }
        });

        // Tapping a link closes the menu; the browser then scrolls to the section.
        menu.addEventListener('click', function (event) {
            if (event.target.closest('a')) closeMenu(false);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && isMenuOpen()) closeMenu(true);
        });

        window.matchMedia('(min-width: 1024px)').addEventListener('change', function (event) {
            if (event.matches && isMenuOpen()) closeMenu(false);
        });
    }


    /* ---------- Active nav link ---------- */

    const navLinks = document.querySelectorAll('.site-nav__link');

    if (navLinks.length && 'IntersectionObserver' in window) {
        const byId = {};
        navLinks.forEach(function (link) {
            byId[link.getAttribute('href').slice(1)] = link;
        });

        const navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                const link = byId[entry.target.id];
                if (link && entry.isIntersecting) {
                    navLinks.forEach(function (l) {
                        l.classList.remove('is-active');
                        l.removeAttribute('aria-current');
                    });
                    link.classList.add('is-active');
                    link.setAttribute('aria-current', 'true');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        Object.keys(byId).forEach(function (id) {
            const section = document.getElementById(id);
            if (section) navObserver.observe(section);
        });
    }


    /* ---------- Register dock (phones) ----------
       Shows once the hero is gone, hides while the registration
       list or footer is on screen (the real buttons are right there). */

    const seen = { hero: true, register: false, footer: false };

    function updateDock() {
        if (!dock) return;
        const show = !seen.hero && !seen.register && !seen.footer && !isMenuOpen();
        dock.classList.toggle('is-visible', show);
        dock.inert = !show;
    }

    if (dock && 'IntersectionObserver' in window) {
        const targets = {
            hero: document.getElementById('top'),
            register: document.getElementById('register'),
            footer: footer
        };

        const dockObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                Object.keys(targets).forEach(function (key) {
                    if (targets[key] === entry.target) seen[key] = entry.isIntersecting;
                });
            });
            updateDock();
        }, { threshold: 0 });

        Object.keys(targets).forEach(function (key) {
            if (targets[key]) dockObserver.observe(targets[key]);
        });
    }
})();
