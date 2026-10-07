"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { ELEMENTS, SKILL_GROUPS, type Element, type Family } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { SectionTag } from "../ui/SectionTag";
import { Style } from "../ui/Style";
import { TechLogo, brandColor, isBrand } from "../ui/TechLogo";

const FAMILIES: (Family | "All")[] = ["All", ...SKILL_GROUPS.map((g) => g.family)];
const NARROW = "(max-width: 899px)";

function useColumns() {
  const narrow = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(NARROW);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(NARROW).matches,
    () => false,
  );
  return narrow ? 4 : 8;
}

export default function Skills() {
  const gridRef = useRef<HTMLDivElement>(null);
  const shown = useInView(gridRef, { threshold: 0.15, once: true });
  const [filter, setFilter] = useState<Family | "All">("All");
  const [active, setActive] = useState<Element>(ELEMENTS[0]);
  const cols = useColumns();

  const glow = brandColor(active.name);

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title" tabIndex={-1}>
      <Style id="skills" css={CSS} />
      <div className="wrap">
        <SectionTag id="skills" label="Skills" className="rv" />
        <h2 id="skills-title" className="h2 skills-h">
          <span className="rv-mask">
            <span>The periodic table</span>
          </span>
          <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
            <span>
              of my <em>stack.</em>
            </span>
          </span>
        </h2>

        <div className="pt-filters rv" role="group" aria-label="Filter by family">
          {FAMILIES.map((f) => (
            <button
              key={f}
              type="button"
              className={`pt-chip ${filter === f ? "is-on" : ""}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="pt-layout">
          <div ref={gridRef} className={`pt-grid ${shown ? "is-in" : ""}`}>
            {ELEMENTS.map((el, i) => {
              const dim = filter !== "All" && el.family !== filter;
              const row = Math.floor(i / cols);
              const col = i % cols;
              return (
                <button
                  key={el.name}
                  type="button"
                  className={`pt-tile ${dim ? "is-dim" : ""} ${active.name === el.name ? "is-active" : ""}`}
                  style={{ "--d": `${(row + col) * 40}ms` } as React.CSSProperties}
                  onMouseEnter={() => setActive(el)}
                  onFocus={() => setActive(el)}
                  onClick={() => setActive(el)}
                >
                  <span className="pt-num mono">{el.number}</span>
                  <span className="pt-sym">{el.symbol}</span>
                  <span className="pt-name">{el.name}</span>
                  <span className="pt-fam mono">{el.family}</span>
                </button>
              );
            })}
          </div>

          <aside className="pt-inspector card" aria-label="Skill details">
            <div className="pt-logo" key={active.name} style={glow ? ({ "--glow": glow } as React.CSSProperties) : undefined}>
              <TechLogo name={active.name} size={150} className={isBrand(active.name) ? "" : "pt-concept"} />
            </div>
            <p className="pt-i-num mono">
              {String(active.number).padStart(2, "0")} · {active.symbol}
            </p>
            <h3 className="pt-i-name">{active.name}</h3>
            <p className="pt-i-fam mono">{active.family}</p>
            <div className="pt-i-used">
              <p className="mono">Used in</p>
              {active.usedIn.length ? (
                <ul>
                  {active.usedIn.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              ) : (
                <p className="pt-i-none">Listed in my résumé&apos;s technical skills.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.skills-h{margin:22px 0 36px}
.pt-filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
.pt-chip{height:36px;padding:0 16px;border-radius:999px;font-size:13.5px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);
  color:var(--ink-2);transition:background-color .4s var(--ease),color .4s var(--ease),box-shadow .4s var(--ease)}
.pt-chip:hover{box-shadow:inset 0 0 0 1px var(--ink);color:var(--ink)}
.pt-chip.is-on{background:var(--ink);color:var(--paper);box-shadow:inset 0 0 0 1px var(--ink)}
.pt-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}
.pt-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
.pt-tile{position:relative;display:flex;flex-direction:column;align-items:flex-start;text-align:left;aspect-ratio:1/1.1;min-width:0;
  padding:10px 11px;border-radius:14px;background:var(--card);box-shadow:var(--hairline);
  opacity:0;transform:translateY(14px) scale(.96);
  transition:opacity .7s var(--ease) var(--d),transform .7s var(--ease) var(--d),background-color .35s var(--ease),
    color .35s var(--ease),box-shadow .35s var(--ease)}
.pt-grid.is-in .pt-tile{opacity:1;transform:none}
.pt-grid.is-in .pt-tile.is-dim{opacity:.22;transition-delay:0s}
.pt-tile:hover,.pt-tile.is-active{background:var(--ink);color:var(--paper);box-shadow:0 18px 30px -18px rgba(13,13,13,.6)}
.pt-grid.is-in .pt-tile:hover{transform:translateY(-3px);transition-delay:0s}
.pt-num{font-size:10px;color:var(--mute)}
.pt-sym{margin-top:auto;font-weight:700;font-size:clamp(20px,2.2vw,32px);letter-spacing:-.04em;line-height:1}
.pt-name{margin-top:6px;font-size:11.5px;font-weight:500;line-height:1.2;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pt-fam{margin-top:2px;font-size:9px;color:var(--mute);text-transform:uppercase;letter-spacing:.04em;max-width:100%;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap}
.pt-tile:hover .pt-num,.pt-tile:hover .pt-fam,.pt-tile.is-active .pt-num,.pt-tile.is-active .pt-fam{color:var(--faint)}
.pt-inspector{position:sticky;top:96px;padding:26px;display:flex;flex-direction:column;min-height:420px}
.pt-logo{position:relative;display:grid;place-items:center;height:190px;margin-bottom:14px;color:var(--ink);
  animation:pt-pop .7s var(--ease) both}
.pt-logo::before{content:"";position:absolute;width:190px;height:190px;border-radius:50%;
  background:radial-gradient(closest-side,color-mix(in srgb,var(--glow,#0d0d0d) 22%,transparent),transparent);filter:blur(6px)}
.pt-logo>*{position:relative}
@keyframes pt-pop{from{opacity:0;transform:scale(.7) rotate(-6deg)}60%{transform:scale(1.04)}to{opacity:1;transform:none}}
.pt-i-num{margin:0;font-size:11px;color:var(--mute)}
.pt-i-name{margin:4px 0 2px;font-size:30px;font-weight:700;letter-spacing:-.04em;line-height:1.05}
.pt-i-fam{margin:0;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
.pt-i-used{margin-top:auto;padding-top:18px;border-top:1px solid var(--line)}
.pt-i-used>p.mono{margin:0 0 8px;font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
.pt-i-used ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.pt-i-used li{padding:5px 11px;border-radius:999px;box-shadow:var(--hairline);font-size:13px}
.pt-i-none{margin:0;font-size:14px;color:var(--ink-2)}
@media (max-width:1100px){.pt-layout{grid-template-columns:minmax(0,1fr)}.pt-inspector{position:relative;top:0;min-height:0}}
@media (max-width:899px){.pt-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.pt-tile{aspect-ratio:1/1.05}}
`;
