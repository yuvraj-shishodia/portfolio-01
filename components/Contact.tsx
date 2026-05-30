"use client";

import { motion } from "framer-motion";

const socials = [
  { label: "Email", value: "yuvrajshishodia24@gmail.com", href: "mailto:yuvrajshishodia24@gmail.com" },
  { label: "LinkedIn", value: "linkedin.com/in/yuvraj-shishodia", href: "https://linkedin.com/in/yuvraj-shishodia" },
  { label: "GitHub", value: "github.com/yuvraj-shishodia", href: "https://github.com/yuvraj-shishodia" },
  { label: "LeetCode", value: "leetcode.com/u/yuvraj-shishodia", href: "https://leetcode.com/u/yuvraj-shishodia/" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative z-10 py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-violet-400 text-sm tracking-widest uppercase mb-3 font-medium">Get in touch</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
            I&apos;m open to internship opportunities, collaborative projects, and interesting conversations. Drop me a message.
          </p>
        </motion.div>

        <motion.a
          href="mailto:yuvrajshishodia24@gmail.com"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-block mb-12 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-colors duration-200 shadow-xl shadow-violet-900/40"
        >
          Say Hello ↗
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid sm:grid-cols-2 gap-4"
        >
          {socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
              className="glass rounded-xl p-4 flex flex-col items-start gap-1 hover:border-violet-500/30 transition-colors duration-200 group text-left"
            >
              <span className="text-xs text-violet-400 font-semibold tracking-widest uppercase">{s.label}</span>
              <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors truncate w-full">{s.value}</span>
            </motion.a>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-slate-700 text-xs mt-16"
        >
          Built with Next.js · Tailwind CSS · Framer Motion
        </motion.p>
      </div>
    </section>
  );
}
