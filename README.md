# IEEE Day 2026 — IEEE VGEC Student Branch

The website for **IEEE Day 2026** at VGEC, **Tuesday 6 October 2026**.
Five events: Treasure Hunt, Workshop, Brand Identity Challenge, Tech Charades and Garba.

Design concept: **"Out of spec."** The site speaks in the voice of an IEEE standards document (section numbers, figure captions, "Draft 01"), then lets five very un-standard things happen inside it.
## Design references

Everything is in [`design_references/`](design_references/). **Read these before you start building your section.**

| File | What it's for |
|---|---|
| `IEEE Day 2026 Full Laptop.pdf` | The full desktop page design. Find your section here. |
| `IEEE Day 2026 Full Mobile.pdf` | The full mobile page design. Hemal + Meet: this is your main reference. |
| `Concept & visual system.pdf` | The concept and the rules: colours and how much of each, fonts, grid, spacing, buttons, and each event's look. |
| `Interaction & motion.pdf` | What moves, when and why: the opening animation, the hover/scroll behaviour per section, reduced motion, and the performance budget. See [Motion](#motion-what-moves-in-your-section) below. |
| `Concept & visual system-html/index.html` | A quick plain-HTML summary of the visual system (palette, fonts, buttons, event chapters). **Just double-click to open it.** |
| `Concept & visual system-html/System.dc.html` | The detailed interactive version of the visual system, with exact sizes and values. Needs a local server to open (see [Run it locally](#run-it-locally)). |

If two references disagree, **the PDFs win**. Ask Kena if you're unsure.

---

## Tech stack

Plain **HTML + CSS + JavaScript**. There is no framework, no build step, no backend and no npm.
Hosting: **Vercel** (static site, no configuration needed).

## Run it locally

Pick one:

1. **Easiest:** double-click `index.html` to open it in your browser.
2. **VS Code:** install the *Live Server* extension, right-click `index.html`, then choose **Open with Live Server**. The page reloads when you save.
3. **Terminal:** run `python -m http.server 8000` in this folder, then open http://localhost:8000

To open `design_references/Concept & visual system-html/System.dc.html`, use option 2 or 3 on that folder (browsers block its scripts on a double-click). The `index.html` next to it opens with a plain double-click.

## Folder structure

```text
index.html              the only page; every section lives here
css/
  style.css             design tokens, reset, shared classes   (Priyanshi)
  sections.css          hero, reveal, intro, registration       (Priyanshi)
  header-footer.css     header, navbar, footer                  (Parthvi + Pushkar)
  events.css            event / flip cards                      (Vansh + Daksh + Nilesh)
  timeline.css          the timeline                            (Dhruvi + Dhwani)
  qa.css                Q&A                                     (Nitant)
  responsive.css        final responsive + styling pass         (Hemal + Meet), loaded last
js/
  main.js               tiny shared helpers                     (Priyanshi)
  header-footer.js      mobile menu etc.                        (Parthvi + Pushkar)
  events.js             card flip logic                         (Vansh + Daksh + Nilesh)
  timeline.js           timeline interaction                    (Dhruvi + Dhwani)
  qa.js                 open/close answers                      (Nitant)
assets/
  logo/                 official IEEE VGEC SB logo (still needed, see assets/logo/README.md)
design_references/      design PDFs + visual system pages (reference only, not part of the site)
```

Every file is already linked in `index.html`, so **you never need to edit `<head>` or the `<script>` tags.**

---

## Where do I work?

| Team | Section in `index.html` | Your files | You may change | Please don't change |
|---|---|---|---|---|
| **Priyanshi** (structure + integration) | `#hero`, `#reveal`, `#intro`, `#registration` | `style.css`, `sections.css`, `main.js` | Global tokens, shared classes, page skeleton | — |
| **Parthvi + Pushkar** (navbar, header, footer) | `<header id="site-header">`, `<footer id="site-footer">` | `header-footer.css`, `header-footer.js`, `assets/logo/` | Everything inside the header and footer tags | Other sections, `style.css` |
| **Vansh + Daksh + Nilesh** (event cards) | `<section id="events">` → inside `.events-grid` | `events.css`, `events.js` | Everything inside `.events-grid` | The section heading, other sections |
| **Dhruvi + Dhwani** (timeline) | `<section id="timeline">` | `timeline.css`, `timeline.js` | Everything below the section title | Other sections |
| **Nitant** (Q&A) | `<section id="qa">` → inside `.qa-list` | `qa.css`, `qa.js` | Everything inside `.qa-list` | Other sections |
| **Hemal + Meet** (responsive + styling) | Whole page, **after** the others are merged | `responsive.css` | Anything in `responsive.css` | Other teams' files, unless you agree it with them first |

**When you build your section, delete the dashed `.dev-slot` box that says "Owner: …".** It only marks where your work goes.

### Rules for everyone's code

- **Use the tokens.** Write `color: var(--color-text)`, not `color: #283558`. The full list is at the top of `css/style.css`.
- **Shared classes you can use:** `.container`, `.section`, `.section--navy`, `.section--paper`, `.section-label`, `.section-title`, `.label`, `.display`, `.hand`, `.meta-row`, `.btn` (+ `.btn--gold`, `.btn--cream`, `.btn--brown`, `.btn--ticket`) and `.visually-hidden`.
- **Prefix your class names** with your section, for example `.event-card`, `.timeline-item` or `.qa-item`, so they never clash.
- **JS:** keep your code inside the `(function () { ... })();` block already in your file. Before animating, check `IEEEDay.prefersReducedMotion()`.
- **Design rules** (from the visual system): square corners, no shadows, no pills, no gradients or glassmorphism. Use one verb per button ("Join the hunt", never "Register Now"). Use sand/gold only on dark backgrounds, never as text on cream. Handwritten notes: at most one per screen.
- **Accessibility:** use real `<button>`s for things you click, add `alt` text to images, and keep visible focus styles (they're already global, so don't remove them).
- **Don't add libraries** without asking Priyanshi.

### Motion: what moves in your section

From `Interaction & motion.pdf`. The rule is *"every motion has an alibi"*: things only move when it means something, and everything else stays still.

| # | What moves | Owner |
|---|---|---|
| — | Opening animation ("Out of" rises, "spec." lands, whistle slides in) | Priyanshi (hero) |
| 01 | Hero headline drifts apart on scroll | Priyanshi (hero) |
| 02 | Whistle tilts toward the cursor; click makes "sound" strokes | Priyanshi (hero) |
| 03 | Spec-o-meter needle + split-flap countdown | **Unassigned**, Kena decides |
| 04 | Index menu rows: gold fill sweep, icon tilt, arrow moves | Parthvi + Pushkar |
| 05–10 | Event cards: hover lift, one card per swipe on mobile, plus each card's own motif (hunt redaction, workshop diagram draws, brand circles, charades strike-through, Garba rings) | Vansh + Daksh + Nilesh |
| 11 | Timeline: drag / arrow keys to scrub along the day | Dhruvi + Dhwani |
| 12 | Tickets: stub separates on hover | Priyanshi (registration) |

Rules that apply to everyone (details in the PDF):

- **Reduced motion:** when `IEEEDay.prefersReducedMotion()` is true, show everything instantly and fully drawn, and stop loops and parallax. Nothing may be hidden behind an animation.
- **Every hover needs a tap or keyboard-focus twin,** because phones can't hover.
- **Section backgrounds change with hard cuts,** never gradients.
- **Performance:** inline SVG only (no video, WebGL or stock photos), total JS around 60 KB or less.

---

## Team responsibilities

**Kena is the main coordinator of the whole project.** She guides the team, checks everyone's work and has the final say on everything: design, content, scope, who works on what, and what gets merged. She can review, approve or change anything in this repo. If you're unsure about anything, or two people disagree, ask Kena.

| Who | What |
|---|---|
| **Kena** | **Main coordinator.** Guides and checks everything, final approval on all decisions and PRs |
| Priyanshi | Overall basic structure + integration, PR reviews, final QA, deployment |
| Parthvi + Pushkar | Navbar + Header + Footer |
| Vansh + Daksh + Nilesh | Flip cards / Event cards |
| Dhruvi + Dhwani | Time Timeline |
| Nitant | Q&A section |
| Hemal + Meet | Mobile responsiveness + overall styling (towards the end) |

**Not assigned yet:** the countdown in `#reveal` and the rules section `#rules` ("The fine print"). Kena decides who picks these up.

## Branches

| Branch | Who |
|---|---|
| `main` | Live site. **Nobody pushes here directly.** |
| `feature/priyanshi-foundation` | Priyanshi |
| `feature/navbar-header-footer` | Parthvi + Pushkar |
| `feature/event-cards` | Vansh + Daksh + Nilesh |
| `feature/timeline` | Dhruvi + Dhwani |
| `feature/qa` | Nitant |
| `feature/responsive-styling` | Hemal + Meet |

## Git workflow

```text
pull latest main
      ↓
switch to your feature branch
      ↓
make changes
      ↓
test locally (open index.html)
      ↓
commit
      ↓
push
      ↓
open a Pull Request into main
      ↓
Priyanshi reviews (code + integration)
      ↓
Kena checks and gives the final OK
      ↓
merge
```

The same steps as commands (replace the branch with yours):

```bash
# first time only
git clone <repo-url>
cd <repo-folder>

# every time you start working
git checkout main
git pull origin main
git checkout feature/event-cards        # your branch
git merge main                          # bring in the latest main

# after making changes
git add css/events.css js/events.js index.html
git commit -m "Add treasure hunt card"
git push origin feature/event-cards
```

Then open GitHub, click **Compare & pull request**, set the base to `main`, and ask Priyanshi to review. Kena gives the final OK before anything is merged.

## Important rules

- Don't edit another person's feature without talking to them first.
- Don't push directly to `main`.
- Don't overwrite existing work. Never use `git push --force`.
- Keep changes inside your assigned area.
- Test in the browser before opening a PR.
- Avoid unnecessary dependencies.
- Don't invent event details. Anything still unknown stays as `[TBA]` until the core team confirms it.

---

## Event information

Use this as the source of truth. Anything shown as `[TBA]` is not confirmed yet.

| # | Event | Format | Time | Fee | Tagline | Button verb |
|---|---|---|---|---|---|---|
| 01 | Treasure Hunt | Team | 10:30–11:30 AM | ₹100 | The campus is hiding something. | Join the hunt |
| 02 | Workshop | [TBA] | [TBA] | [TBA] | Come curious. Leave with something new. | Get curious |
| 03 | Brand Identity Challenge | Individual | [TBA] | [TBA] | A brand. A blank canvas. No bad ideas. | Build the brand |
| 04 | Tech Charades | Team | [TBA] | [TBA] | No keyboard. No mouse. Just vibes. | Play it out |
| 05 | Garba | Everyone | [TBA] | [TBA] | Yes, IEEE does Garba. | Join the circle |

- **Treasure Hunt:** the VGEC campus becomes the playing field. Solve questions, follow hints, find the hidden whistles.
- **Workshop:** topic to be announced.
- **Brand Identity Challenge:** you get a hypothetical brand and design its logo/identity. Judged on uniqueness, innovation and creativity.
- **Tech Charades:** dumb charades with tech terms.
- **Garba:** a Gujarati Garba celebration.

Still missing: registration links, deadline, team sizes, the remaining times and fees, the workshop topic, contact details, and the logo file.
