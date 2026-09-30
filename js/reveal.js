/* =========================================================
   Reveal — Spec-o-meter + split-flap countdown
   Section: #reveal  (markup in index.html, styles in css/sections.css)

   Motion #03 from "Interaction & motion.pdf":
   "Needle creeps toward the red zone as 6 Oct approaches;
    split-flap tiles count down, the seconds flap drops every tick."

   - The needle sweeps up to today's reading once the panel is in view,
     then keeps creeping live with the clock.
   - Each tile shows the new digit at once; a leaf with the old digit's
     top half folds down over it (pure CSS animation, .is-falling).
   - Reduced motion: everything is shown instantly, nothing sweeps or folds.

   Loaded with "defer", so the HTML is ready when this runs.
   ========================================================= */

(function () {

    /* 06.10.2026 10:30 IST. Written in UTC because "+05:30" offsets
       don't parse in every browser. */
    var TARGET_MS = Date.UTC(2026, 9, 6, 5, 0, 0);
    /* The gauge reads 0% 30 days before (06.09.2026 10:30 IST), same as the mockup */
    var SPEC_START_MS = Date.UTC(2026, 8, 6, 5, 0, 0);

    var panel = document.querySelector('.instrument-panel');
    if (!panel) return;

    var needle   = document.getElementById('specometer-needle');
    var reading  = document.getElementById('specometer-number');
    var timerTxt = document.getElementById('countdown-text');
    var countdown = document.getElementById('countdown');

    var noMotion = window.IEEEDay && IEEEDay.prefersReducedMotion();

    var units = ['days', 'hours', 'minutes', 'seconds'].map(function (name) {
        var el = panel.querySelector('[data-unit="' + name + '"]');
        return el ? el.querySelectorAll('.flap') : [];
    });

    /* ── Gauge ─────────────────────────────────────────── */

    /* 0 → 1 across the 30 days before the event */
    function specFraction(now) {
        var f = (now - SPEC_START_MS) / (TARGET_MS - SPEC_START_MS);
        return Math.min(1, Math.max(0, f));
    }

    function drawGauge(f) {
        /* The needle is drawn pointing at 100%; rotate it back by the missing part */
        needle.setAttribute('transform', 'rotate(' + (-(1 - f) * 180).toFixed(2) + ' 240 250)');
        reading.textContent = Math.round(f * 100);
    }

    var gaugeLive = false;   /* true once the intro sweep has finished */

    function sweepGauge() {
        var target = specFraction(Date.now());
        if (noMotion) {
            drawGauge(target);
            gaugeLive = true;
            return;
        }

        var duration = 1600;
        var start = null;

        function step(ts) {
            if (start === null) start = ts;
            var t = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - t, 3);   /* ease-out cubic */
            drawGauge(target * eased);
            if (t < 1) requestAnimationFrame(step);
            else gaugeLive = true;
        }
        requestAnimationFrame(step);
    }

    /* ── Split-flap tiles ──────────────────────────────── */

    function setFlap(flap, digit, animate) {
        var old = flap.getAttribute('data-digit');
        if (old === digit) return;
        flap.setAttribute('data-digit', digit);
        flap.querySelector('.flap__num').textContent = digit;

        if (!animate || noMotion) return;
        var leaf = flap.querySelector('.flap__leaf');
        leaf.firstElementChild.textContent = old;
        leaf.classList.remove('is-falling');
        void leaf.offsetWidth;               /* restart the animation */
        leaf.classList.add('is-falling');
    }

    function setUnit(flaps, value, animate) {
        if (flaps.length < 2) return;
        var str = String(value).padStart(2, '0').slice(-2);
        setFlap(flaps[0], str[0], animate);
        setFlap(flaps[1], str[1], animate);
    }

    /* ── Clock ─────────────────────────────────────────── */

    var lastMinute = -1;

    function plural(n, word) {
        return n + ' ' + word + (n === 1 ? '' : 's');
    }

    function tick(animate) {
        var now = Date.now();
        var left = Math.max(0, Math.floor((TARGET_MS - now) / 1000));

        var d = Math.floor(left / 86400);
        var h = Math.floor(left % 86400 / 3600);
        var m = Math.floor(left % 3600 / 60);
        var s = left % 60;

        setUnit(units[0], d, animate);
        setUnit(units[1], h, animate);
        setUnit(units[2], m, animate);
        setUnit(units[3], s, animate);

        if (gaugeLive) drawGauge(specFraction(now));

        /* Screen-reader version, refreshed once a minute (not every second) */
        var minuteKey = Math.floor(left / 60);
        if (timerTxt && minuteKey !== lastMinute) {
            lastMinute = minuteKey;
            timerTxt.textContent = left > 0
                ? plural(d, 'day') + ', ' + plural(h, 'hour') + ' and ' + plural(m, 'minute') +
                  ' until IEEE Day starts, 6 October 2026 at 10:30 AM.'
                : 'IEEE Day has started.';
        }

        if (left === 0) {
            if (countdown) countdown.classList.add('countdown--expired');
            if (!gaugeLive) drawGauge(1);
            return;                          /* stop ticking */
        }

        /* Line up with the next full second so the flap drops on the beat */
        setTimeout(function () { tick(true); }, 1000 - (Date.now() % 1000) + 10);
    }

    /* Fill the tiles straight away, without folding */
    tick(false);

    /* Needle waits at 0 until the panel is actually seen */
    if ('IntersectionObserver' in window && !noMotion) {
        var observer = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting) return;
            observer.disconnect();
            sweepGauge();
        }, { threshold: 0.3 });
        observer.observe(panel);
    } else {
        sweepGauge();
    }

})();
