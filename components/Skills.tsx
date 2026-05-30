"use client";

import { motion } from "framer-motion";

const skillGroups = [
  {
    category: "Languages",
    skills: ["C", "C++", "Java", "Python", "TypeScript", "JavaScript"],
  },
  {
    category: "Frontend",
    skills: ["React.js", "Next.js", "HTML", "CSS", "TailwindCSS"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs", "JWT", "Firebase", "Socket.io"],
  },
  {
    category: "Databases",
    skills: ["MySQL", "MongoDB", "SQL Server", "Firebase Firestore"],
  },
  {
    category: "Data Engineering",
    skills: ["ETL Pipelines", "Dimensional Modelling", "SCD Types 1–3", "Data Warehousing"],
  },
  {
    category: "Tools & Platforms",
    skills: ["Docker", "Stripe API", "Render", "Netlify", "Vercel", "Git", "Postman"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-violet-400 text-sm tracking-widest uppercase mb-3 font-medium">What I work with</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Tech <span className="gradient-text">Stack</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="glass rounded-2xl p-5 hover:border-violet-500/30 transition-colors duration-300"
            >
              <p className="text-violet-400 text-xs tracking-widest uppercase font-semibold mb-4">
                {group.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs text-slate-300 bg-white/5 border border-white/8 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
