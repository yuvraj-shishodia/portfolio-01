import { PROFILE } from "@/lib/data";
import { IdCard } from "../ui/IdCard";
import { SectionTag } from "../ui/SectionTag";
import { Style } from "../ui/Style";

const FACTS = [
  { k: "Location", v: PROFILE.location },
  { k: "Education", v: `${PROFILE.degree} — ${PROFILE.collegeShort}, ${PROFILE.graduationYear}` },
  { k: "Current role", v: PROFILE.currentRole },
  { k: "Email", v: PROFILE.email, href: `mailto:${PROFILE.email}` },
];

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title" tabIndex={-1}>
      <Style id="about" css={CSS} />
      <div className="wrap about-grid">
        <div className="about-left">
          <SectionTag id="about" label="About" className="rv" />
          <h2 id="about-title" className="h2 about-h">
            <span className="rv-mask">
              <span>Hi, I’m</span>
            </span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <span>
                <em>{PROFILE.firstName}.</em>
              </span>
            </span>
          </h2>
          <p className="about-lead rv" style={{ "--i": 2 } as React.CSSProperties}>
            {PROFILE.resumeSummary}
          </p>
          <p className="about-extra rv" style={{ "--i": 3 } as React.CSSProperties}>
            {PROFILE.aboutExtra}
          </p>
          <div className="about-ctas rv" style={{ "--i": 4 } as React.CSSProperties}>
            <a href={PROFILE.resume} download className="btn btn-primary">
              Résumé <span aria-hidden="true">↓</span>
            </a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="about-card">
          <IdCard />
        </div>

        <aside className="about-right card rv" style={{ "--i": 2 } as React.CSSProperties} aria-label="Quick facts">
          <p className="tag">Quick facts</p>
          <dl className="about-facts">
            {FACTS.map((f) => (
              <div key={f.k}>
                <dt className="mono">{f.k}</dt>
                <dd>{f.href ? <a href={f.href}>{f.v}</a> : f.v}</dd>
              </div>
            ))}
          </dl>
          <blockquote className="about-quote">
            <p>“{PROFILE.quote}”</p>
          </blockquote>
        </aside>
      </div>
    </section>
  );
}

const CSS = `
.about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,3vw,48px);align-items:stretch}
.about-left{display:flex;flex-direction:column}
.about-h{margin:22px 0 28px}
.about-lead{margin:0;font-size:clamp(17px,1.35vw,20px);line-height:1.5;letter-spacing:-.01em;color:var(--ink)}
.about-extra{margin:18px 0 0;font-size:15px;line-height:1.6;color:var(--mute)}
.about-ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto;padding-top:32px}
.about-card{position:relative}
.about-right{display:flex;flex-direction:column;padding:28px}
.about-facts{margin:20px 0 0;display:grid}
.about-facts div{padding:14px 0;border-top:1px solid var(--line)}
.about-facts div:last-child{border-bottom:1px solid var(--line)}
.about-facts dt{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute);margin-bottom:4px}
.about-facts dd{margin:0;font-size:15px;line-height:1.4;overflow-wrap:anywhere}
.about-facts a{text-decoration:underline;text-decoration-color:var(--faint);text-underline-offset:3px}
.about-facts a:hover{text-decoration-color:var(--ink)}
.about-quote{margin:auto 0 0;padding-top:28px}
.about-quote p{margin:0;font-family:var(--font-serif);font-style:italic;font-size:clamp(24px,2vw,30px);line-height:1.15;color:var(--ink-2)}
@media (max-width:1100px){
  .about-grid{grid-template-columns:minmax(0,1fr) 320px}
  .about-right{grid-column:1 / -1}
}
@media (max-width:760px){
  .about-grid{grid-template-columns:minmax(0,1fr)}
  .about-card{order:-1;margin-bottom:8px}
}
`;
