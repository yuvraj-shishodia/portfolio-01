"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const links = ["About", "Skills", "Projects", "Experience", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-white/8 shadow-lg shadow-violet-950/20" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="gradient-text font-bold text-lg tracking-tight">YS</span>
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-200"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="mailto:yuvrajshishodia24@gmail.com"
          className="hidden md:inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-violet-500/40 text-violet-300 hover:bg-violet-500/10 transition-colors duration-200"
        >
          Hire me
        </a>
      </div>
    </motion.nav>
  );
}
