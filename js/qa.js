/* =========================================================
   Q&A
   Owner: Nitant
   Section: #faq

   The accordion is native <details>, so it already works.
   This only closes the other answers when one opens, so the
   list stays short on a phone.
   ========================================================= */

(function () {
    'use strict';

    const items = Array.from(document.querySelectorAll('.qa-item'));
    if (!items.length) {
        return;
    }

    items.forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (!item.open) return;
            items.forEach(function (other) {
                if (other !== item && other.open) other.open = false;
            });
        });
    });
})();
