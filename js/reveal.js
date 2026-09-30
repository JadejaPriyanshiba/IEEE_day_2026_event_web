/* =========================================================
   Reveal — Countdown timer
   Section: #reveal

   Loaded with "defer", so the HTML is ready when this runs.
   Shared helpers from main.js: IEEEDay.prefersReducedMotion()

   Flip animation — correct 2-phase sequence:

   Phase 1  fc-flap-top (OLD digit, flat at 0°) rotates → -90° (folds away)
            fc-top / fc-bot still show OLD digit throughout (hidden behind flap)
            fc-flap-bot (NEW digit) stays at 90° (invisible)

   Midpoint (transitionend of Phase 1):
            fc-top and fc-bot NOW update to NEW digit
            fc-flap-bot begins animating

   Phase 2  fc-flap-bot (NEW digit) rotates 90° → 0° (unfolds in)
            fc-bot underneath already shows NEW digit (same content = seamless)

   Cleanup  reset both flaps to their rest state for the next flip
   ========================================================= */

(function () {

    /* ── Config ─────────────────────────────────────────── */
    /* 2026-10-06 10:30 IST = 2026-10-06 05:00 UTC
       Written in UTC so new Date() parses correctly in every browser.
       The "+05:30" offset notation is not supported in all browsers
       and returns NaN, causing the timer to show NaN:NaN:NaN:NaN. */
    var TARGET_MS = new Date('2026-10-06T05:00:00Z').getTime();

    /* ── DOM ─────────────────────────────────────────────── */
    var clock = document.querySelector('.countdown__clock');
    if (!clock) return;

    var units = {
        days:    clock.querySelector('[data-unit="days"]'),
        hours:   clock.querySelector('[data-unit="hours"]'),
        minutes: clock.querySelector('[data-unit="minutes"]'),
        seconds: clock.querySelector('[data-unit="seconds"]')
    };

    var displayed = { days: -1, hours: -1, minutes: -1, seconds: -1 };

    var noMotion = window.IEEEDay && IEEEDay.prefersReducedMotion();

    /* ── Single card flip ───────────────────────────────── */

    function flipCard(card, nextDigit) {
        var cur = parseInt(card.dataset.digit, 10);
        if (cur === nextDigit) return;

        var fcTopSp   = card.querySelector('.fc-top span');
        var fcBotSp   = card.querySelector('.fc-bot span');
        var flapTop   = card.querySelector('.fc-flap-top');
        var flapBot   = card.querySelector('.fc-flap-bot');
        var flapTopSp = flapTop.querySelector('span');
        var flapBotSp = flapBot.querySelector('span');

        card.dataset.digit = nextDigit;

        /* ── No-motion: just snap ── */
        if (noMotion) {
            fcTopSp.textContent   = nextDigit;
            fcBotSp.textContent   = nextDigit;
            flapTopSp.textContent = nextDigit;
            return;
        }

        /* ── PHASE 0 — set up state, no transition ──────── */

        /*  Static halves keep showing OLD digit.
            They're hidden behind the flaps right now — the number
            must NOT change visually until Phase 1 is done. */
        fcTopSp.textContent = cur;
        fcBotSp.textContent = cur;

        /*  Flap-top: shows OLD digit, sits flat on top (covers fc-top) */
        flapTopSp.textContent    = cur;
        flapTop.style.transition = 'none';
        flapTop.style.transform  = 'perspective(400px) rotateX(0deg)';
        flapTop.style.zIndex     = '3';

        /*  Flap-bot: shows NEW digit, hidden at 90° behind the centre fold */
        flapBotSp.textContent    = nextDigit;
        flapBot.style.transition = 'none';
        flapBot.style.transform  = 'perspective(400px) rotateX(90deg)';
        flapBot.style.zIndex     = '3';

        /* Double rAF: browser must register the reset before we add transitions */
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {

                /* ── PHASE 1 — top flap folds down (0° → -90°) ── */
                flapTop.style.transition = 'transform 0.28s ease-in';
                flapTop.style.transform  = 'perspective(400px) rotateX(-90deg)';

                flapTop.addEventListener('transitionend', function onTopDone() {
                    flapTop.removeEventListener('transitionend', onTopDone);

                    /*
                     * MIDPOINT — top flap is completely edge-on (invisible).
                     * NOW swap the static halves to the new digit.
                     * They were hidden behind the flaps; flapTop is gone,
                     * and flapBot hasn't appeared yet — so this swap is invisible.
                     */
                    fcTopSp.textContent = nextDigit;
                    fcBotSp.textContent = nextDigit;

                    /* Park the top flap out of the way */
                    flapTop.style.zIndex = '1';

                    /* ── PHASE 2 — bottom flap unfolds (90° → 0°) ── */
                    flapBot.style.transition = 'transform 0.22s ease-out';
                    flapBot.style.transform  = 'perspective(400px) rotateX(0deg)';

                    flapBot.addEventListener('transitionend', function onBotDone() {
                        flapBot.removeEventListener('transitionend', onBotDone);

                        /* ── CLEANUP — reset both flaps to rest state ── */
                        flapTop.style.transition  = 'none';
                        flapTop.style.transform   = 'perspective(400px) rotateX(0deg)';
                        flapTop.style.zIndex      = '2';
                        flapTopSp.textContent     = nextDigit; /* ready for next flip */

                        flapBot.style.transition  = 'none';
                        flapBot.style.transform   = 'perspective(400px) rotateX(90deg)';
                        flapBot.style.zIndex      = '2';

                    }, { once: true });

                }, { once: true });

            });
        });
    }

    /* ── Two-digit unit updater ──────────────────────────── */

    function updateUnit(unitEl, value) {
        if (!unitEl) return;
        /* Guard: if value is NaN or negative, clamp to 0 */
        var safe  = (isNaN(value) || value < 0) ? 0 : value;
        var str   = String(safe).padStart(2, '0');
        var cards = unitEl.querySelectorAll('.flip-card');
        flipCard(cards[0], parseInt(str[0], 10));
        flipCard(cards[1], parseInt(str[1], 10));
    }

    /* ── Tick (every second) ─────────────────────────────── */

    function tick() {
        var diff = TARGET_MS - Date.now();

        /* Safety net: if TARGET_MS parsed as NaN, show 00:00:00:00 and stop */
        if (isNaN(diff)) {
            updateUnit(units.days,    0);
            updateUnit(units.hours,   0);
            updateUnit(units.minutes, 0);
            updateUnit(units.seconds, 0);
            return;
        }

        var expired  = diff <= 0;
        var totalSec = expired ? 0 : Math.floor(diff / 1000);

        var d = Math.floor(totalSec / 86400);
        var h = Math.floor((totalSec % 86400) / 3600);
        var m = Math.floor((totalSec % 3600)  / 60);
        var s = totalSec % 60;

        if (d !== displayed.days)    { updateUnit(units.days,    d); displayed.days    = d; }
        if (h !== displayed.hours)   { updateUnit(units.hours,   h); displayed.hours   = h; }
        if (m !== displayed.minutes) { updateUnit(units.minutes, m); displayed.minutes = m; }
        if (s !== displayed.seconds) { updateUnit(units.seconds, s); displayed.seconds = s; }

        if (expired) {
            var wrapper = document.getElementById('countdown');
            if (wrapper) wrapper.classList.add('countdown--expired');
            return; /* stop ticking */
        }

        setTimeout(tick, 1000);
    }

    /* ── Spec-O-Meter ────────────────────────────────────── */
    /*
        Value = % of the event countdown period that has already elapsed.
        SPEC_START = 30 days before the event (Sep 06 UTC).
        0%  → needle points left  (IN SPEC  — event far away)
        100%→ needle points right (OUT OF SPEC — event is NOW)

        Rotation formula: angle = (value / 100 * 180) - 90
    */

    var SPEC_START_MS = new Date('2026-09-06T05:00:00Z').getTime();

    function getSpecValue() {
        /* If either date failed to parse, default to 100% (event is live/past) */
        if (isNaN(SPEC_START_MS) || isNaN(TARGET_MS)) return 100;

        var now = Date.now();
        if (now <= SPEC_START_MS) return 0;
        if (now >= TARGET_MS)     return 100;

        var raw = (now - SPEC_START_MS) / (TARGET_MS - SPEC_START_MS) * 100;

        /* Extra safety: if division somehow produced NaN or out-of-range, clamp */
        if (isNaN(raw) || raw > 100) return 100;
        if (raw < 0)                 return 0;

        return Math.round(raw);
    }

    function animateSpecometer(targetValue) {
        var needleEl = document.getElementById('specometer-needle');
        var numberEl = document.getElementById('specometer-number');
        if (!needleEl || !numberEl) return;

        /* Clamp value: any NaN or out-of-range → 100 (event is live/past) */
        var safeValue = (isNaN(targetValue) || targetValue > 100) ? 100
                      : (targetValue < 0)                         ? 0
                      : targetValue;

        /* No motion: snap immediately */
        if (noMotion) {
            var snapAngle = (safeValue / 100 * 180) - 90;
            needleEl.setAttribute('transform',
                'rotate(' + snapAngle.toFixed(2) + ',160,175)');
            numberEl.textContent = safeValue;
            return;
        }

        var startAngle = -90;                             /* 0% position */
        var endAngle   = (safeValue / 100 * 180) - 90;  /* target angle */
        var duration   = 1800;                            /* ms */
        var startTime  = null;

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function step(ts) {
            if (!startTime) startTime = ts;
            var raw      = Math.min((ts - startTime) / duration, 1);
            var progress = easeOutCubic(raw);

            var angle = startAngle + (endAngle - startAngle) * progress;
            var value = Math.round(safeValue * progress);

            needleEl.setAttribute('transform',
                'rotate(' + angle.toFixed(2) + ',160,175)');
            numberEl.textContent = value;

            if (raw < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    /* Fire animation when the instrument panel enters the viewport */
    var panel = document.querySelector('.instrument-panel');
    if (panel && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                setTimeout(function () {
                    animateSpecometer(getSpecValue());
                }, 200);
            }
        }, { threshold: 0.2 });
        observer.observe(panel);
    } else {
        /* Fallback: fire immediately */
        setTimeout(function () { animateSpecometer(getSpecValue()); }, 400);
    }

    /* ── Start countdown ─────────────────────────────────── */
    tick();

})();
