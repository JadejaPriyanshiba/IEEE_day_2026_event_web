/* =========================================================
   Countdown to the first whistle (hero + mobile dock)
   Owner: Priyanshi
   Section: #top (hero)

   Target time comes from data-target on #countdown.
   ========================================================= */

(function () {
    'use strict';

    const countdown = document.getElementById('countdown');
    if (!countdown) {
        return;
    }

    const target = new Date(countdown.getAttribute('data-target')).getTime();
    const dayEnd = new Date('2026-10-06T23:59:59+05:30').getTime();

    const units = {};
    countdown.querySelectorAll('[data-unit]').forEach(function (el) {
        units[el.getAttribute('data-unit')] = el;
    });

    const status = document.getElementById('countdown-status');
    const readable = document.getElementById('countdown-text');
    const dock = document.getElementById('dock-countdown');
    const animate = !IEEEDay.prefersReducedMotion();

    let timer = null;
    let lastMinute = -1;

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function setUnit(name, value) {
        const el = units[name];
        if (!el || el.textContent === value) {
            return;
        }
        el.textContent = value;
        if (animate) {
            el.classList.remove('is-tick');
            void el.offsetWidth; // restart the animation
            el.classList.add('is-tick');
        }
    }

    function render() {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            ['days', 'hours', 'minutes', 'seconds'].forEach(function (u) { setUnit(u, '00'); });
            const live = now < dayEnd;
            const message = live ? "It's happening · live now" : "That's a wrap · thank you";
            if (status) status.textContent = message;
            if (dock) dock.textContent = live ? 'Live now' : "That's a wrap";
            if (readable) readable.textContent = live ? 'IEEE Day is happening now.' : 'IEEE Day 2026 has ended. Thank you for coming.';
            clearInterval(timer);
            return;
        }

        const days = Math.floor(diff / 864e5);
        const hours = Math.floor((diff % 864e5) / 36e5);
        const minutes = Math.floor((diff % 36e5) / 6e4);
        const seconds = Math.floor((diff % 6e4) / 1e3);

        setUnit('days', pad(days));
        setUnit('hours', pad(hours));
        setUnit('minutes', pad(minutes));
        setUnit('seconds', pad(seconds));

        if (dock) {
            dock.textContent = days > 0
                ? days + 'd ' + pad(hours) + 'h ' + pad(minutes) + 'm to go'
                : pad(hours) + ':' + pad(minutes) + ':' + pad(seconds) + ' to go';
        }

        // Screen-reader text: once a minute is plenty.
        if (readable && minutes !== lastMinute) {
            lastMinute = minutes;
            readable.textContent = days + ' days, ' + hours + ' hours and ' + minutes +
                ' minutes until IEEE Day starts on 6 October 2026 at 8:30 AM.';
        }
    }

    render();
    timer = setInterval(render, 1000);
})();
