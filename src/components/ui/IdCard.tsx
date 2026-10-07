"use client";

/* eslint-disable @next/next/no-img-element -- pre-sized local portrait */
import { useEffect, useRef, useState } from "react";
import { ID_CARD, PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { Style } from "./Style";

// Deterministic barcode from the ID number.
const BARS = Array.from(`${ID_CARD.idNo}${PROFILE.name}`).flatMap((ch, i) => {
  const c = ch.charCodeAt(0);
  return [1 + (c % 3), 1 + ((c >> 2) % 2), 1 + ((c + i) % 4)];
});

const BAR_X = BARS.map((_, i) => BARS.slice(0, i).reduce((a, b) => a + b, 0));
const BAR_W = BAR_X[BAR_X.length - 1] + BARS[BARS.length - 1];

function Barcode() {
  return (
    <svg className="idc-barcode" viewBox={`0 0 ${BAR_W} 28`} preserveAspectRatio="none" aria-hidden="true">
      <g fill="currentColor">
        {BARS.map((w, i) => (i % 2 === 0 ? <rect key={i} x={BAR_X[i]} y={0} width={w} height={28} /> : null))}
      </g>
    </svg>
  );
}

/**
 * ID card on a lanyard. A damped pendulum reacts to pointer velocity and sways
 * when idle; the card flips on hover, tap, Enter or Space.
 */
export function IdCard() {
  const pivotRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const pivot = pivotRef.current;
    const area = pivot?.closest("section");
    if (!pivot || !area || prefersReducedMotion()) return;

    let theta = 0; // degrees
    let omega = 0; // degrees / s
    let lastX: number | null = null;
    let lastT = 0;
    let lastPush = 0;
    let raf = 0;
    let running = false;
    let prev = 0;

    const K = 30; // spring stiffness
    const C = 2.4; // damping
    const GAIN = 0.16; // pointer px/s -> angular acceleration

    const step = (now: number) => {
      const dt = Math.min(0.033, (now - prev) / 1000 || 0.016);
      prev = now;
      const idle = now - lastPush > 1400 ? Math.sin(now / 1100) * 1.4 : 0;
      omega += (-K * (theta - idle) - C * omega) * dt;
      theta = Math.max(-16, Math.min(16, theta + omega * dt));
      pivot.style.transform = `rotate(${theta.toFixed(3)}deg)`;
      if (running) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null && now > lastT) {
        const vx = ((e.clientX - lastX) / (now - lastT)) * 1000;
        omega -= Math.max(-2400, Math.min(2400, vx)) * GAIN * Math.min(0.05, (now - lastT) / 1000);
        lastPush = now;
      }
      lastX = e.clientX;
      lastT = now;
    };
    const onLeave = () => {
      lastX = null;
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        prev = performance.now();
        raf = requestAnimationFrame(step);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(area);
    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const strapText = `${PROFILE.name} · ${PROFILE.role} · `;

  return (
    <div className="lny">
      <Style id="idcard" css={CSS} />
      <div ref={pivotRef} className="lny-pivot">
        <div className="lny-strap" aria-hidden="true">
          <div className="lny-text">
            <span>{strapText.repeat(3)}</span>
            <span>{strapText.repeat(3)}</span>
          </div>
        </div>
        <div className="lny-clip" aria-hidden="true">
          <i />
        </div>

        <div
          className={`idc ${flipped ? "is-flipped" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={`Developer ID card for ${PROFILE.name}. Press to flip.`}
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
        >
          <div className="idc-inner">
            <div className="idc-face idc-front" aria-hidden={flipped}>
              <div className="idc-band">
                <span>DEVELOPER ID</span>
                <span className="idc-slot" />
              </div>
              <div className="idc-photo">
                <div className="idc-halo" />
                <div className="idc-ring">
                  <img src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={480} height={600} />
                </div>
              </div>
              <p className="idc-name">{PROFILE.name}</p>
              <p className="idc-role mono">{PROFILE.role}</p>
              <dl className="idc-rows mono">
                <div>
                  <dt>ID No.</dt>
                  <dd>{ID_CARD.idNo}</dd>
                </div>
                <div>
                  <dt>Dept.</dt>
                  <dd>{ID_CARD.dept}</dd>
                </div>
                <div>
                  <dt>Valid till</dt>
                  <dd>{ID_CARD.validTill}</dd>
                </div>
              </dl>
              <div className="idc-foot">
                <Barcode />
                <span className="idc-holo" aria-hidden="true" />
              </div>
            </div>

            <div className="idc-face idc-back" aria-hidden={!flipped}>
              <div className="idc-band">
                <span>WHAT I AM</span>
                <span className="idc-slot" />
              </div>
              <ul className="idc-list">
                {ID_CARD.back.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <div className="idc-sign">
                <span>{PROFILE.name}</span>
              </div>
              <p className="idc-found mono">
                If found, say hello · <br />
                {PROFILE.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.lny{position:relative;height:100%;min-height:calc(404px + 120px);display:flex;justify-content:center}
.lny-pivot{position:absolute;top:calc(-1 * var(--section-y));left:50%;width:300px;margin-left:-150px;transform-origin:50% 0;
  display:flex;flex-direction:column;align-items:center;will-change:transform}
.lny-strap{width:30px;height:calc(var(--section-y) + 56px);overflow:hidden;background:var(--ink);border-radius:0 0 4px 4px;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.06),inset 6px 0 8px -6px rgba(255,255,255,.25)}
.lny-text{display:flex;flex-direction:column;animation:lny-scroll 22s linear infinite}
.lny-text span{writing-mode:vertical-rl;font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;
  color:rgba(244,242,238,.75);line-height:30px;white-space:nowrap}
@keyframes lny-scroll{to{transform:translateY(-50%)}}
.lny-clip{position:relative;width:38px;height:34px;margin-top:-4px;border-radius:6px 6px 10px 10px;
  background:linear-gradient(180deg,#e9e9e9,#a7a7a7 45%,#d6d6d6 70%,#8c8c8c);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.8),0 4px 10px -4px rgba(0,0,0,.45)}
.lny-clip i{position:absolute;left:50%;bottom:-12px;width:14px;height:18px;margin-left:-7px;border:3px solid #9a9a9a;border-top:0;
  border-radius:0 0 8px 8px}
.idc{position:relative;width:300px;height:404px;margin-top:8px;perspective:1400px;cursor:pointer;border-radius:22px}
.idc-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 1s var(--ease)}
.idc.is-flipped .idc-inner{transform:rotateY(180deg)}
@media (hover:hover){.idc:hover .idc-inner{transform:rotateY(180deg)}.idc.is-flipped:hover .idc-inner{transform:none}}
.idc-face{position:absolute;inset:0;display:flex;flex-direction:column;border-radius:22px;background:var(--card);overflow:hidden;
  backface-visibility:hidden;-webkit-backface-visibility:hidden;
  box-shadow:var(--hairline),0 40px 70px -40px rgba(13,13,13,.45),0 14px 30px -20px rgba(13,13,13,.25)}
.idc-back{transform:rotateY(180deg)}
.idc-band{position:relative;display:flex;align-items:center;justify-content:space-between;height:46px;padding:0 18px;
  background:var(--ink);color:var(--paper);font-family:var(--font-mono);font-size:11px;letter-spacing:.2em}
.idc-slot{width:44px;height:8px;border-radius:6px;background:var(--paper);opacity:.9}
.idc-photo{position:relative;display:grid;place-items:center;margin:14px auto 10px;width:128px;height:156px}
.idc-halo{position:absolute;inset:-26px;border-radius:50%;background:radial-gradient(closest-side,rgba(13,13,13,.10),transparent);
  transition:transform .8s var(--ease)}
.idc-ring{position:relative;width:128px;height:156px;padding:3px;border-radius:18px;
  background:linear-gradient(145deg,#f2f2f2,#9b9b9b 40%,#e6e6e6 60%,#6d6d6d)}
.idc-ring img{width:100%;height:100%;object-fit:cover;object-position:50% 20%;border-radius:15px;filter:grayscale(1) contrast(1.05);
  transition:transform .8s var(--ease),filter .8s var(--ease)}
.idc-photo:hover img{transform:scale(1.06);filter:grayscale(0)}
.idc-photo:hover .idc-halo{transform:scale(1.12)}
.idc-name{margin:0;text-align:center;font-weight:700;font-size:20px;letter-spacing:-.03em}
.idc-role{margin:2px 0 8px;text-align:center;font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.08em}
.idc-rows{margin:0 22px;display:grid;gap:4px;font-size:10.5px}
.idc-rows div{display:flex;justify-content:space-between;gap:12px;border-top:1px dashed var(--line);padding-top:5px}
.idc-rows dt{color:var(--mute)}.idc-rows dd{margin:0;text-align:right}
.idc-foot{margin:auto 22px 16px;padding-top:10px;display:flex;align-items:center;justify-content:space-between;gap:14px}
.idc-barcode{flex:1;height:28px;color:var(--ink)}
.idc-holo{flex:none;width:34px;height:34px;border-radius:50%;
  background:conic-gradient(from 0deg,#f5f5f5,#b9b9b9,#ffffff,#8f8f8f,#e2e2e2,#a5a5a5,#f5f5f5);
  box-shadow:inset 0 0 0 1px rgba(13,13,13,.12);animation:idc-holo 6s linear infinite}
@keyframes idc-holo{to{transform:rotate(360deg)}}
.idc-list{list-style:none;margin:22px 22px 0;padding:0;display:grid;gap:12px;font-size:14px;line-height:1.35;color:var(--ink-2)}
.idc-list li{display:flex;gap:10px}
.idc-list li::before{content:"";flex:none;width:6px;height:6px;margin-top:.5em;border-radius:50%;background:var(--ink)}
.idc-sign{margin:auto 22px 0;border-bottom:1px solid var(--ink);padding-bottom:2px}
.idc-sign span{font-family:var(--font-serif);font-style:italic;font-size:30px;letter-spacing:-.01em}
.idc-found{margin:10px 22px 18px;font-size:10px;line-height:1.5;color:var(--mute)}
`;
