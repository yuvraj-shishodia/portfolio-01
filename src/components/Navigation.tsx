"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { useScrollFrame } from "@/lib/hooks";
import { lockScroll, scrollToTarget } from "@/lib/scroll";
import { ScrollLink } from "./ui/ScrollLink";
import { Style } from "./ui/Style";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useScrollFrame(
    useCallback(() => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }, []),
  );

  // Active section: the one crossing the band just above the middle of the viewport.
  useEffect(() => {
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        setActive(NAV.find((n) => visible.has(n.id))?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Slide the ink indicator under the active link.
  const placeIndicator = useCallback(() => {
    const pill = pillRef.current;
    const ind = indicatorRef.current;
    if (!pill || !ind) return;
    const link = active ? pill.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!link) {
      ind.style.opacity = "0";
      return;
    }
    ind.style.opacity = "1";
    ind.style.width = `${link.offsetWidth}px`;
    ind.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [active]);

  useLayoutEffect(placeIndicator, [placeIndicator]);
  useEffect(() => {
    window.addEventListener("resize", placeIndicator);
    document.fonts?.ready.then(placeIndicator);
    return () => window.removeEventListener("resize", placeIndicator);
  }, [placeIndicator]);

  // Mobile menu: lock scroll, Esc closes, focus moves in and back out.
  useEffect(() => {
    if (!open) return;
    const menuBtn = menuBtnRef.current;
    lockScroll(true);
    overlayRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      menuBtn?.focus();
    };
  }, [open]);

  const goMobile = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => scrollToTarget(`#${id}`));
  };

  return (
    <>
      <Style id="nav" css={CSS} />
      <a href="#main" className="skip btn btn-primary btn-sm">
        Skip to content
      </a>
      <div className="nav-progress" aria-hidden="true">
        <div ref={progressRef} />
      </div>
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="wrap nav-inner">
          <ScrollLink href="#top" className="nav-brand" aria-label={`${PROFILE.name} — back to top`}>
            <span className="nav-mark">{PROFILE.initials}</span>
            <span className="nav-name">{PROFILE.name}</span>
          </ScrollLink>

          <nav aria-label="Primary" className="nav-desktop">
            <div ref={pillRef} className="nav-pill">
              <span ref={indicatorRef} className="nav-ind" aria-hidden="true" />
              <ul>
              {NAV.map((n) => (
                <li key={n.id}>
                  <ScrollLink
                    href={`#${n.id}`}
                    data-id={n.id}
                    className={active === n.id ? "is-active" : ""}
                    aria-current={active === n.id ? "location" : undefined}
                  >
                    {n.label}
                  </ScrollLink>
                </li>
              ))}
              </ul>
            </div>
          </nav>

          <button
            ref={menuBtnRef}
            type="button"
            className="nav-menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <i aria-hidden="true" className={open ? "is-open" : ""} />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={overlayRef}
        className={`nav-overlay ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
      >
        <nav aria-label="Mobile" className="wrap">
          <ol>
            {NAV.map((n, i) => (
              <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
                <a href={`#${n.id}`} onClick={goMobile(n.id)}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
          <p className="nav-overlay-foot mono">
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          </p>
        </nav>
      </div>
    </>
  );
}

const CSS = `
.nav-progress{position:fixed;inset:0 0 auto;height:2px;z-index:60;pointer-events:none}
.nav-progress>div{height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0)}
.nav{position:fixed;inset:0 0 auto;z-index:50;padding-top:14px;pointer-events:none}
.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:16px}
.nav-inner>*{pointer-events:auto}
.nav-brand{display:inline-flex;align-items:center;gap:12px;border-radius:999px}
.nav-mark{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--ink);
  font-family:var(--font-mono);font-size:13px;font-weight:600;letter-spacing:-.02em;background:var(--paper);
  transition:background-color .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
.nav-brand:hover .nav-mark{transform:rotate(360deg)}
.is-scrolled .nav-mark{background:var(--ink);color:var(--paper)}
.nav-name{font-weight:600;font-size:15px;letter-spacing:-.02em;transition:opacity .5s var(--ease),transform .5s var(--ease)}
.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.nav-pill ul{display:flex;gap:2px;list-style:none;margin:0;padding:0}
.nav-pill{position:relative;padding:5px;border-radius:999px;
  transition:background-color .5s var(--ease),box-shadow .5s var(--ease)}
.is-scrolled .nav-pill{background:rgba(255,255,255,.72);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  box-shadow:var(--hairline),0 10px 30px -18px rgba(13,13,13,.35)}
.nav-pill a{position:relative;z-index:1;display:block;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:500;
  color:var(--ink-2);transition:color .4s var(--ease)}
.nav-pill a:hover{color:var(--ink)}
.nav-pill a.is-active{color:var(--paper)}
.nav-ind{position:absolute;top:5px;left:0;height:calc(100% - 10px);border-radius:999px;background:var(--ink);opacity:0;
  transition:transform .55s var(--ease),width .55s var(--ease),opacity .3s}
.nav-menu-btn{display:none;align-items:center;gap:10px;height:44px;padding:0 18px;border-radius:999px;background:var(--ink);
  color:var(--paper);font-size:14px;font-weight:500}
.nav-menu-btn i{position:relative;width:14px;height:8px}
.nav-menu-btn i::before,.nav-menu-btn i::after{content:"";position:absolute;left:0;right:0;height:1.5px;background:currentColor;
  transition:transform .5s var(--ease),top .5s var(--ease)}
.nav-menu-btn i::before{top:0}.nav-menu-btn i::after{top:6.5px}
.nav-menu-btn i.is-open::before{top:3.25px;transform:rotate(45deg)}
.nav-menu-btn i.is-open::after{top:3.25px;transform:rotate(-45deg)}
.nav-overlay{position:fixed;inset:0;z-index:45;background:var(--paper);display:flex;align-items:center;
  clip-path:circle(0% at calc(100% - 60px) 36px);visibility:hidden;
  transition:clip-path .8s var(--ease),visibility 0s .8s}
.nav-overlay.is-open{clip-path:circle(150% at calc(100% - 60px) 36px);visibility:visible;transition:clip-path .8s var(--ease)}
.nav-overlay ol{list-style:none;margin:0;padding:0}
.nav-overlay li{overflow:hidden}
.nav-overlay li a{display:flex;align-items:baseline;gap:16px;padding:6px 0;font-size:clamp(40px,11vw,72px);font-weight:700;
  letter-spacing:-.045em;line-height:1.05;transform:translateY(110%);transition:transform .8s var(--ease)}
.nav-overlay li a .mono{font-size:13px;font-weight:400;letter-spacing:0;color:var(--mute)}
.nav-overlay.is-open li a{transform:none;transition-delay:calc(.15s + var(--i) * 60ms)}
.nav-overlay-foot{margin-top:36px;font-size:13px;color:var(--mute)}
@media (max-width:899px){
  .nav-desktop{display:none}
  .nav-menu-btn{display:inline-flex}
}
@media (min-width:900px){.nav-overlay{display:none}}
`;
