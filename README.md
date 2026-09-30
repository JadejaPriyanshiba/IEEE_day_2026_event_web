# IEEE Day 2026 — IEEE VGEC Student Branch

The website for **IEEE Day 2026** at VGEC, **Tuesday 6 October 2026**.
Five events: Treasure Hunt, Workshop, Brand Identity Challenge, Tech Charades and Garba.

Design direction (v2): **techy, catchy, clean.** A dot-matrix, terminal-flavoured look built on the IEEE VGEC palette (Indigo `#1A325A`, Terracotta `#964B36`, Straw `#C9AF80`, Cream `#EDE9DF`, Umber `#4B3621` plus tints and shades), set in Unbounded / Geist / Geist Mono, with **light and dark themes** and a **mobile-first** layout (≈90% of visitors are on phones). The page gets straight to the point: date, countdown and a Register button are on the first screen, and every event is a flip card: poster on the front, time / format / fee and the register button on the back.

> v1 used the "Out of spec" standards-document concept. The PDFs and mockups in `design_references/` describe v1. Treat them as background only; **the live code and the rules in this README are the reference now.**


## The Web is Live
Check out: [`https://ieeeday-vgec-sb.vercel.app/`](https://ieeeday-vgec-sb.vercel.app/)
Check the mockups directly (this was the first preview **not a strict guide**, just the vibe, many changes are to be made): 
- [`mobile view`](https://jadejapriyanshiba.github.io/IEEE_day_2026_event_web/mobile/)
- [`laptop view`](https://jadejapriyanshiba.github.io/IEEE_day_2026_event_web/laptop/)


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

### Clickable mockups (desktop + mobile)

PDFs are cool, but sometimes you wanna *poke* at the thing. So we've got two live HTML mockups of the whole homepage in `design_references/framework_references/`:

| Folder | What's inside |
|---|---|
| `Desktop homepage-html/` | The full desktop homepage, 1440px wide |
| `Mobile-html/` | The full mobile page, 390px wide (iPhone-ish) |

**How to open them (pick your vibe):**

- **Easy mode (works fine):** open the folder and double-click `index.html`. Done.
- **Full mode (the exact design file, preferred):** the `.dc.html` files (`Main.dc.html` for desktop, `Mobile.dc.html` for mobile) are the originals with the precise values. Browsers block their scripts on a double-click, so run a tiny server first:
  - VS Code: right-click the `.dc.html` file → **Open with Live Server**, or
  - Terminal: `cd` into the folder, run `python -m http.server 8000`, then open `http://localhost:8000/Main.dc.html` (or `Mobile.dc.html`)

**Using them like a pro:**

- Need an exact colour, font size or spacing? **Right-click → Inspect** on the mockup and read the styles. Way faster than guessing from a PDF.
- Checking mobile? Open the desktop mockup, press `F12`, and toggle device mode (`Ctrl + Shift + M`). Or just open the mobile one.
- Find your section by its label: `§2` events, `§3` the flow (timeline), `§4` registration, `§6` FAQ, and the header/footer at the top and bottom.

> **Real talk: this is NOT the final UI.** It's a reference, a vibe check. Don't copy-paste its code into our site: it's built with absolute positioning and inline styles that won't work responsively, and it uses its own class names. Rebuild your section properly with our files and tokens (see [Where do I work?](#where-do-i-work)).

**You're allowed (encouraged, even) to cook.** If an animation, hover or little interaction would make your section hit harder, go for it. Just keep it on-brand:

- It should *mean* something. A signal wave drawing itself = yes. Random things bouncing around = nah.
- Stay in the tokens and fonts, and check it in **both themes** and at **360px wide**.
- Respect reduced motion: check `IEEEDay.prefersReducedMotion()` and tone it down if it's true.
- Keep it light: CSS or a few lines of JS, no big animation libraries (ask Priyanshi first if you really need one).
- Show it to Kena / Priyanshi in your PR. If it slaps, it stays.

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
  style.css             tokens, light/dark themes, reset, shared classes   (Priyanshi)
  sections.css          hero, ticker, about, registration, rules, outro    (Priyanshi)
  header-footer.css     header, mobile menu, register dock, footer         (Parthvi + Pushkar)
  events.css            flip cards + motifs (swipe rail → bento grid)      (Vansh + Daksh + Nilesh)
  timeline.css          the timeline                                       (Dhruvi + Dhwani)
  qa.css                Q&A                                                (Nitant)
  responsive.css        final responsive + styling pass                    (Hemal + Meet), loaded last
js/
  main.js               shared helpers: theme, scroll reveal, reg. links   (Priyanshi)
  countdown.js          hero countdown + dock countdown                    (Priyanshi)
  header-footer.js      menu, theme toggle, active link, register dock     (Parthvi + Pushkar)
  events.js             flip, tilt, peek, rail dots / arrows               (Vansh + Daksh + Nilesh)
  timeline.js           "live now" / done state on the day                 (Dhruvi + Dhwani)
  qa.js                 one answer open at a time                          (Nitant)
assets/
  logo/                 official IEEE VGEC SB logo (still needed, see assets/logo/README.md)
design_references/      design PDFs, visual system + clickable mockups (reference only)
```

Every file is already linked in `index.html`, so **you never need to edit `<head>` or the `<script>` tags.**

---

## Where do I work?

| Team | Section in `index.html` | Your files | You may change | Please don't change |
|---|---|---|---|---|
| **Priyanshi** (structure + integration) | `#top` (hero), `#about`, `#register`, `#rules`, outro | `style.css`, `sections.css`, `main.js`, `countdown.js` | Global tokens, themes, shared classes, page skeleton | — |
| **Parthvi + Pushkar** (navbar, header, footer) | `<header id="site-header">`, `#menu`, `#dock`, `<footer id="site-footer">` | `header-footer.css`, `header-footer.js`, `assets/logo/` | Everything inside those elements | Other sections, `style.css` |
| **Vansh + Daksh + Nilesh** (event cards) | `<section id="events">` → inside `.events__rail` | `events.css`, `events.js` | The cards and rail controls | The section heading, other sections |
| **Dhruvi + Dhwani** (timeline) | `<section id="timeline">` → `.timeline__list` | `timeline.css`, `timeline.js` | Everything below the section heading | Other sections |
| **Nitant** (Q&A) | `<section id="faq">` → inside `.qa-list` | `qa.css`, `qa.js` | Everything inside `.qa-list` | Other sections |
| **Hemal + Meet** (responsive + styling) | Whole page | `responsive.css` | Anything in `responsive.css` | Other teams' files, unless you agree it with them first |

### Rules for everyone's code

- **Use the tokens.** Write `color: var(--color-text)`, not `color: #14264A`. Hard-coded colours break the other theme. The full list is at the top of `css/style.css`.
- **Both themes, always.** Toggle the sun/moon button in the header and check your section in light **and** dark before opening a PR.
- **Mobile first.** Write the phone styles first, then add `@media (min-width: 640px)` / `(min-width: 1024px)` for bigger screens. Test at 360px wide. Tap targets at least 44px.
- **Shared classes you can use:** `.container`, `.section`, `.section-head` (+ `--row`), `.eyebrow` (+ `.eyebrow__num`), `.section-title` (put the accent words in `<em>` for the gradient), `.section-sub`, `.label`, `.chip` (+ `.chip--sm`, `.chip--warn`), `.live-dot`, `.btn` (+ `.btn--primary`, `.btn--ghost`, `.btn--sm`, `.btn--lg`, `.btn--block`), `.icon-btn`, `.visually-hidden`. Add `data-reveal` to fade a block in on scroll, and `data-scramble` on text inside it to "decode" it.
- **Event colours:** set `style="--ev: var(--ev-1)"` (… `--ev-5`) on an event's element, then use `var(--ev)` inside it.
- **Prefix your class names** with your section, for example `.event-card`, `.timeline__item` or `.qa-item`, so they never clash.
- **JS:** keep your code inside the `(function () { ... })();` block already in your file. Before animating, check `IEEEDay.prefersReducedMotion()`.
- **Design rules:** only brand colours and their tints (all in the tokens). Unbounded for headings only, Geist for reading text, Geist Mono for labels and numbers. Pill buttons, rounded cards (`--radius-*`). One verb per button ("Join the hunt", not "Click here"). Glass blur only on the header and dock.
- **Registration links:** paste the Google Form URL into `data-registration-url="..."` on the ticket button. `main.js` switches it on; empty = stays disabled with "soon".
- **Accessibility:** use real `<button>`s for things you click, add `alt` text to images, and keep visible focus styles (they're already global, so don't remove them).
- **Don't add libraries** without asking Priyanshi.

### Motion: what moves

The rule: things only move when it means something, and everything else stays still.

| What moves | Owner |
|---|---|
| Hero: title lines rise out of a mask, date sticker pops in, circuit pulses travel, glow orbs drift, countdown digits roll | Priyanshi (hero) |
| Ticker marquee of event names | Priyanshi |
| Header turns to glass on scroll + scroll progress line; menu links stagger in | Parthvi + Pushkar |
| Register dock slides up after the hero, hides near registration / footer (phones only) | Parthvi + Pushkar |
| Event cards: springy 3D flip with a depth dip and light sweep; each front has a live motif (radar, chip, pen tool, equaliser, Garba rings) that pauses off screen; pointer tilt + spotlight on laptops; first card peeks once | Vansh + Daksh + Nilesh |
| Timeline: each event's signal wave draws itself on scroll; "Live now" on the day | Dhruvi + Dhwani |
| Sections rise out of a soft blur on scroll (`data-reveal`); eyebrow labels decode (`data-scramble`) | Everyone |

Rules that apply to everyone:

- **Reduced motion:** when `IEEEDay.prefersReducedMotion()` is true, show everything instantly and fully drawn, and stop loops. Nothing may be hidden behind an animation. (`style.css` already kills CSS animations for these visitors.)
- **Every hover needs a tap or keyboard-focus twin,** because phones can't hover. Put hover-only effects inside `@media (hover: hover)`.
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

**Not assigned yet:** the rules content in `#rules` (currently a "coming soon" terminal). Kena decides who picks this up.

## Branches

| Branch | Who |
|---|---|
| `main` | Live site. **Nobody pushes here directly.** |
| `feature/foundation` | Priyanshi |
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

Confirmed details as of 6 October 2026:

| # | Event | Format | Time | Fee | Venue | Registration Form | Rulebook |
|---|---|---|---|---|---|---|---|
| 01 | CLUESTLE HUNT | Team | 9:00–11:00 AM (8:30 AM Reporting) | ₹100 | A Block | [Form Link](https://forms.gle/72QvyyjabLZr2YGfA) | Given at reporting desk |
| 02 | NLP: The Language of Machines (Workshop) | Open | 11:00 AM – 1:00 PM | Free | J Block Auditorium | [Form Link](https://forms.gle/cTFWqSD6ehUetmAm7) | — |
| 03 | LogoLabz (Logo Design Challenge) | Individual | 1:30 PM – 3:15 PM | Free | J Block Auditorium | [Form Link](https://forms.gle/fBsXAFacX6NCqsjV9) | [Rulebook PDF](Rulebook_Logolabz.pdf) · [Drive Mirror](https://drive.google.com/file/d/1w554UOAv2lKu1ld5sq9s9BUPj73d14N5/view) |
| 04 | Tech Charades | Individual | 3:30 PM – 4:30 PM | Free | J Block Auditorium | [Form Link](https://forms.gle/aD3humeoC4r9Qjvu6) | — |
| 05 | Garba Celebration | Everyone | 4:00 PM onwards | Free | M & N Block | Open entry (no form required) | — |

- **CLUESTLE HUNT:** VGEC campus becomes the playing field. Solve questions, follow hints, find the hidden checkpoints.
- **NLP: The Language of Machines:** Keynote workshop by Dr. Uttam Chauhan (Associate Professor, GEC Modasa).
- **LogoLabz:** Hypothetical brand identity & logo design challenge. Individual participation. Judged on design creativity and a short presentation.
- **Tech Charades:** Dumb charades with technical concepts and computing terms. Individual participation showdown.
- **Garba:** Traditional Gujarati Garba celebration to close the day. Open to everyone.

