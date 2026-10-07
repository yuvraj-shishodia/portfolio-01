"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { PROJECTS } from "@/lib/data";
import { MiniUI } from "../ui/MiniUI";
import { SectionTag } from "../ui/SectionTag";
import { Style } from "../ui/Style";
import { TechLogo } from "../ui/TechLogo";

const DESKTOP = "(min-width: 900px)";
const GAP = 10;
const OPEN_FLEX = 8;

function useDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DESKTOP);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );
}

export default function Work() {
  const [open, setOpen] = useState(0);
  const desktop = useDesktop();
  const rowRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  // Width of the open panel, so its content can be laid out at full size while the flex animates.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const ro = new ResizeObserver(() => {
      const n = PROJECTS.length;
      const unit = (row.clientWidth - GAP * (n - 1)) / (OPEN_FLEX + n - 1);
      row.style.setProperty("--ow", `${Math.round(unit * OPEN_FLEX)}px`);
    });
    ro.observe(row);
    return () => ro.disconnect();
  }, []);

  const openFromKeyboardOrClick = (i: number) => {
    if (!desktop && open === i) return setOpen(-1); // mobile accordion toggles
    setOpen(i);
    // On desktop the spine disappears once open, so hand focus to the panel heading.
    if (desktop) requestAnimationFrame(() => headingRefs.current[i]?.focus({ preventScroll: true }));
  };

  return (
    <section id="work" className="section work" aria-labelledby="work-title" tabIndex={-1}>
      <Style id="work" css={CSS} />
      <div className="wrap">
        <div className="work-head">
          <SectionTag id="work" label="Selected work" className="rv" />
          <h2 id="work-title" className="h2">
            <span className="rv-mask">
              <span>
                Things I’ve <em>built.</em>
              </span>
            </span>
          </h2>
        </div>

        <div ref={rowRef} className="wk-row" style={{ "--gap": `${GAP}px` } as React.CSSProperties}>
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <article
                key={p.id}
                className="wk-panel rv"
                data-open={isOpen}
                style={{ "--i": i } as React.CSSProperties}
                onPointerEnter={(e) => {
                  if (desktop && e.pointerType === "mouse") setOpen(i);
                }}
              >
                <button
                  type="button"
                  className="wk-spine"
                  aria-expanded={isOpen}
                  aria-controls={`wk-${p.id}`}
                  onClick={() => openFromKeyboardOrClick(i)}
                  onFocus={() => {
                    if (desktop && !isOpen) openFromKeyboardOrClick(i);
                  }}
                >
                  <span className="wk-spine-idx mono">{p.index}</span>
                  <span className="wk-spine-title">{p.title}</span>
                  <span className="wk-plus" aria-hidden="true" />
                </button>

                <div id={`wk-${p.id}`} className="wk-body" inert={!isOpen}>
                  <div className="wk-info">
                    <p className="wk-kicker mono">
                      {p.index} — {p.kicker}
                    </p>
                    <h3
                      ref={(el) => {
                        headingRefs.current[i] = el;
                      }}
                      tabIndex={-1}
                      className="wk-title"
                    >
                      {p.title}
                    </h3>
                    <p className="wk-desc">{p.description}</p>
                    <ul className="wk-features">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <ul className="wk-tech" aria-label="Tech stack">
                      {p.tech.map((t) => (
                        <li key={t} className="chip">
                          <TechLogo name={t} size={14} />
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="wk-links">
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                          Live site <span aria-hidden="true">↗</span>
                        </a>
                      )}
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                          View on GitHub <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <figure className="wk-visual">
                    <MiniUI kind={p.ui} />
                    <figcaption className="mono">Illustrative UI</figcaption>
                  </figure>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const CSS = `
.work-head{display:flex;flex-direction:column;gap:22px;margin-bottom:40px}
.wk-row{display:flex;gap:var(--gap);height:min(78svh,600px)}
.wk-panel{position:relative;flex:1 1 0;min-width:0;border-radius:26px;background:var(--card);box-shadow:var(--hairline);overflow:hidden;
  transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease),opacity .9s var(--ease),transform .9s var(--ease)}
.js .wk-panel.rv{transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease),opacity .9s var(--ease) calc(var(--i) * 80ms),
  transform .9s var(--ease) calc(var(--i) * 80ms)}
.wk-panel[data-open="true"]{flex-grow:8;box-shadow:var(--hairline),var(--lift)}
.wk-spine{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;
  border-radius:26px;transition:opacity .4s var(--ease),background-color .4s var(--ease)}
.wk-spine:hover{background:#fbfaf8}
.wk-panel[data-open="true"] .wk-spine{opacity:0;pointer-events:none;visibility:hidden;transition:opacity .2s,visibility 0s .2s}
.wk-spine-idx{font-size:12px;color:var(--mute)}
.wk-spine-title{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:700;font-size:clamp(18px,1.6vw,24px);letter-spacing:-.03em;white-space:nowrap}
.wk-plus{position:relative;width:38px;height:38px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);transition:transform .6s var(--ease),background-color .4s,color .4s}
.wk-plus::before,.wk-plus::after{content:"";position:absolute;left:50%;top:50%;width:12px;height:1.5px;margin:-.75px 0 0 -6px;background:currentColor}
.wk-plus::after{transform:rotate(90deg)}
.wk-spine:hover .wk-plus{transform:rotate(90deg);background:var(--ink);color:var(--paper)}
.wk-body{position:absolute;top:0;bottom:0;left:0;width:var(--ow,900px);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);
  gap:clamp(20px,2.5vw,40px);padding:clamp(24px,3vw,40px);opacity:0;transition:opacity .3s var(--ease)}
.wk-panel[data-open="true"] .wk-body{opacity:1;transition:opacity .6s .35s var(--ease)}
.wk-info{display:flex;flex-direction:column;min-width:0}
.wk-kicker{margin:0;font-size:12px;color:var(--mute);text-transform:uppercase;letter-spacing:.04em}
.wk-title{margin:10px 0 14px;font-size:clamp(34px,3.6vw,56px);font-weight:700;letter-spacing:-.045em;line-height:1}
.wk-title:focus{outline:none}
.wk-desc{margin:0 0 18px;font-size:15px;line-height:1.55;color:var(--ink-2)}
.wk-features{list-style:none;margin:0 0 18px;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:8px 18px}
.wk-features li{position:relative;padding-left:14px;font-size:13px;line-height:1.4;color:var(--ink-2)}
.wk-features li::before{content:"";position:absolute;left:0;top:.55em;width:5px;height:5px;border-radius:50%;background:var(--ink)}
.wk-tech{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.wk-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:20px}
.wk-visual{position:relative;margin:0;display:flex;flex-direction:column;min-height:0;clip-path:inset(0 100% 0 0 round 18px);
  transition:clip-path .3s var(--ease)}
.wk-panel[data-open="true"] .wk-visual{clip-path:inset(0 0 0 0 round 18px);transition:clip-path 1.1s .45s var(--ease)}
.wk-visual figcaption{position:absolute;right:10px;top:6px;padding:2px 9px;border-radius:999px;background:rgba(255,255,255,.85);
  box-shadow:var(--hairline);font-size:10.5px;color:var(--mute)}
@media (max-width:1180px){.wk-features{grid-template-columns:1fr}}
@media (max-width:899px){
  .wk-row{flex-direction:column;height:auto}
  .wk-panel{flex:none}
  .wk-spine{position:relative;inset:auto;width:100%;flex-direction:row;padding:18px 20px;gap:16px;justify-content:flex-start}
  .wk-panel[data-open="true"] .wk-spine{opacity:1;visibility:visible;pointer-events:auto}
  .wk-spine-title{writing-mode:horizontal-tb;transform:none;flex:1;text-align:left}
  .wk-panel[data-open="true"] .wk-plus{transform:rotate(45deg)}
  .wk-body{position:relative;width:auto;display:none;grid-template-columns:minmax(0,1fr);padding:0 20px 22px}
  .wk-panel[data-open="true"] .wk-body{display:grid}
  .wk-title{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
  .wk-visual{height:300px}
  .wk-features{grid-template-columns:1fr}
}
`;
