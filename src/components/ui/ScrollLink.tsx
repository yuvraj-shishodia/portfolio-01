"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { scrollToTarget } from "@/lib/scroll";

/** In-page link that scrolls through Lenis; still a plain #hash link without JS. */
export function ScrollLink({
  href,
  onClick,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: `#${string}` }) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    scrollToTarget(href === "#top" ? 0 : href);
  };
  return <a href={href} onClick={handle} {...rest} />;
}
