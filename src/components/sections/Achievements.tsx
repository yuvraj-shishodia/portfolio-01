"use client";

import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import { useReducedMotion, useScrollProgress } from "@/lib/hooks";
import { SectionTag } from "../ui/SectionTag";
import { Style } from "../ui/Style";
import { TechLogo, brandColor } from "../ui/TechLogo";

const TOTAL = String(ACHIEVEMENTS.length).padStart(2, "0");

function CountUp({ a, run }: { a: Achievement; run: boolean }) {
  const [n, setN] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!run || reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400);
      setN(Math.round(a.value * (1 - Math.pow(1 - k, 4)))); // easeOutQuart
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, reduced, a.value]);
  return (
    <span className="ach-num" aria-hidden="true">
      {a.prefix}
      {run && reduced ? a.value : n}
      {a.suffix}
    </span>
  );
}

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const travel = useRef(0);
  const [near, setNear] = useState(0);
  const [seen, setSeen] = useState<boolean[]>(() => ACHIEVEMENTS.map(() => false));

  // Section height = viewport + horizontal travel, so the pinned track slides while you scroll.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const vp = viewportRef.current;
      const section = sectionRef.current;
      if (!track || !vp || !section) return;
      const cs = getComputedStyle(vp);
      const inner = vp.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      travel.current = Math.max(0, Math.ceil(track.scrollWidth - inner));
      section.style.height = travel.current > 0 ? `calc(100svh + ${travel.current}px)` : "";
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  useScrollProgress(sectionRef, (p) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${-p * travel.current}px,0,0)`;
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

    // Lift the card closest to the viewport centre.
    const mid = window.innerWidth / 2;
    let best = 0;
    let bestD = Infinity;
    Array.from(track.querySelectorAll<HTMLElement>(".ach-card")).forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setNear(best);
  });

  // Count up the first time each card is seen.
  useEffect(() => {
    const cards = trackRef.current?.querySelectorAll<HTMLElement>(".ach-card");
    if (!cards) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.i);
          setSeen((s) => (s[i] ? s : s.map((v, j) => v || j === i)));
          io.unobserve(e.target);
        }
      },
      { threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="achievements" className="ach" aria-labelledby="ach-title" tabIndex={-1}>
      <Style id="ach" css={CSS} />
      <div className="ach-pin">
        <div className="wrap ach-head">
          <div>
            <SectionTag id="achievements" label="Achievements" className="rv" />
            <h2 id="ach-title" className="h2">
              <span className="rv-mask">
                <span>
                  Wins, in <em>numbers.</em>
                </span>
              </span>
            </h2>
          </div>
          <div className="ach-progress" aria-hidden="true">
            <div ref={barRef} />
          </div>
        </div>

        <div ref={viewportRef} className="ach-viewport">
          <ol ref={trackRef} className="ach-track">
            {ACHIEVEMENTS.map((a, i) => {
              const tint = brandColor(a.logo);
              return (
                <li
                  key={a.label}
                  data-i={i}
                  className={`ach-card ${near === i ? "is-near" : ""}`}
                  style={tint ? ({ "--glow": tint } as React.CSSProperties) : undefined}
                >
                  <div className="ach-top">
                    <span className="ach-logo">
                      <TechLogo name={a.logo} size={34} />
                    </span>
                    <span className="ach-idx mono">
                      {String(i + 1).padStart(2, "0")} / {TOTAL}
                    </span>
                  </div>
                  <div className="ach-bottom">
                    <div className="ach-text">
                      <h3 className="ach-label">{a.label}</h3>
                      <p className="ach-caption">{a.caption}</p>
                      <p className="ach-detail mono">{a.detail}</p>
                    </div>
                    <div className="ach-stat">
                      <CountUp a={a} run={seen[i]} />
                      <span className="sr-only">
                        {a.prefix}
                        {a.value}
                        {a.suffix} {a.unit}
                      </span>
                      <span className="ach-unit mono" aria-hidden="true">
                        {a.unit}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
            <li className="ach-end" aria-hidden="true">
              and counting <span>→</span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.ach{position:relative}
.ach-pin{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:clamp(24px,5vh,48px);overflow:clip;
  padding-block:clamp(72px,10vh,110px) clamp(24px,5vh,48px)}
.ach-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.ach-head .h2{margin-top:22px}
.ach-progress{flex:none;width:clamp(120px,18vw,240px);height:2px;margin-bottom:14px;background:var(--soft);border-radius:2px;overflow:hidden}
.ach-progress div{height:100%;background:var(--ink);transform:scaleX(0);transform-origin:0 50%}
.ach-viewport{width:100%;max-width:calc(var(--maxw) + var(--gutter) * 2);margin-inline:auto;padding-inline:var(--gutter)}
.ach-track{list-style:none;margin:0;padding:22px 0 30px;display:flex;gap:clamp(14px,2vw,24px);width:max-content;will-change:transform}
.ach-card{position:relative;flex:none;display:flex;flex-direction:column;justify-content:space-between;
  width:clamp(min(300px,84vw),40vw,540px);height:clamp(260px,36vh,310px);padding:24px 26px;border-radius:28px;background:var(--card);
  box-shadow:var(--hairline),0 10px 30px -24px rgba(13,13,13,.3);
  transition:transform .8s var(--ease),box-shadow .8s var(--ease)}
.ach-card.is-near{transform:translateY(-12px);box-shadow:var(--hairline),0 40px 60px -34px rgba(13,13,13,.4),0 16px 28px -20px rgba(13,13,13,.18)}
.ach-top{display:flex;align-items:flex-start;justify-content:space-between}
.ach-logo{position:relative;display:grid;place-items:center;width:72px;height:72px;border-radius:20px;background:var(--card);box-shadow:var(--hairline);color:var(--ink)}
.ach-logo::before{content:"";position:absolute;inset:-16px;z-index:-1;border-radius:50%;opacity:.45;transition:opacity .8s var(--ease);
  background:radial-gradient(closest-side,color-mix(in srgb,var(--glow,#0d0d0d) 26%,transparent),transparent)}
.is-near .ach-logo::before{opacity:1}
.ach-idx{font-size:12px;color:var(--mute)}
.ach-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:16px}
.ach-text{min-width:0}
.ach-label{margin:0;font-size:clamp(18px,1.6vw,22px);font-weight:700;letter-spacing:-.03em;line-height:1.1}
.ach-caption{margin:6px 0 0;font-size:13px;line-height:1.4;color:var(--mute)}
.ach-detail{margin:10px 0 0;font-size:11px;line-height:1.45;color:var(--ink-2)}
.ach-stat{flex:none;display:flex;flex-direction:column;align-items:flex-end;text-align:right}
.ach-num{font-weight:700;font-size:clamp(56px,6.4vw,96px);line-height:.85;letter-spacing:-.06em;font-variant-numeric:tabular-nums}
.ach-unit{margin-top:8px;font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--mute);max-width:130px}
.ach-end{flex:none;align-self:center;padding:0 clamp(24px,6vw,80px) 0 clamp(8px,2vw,24px);font-family:var(--font-serif);font-style:italic;
  font-size:clamp(28px,3vw,44px);color:var(--mute);white-space:nowrap}
.ach-end span{font-family:var(--font-sans);font-style:normal}
@media (max-width:640px){.ach-bottom{flex-direction:column;align-items:flex-start}.ach-stat{align-items:flex-start;text-align:left}
  .ach-card{height:auto;min-height:300px;gap:18px}}
`;
