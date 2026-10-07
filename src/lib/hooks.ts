"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

const RM_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(RM_QUERY).matches;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(RM_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(RM_QUERY).matches,
    () => false,
  );
}

/** True while (or, with `once`, after) the element intersects the viewport. */
export function useInView(
  ref: RefObject<Element | null>,
  { threshold = 0, rootMargin = "0px", once = false }: { threshold?: number; rootMargin?: string; once?: boolean } = {},
): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (once && entry.isIntersecting) io.disconnect();
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, once]);
  return inView;
}

/** Calls `cb` at most once per animation frame on scroll and resize. */
export function useScrollFrame(cb: () => void): void {
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      cb();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [cb]);
}

/**
 * Progress (0–1) of an element through the viewport, reported every scroll frame.
 * 0 when its top reaches `start` × viewport height, 1 when its bottom reaches `end` × viewport height.
 * start = 0, end = 1 is the classic "pinned section" progress.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  start = 0,
  end = 1,
): void {
  useScrollFrame(
    useStableCallback(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = r.height + vh * start - vh * end;
      const p = span <= 0 ? (r.top <= vh * start ? 1 : 0) : (vh * start - r.top) / span;
      onProgress(Math.min(1, Math.max(0, p)));
    }),
  );
}

// Keeps a stable function identity while always calling the latest closure.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useStableCallback<T extends (...args: never[]) => unknown>(fn: T): T {
  const ref = useRef(fn);
  useIsoLayoutEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args: Parameters<T>) => ref.current(...args), []) as T;
}
