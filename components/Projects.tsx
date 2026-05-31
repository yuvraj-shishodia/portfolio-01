"use client";

import { motion } from "framer-motion";

const projects = [
  {
    title: "SwiftCause",
    subtitle: "Donation Platform for UK Nonprofits",
    description:
      "Production SaaS platform serving real UK charities with one-time and recurring Stripe Connect donations, HMRC Gift Aid compliance, declaration versioning, and a dual-auth system (email admin + PIN kiosk).",
    tags: ["Next.js", "Firebase", "Stripe Connect", "TypeScript", "Vitest"],
    highlights: ["25% boost in eligible donation value via Gift Aid engine", "FSD monorepo architecture", "Full Vitest test coverage"],
    live: "https://swiftcause.com/",
    github: "https://github.com/yuvraj-shishodia",
    gradient: "from-violet-600/20 to-indigo-600/10",
    accent: "violet",
  },
  {
    title: "2 Day Fitness",
    subtitle: "Full Stack Gym Portal",
    description:
      "React gym portal with trainer booking, class scheduling, Stripe payments, and an ML-based plan recommendation engine built with Flask that reduced plan search time by 15%.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Flask", "Stripe"],
    highlights: ["ML recommendation engine (Flask)", "Automated emails with EmailJS", "10+ active subscriptions"],
    live: "https://2dayfitness.netlify.app/",
    github: "https://github.com/yuvraj-shishodia",
    gradient: "from-purple-600/20 to-pink-600/10",
    accent: "purple",
  },
  {
    title: "AuthCorp",
    subtitle: "AI-Powered Document Authentication Platform",
    description:
      "Enterprise-grade document forgery detection platform with 9 FastAPI microservices, blockchain anchoring, ELA/quantization/metadata forensic detectors, OCR, risk scoring, and a Next.js dashboard with real-time monitoring.",
    tags: ["Next.js", "FastAPI", "Python", "PostgreSQL", "Redis", "Docker", "Blockchain"],
    highlights: ["9 independent microservices deployed on Render", "Multi-layer AI forgery detection (ELA, quantization, metadata)", "Blockchain anchoring via Ethereum & Polygon"],
    live: "https://authcorp-phi.vercel.app",
    github: "https://github.com/yuvraj-shishodia/AuthCorp",
    gradient: "from-emerald-600/20 to-teal-600/10",
    accent: "emerald",
  },
  {
    title: "Ink & Think",
    subtitle: "Real-Time Multiplayer Drawing Game",
    description:
      "WebSockets-driven multiplayer Pictionary-style game with real-time canvas sync, room management, scoring, and chat — all powered by Socket.io.",
    tags: ["React", "Node.js", "Express.js", "Socket.io"],
    highlights: ["Real-time canvas sync via WebSockets", "Room creation & lobby system", "Live chat + scoring"],
    live: "https://inkandthinkbypc.netlify.app/",
    github: "https://github.com/yuvraj-shishodia",
    gradient: "from-indigo-600/20 to-cyan-600/10",
    accent: "indigo",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative z-10 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-violet-400 text-sm tracking-widest uppercase mb-3 font-medium">What I&apos;ve built</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Featured <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl overflow-hidden group hover:border-violet-500/30 transition-all duration-300"
            >
              {/* Gradient bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${project.gradient} group-hover:opacity-100 opacity-60 transition-opacity`} />

              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    <p className="text-sm text-violet-400 mt-1">{project.subtitle}</p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/40 transition-colors"
                      >
                        Live Demo ↗
                      </a>
                    )}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                    >
                      GitHub ↗
                    </a>
                  </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-5">{project.description}</p>

                <ul className="space-y-1 mb-5">
                  {project.highlights.map((h) => (
                    <li key={h} className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-violet-500 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
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
    </section>
  );
}
