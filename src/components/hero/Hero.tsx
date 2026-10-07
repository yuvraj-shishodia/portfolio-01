"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { ScrollLink } from "../ui/ScrollLink";
import { Style } from "../ui/Style";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  // Refs mirror state for the long-lived listeners below.
  const wantPlay = useRef(true);
  const userMuted = useRef(false);
  const visible = useRef(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduced = prefersReducedMotion();
    wantPlay.current = !reduced;

    const playWithSound = () => {
      v.muted = false;
      return v.play().then(() => {
        setSoundOn(true);
        setBlocked(false);
      });
    };

    // Try sound first; fall back to muted autoplay and wait for a gesture.
    if (!reduced) {
      playWithSound().catch(() => {
        v.muted = true;
        setSoundOn(false);
        setBlocked(true);
        v.play().catch(() => {});
      });
    }

    const unlock = (e: Event) => {
      if (btnRef.current?.contains(e.target as Node)) return; // the button handles itself
      if (userMuted.current || !v.muted || reduced) return cleanupUnlock();
      v.muted = false;
      setSoundOn(true);
      setBlocked(false);
      if (visible.current) v.play().catch(() => {});
      cleanupUnlock();
    };
    const events = ["pointerdown", "keydown", "touchend"] as const;
    const cleanupUnlock = () => events.forEach((t) => window.removeEventListener(t, unlock, true));
    events.forEach((t) => window.addEventListener(t, unlock, { capture: true, passive: true }));

    // Pause (and silence) once less than 35% of the hero is visible.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.intersectionRatio >= 0.35;
        if (!visible.current) v.pause();
        else if (wantPlay.current) v.play().catch(() => {});
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    return () => {
      cleanupUnlock();
      io.disconnect();
    };
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (soundOn) {
      userMuted.current = true;
      v.muted = true;
      setSoundOn(false);
      if (prefersReducedMotion()) {
        wantPlay.current = false;
        v.pause();
      }
    } else {
      userMuted.current = false;
      wantPlay.current = true;
      v.muted = false;
      setSoundOn(true);
      setBlocked(false);
      v.play().catch(() => {});
    }
  };

  return (
    <section ref={sectionRef} id="top" className="hero" aria-labelledby="hero-title">
      <Style id="hero" css={CSS} />
      <p className="hero-ghost" aria-hidden="true">
        {PROFILE.firstName}
      </p>

      <div className="hero-stage">
        <video
          ref={videoRef}
          className="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero/poster.webp"
          aria-label={`${PROFILE.firstName}'s animated avatar giving a short spoken self-introduction`}
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="tag hero-tag">
            <b>{PROFILE.name}</b>
            <i aria-hidden="true" />
            Portfolio
          </p>
          <h1 id="hero-title" className="h1">
            <span className="hero-line">
              <span>Full Stack</span>
            </span>
            <span className="hero-line" style={{ "--i": 1 } as React.CSSProperties}>
              <span>
                <em>Developer.</em>
              </span>
            </span>
          </h1>
          <p className="hero-sub">{PROFILE.heroLine}</p>
          <div className="hero-ctas">
            <ScrollLink href="#work" className="btn btn-primary">
              Explore work
            </ScrollLink>
            <ScrollLink href="#contact" className="btn btn-ghost">
              Let&apos;s talk
            </ScrollLink>
            <a href={PROFILE.resume} download className="btn btn-ghost">
              Résumé <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero-side">
          <dl className="hero-facts mono">
            <div>
              <dt>Now</dt>
              <dd>{PROFILE.currentRole}</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{PROFILE.location}</dd>
            </div>
          </dl>
          <button
            ref={btnRef}
            type="button"
            className={`hero-sound ${blocked ? "is-blocked" : ""}`}
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute the introduction" : "Play the introduction with sound"}
          >
            {soundOn ? (
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
                <rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M4 2.5v11a.6.6 0 0 0 .9.5l9-5.5a.6.6 0 0 0 0-1l-9-5.5a.6.6 0 0 0-.9.5Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.hero{position:relative;min-height:100svh;overflow:hidden;display:flex;align-items:flex-end;padding-bottom:clamp(28px,5vh,56px)}
.hero-ghost{position:absolute;left:50%;top:clamp(76px,16vh,170px);transform:translateX(-50%);margin:0;white-space:nowrap;
  font-weight:800;font-size:clamp(96px,23vw,400px);line-height:.8;letter-spacing:-.06em;text-transform:uppercase;
  color:transparent;-webkit-text-stroke:1.2px rgba(13,13,13,.16);pointer-events:none;user-select:none;
  animation:hero-ghost 1.6s var(--ease) both}
@keyframes hero-ghost{from{opacity:0;transform:translate(-50%,40px)}}
.hero-stage{position:absolute;left:50%;bottom:0;transform:translateX(-50%);height:min(96svh,1040px);aspect-ratio:768/960;
  mix-blend-mode:multiply;z-index:1;animation:hero-stage 1.4s .1s var(--ease) both}
@keyframes hero-stage{from{opacity:0;transform:translate(-50%,24px)}}
.hero-video{width:100%;height:100%;object-fit:contain;object-position:bottom}
.hero-grid{position:relative;z-index:2;display:flex;align-items:flex-end;justify-content:space-between;gap:32px;pointer-events:none}
.hero-grid>*{pointer-events:auto}
.hero-copy{max-width:min(520px,36vw)}
.hero-tag{margin-bottom:22px}
.h1{margin:0;font-weight:700;font-size:clamp(48px,6.6vw,104px);line-height:.95;letter-spacing:-.05em}
.h1 em{display:inline-block;padding-right:.05em}
.hero-line{display:block;overflow:hidden;padding-bottom:.1em;margin-bottom:-.1em}
.hero-line>span{display:block;animation:hero-up 1.2s calc(.15s + var(--i,0) * .1s) var(--ease) both}
@keyframes hero-up{from{transform:translateY(105%)}}
.hero-sub{margin:22px 0 28px;max-width:400px;color:var(--ink-2);font-size:16px;line-height:1.55;
  animation:hero-fade 1.2s .35s var(--ease) both}
.hero-ctas{display:flex;flex-wrap:wrap;gap:10px;animation:hero-fade 1.2s .45s var(--ease) both}
@keyframes hero-fade{from{opacity:0;transform:translateY(14px)}}
.hero-side{display:flex;flex-direction:column;align-items:flex-end;gap:22px;animation:hero-fade 1.2s .55s var(--ease) both}
.hero-facts{margin:0;display:grid;gap:12px;text-align:right;font-size:12px}
.hero-facts dt{color:var(--mute);text-transform:uppercase;letter-spacing:.04em;margin-bottom:3px}
.hero-facts dd{margin:0;color:var(--ink)}
.hero-sound{position:relative;display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:var(--ink);
  color:var(--paper);transition:transform .4s var(--ease)}
.hero-sound:hover{transform:scale(1.06)}
.hero-sound.is-blocked::before{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 1px var(--ink);
  animation:hero-ping 1.8s var(--ease) infinite}
@keyframes hero-ping{from{transform:scale(1);opacity:.6}to{transform:scale(1.8);opacity:0}}
@media (max-width:1100px){.hero-facts{display:none}}
@media (max-width:899px){
  .hero{flex-direction:column;align-items:stretch;justify-content:flex-start;padding-top:76px;padding-bottom:40px}
  .hero-ghost{top:96px;font-size:clamp(84px,26vw,200px)}
  .hero-stage{position:relative;left:auto;bottom:auto;transform:none;height:62svh;max-width:100%;margin:0 auto;
    animation-name:hero-fade}
  .hero-grid{flex-direction:column;align-items:stretch;gap:0}
  .hero-copy{max-width:none}
  .hero-side{position:absolute;right:var(--gutter);top:calc(-46px - 16px)}
  .hero-tag{margin-top:8px}
}
`;
