/* =========================================================
   Shared JavaScript foundation
   Owner: Priyanshi

   Runs before every team file. Keep this tiny: only helpers
   that more than one section needs belong here.
   - IEEEDay.prefersReducedMotion()
   - IEEEDay.setTheme('light' | 'dark') / IEEEDay.getTheme()
   - Scroll reveal for [data-reveal]
   - "Decode" effect for [data-scramble] text inside revealed blocks
   - Registration buttons: [data-registration-url]
   ========================================================= */

(function () {
    'use strict';

    const root = document.documentElement;
    const THEME_KEY = 'ieeeday-theme';
    const THEME_COLORS = { light: '#F4F0E7', dark: '#0A1224' };

    // The inline script in <head> already adds this; kept here as a safety net.
    root.classList.add('js');

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function getTheme() {
        return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    // save = true when the visitor picked it (toggle), false when we follow the device
    function setTheme(theme, save) {
        root.setAttribute('data-theme', theme);
        document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
            meta.setAttribute('content', THEME_COLORS[theme]);
        });
        if (save) {
            try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* private mode */ }
        }
        document.dispatchEvent(new CustomEvent('ieeeday:themechange', { detail: { theme: theme } }));
    }

    function hasSavedTheme() {
        try { return !!localStorage.getItem(THEME_KEY); } catch (e) { return false; }
    }

    // Shared helpers — use as IEEEDay.prefersReducedMotion() in your file.
    window.IEEEDay = {
        // true if the visitor asked their OS for less animation. Check it
        // before starting any JS animation.
        prefersReducedMotion: function () {
            return reducedMotionQuery.matches;
        },
        getTheme: getTheme,
        setTheme: setTheme
    };

    // Sync the browser bar colour with the theme picked in <head>.
    setTheme(getTheme(), false);

    // Follow the device theme live, unless the visitor chose one.
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (event) {
        if (!hasSavedTheme()) {
            setTheme(event.matches ? 'light' : 'dark', false);
        }
    });


    /* ---------- Scroll reveal ---------- */

    const revealEls = document.querySelectorAll('[data-reveal]');

    // Stagger siblings (tickets, timeline items) so they cascade in.
    revealEls.forEach(function (el) {
        const siblings = Array.prototype.filter.call(el.parentElement.children, function (child) {
            return child.hasAttribute('data-reveal');
        });
        const index = siblings.indexOf(el);
        if (index > 0) {
            el.style.transitionDelay = Math.min(index, 5) * 70 + 'ms';
        }
    });

    /* Decode: letters cycle through glyphs and lock in left to right. */
    const GLYPHS = '01<>/[]{}#*+=_-';

    function scramble(el) {
        const final = el.textContent;
        const total = 22;
        let frame = 0;
        el.style.minWidth = el.offsetWidth + 'px';
        function tick() {
            const locked = Math.floor((frame / total) * final.length);
            let out = '';
            for (let i = 0; i < final.length; i++) {
                const ch = final[i];
                out += (i < locked || ch === ' ') ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
            el.textContent = out;
            if (frame++ < total) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = final;
                el.style.minWidth = '';
            }
        }
        tick();
    }

    function reveal(el) {
        el.classList.add('is-in');
        if (!reducedMotionQuery.matches) {
            el.querySelectorAll('[data-scramble]').forEach(scramble);
        }
    }

    if (!('IntersectionObserver' in window) || reducedMotionQuery.matches) {
        revealEls.forEach(function (el) { el.classList.add('is-in'); });
    } else {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        revealEls.forEach(function (el) { revealObserver.observe(el); });
    }


    /* ---------- Registration buttons ----------
       Paste a Google Form link into data-registration-url="..." in
       index.html and the button switches on. Empty = stays disabled. */

    document.querySelectorAll('[data-registration-url]').forEach(function (link) {
        const url = link.getAttribute('data-registration-url').trim();
        if (url) {
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.removeAttribute('aria-disabled');
        } else {
            link.title = 'Registration link opens soon';
            link.addEventListener('click', function (event) { event.preventDefault(); });
        }
    });
})();
