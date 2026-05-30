"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const roles = [
  "Full Stack Developer",
  "Software Developer @ YNV Solutions",
  "React & Next.js Dev",
  "Problem Solver",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-violet-400 text-sm tracking-widest uppercase mb-4 font-medium"
        >
          Hey there, I&apos;m
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight tracking-tight"
        >
          Yuvraj{" "}
          <span className="gradient-text">Shishodia</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-slate-400 mb-8 h-8"
        >
          <span className="text-violet-300">{displayed}</span>
          <span className="animate-pulse text-violet-400">|</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          I build production-grade web apps and data pipelines — from HMRC-compliant donation platforms to real-time multiplayer games.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors duration-200 shadow-lg shadow-violet-900/40"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-full glass border border-violet-500/30 text-violet-300 hover:bg-violet-500/10 font-medium transition-colors duration-200"
          >
            Get in Touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-6 mt-10"
        >
          {[
            { label: "GitHub", href: "https://github.com/yuvraj-shishodia" },
            { label: "LinkedIn", href: "https://linkedin.com/in/yuvraj-shishodia" },
            { label: "LeetCode", href: "https://leetcode.com/u/yuvraj-shishodia/" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-violet-400 transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-600 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-violet-500/60 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
