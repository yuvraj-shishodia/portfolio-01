"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

/** Mounts Lenis smooth scrolling (skipped for prefers-reduced-motion). */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.1, prevent: (node) => node.closest("[data-lenis-prevent]") !== null });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}

/** Scrolls to a section id ("#work"), element or y offset, then moves focus there for keyboard users. */
export function scrollToTarget(target: string | HTMLElement | number) {
  const el =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : typeof target === "number" ? null : target;
  const y = typeof target === "number" ? target : el ? el.getBoundingClientRect().top + window.scrollY : 0;
  const focus = () => el?.focus({ preventScroll: true });

  if (lenis) {
    lenis.scrollTo(y, { duration: 1.2, onComplete: focus });
  } else {
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    focus();
  }
  if (typeof target === "string" && target.startsWith("#")) history.replaceState(null, "", target);
  else if (y === 0) history.replaceState(null, "", location.pathname);
}

/** Locks page scroll (mobile menu). */
export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle("is-locked", locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}
