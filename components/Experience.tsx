"use client";

import { motion } from "framer-motion";

const experiences = [
  {
    company: "Celebal Technologies",
    role: "Data Engineering Intern",
    period: "June 2025 – August 2025",
    type: "Remote / Hybrid",
    points: [
      "Engineered a sales-focused data warehouse using dimensional modelling in SQL Server, enabling seamless integration and analytics across business units.",
      "Developed incremental ETL pipelines with staging layers, reducing processing time by 30% and ensuring timely availability of insights.",
      "Implemented SCD Types 1, 2, and 3, improving historical tracking accuracy of critical business attributes.",
      "Designed a lineage tracking framework with reconciliation checks for end-to-end data consistency.",
    ],
    tags: ["SQL Server", "ETL", "Data Warehousing", "SCD", "Dimensional Modelling"],
  },
  {
    company: "YNV Solutions",
    role: "Open Source Contributor",
    period: "2025 – Present",
    type: "Remote",
    points: [
      "Built and maintain SwiftCause, a production SaaS donation platform serving real UK charities.",
      "Architected a Feature-Sliced Design monorepo with Firebase Cloud Functions and full Vitest test coverage.",
      "Implemented HMRC Gift Aid engine with declaration versioning and tax year-aware export logic.",
    ],
    tags: ["Next.js", "Firebase", "Stripe", "TypeScript", "Open Source"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative z-10 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-violet-400 text-sm tracking-widest uppercase mb-3 font-medium">Where I&apos;ve worked</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            <span className="gradient-text">Experience</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-linear-to-b from-violet-500/60 via-violet-500/20 to-transparent hidden md:block" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="md:pl-12 relative"
              >
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-3 top-6 w-3 h-3 -translate-x-1/2 rounded-full bg-violet-500 border-2 border-violet-900 shadow-[0_0_10px_rgba(124,58,237,0.5)]" />

                <div className="glass rounded-2xl p-6 hover:border-violet-500/30 transition-colors duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{exp.company}</h3>
                    <span className="text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/8 whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-violet-400 text-sm mb-1">{exp.role}</p>
                  <p className="text-slate-600 text-xs mb-4">{exp.type}</p>

                  <ul className="space-y-2 mb-5">
                    {exp.points.map((point, j) => (
                      <li key={j} className="text-sm text-slate-400 flex gap-3">
                        <span className="text-violet-500 mt-1 shrink-0">▸</span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-slate-400 bg-white/5 border border-white/8 px-2.5 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
