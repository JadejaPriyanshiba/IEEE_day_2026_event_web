/* =========================================================
   Q&A
   Owner: Nitant
   Section: #qa

   Loaded with "defer", so the HTML is ready when this runs.
   Shared helpers from main.js: IEEEDay.prefersReducedMotion()
   Keep everything inside this block so your variables don't
   clash with other teams' files.
   ========================================================= */

(function () {

    var section = document.getElementById('qa');
    if (!section) return;

    var triggers = section.querySelectorAll('.qa-trigger');
    if (!triggers.length) return;

    var reducedMotion = window.IEEEDay && IEEEDay.prefersReducedMotion();

    /**
     * Open a single accordion item.
     * @param {HTMLButtonElement} trigger
     * @param {HTMLElement}       panel
     */
    function openItem(trigger, panel) {
        trigger.setAttribute('aria-expanded', 'true');

        if (reducedMotion) {
            panel.classList.add('is-open');
        } else {
            // rAF ensures the browser registers the open class
            // in the same frame the display changes, giving the
            // CSS transition a starting point to animate from.
            requestAnimationFrame(function () {
                panel.classList.add('is-open');
            });
        }
    }

    /**
     * Close a single accordion item.
     * @param {HTMLButtonElement} trigger
     * @param {HTMLElement}       panel
     */
    function closeItem(trigger, panel) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
    }

    /**
     * Toggle the clicked item. All others close.
     * (Accordion behaviour: one open at a time.)
     */
    function onTriggerClick(e) {
        var clickedTrigger = e.currentTarget;
        var panelId        = clickedTrigger.getAttribute('aria-controls');
        var panel          = document.getElementById(panelId);
        var isOpen         = clickedTrigger.getAttribute('aria-expanded') === 'true';

        // Close every other item first
        triggers.forEach(function (t) {
            if (t === clickedTrigger) return;
            var pid = t.getAttribute('aria-controls');
            var p   = document.getElementById(pid);
            if (p) closeItem(t, p);
        });

        // Toggle the clicked one
        if (isOpen) {
            closeItem(clickedTrigger, panel);
        } else {
            openItem(clickedTrigger, panel);
        }
    }

    // Attach listeners
    triggers.forEach(function (trigger) {
        trigger.addEventListener('click', onTriggerClick);

        // Keyboard: Space and Enter are already handled by <button>,
        // but ensure arrow keys work for power users.
        trigger.addEventListener('keydown', function (e) {
            var idx = Array.prototype.indexOf.call(triggers, trigger);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                var next = triggers[idx + 1] || triggers[0];
                next.focus();
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                var prev = triggers[idx - 1] || triggers[triggers.length - 1];
                prev.focus();
            }
            if (e.key === 'Home') {
                e.preventDefault();
                triggers[0].focus();
            }
            if (e.key === 'End') {
                e.preventDefault();
                triggers[triggers.length - 1].focus();
            }
        });
    });

    // Initialise: open items whose button starts with aria-expanded="true"
    triggers.forEach(function (trigger) {
        var panelId = trigger.getAttribute('aria-controls');
        var panel   = document.getElementById(panelId);
        if (!panel) return;

        if (trigger.getAttribute('aria-expanded') === 'true') {
            // Open immediately without transition on first paint
            panel.classList.add('is-open');
        }
    });

})();
