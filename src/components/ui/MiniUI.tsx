import type { MiniUiKind } from "@/lib/data";
import { Style } from "./Style";

/** Grayscale, illustrative product sketches — clearly labelled, never presented as screenshots. */
export function MiniUI({ kind }: { kind: MiniUiKind }) {
  return (
    <div className="mui" aria-hidden="true">
      <Style id="miniui" css={CSS} />
      <div className="mui-bar">
        <i />
        <i />
        <i />
      </div>
      <div className="mui-body">{VIEWS[kind]}</div>
    </div>
  );
}

const VIEWS: Record<MiniUiKind, React.ReactNode> = {
  kiosk: (
    <div className="mui-kiosk">
      <p className="mui-k-title">Choose an amount</p>
      <div className="mui-k-amounts">
        <span>£5</span>
        <span className="is-on">£10</span>
        <span>£25</span>
        <span>Other</span>
      </div>
      <div className="mui-k-toggle">
        <span className="mui-switch" />
        <div>
          <b>Add Gift Aid</b>
          <small>HMRC declaration</small>
        </div>
        <em>+25%</em>
      </div>
      <div className="mui-k-recur">
        <span className="is-on">One-time</span>
        <span>Monthly</span>
      </div>
      <span className="mui-k-cta">Donate</span>
    </div>
  ),
  forensics: (
    <div className="mui-for">
      <div className="mui-doc">
        <i />
        <i />
        <i className="w60" />
        <span className="mui-scan" />
        <span className="mui-hit" />
      </div>
      <div className="mui-for-side">
        <div className="mui-gauge">
          <svg viewBox="0 0 100 56">
            <path d="M8 50a42 42 0 0 1 84 0" fill="none" stroke="#e3e1dc" strokeWidth="9" strokeLinecap="round" />
            <path d="M8 50a42 42 0 0 1 60-38" fill="none" stroke="#0d0d0d" strokeWidth="9" strokeLinecap="round" />
          </svg>
          <b>Risk</b>
        </div>
        {["ELA", "Quantization", "Metadata", "OCR"].map((d, i) => (
          <div key={d} className="mui-meter">
            <span>{d}</span>
            <i style={{ width: `${[72, 44, 58, 30][i]}%` }} />
          </div>
        ))}
        <p className="mui-chain">⛓ anchored</p>
      </div>
    </div>
  ),
  gym: (
    <div className="mui-gym">
      <div className="mui-cal">
        {["M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i}>
            <small>{d}</small>
            <i className={i % 2 ? "" : "is-on"} />
            <i className={i === 3 ? "is-on" : ""} />
          </div>
        ))}
      </div>
      <div className="mui-gym-row">
        <div className="mui-trainer">
          <span className="mui-ava" />
          <div>
            <b>Trainer</b>
            <small>Book a slot</small>
          </div>
        </div>
        <div className="mui-plan">
          <small>Recommended</small>
          <b>Plan</b>
          <i />
        </div>
      </div>
    </div>
  ),
  canvas: (
    <div className="mui-canvas">
      <div className="mui-board">
        <svg viewBox="0 0 160 110">
          <path
            d="M20 80c10-30 30-50 50-48s26 24 14 36-30 6-26-8 26-26 46-18 24 22 34 18"
            fill="none"
            stroke="#0d0d0d"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="124" cy="28" r="10" fill="none" stroke="#77756f" strokeWidth="2" />
        </svg>
        <span className="mui-word">_ _ _ _ _</span>
      </div>
      <div className="mui-side">
        <div className="mui-lb">
          {[3, 2, 1].map((n) => (
            <div key={n}>
              <span className="mui-ava sm" />
              <i style={{ width: `${30 + n * 18}%` }} />
            </div>
          ))}
        </div>
        <div className="mui-chat">
          <span>guess?</span>
          <span className="me">a river!</span>
          <span>✓ correct</span>
        </div>
      </div>
    </div>
  ),
};

const CSS = `
.mui{width:100%;height:100%;display:flex;flex-direction:column;border-radius:18px;background:#fbfaf8;box-shadow:var(--hairline);overflow:hidden;
  font-size:12px;color:var(--ink)}
.mui-bar{display:flex;gap:5px;padding:10px 12px;border-bottom:1px solid var(--line)}
.mui-bar i{width:8px;height:8px;border-radius:50%;background:#d9d6d0}
.mui-body{flex:1;min-height:0;padding:16px;display:flex}
.mui-body>div{flex:1;min-width:0}
.mui b{font-weight:600}.mui small{display:block;color:var(--mute);font-size:10.5px}
.mui-ava{display:block;flex:none;width:34px;height:34px;border-radius:50%;background:#c9c6c0}
.mui-ava.sm{width:18px;height:18px}
.mui-switch{position:relative;flex:none;width:34px;height:20px;border-radius:999px;background:var(--ink)}
.mui-switch::after{content:"";position:absolute;right:3px;top:3px;width:14px;height:14px;border-radius:50%;background:#fff}
.mui-kiosk{display:flex;flex-direction:column;gap:12px}
.mui-k-title{margin:0;font-weight:600;font-size:15px;letter-spacing:-.02em}
.mui-k-amounts{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.mui-k-amounts span,.mui-k-recur span{display:grid;place-items:center;height:38px;border-radius:10px;background:#fff;box-shadow:var(--hairline);font-weight:600}
.mui-k-amounts .is-on,.mui-k-recur .is-on{background:var(--ink);color:#fff}
.mui-k-toggle{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:#fff;box-shadow:var(--hairline)}
.mui-k-toggle div{flex:1}.mui-k-toggle em{font-style:normal;font-family:var(--font-mono);font-size:11px;padding:3px 8px;border-radius:999px;background:var(--soft)}
.mui-k-recur{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.mui-k-cta{margin-top:auto;display:grid;place-items:center;height:42px;border-radius:999px;background:var(--ink);color:#fff;font-weight:600}
.mui-for{display:grid;grid-template-columns:1.1fr 1fr;gap:14px}
.mui-doc{position:relative;border-radius:10px;background:#fff;box-shadow:var(--hairline);padding:16px 14px;display:flex;flex-direction:column;gap:8px;overflow:hidden}
.mui-doc i{height:6px;border-radius:4px;background:#e6e4df}.mui-doc i.w60{width:60%}
.mui-doc::after{content:"";margin-top:auto;height:44%;border-radius:8px;background:repeating-linear-gradient(135deg,#efede9 0 6px,#e5e3de 6px 12px)}
.mui-scan{position:absolute;left:0;right:0;top:0;height:2px;background:var(--ink);opacity:.5;animation:mui-scan 3.2s var(--ease) infinite}
@keyframes mui-scan{50%{transform:translateY(220px)}}
.mui-hit{position:absolute;right:18px;bottom:24%;width:40%;height:24%;border:1.5px dashed var(--ink);border-radius:6px}
.mui-for-side{display:flex;flex-direction:column;gap:8px}
.mui-gauge{position:relative;display:grid;place-items:center}.mui-gauge svg{width:100%;max-width:140px}
.mui-gauge b{position:absolute;bottom:2px;font-size:11px}
.mui-meter span{display:block;font-family:var(--font-mono);font-size:10px;color:var(--mute);margin-bottom:3px}
.mui-meter i{display:block;height:5px;border-radius:4px;background:var(--ink)}
.mui-chain{margin:auto 0 0;font-family:var(--font-mono);font-size:10px;color:var(--mute)}
.mui-gym{display:flex;flex-direction:column;gap:12px}
.mui-cal{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
.mui-cal>div{display:flex;flex-direction:column;gap:5px;align-items:stretch;text-align:center}
.mui-cal i{height:34px;border-radius:8px;background:#fff;box-shadow:var(--hairline)}.mui-cal i.is-on{background:var(--ink)}
.mui-gym-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;min-height:120px}
.mui-trainer,.mui-plan{border-radius:12px;background:#fff;box-shadow:var(--hairline);padding:12px;display:flex;gap:10px}
.mui-trainer{align-items:center}
.mui-plan{flex-direction:column;gap:2px}.mui-plan b{font-size:18px;letter-spacing:-.03em}
.mui-plan i{margin-top:auto;height:6px;border-radius:4px;background:linear-gradient(90deg,var(--ink) 70%,#e6e4df 70%)}
.mui-canvas{display:grid;grid-template-columns:1.4fr 1fr;gap:12px}
.mui-board{position:relative;border-radius:12px;background:#fff;box-shadow:var(--hairline);display:grid;place-items:center;padding:10px}
.mui-board svg{width:100%}
.mui-board path{stroke-dasharray:420;stroke-dashoffset:420;animation:mui-draw 4s var(--ease) infinite}
@keyframes mui-draw{60%,100%{stroke-dashoffset:0}}
.mui-word{position:absolute;bottom:10px;font-family:var(--font-mono);letter-spacing:.2em;color:var(--mute)}
.mui-side{display:flex;flex-direction:column;gap:10px}
.mui-lb{display:grid;gap:7px;padding:10px;border-radius:12px;background:#fff;box-shadow:var(--hairline)}
.mui-lb div{display:flex;align-items:center;gap:8px}.mui-lb i{height:6px;border-radius:4px;background:var(--ink)}
.mui-chat{flex:1;display:flex;flex-direction:column;gap:6px;justify-content:flex-end}
.mui-chat span{align-self:flex-start;padding:6px 10px;border-radius:12px;background:#fff;box-shadow:var(--hairline);font-size:11px}
.mui-chat span.me{align-self:flex-end;background:var(--ink);color:#fff}
`;
