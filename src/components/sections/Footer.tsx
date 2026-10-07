import { PROFILE } from "@/lib/data";
import { ScrollLink } from "../ui/ScrollLink";
import { Style } from "../ui/Style";

export default function Footer() {
  return (
    <footer className="ft">
      <Style id="footer" css={CSS} />
      <div className="wrap ft-inner mono">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <p>Built with Next.js</p>
        <ScrollLink href="#top">
          Back to top <span aria-hidden="true">↑</span>
        </ScrollLink>
      </div>
    </footer>
  );
}

const CSS = `
.ft{border-top:1px solid var(--line)}
.ft-inner{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 24px;padding-block:26px;font-size:12px;color:var(--mute)}
.ft-inner p{margin:0}
.ft-inner a{color:var(--ink);text-decoration:underline;text-decoration-color:var(--faint);text-underline-offset:3px}
.ft-inner a:hover{text-decoration-color:var(--ink)}
`;
