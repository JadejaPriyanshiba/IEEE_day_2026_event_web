/* =========================================================
   Timeline ("The flow")
   Owner: Dhruvi + Dhwani
   Section: #timeline

   Loaded with "defer", so the HTML is ready when this runs.
   Shared helpers from main.js: IEEEDay.prefersReducedMotion()
   Keep everything inside this block so your variables don't
   clash with other teams' files.
   ========================================================= */

(function () {
    'use strict';

    // Section elements
    const section = document.getElementById('timeline');
    if (!section) return;

    const plotWrapper = section.querySelector('.timeline__plot-wrapper');
    const svg = section.querySelector('.timeline__svg');
    const scrubLine = document.getElementById('timeline-scrub-line');
    const scrubHalo = document.getElementById('timeline-scrub-halo');
    const scrubDot = document.getElementById('timeline-scrub-dot');
    const badgeBg = document.getElementById('timeline-badge-bg');
    const badgeText = document.getElementById('timeline-badge-text');
    const announcer = document.getElementById('timeline-announcer');

    const nameElements = section.querySelectorAll('.timeline__event-name');
    const signalElements = section.querySelectorAll('.timeline__event-signal');
    const targetRegions = section.querySelectorAll('.timeline__region-target');
    const mobileItems = section.querySelectorAll('.timeline__mobile-item');

    if (!svg || !scrubLine || !scrubDot || !badgeBg || !badgeText) return;

    // Events metadata
    const EVENTS = [
        {
            key: 'hunt',
            name: 'Hunt',
            fullName: 'Treasure Hunt',
            signal: 'SIGNAL: RUNNING',
            time: '10:30–11:30 AM',
            timeBadge: '10:30',
            xStart: 160,
            xEnd: 440,
            xDefault: 255,
            colorToken: 'var(--color-text)'
        },
        {
            key: 'workshop',
            name: 'Workshop',
            fullName: 'Workshop',
            signal: 'SIGNAL: FOCUSED',
            time: '[TIME]',
            timeBadge: '[TIME]',
            xStart: 440,
            xEnd: 700,
            xDefault: 560,
            colorToken: 'var(--color-accent)'
        },
        {
            key: 'brand',
            name: 'Brand',
            fullName: 'Brand Identity Challenge',
            signal: 'SIGNAL: SHARP',
            time: '[TIME]',
            timeBadge: '[TIME]',
            xStart: 700,
            xEnd: 960,
            xDefault: 760,
            colorToken: 'var(--color-text)'
        },
        {
            key: 'charades',
            name: 'Charades',
            fullName: 'Tech Charades',
            signal: 'SIGNAL: LOUD',
            time: '[TIME]',
            timeBadge: '[TIME]',
            xStart: 960,
            xEnd: 1150,
            xDefault: 1040,
            colorToken: 'var(--color-body)'
        },
        {
            key: 'garba',
            name: 'Garba',
            fullName: 'Garba',
            signal: 'SIGNAL: CIRCULAR',
            time: '[EVENING]',
            timeBadge: '[EVENING]',
            xStart: 1150,
            xEnd: 1312,
            xDefault: 1240,
            colorToken: 'var(--color-accent)'
        }
    ];

    // Coordinate data for Hunt linear spikes
    const HUNT_POINTS = [
        [160, 300], [180, 240], [200, 290], [215, 190], [235, 270],
        [255, 160], [275, 250], [300, 180], [320, 280], [345, 150],
        [365, 240], [385, 210], [400, 300], [440, 300]
    ];

    // Coordinate data for Charades noisy audio spikes
    const CHARADES_POINTS = [
        [960, 300], [970, 260], [978, 315], [985, 230], [993, 280],
        [1000, 210], [1010, 305], [1018, 240], [1027, 290], [1035, 190],
        [1044, 320], [1052, 230], [1062, 285], [1070, 220], [1080, 310],
        [1090, 245], [1100, 280], [1110, 260], [1120, 300], [1150, 300]
    ];

    // Helper: interpolate piecewise linear array
    function interpolatePoints(points, x) {
        if (x <= points[0][0]) return points[0][1];
        if (x >= points[points.length - 1][0]) return points[points.length - 1][1];

        for (let i = 0; i < points.length - 1; i++) {
            const x1 = points[i][0];
            const y1 = points[i][1];
            const x2 = points[i + 1][0];
            const y2 = points[i + 1][1];

            if (x >= x1 && x <= x2) {
                if (x2 === x1) return y1;
                const ratio = (x - x1) / (x2 - x1);
                return y1 + ratio * (y2 - y1);
            }
        }
        return 300;
    }

    /**
     * Compute the exact Y coordinate on the waveform for any given X
     */
    function getYForX(x) {
        // Pre-lead flat line
        if (x <= 160) {
            return 300;
        }

        // Hunt: spiky running waveform
        if (x > 160 && x <= 440) {
            return interpolatePoints(HUNT_POINTS, x);
        }

        // Workshop: smooth sinusoidal wave
        if (x > 440 && x <= 700) {
            if (x > 660) return 300;
            const cycleIndex = Math.floor((x - 440) / 55);
            const t = ((x - 440) % 55) / 55.0;
            const p1 = (cycleIndex % 2 === 0) ? 210 : 390;
            return (1 - t) * (1 - t) * 300 + 2 * (1 - t) * t * p1 + t * t * 300;
        }

        // Brand Identity: sharp square pulses
        if (x > 700 && x <= 960) {
            const offset = x - 700;
            if (offset < 200) {
                const step = offset % 80;
                return (step < 40) ? 210 : 300;
            }
            return 300;
        }

        // Tech Charades: loud audio burst waveform
        if (x > 960 && x <= 1150) {
            return interpolatePoints(CHARADES_POINTS, x);
        }

        // Garba: circular loops
        if (x > 1150 && x <= 1312) {
            const loopCenters = [1189, 1239, 1289];
            for (let i = 0; i < loopCenters.length; i++) {
                const center = loopCenters[i];
                if (Math.abs(x - center) <= 24) {
                    const dx = x - center;
                    return 276 - Math.sqrt(Math.max(0, 24 * 24 - dx * dx));
                }
            }
            return 300;
        }

        return 300;
    }

    // Determine which event corresponds to X
    function getEventForX(x) {
        for (let i = 0; i < EVENTS.length; i++) {
            const ev = EVENTS[i];
            if (x >= ev.xStart && (x < ev.xEnd || i === EVENTS.length - 1)) {
                return ev;
            }
        }
        return EVENTS[1]; // default: Workshop
    }

    // Active state
    let currentX = 560; // Initial resting state (Workshop peak as shown in Screenshot 1)
    let isPointerDown = false;
    let animationFrameId = null;
    let announcementTimer = null;

    /**
     * Update the visual position of the scrubber line, dot, halo, and badge
     */
    function renderScrubber(x) {
        const clampedX = Math.max(160, Math.min(1312, x));
        currentX = clampedX;
        const currentY = getYForX(clampedX);
        const currentEvent = getEventForX(clampedX);

        // Update Guideline
        scrubLine.setAttribute('x1', clampedX);
        scrubLine.setAttribute('x2', clampedX);
        scrubLine.style.stroke = currentEvent.colorToken;

        // Update Dot and Halo
        scrubHalo.setAttribute('cx', clampedX);
        scrubHalo.setAttribute('cy', currentY);
        scrubHalo.style.fill = currentEvent.colorToken;

        scrubDot.setAttribute('cx', clampedX);
        scrubDot.setAttribute('cy', currentY);
        scrubDot.style.fill = currentEvent.colorToken;

        // Update Badge Text & Position
        const badgeString = 'SCRUBBING · ' + currentEvent.name.toUpperCase() + ' · ' + currentEvent.timeBadge.toUpperCase();
        badgeText.textContent = badgeString;

        // Accurately center the badge on the scrubber line
        const textLen = (badgeText.getComputedTextLength && badgeText.getComputedTextLength() > 0)
            ? badgeText.getComputedTextLength()
            : 180;
        const badgeWidth = Math.round(textLen + 24);
        const minBadgeX = 12;
        const maxBadgeX = 1312 - badgeWidth - 12;
        const badgeX = Math.max(minBadgeX, Math.min(maxBadgeX, clampedX - badgeWidth / 2));

        badgeBg.setAttribute('x', badgeX);
        badgeBg.setAttribute('width', badgeWidth);
        badgeBg.style.fill = currentEvent.colorToken;
        badgeText.setAttribute('x', badgeX + badgeWidth / 2);

        // Update active highlight classes on labels
        nameElements.forEach(el => {
            el.classList.toggle('is-active', el.getAttribute('data-event') === currentEvent.key);
        });
        signalElements.forEach(el => {
            el.classList.toggle('is-active', el.getAttribute('data-event') === currentEvent.key);
        });
        mobileItems.forEach(el => {
            el.classList.toggle('is-active', el.getAttribute('data-event') === currentEvent.key);
        });

        // Accessibility slider values
        if (plotWrapper) {
            plotWrapper.setAttribute('aria-valuenow', Math.round(clampedX));
            plotWrapper.setAttribute(
                'aria-valuetext',
                'Scrubbing: ' + currentEvent.fullName + ', Time: ' + currentEvent.time + ', ' + currentEvent.signal
            );
        }

        // Debounced screen-reader announcement
        if (announcer) {
            clearTimeout(announcementTimer);
            announcementTimer = setTimeout(function () {
                announcer.textContent = 'Scrubbing: ' + currentEvent.fullName + '. ' + currentEvent.signal + '. Time: ' + currentEvent.time;
            }, 500);
        }
    }

    /**
     * Smoothly animate to a target X coordinate
     */
    function animateToX(targetX) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        const prefersReduced = (window.IEEEDay && typeof window.IEEEDay.prefersReducedMotion === 'function')
            ? window.IEEEDay.prefersReducedMotion()
            : false;

        if (prefersReduced) {
            renderScrubber(targetX);
            return;
        }

        const startX = currentX;
        const distance = targetX - startX;
        const duration = 280; // ms
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease-out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            renderScrubber(startX + distance * ease);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step);
            } else {
                animationFrameId = null;
            }
        }

        animationFrameId = requestAnimationFrame(step);
    }

    /**
     * Convert client pointer coordinate to SVG viewBox X
     */
    function getPointerSvgX(e) {
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const ctm = svg.getScreenCTM();
        if (!ctm) return 560;
        const svgPt = pt.matrixTransform(ctm.inverse());
        return svgPt.x;
    }

    // Pointer Events for Dragging / Clicking along the SVG plot
    svg.addEventListener('pointerdown', function (e) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        isPointerDown = true;
        try {
            svg.setPointerCapture(e.pointerId);
        } catch (_) {}
        renderScrubber(getPointerSvgX(e));
    });

    svg.addEventListener('pointermove', function (e) {
        if (isPointerDown) {
            renderScrubber(getPointerSvgX(e));
        }
    });

    function endPointerDrag(e) {
        if (isPointerDown) {
            isPointerDown = false;
            try {
                svg.releasePointerCapture(e.pointerId);
            } catch (_) {}
        }
    }

    svg.addEventListener('pointerup', endPointerDrag);
    svg.addEventListener('pointercancel', endPointerDrag);

    // Click on Anomaly Hit Targets & Titles
    targetRegions.forEach(function (region) {
        region.addEventListener('click', function () {
            const key = region.getAttribute('data-event-key');
            const targetEv = EVENTS.find(ev => ev.key === key);
            if (targetEv) animateToX(targetEv.xDefault);
        });
    });

    nameElements.forEach(function (nameEl) {
        nameEl.addEventListener('click', function () {
            const key = nameEl.getAttribute('data-event');
            const targetEv = EVENTS.find(ev => ev.key === key);
            if (targetEv) animateToX(targetEv.xDefault);
        });
    });

    signalElements.forEach(function (signalEl) {
        signalEl.addEventListener('click', function () {
            const key = signalEl.getAttribute('data-event');
            const targetEv = EVENTS.find(ev => ev.key === key);
            if (targetEv) animateToX(targetEv.xDefault);
        });
    });

    // Mobile compact list item clicks
    mobileItems.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const scrubX = parseFloat(btn.getAttribute('data-scrub-x')) || 560;
            animateToX(scrubX);
        });
    });

    // Keyboard interaction on the slider container
    if (plotWrapper) {
        plotWrapper.addEventListener('keydown', function (e) {
            let handled = false;
            const step = 15;
            const largeStep = 75;

            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowDown':
                    animateToX(Math.max(160, currentX - step));
                    handled = true;
                    break;
                case 'ArrowRight':
                case 'ArrowUp':
                    animateToX(Math.min(1312, currentX + step));
                    handled = true;
                    break;
                case 'PageDown':
                    animateToX(Math.max(160, currentX - largeStep));
                    handled = true;
                    break;
                case 'PageUp':
                    animateToX(Math.min(1312, currentX + largeStep));
                    handled = true;
                    break;
                case 'Home':
                    animateToX(160);
                    handled = true;
                    break;
                case 'End':
                    animateToX(1300);
                    handled = true;
                    break;
                case '1':
                    animateToX(EVENTS[0].xDefault);
                    handled = true;
                    break;
                case '2':
                    animateToX(EVENTS[1].xDefault);
                    handled = true;
                    break;
                case '3':
                    animateToX(EVENTS[2].xDefault);
                    handled = true;
                    break;
                case '4':
                    animateToX(EVENTS[3].xDefault);
                    handled = true;
                    break;
                case '5':
                    animateToX(EVENTS[4].xDefault);
                    handled = true;
                    break;
            }

            if (handled) {
                e.preventDefault();
            }
        });
    }

    // Initial render at Workshop crest (x = 560)
    renderScrubber(560);
})();
