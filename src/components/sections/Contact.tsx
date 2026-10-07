"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/data";
import { SectionTag } from "../ui/SectionTag";
import { Style } from "../ui/Style";

const LINES: { text: string; accent?: string }[] = [{ text: "Let's build" }, { text: "something ", accent: "together." }];

/** Letters hop when the cursor passes over them. */
function HopLine({ text, accent }: { text: string; accent?: string }) {
  const hop = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    if (el.classList.contains("is-hop")) return;
    el.classList.add("is-hop");
    el.addEventListener("animationend", () => el.classList.remove("is-hop"), { once: true });
  };
  const letters = (s: string, cls = "") =>
    Array.from(s).map((ch, i) =>
      ch === " " ? (
        <span key={`${cls}${i}`}> </span>
      ) : (
        <span key={`${cls}${i}`} className={`hop ${cls}`} onPointerEnter={hop}>
          {ch}
        </span>
      ),
    );
  return (
    <span className="ct-line" aria-hidden="true">
      {letters(text)}
      {accent && <em>{letters(accent, "a")}</em>}
    </span>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = PROFILE.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const links = [
    { label: "GitHub", href: PROFILE.github },
    { label: "LinkedIn", href: PROFILE.linkedin },
    { label: "LeetCode", href: PROFILE.leetcode },
  ];

  return (
    <section id="contact" className="section ct" aria-labelledby="ct-title" tabIndex={-1}>
      <Style id="contact" css={CSS} />
      <div className="wrap">
        <SectionTag id="contact" label="Contact" className="rv" />
        <h2 id="ct-title" className="ct-h rv" aria-label="Let's build something together.">
          {LINES.map((l) => (
            <HopLine key={l.text} {...l} />
          ))}
        </h2>

        <div className="ct-grid">
          <div className="ct-main rv">
            <p className="ct-label mono">Write to me</p>
            <div className="ct-email-row">
              <a href={`mailto:${PROFILE.email}`} className="ct-email">
                {PROFILE.email}
              </a>
              <button type="button" className="chip ct-copy" onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
            <ul className="ct-links">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    <span>{l.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <a href={`mailto:${PROFILE.email}`} className="ct-badge rv" aria-label={`Say hello — email ${PROFILE.firstName}`}>
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path id="ct-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text>
                <textPath href="#ct-circle" startOffset="0">
                  SAY HELLO · SAY HELLO · SAY HELLO ·
                </textPath>
              </text>
            </svg>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.ct{padding-bottom:clamp(64px,10vh,110px)}
.ct-h{margin:22px 0 clamp(40px,7vh,72px);font-weight:700;font-size:clamp(46px,9vw,150px);line-height:.95;letter-spacing:-.055em}
.ct-line{display:block;white-space:nowrap}
.ct-line em{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.02em;color:var(--mute)}
.hop{display:inline-block;will-change:transform}
.hop.is-hop{animation:hop .6s var(--ease)}
@keyframes hop{30%{transform:translateY(-.14em)}60%{transform:translateY(.02em)}}
.ct-grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end}
.ct-label{margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
.ct-email-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px}
.ct-email{font-size:clamp(22px,3.4vw,46px);font-weight:600;letter-spacing:-.04em;text-decoration:underline;text-decoration-thickness:2px;
  text-underline-offset:.18em;text-decoration-color:var(--faint);transition:text-decoration-color .4s var(--ease);overflow-wrap:anywhere}
.ct-email:hover{text-decoration-color:var(--ink)}
.ct-copy{cursor:pointer;transition:background-color .3s var(--ease),color .3s var(--ease)}
.ct-copy:hover{background:var(--ink);color:var(--paper)}
.ct-links{list-style:none;margin:36px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:10px}
.ct-links a{display:inline-flex;gap:10px;align-items:center;height:46px;padding:0 20px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);
  font-weight:500;transition:background-color .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
.ct-links a:hover{background:var(--ink);color:var(--paper);transform:translateY(-2px)}
.ct-badge{position:relative;display:grid;place-items:center;contain:paint;width:clamp(130px,14vw,180px);aspect-ratio:1;border-radius:50%}
.ct-badge svg{position:absolute;inset:0;width:100%;height:100%;animation:ct-spin 18s linear infinite}
.ct-badge text{font-family:var(--font-mono);font-size:15.5px;letter-spacing:.2em;fill:var(--ink)}
.ct-badge>span{display:grid;place-items:center;width:46%;aspect-ratio:1;border-radius:50%;background:var(--ink);color:var(--paper);font-size:22px;
  transition:transform .5s var(--ease)}
.ct-badge:hover>span{transform:rotate(45deg) scale(1.05)}
@keyframes ct-spin{to{transform:rotate(360deg)}}
@media (max-width:640px){.ct-grid{grid-template-columns:minmax(0,1fr)}.ct-badge{justify-self:end}.ct-line{white-space:normal}}
`;
