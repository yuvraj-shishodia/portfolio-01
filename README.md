# Yuvraj Shishodia — Portfolio

A single-page portfolio: white, black and gray, one continuous scroll, every section with its own component and motion.
Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 and Lenis — no other animation libraries, no WebGL.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (type-checks)
npm start          # serve the production build
npm run lint
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://yuvraj.dev`) in production so Open Graph URLs are absolute. On Vercel the production URL is picked up automatically.

## Editing content

All text lives in [`src/lib/data.ts`](src/lib/data.ts) — `PROFILE`, `NAV`, `SKILL_GROUPS`, `EXPERIENCE`, `EDUCATION`, `PROJECTS`, `CERTIFICATIONS`, `ACHIEVEMENTS`, `ID_CARD`. Components only read from it.

- Sections with no data disappear along with their nav link, and section numbers (`01 — About`, …) renumber themselves. Add an entry to `CERTIFICATIONS` and that section appears.
- Skill tiles link to projects automatically when a project's `tech` uses the same name as the skill.
- The downloadable résumé is `public/Yuvraj-Shishodia-Resume.pdf`.

## Sections

| # | Section | Component | Motion |
|---|---|---|---|
| — | Navigation | `components/Navigation.tsx` | Frosted pill after 40px, sliding active indicator, top progress bar, clip-path mobile menu |
| — | Hero | `components/hero/Hero.tsx` | Looping intro video (multiply-blended), outlined ghost name, sound toggle, pauses off-screen |
| 01 | About | `sections/About.tsx`, `ui/IdCard.tsx` | ID card on a lanyard: damped pendulum, idle sway, 3D flip (hover / tap / Enter) |
| 02 | Skills | `sections/Skills.tsx` | Periodic table with diagonal wave reveal, family filter, sticky inspector |
| 03 | Work | `sections/Work.tsx`, `ui/MiniUI.tsx` | Expanding accordion gallery, clip-path wipe of an illustrative UI |
| — | Certifications | `sections/Certifications.tsx` | Ink-flood rows (hidden until there is data) |
| 04 | Experience | `sections/Experience.tsx` | Timeline spine draws with scroll; stops light up |
| 05 | Achievements | `sections/Achievements.tsx` | Pinned horizontal gallery, count-up numbers, nearest card lifts |
| 06 | Contact | `sections/Contact.tsx`, `sections/Footer.tsx` | Hopping letters, copy-to-clipboard, spinning badge |

Shared pieces: `lib/hooks.ts` (`useInView`, `useScrollProgress`, `prefersReducedMotion`), `lib/scroll.tsx` (Lenis + `scrollToTarget`), `ui/RevealObserver.tsx` (`.rv` / `.rv-mask` reveals), `ui/TechLogo.tsx` (`BRAND` + `CONCEPT` maps, `isBrand()`).
Component CSS lives in a `<Style>` tag inside each component and is placed in `@layer components`, so Tailwind utilities always win.

`prefers-reduced-motion` turns off Lenis, the pendulum, autoplay and decorative animation.

## Rebuilding the hero video

Source files live in `media/` (`intro.mp4`, `portrait.jpg`). The pipeline needs Python with `numpy` and ffmpeg (on `PATH`, or `pip install imageio-ffmpeg`).

```bash
python scripts/build-hero-assets.py
# options: --src media/intro.mp4 --photo media/portrait.jpg --crop W:H:X:Y --fade 0.5 --seconds 10
```

It detects the person and crops head-to-toe at a 768:960 ratio (never upscaling), maps the measured backdrop to pure white so it disappears into the page with `mix-blend-mode: multiply`, and makes the clip loop seamlessly: the first 0.5 s is cross-faded into the tail (video with ffmpeg `xfade`, audio sample-accurately in numpy), with no retiming so lips stay in sync. It writes:

- `public/hero/hero.webm` (VP9 CRF 36 + Opus 80k) and `public/hero/hero.mp4` (H.264 CRF 24 + AAC 96k, faststart)
- `public/hero/poster.webp`, `public/portrait-bust.webp` (480×600), `public/og.jpg` (1200×630)

## Credits & licences

- Brand logos in `public/logos/`: [devicon](https://devicon.dev) ("original" SVGs, MIT — `LICENSE-devicon.txt`) and [Simple Icons](https://simpleicons.org) for Render, JWT and Stripe (CC0 — `LICENSE-simple-icons.md`). Logos are trademarks of their owners and are used only to name the technologies.
- Fonts in `src/fonts/`: Inter Tight, Instrument Serif and JetBrains Mono, all under the SIL Open Font License 1.1 (licence files alongside).
- Concept and honour icons are drawn in-house (`ui/TechLogo.tsx`).
