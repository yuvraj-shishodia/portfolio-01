import { CERTIFICATIONS } from "@/lib/data";
import { SectionTag } from "../ui/SectionTag";
import { Style } from "../ui/Style";

/** Rendered only when CERTIFICATIONS has entries (see App). */
export default function Certifications() {
  return (
    <section id="certifications" className="section certs" aria-labelledby="certs-title" tabIndex={-1}>
      <Style id="certs" css={CSS} />
      <div className="wrap certs-grid">
        <div className="certs-head">
          <SectionTag id="certifications" label="Certifications" className="rv" />
          <h2 id="certs-title" className="h2">
            <span className="rv-mask">
              <span>
                Always <em>learning.</em>
              </span>
            </span>
          </h2>
          <p className="certs-count mono rv">
            {String(CERTIFICATIONS.length).padStart(2, "0")} certifications
          </p>
        </div>
        <ol className="certs-list">
          {CERTIFICATIONS.map((c, i) => {
            const body = (
              <>
                <span className="mono certs-i">{String(i + 1).padStart(2, "0")}</span>
                <span className="certs-t">{c.title}</span>
                <span className="certs-by">{c.issuer}</span>
                <span className="certs-arrow" aria-hidden="true">
                  ↗
                </span>
              </>
            );
            return (
              <li key={c.title} className="rv" style={{ "--i": i } as React.CSSProperties}>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="certs-row">
                    {body}
                  </a>
                ) : (
                  <div className="certs-row" tabIndex={0}>
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const CSS = `
.certs{background:var(--card);border-block:1px solid var(--line)}
.certs-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;align-items:start}
.certs-head{position:sticky;top:110px;display:flex;flex-direction:column;gap:22px}
.certs-count{margin:0;font-size:12px;color:var(--mute)}
.certs-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.certs-list li{border-bottom:1px solid var(--line)}
.certs-row{position:relative;display:grid;grid-template-columns:44px minmax(0,1fr) auto 24px;align-items:center;gap:16px;padding:22px 12px;
  overflow:hidden;isolation:isolate;transition:color .5s var(--ease)}
.certs-row::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;
  transition:transform .6s var(--ease)}
.certs-row:hover,.certs-row:focus-visible{color:var(--paper)}
.certs-row:hover::before,.certs-row:focus-visible::before{transform:scaleX(1)}
.certs-i{font-size:12px;opacity:.6}
.certs-t{font-size:clamp(17px,1.6vw,22px);font-weight:600;letter-spacing:-.02em}
.certs-by{font-size:13px;opacity:.7}
.certs-arrow{opacity:0;transform:translateX(-10px);transition:opacity .4s var(--ease),transform .5s var(--ease)}
.certs-row:hover .certs-arrow,.certs-row:focus-visible .certs-arrow{opacity:1;transform:none}
@media (max-width:899px){.certs-grid{grid-template-columns:minmax(0,1fr)}.certs-head{position:static}
  .certs-row{grid-template-columns:32px minmax(0,1fr) 20px}.certs-by{grid-column:2}}
`;
