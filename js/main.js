/* =========================================================
   Shared JavaScript foundation
   Owner: Priyanshi

   Runs before every team file. Keep this tiny: only helpers
   that more than one section needs belong here.
   ========================================================= */

(function () {
    // Lets CSS know JS is running, e.g. `.js .flip-card__back { ... }`.
    // Style the no-JS version first so content is never hidden without JS.
    document.documentElement.classList.add('js');

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Shared helpers — use as IEEEDay.prefersReducedMotion() in your file.
    window.IEEEDay = {
        // true if the visitor asked their OS for less animation. Check it
        // before starting any JS animation (timeline, flips, counters).
        prefersReducedMotion: function () {
            return reducedMotionQuery.matches;
        }
    };
})();
