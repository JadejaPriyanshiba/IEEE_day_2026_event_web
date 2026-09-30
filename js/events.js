/* =========================================================
   Event flip cards + rail
   Owner: Vansh + Daksh + Nilesh
   Section: #events

   - Tap a card (or its "details" button) to flip it; tap again
     or "Flip back" to return. Links on the back still work.
   - The hidden face is made inert so keyboard / screen readers
     only ever meet the side you can see.
   - Laptops: the card tilts toward the pointer, with a spotlight.
   - The first card does a small "peek" when it first appears,
     so people learn the cards turn.
   - Motif animations pause while a card is off screen.
   - Phones: dots, counter and arrows for the swipe rail.
   ========================================================= */

(function () {
    'use strict';

    const rail = document.getElementById('events-rail');
    if (!rail) {
        return;
    }

    const cards = Array.from(rail.querySelectorAll('.event-card'));
    const reduced = IEEEDay.prefersReducedMotion();


    /* ---------- Flip ---------- */

    function setFlipped(card, flipped, moveFocus) {
        const front = card.querySelector('.event-card__front');
        const back = card.querySelector('.event-card__back');

        card.classList.toggle('is-flipped', flipped);
        front.inert = flipped;
        back.inert = !flipped;

        if (!reduced) {
            card.classList.remove('is-flipping');
            void card.offsetWidth; // restart the dip + sheen
            card.classList.add('is-flipping');
        }

        if (moveFocus) {
            const target = (flipped ? back : front).querySelector('.event-card__flip');
            if (target) target.focus({ preventScroll: true });
        }
    }

    cards.forEach(function (card) {
        card.querySelector('.event-card__back').inert = true;

        card.addEventListener('animationend', function (event) {
            if (event.animationName === 'card-dip') card.classList.remove('is-flipping');
        });

        card.addEventListener('click', function (event) {
            if (event.target.closest('a')) return;         // let "Join the hunt" etc. through
            const button = event.target.closest('.event-card__flip');
            // Keyboard users pressing the button get focus moved to the other side.
            setFlipped(card, !card.classList.contains('is-flipped'), !!button && event.detail === 0);
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        const open = document.activeElement && document.activeElement.closest('.event-card.is-flipped');
        if (open) setFlipped(open, false, true);
    });


    /* ---------- Tilt + spotlight (mouse only) ---------- */

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    if (finePointer.matches && !reduced) {
        cards.forEach(function (card) {
            card.addEventListener('pointermove', function (event) {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                card.classList.add('is-tilting');
                card.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
                card.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
                card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
                card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
            });

            card.addEventListener('pointerleave', function () {
                card.classList.remove('is-tilting');
                card.style.setProperty('--rx', '0deg');
                card.style.setProperty('--ry', '0deg');
            });
        });
    }


    /* ---------- Visibility: pause motifs off screen, peek once ---------- */

    let peeked = false;

    if ('IntersectionObserver' in window) {
        const visibility = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                entry.target.classList.toggle('is-visible', entry.isIntersecting);

                if (entry.isIntersecting && !peeked && !reduced && entry.target === cards[0]) {
                    peeked = true;
                    const inner = entry.target.querySelector('.event-card__inner');
                    setTimeout(function () {
                        if (entry.target.classList.contains('is-flipped')) return;
                        inner.animate([
                            { transform: 'rotateY(0deg)' },
                            { transform: 'rotateY(-28deg)', offset: 0.45 },
                            { transform: 'rotateY(0deg)' }
                        ], { duration: 1100, easing: 'cubic-bezier(0.34, 1.4, 0.5, 1)' });
                    }, 700);
                }
            });
        }, { threshold: 0.35 });

        cards.forEach(function (card) { visibility.observe(card); });
    } else {
        cards.forEach(function (card) { card.classList.add('is-visible'); });
    }


    /* ---------- Rail controls (phones / tablets) ---------- */

    const prev = document.getElementById('events-prev');
    const next = document.getElementById('events-next');
    const dotsWrap = document.getElementById('events-dots');
    const current = document.getElementById('events-current');

    if (cards.length < 2 || !dotsWrap) {
        return;
    }

    const dots = cards.map(function (card, i) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.tabIndex = -1; // the arrow buttons are the keyboard route
        dot.addEventListener('click', function () { goTo(i); });
        dotsWrap.appendChild(dot);
        return dot;
    });

    let active = -1;

    function step() {
        return cards[1].offsetLeft - cards[0].offsetLeft;
    }

    function currentIndex() {
        const maxScroll = rail.scrollWidth - rail.clientWidth;
        if (rail.scrollLeft >= maxScroll - 4) {
            return cards.length - 1;
        }
        return Math.max(0, Math.min(cards.length - 1, Math.round(rail.scrollLeft / step())));
    }

    function goTo(i) {
        const index = Math.max(0, Math.min(cards.length - 1, i));
        rail.scrollTo({
            left: cards[index].offsetLeft - cards[0].offsetLeft,
            behavior: reduced ? 'auto' : 'smooth'
        });
    }

    function update() {
        const i = currentIndex();
        if (i === active) return;
        active = i;
        dots.forEach(function (dot, n) { dot.classList.toggle('is-active', n === i); });
        if (current) current.textContent = String(i + 1).padStart(2, '0');
        if (prev) prev.disabled = i === 0;
        if (next) next.disabled = i === cards.length - 1;
    }

    let ticking = false;
    rail.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(function () {
                update();
                ticking = false;
            });
        }
    }, { passive: true });

    if (prev) prev.addEventListener('click', function () { goTo(currentIndex() - 1); });
    if (next) next.addEventListener('click', function () { goTo(currentIndex() + 1); });

    update();
})();
