/* =========================================================
   Event / flip cards
   Owner: Vansh + Daksh + Nilesh
   Section: #events

   Loaded with "defer", so the HTML is ready when this runs.
   Shared helpers from main.js: IEEEDay.prefersReducedMotion()
   Keep everything inside this block so your variables don't
   clash with other teams' files.
   ========================================================= */

(function () {
"use strict";


const carousel = document.querySelector(".events-carousel");

if (!carousel) {
    return;
}

const track = carousel.querySelector(".events-carousel__track");
const cards = Array.from(carousel.querySelectorAll(".event-card"));
const previousButton = carousel.querySelector(".events-carousel__arrow--prev");
const nextButton = carousel.querySelector(".events-carousel__arrow--next");
const currentCounter = carousel.querySelector(".events-carousel__current");
const hint = carousel.querySelector(".events-carousel__hint");

const totalCards = cards.length;

if (!track || totalCards !== 5) {
    return;
}

let currentIndex = 0;
let startX = 0;
let startY = 0;
let isDragging = false;

const SWIPE_THRESHOLD = 45;

/*
 * Cards are positioned at five points around an
 * invisible cylinder.
 *
 * Position 0 = front
 * Position 1 = right
 * Position 2 = far right / behind
 * Position 3 = far left / behind
 * Position 4 = left
 */
const positions = [
    {
        rotate: 0,
        translateZ: 230,
        scale: 1,
        opacity: 1,
        zIndex: 5
    },
    {
        rotate: 72,
        translateZ: 80,
        scale: 0.84,
        opacity: 0.78,
        zIndex: 4
    },
    {
        rotate: 144,
        translateZ: -100,
        scale: 0.68,
        opacity: 0.38,
        zIndex: 2
    },
    {
        rotate: 216,
        translateZ: -100,
        scale: 0.68,
        opacity: 0.38,
        zIndex: 2
    },
    {
        rotate: 288,
        translateZ: 80,
        scale: 0.84,
        opacity: 0.78,
        zIndex: 4
    }
];

function prefersReducedMotion() {
    if (
        window.IEEEDay &&
        typeof window.IEEEDay.prefersReducedMotion === "function"
    ) {
        return window.IEEEDay.prefersReducedMotion();
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getRelativePosition(cardIndex) {
    return (cardIndex - currentIndex + totalCards) % totalCards;
}

function updateCards() {
    cards.forEach(function (card, cardIndex) {
        const positionIndex = getRelativePosition(cardIndex);
        const position = positions[positionIndex];

        card.style.zIndex = position.zIndex;

        if (prefersReducedMotion()) {
            /*
             * In reduced-motion mode, keep the active card visible
             * and remove the animated 3D transition.
             */
            card.style.transform =
                positionIndex === 0
                    ? "translate3d(0, 0, 0) scale(1)"
                    : "translate3d(0, 0, 0) scale(0.92)";

            card.style.opacity = positionIndex === 0 ? "1" : "0.25";

            return;
        }

        /*
         * The translateX component gives the cylinder its
         * visible left/right curvature while rotateY and
         * translateZ create the depth.
         */
        let translateX = 0;

        if (positionIndex === 1) {
            translateX = 30;
        } else if (positionIndex === 2) {
            translateX = 55;
        } else if (positionIndex === 3) {
            translateX = -55;
        } else if (positionIndex === 4) {
            translateX = -30;
        }

        card.style.transform =
            "translate3d(" +
            translateX +
            "px, 0, " +
            position.translateZ +
            "px) " +
            "rotateY(" +
            position.rotate +
            "deg) " +
            "scale(" +
            position.scale +
            ")";

        card.style.opacity = position.opacity;
    });

    updateCounter();
}

function updateCounter() {
    const displayNumber = String(currentIndex + 1).padStart(2, "0");

    if (currentCounter) {
        currentCounter.textContent = displayNumber;
    }

    if (hint) {
        hint.textContent =
            "Swipe to rotate · " + displayNumber + " / 05";
    }

    cards.forEach(function (card, index) {
        const isActive = index === currentIndex;

        card.setAttribute("aria-hidden", String(!isActive));

        if (isActive) {
            card.setAttribute("aria-current", "true");
        } else {
            card.removeAttribute("aria-current");
        }
    });
}

function goTo(index) {
    currentIndex = (index + totalCards) % totalCards;
    updateCards();
}

function next() {
    goTo(currentIndex + 1);
}

function previous() {
    goTo(currentIndex - 1);
}

/* Arrow controls */
if (nextButton) {
    nextButton.addEventListener("click", next);
}

if (previousButton) {
    previousButton.addEventListener("click", previous);
}

/* -------------------------------------------------------
   Touch / pointer swipe
   ------------------------------------------------------- */

track.addEventListener("pointerdown", function (event) {
    /*
     * Do not start dragging from a registration button.
     */
    if (event.target.closest(".event-card__register")) {
        return;
    }

    startX = event.clientX;
    startY = event.clientY;
    isDragging = true;

    track.setPointerCapture?.(event.pointerId);
});

track.addEventListener("pointerup", function (event) {
    if (!isDragging) {
        return;
    }

    isDragging = false;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    /*
     * Ignore predominantly vertical gestures so the
     * carousel doesn't fight normal page scrolling.
     */
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
    }

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
        return;
    }

    if (deltaX < 0) {
        next();
    } else {
        previous();
    }
});

track.addEventListener("pointercancel", function () {
    isDragging = false;
});

/*
 * Prevent a drag from accidentally following a link when
 * a registration URL eventually gets added.
 */
track.addEventListener("click", function (event) {
    const button = event.target.closest(".event-card__register");

    if (!button) {
        return;
    }

    const url = button.dataset.registrationUrl;

    if (!url) {
        event.preventDefault();
    }
});

/* -------------------------------------------------------
   Keyboard support
   ------------------------------------------------------- */

carousel.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
    }
});

/* Make the carousel keyboard reachable */
carousel.setAttribute("tabindex", "0");

/* Initial state */
updateCards();


})();
