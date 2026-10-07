"use client";

import { useRef, useState } from "react";
import { EDUCATION, EXPERIENCE, type Education, type Experience as Job } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { ScrollLink } from "../ui/ScrollLink";
import { SectionTag } from "../ui/SectionTag";
import { Style } from "../ui/Style";

type Stop =
  | { kind: "work"; key: string; start: string; year: string; data: Job }
  | { kind: "edu"; key: string; start: string; year: string; data: Education };

// Education and experience on one chronological path.
const STOPS: Stop[] = [
  ...EXPERIENCE.map((e) => ({ kind: "work" as const, key: e.org, start: e.start, year: e.start.slice(0, 4), data: e })),
  ...EDUCATION.map((e) => ({ kind: "edu" as const, key: e.school, start: e.start, year: e.start.slice(0, 4), data: e })),
].sort((a, b) => a.start.localeCompare(b.start));

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);

  // The spine draws as the list passes the 60% line; each stop lights when the spine reaches its dot.
  useScrollProgress(
    listRef,
    (p) => {
      const list = listRef.current;
      if (!list || !fillRef.current) return;
      fillRef.current.style.transform = `scaleY(${p})`;
      const drawn = p * list.offsetHeight;
      const items = Array.from(list.children) as HTMLElement[];
      const count = items.filter((li) => li.offsetTop + 14 <= drawn + 1).length;
      setLit(count);
    },
    0.6,
    0.6,
  );

  return (
    <section id="experience" className="section exp" aria-labelledby="exp-title" tabIndex={-1}>
      <Style id="exp" css={CSS} />
      <div className="wrap exp-grid">
        <div className="exp-head">
          <SectionTag id="experience" label="Experience & education" className="rv" />
          <h2 id="exp-title" className="h2">
            <span className="rv-mask">
              <span>The path</span>
            </span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <span>
                so <em>far.</em>
              </span>
            </span>
          </h2>
        </div>

        <div className="exp-path">
          <div className="exp-spine" aria-hidden="true">
            <div ref={fillRef} />
          </div>
          <ol ref={listRef} className="exp-list">
            {STOPS.map((s, i) => (
              <li key={s.key} className={`exp-stop ${i < lit ? "is-lit" : ""}`}>
                <span className="exp-dot" aria-hidden="true" />
                <p className="exp-year mono">
                  {s.data.period}
                  <span>{s.kind === "work" ? "Experience" : "Education"}</span>
                </p>
                {s.kind === "work" ? (
                  <>
                    <h3 className="exp-title">{s.data.role}</h3>
                    <p className="exp-place">
                      {s.data.org} · {s.data.mode}
                    </p>
                    <ul className="exp-points">
                      {s.data.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <h3 className="exp-title">{s.data.title}</h3>
                    <p className="exp-place">{s.data.school}</p>
                    <p className="exp-detail">{s.data.detail}</p>
                  </>
                )}
              </li>
            ))}
            <li className={`exp-stop exp-next ${lit > STOPS.length ? "is-lit" : ""}`}>
              <span className="exp-dot" aria-hidden="true" />
              <div className="exp-next-card">
                <p className="mono">Next</p>
                <p className="exp-next-q">
                  Your <em>team?</em>
                </p>
                <ScrollLink href="#contact" className="btn btn-primary btn-sm">
                  Let&apos;s talk <span aria-hidden="true">→</span>
                </ScrollLink>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.exp-grid{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:48px;align-items:start}
.exp-head{position:sticky;top:110px;display:flex;flex-direction:column;gap:22px}
.exp-path{position:relative;padding-left:44px}
.exp-spine{position:absolute;left:11px;top:6px;bottom:6px;width:2px;background:var(--soft);border-radius:2px;overflow:hidden}
.exp-spine div{width:100%;height:100%;background:var(--ink);transform:scaleY(0);transform-origin:50% 0}
.exp-list{list-style:none;margin:0;padding:0;display:grid;gap:clamp(40px,7vh,72px)}
.exp-stop{position:relative;--c:var(--mute)}
.exp-stop.is-lit{--c:var(--ink)}
.exp-title,.exp-year,.exp-detail,.exp-points li,.exp-next-q{color:var(--c);transition:color .8s var(--ease)}
.exp-dot{position:absolute;left:-44px;top:4px;width:24px;height:24px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--soft);
  transition:box-shadow .6s var(--ease),background-color .6s var(--ease)}
.exp-dot::after{content:"";position:absolute;inset:7px;border-radius:50%;background:var(--faint);transition:background-color .6s var(--ease),transform .6s var(--ease)}
.is-lit .exp-dot{box-shadow:inset 0 0 0 2px var(--ink)}
.is-lit .exp-dot::after{background:var(--ink);transform:scale(1.15)}
.exp-year{display:flex;gap:12px;align-items:center;margin:4px 0 10px;font-size:12px}
.exp-year span{color:var(--mute);text-transform:uppercase;letter-spacing:.05em;font-size:10.5px}
.exp-title{margin:0;font-size:clamp(24px,2.6vw,36px);font-weight:700;letter-spacing:-.04em;line-height:1.05}
.exp-place{margin:6px 0 0;font-size:15px;color:var(--mute)}
.exp-detail{margin:12px 0 0;font-size:15px;line-height:1.55}
.exp-points{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:9px;max-width:720px}
.exp-points li{position:relative;padding-left:16px;font-size:15px;line-height:1.55}
.exp-points li::before{content:"";position:absolute;left:0;top:.7em;width:6px;height:1.5px;background:currentColor}
.exp-next-card{display:flex;flex-wrap:wrap;align-items:center;gap:12px 24px;padding:24px 26px;border-radius:24px;border:1.5px dashed rgba(13,13,13,.28)}
.exp-next-card .mono{margin:0;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
.exp-next-q{margin:0;flex:1;font-size:clamp(26px,2.6vw,38px);font-weight:700;letter-spacing:-.04em}
.exp-next-card{transition:border-color .8s var(--ease)}
.is-lit .exp-next-card{border-color:rgba(13,13,13,.5)}
.exp-next-q em{font-family:var(--font-serif);font-style:italic;font-weight:400;color:var(--mute)}
@media (max-width:899px){.exp-grid{grid-template-columns:minmax(0,1fr)}.exp-head{position:static}.exp-path{padding-left:38px}
  .exp-dot{left:-38px}.exp-spine{left:11px}}
`;
