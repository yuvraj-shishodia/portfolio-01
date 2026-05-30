"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="relative z-10 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-violet-400 text-sm tracking-widest uppercase mb-3 font-medium">About me</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
            Who I <span className="gradient-text">am</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 text-slate-400 leading-relaxed"
          >
            <p>
              I&apos;m a final-year B.Tech IT student at AKGEC (graduating May 2026), currently working as a Software Developer at YNV Solutions. I build things that work in production — not just demos.
            </p>
            <p>
              My most significant project is <span className="text-violet-300 font-medium">SwiftCause</span>, an open-source SaaS donation platform serving real UK charities, complete with Stripe Connect payouts, HMRC Gift Aid compliance, and a dual-auth system.
            </p>
            <p>
              Outside of web development, I work on data warehousing, ETL pipelines, and dimensional modelling — which gives me an unusual full-stack + data perspective that most frontend devs don&apos;t have.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-6 space-y-4"
          >
            {[
              { label: "Degree", value: "B.Tech Information Technology" },
              { label: "College", value: "AKGEC, Ghaziabad" },
              { label: "Graduation", value: "May 2026" },
              { label: "Current Role", value: "Software Developer @ YNV Solutions" },
              { label: "Location", value: "India" },
              { label: "Email", value: "yuvrajshishodia24@gmail.com" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start text-sm gap-4">
                <span className="text-slate-500 shrink-0">{label}</span>
                <span className="text-slate-300 text-right">{value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
