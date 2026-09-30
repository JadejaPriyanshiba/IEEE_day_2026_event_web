/* =========================================================
   Timeline live state
   Owner: Dhruvi + Dhwani
   Section: #timeline

   Items with data-start / data-end (ISO times with +05:30)
   get .is-live while running and .is-done afterwards.
   Add those attributes to the other events once their times
   are confirmed; everything else is automatic.
   ========================================================= */

(function () {
    'use strict';

    const items = Array.from(document.querySelectorAll('.timeline__item[data-start]'));
    if (!items.length) {
        return;
    }

    function update() {
        const now = Date.now();
        items.forEach(function (item) {
            const start = new Date(item.getAttribute('data-start')).getTime();
            const end = new Date(item.getAttribute('data-end') || item.getAttribute('data-start')).getTime();
            item.classList.toggle('is-live', now >= start && now < end);
            item.classList.toggle('is-done', now >= end);
        });
    }

    update();
    setInterval(update, 30000);
})();
