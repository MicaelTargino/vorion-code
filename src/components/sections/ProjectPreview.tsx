import type { Project } from "@/content";

/**
 * Prévias abstratas em SVG para os projetos demonstrativos. Quando houver
 * cases reais, troque por imagens (next/image) mantendo a mesma proporção 16:10.
 */
export function ProjectPreview({ kind }: { kind: Project["preview"] }) {
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`pv-bg-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14122b" />
          <stop offset="1" stopColor="#0b0d1f" />
        </linearGradient>
        <linearGradient id={`pv-brand-${kind}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id={`pv-area-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7C3AED" stopOpacity="0.35" />
          <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`pv-glow-${kind}`} cx="0.75" cy="0.15" r="0.8">
          <stop offset="0" stopColor="#7C3AED" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#pv-bg-${kind})`} />
      <rect width="800" height="500" fill={`url(#pv-glow-${kind})`} />
      {kind === "dashboard" && <Dashboard />}
      {kind === "agent" && <Agent />}
      {kind === "mobile" && <Mobile />}
    </svg>
  );
}

const line = "rgba(255,255,255,0.08)";
const soft = "rgba(255,255,255,0.14)";
const text = "rgba(248,250,252,0.55)";

function Dashboard() {
  return (
    <g>
      <rect x="70" y="60" width="660" height="400" rx="16" fill="#0e0f22" stroke={soft} />
      <rect x="70" y="60" width="150" height="400" rx="16" fill="#0b0c1c" stroke={line} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x="94"
          y={110 + i * 34}
          width={i === 1 ? 96 : 76}
          height="9"
          rx="4.5"
          fill={i === 1 ? "url(#pv-brand-dashboard)" : text}
          opacity={i === 1 ? 1 : 0.35}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={244 + i * 158} y="88" width="142" height="78" rx="10" fill="#121330" stroke={line} />
          <rect x={260 + i * 158} y="106" width="54" height="7" rx="3.5" fill={text} opacity="0.4" />
          <rect x={260 + i * 158} y="128" width={70 + i * 10} height="16" rx="5" fill="#F8FAFC" opacity="0.85" />
        </g>
      ))}
      <rect x="244" y="184" width="458" height="248" rx="10" fill="#121330" stroke={line} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="266" x2="682" y1={226 + i * 48} y2={226 + i * 48} stroke={line} />
      ))}
      <path
        d="M266 378 C 316 360, 340 330, 386 336 S 456 300, 500 290 S 580 236, 620 246 S 666 214, 682 206 L 682 412 L 266 412 Z"
        fill="url(#pv-area-dashboard)"
      />
      <path
        d="M266 378 C 316 360, 340 330, 386 336 S 456 300, 500 290 S 580 236, 620 246 S 666 214, 682 206"
        fill="none"
        stroke="url(#pv-brand-dashboard)"
        strokeWidth="3"
      />
      <circle cx="620" cy="246" r="6" fill="#F8FAFC" />
      <circle cx="620" cy="246" r="14" fill="#7C3AED" opacity="0.25" />
    </g>
  );
}

function Agent() {
  const docs = [0, 1, 2];
  return (
    <g>
      {docs.map((i) => (
        <g key={i} transform={`translate(${90 + i * 18} ${120 + i * 26})`}>
          <rect width="150" height="190" rx="12" fill="#121330" stroke={soft} />
          {[0, 1, 2, 3, 4, 5].map((j) => (
            <rect
              key={j}
              x="20"
              y={28 + j * 24}
              width={j % 2 ? 84 : 110}
              height="8"
              rx="4"
              fill={text}
              opacity="0.35"
            />
          ))}
        </g>
      ))}
      <path
        d="M296 250 C 340 250, 352 250, 378 250"
        stroke="url(#pv-brand-agent)"
        strokeWidth="2"
        strokeDasharray="4 6"
        fill="none"
      />
      <circle cx="420" cy="250" r="54" fill="#121330" stroke="url(#pv-brand-agent)" strokeWidth="2" />
      <circle cx="420" cy="250" r="78" fill="none" stroke={soft} strokeDasharray="2 8" />
      <path
        d="M420 222c2.4 15.4 7.6 20.6 23 23-15.4 2.4-20.6 7.6-23 23-2.4-15.4-7.6-20.6-23-23 15.4-2.4 20.6-7.6 23-23Z"
        fill="#F8FAFC"
      />
      <path
        d="M476 250 C 500 250, 512 250, 536 250"
        stroke="url(#pv-brand-agent)"
        strokeWidth="2"
        strokeDasharray="4 6"
        fill="none"
      />
      <rect x="548" y="140" width="200" height="220" rx="12" fill="#121330" stroke={soft} />
      {[0, 1, 2, 3, 4, 5].map((j) => (
        <g key={j}>
          <rect x="568" y={166 + j * 30} width="70" height="8" rx="4" fill={text} opacity="0.4" />
          <rect
            x="652"
            y={166 + j * 30}
            width="76"
            height="8"
            rx="4"
            fill={j === 3 ? "#F59E0B" : "#F8FAFC"}
            opacity={j === 3 ? 0.8 : 0.75}
          />
        </g>
      ))}
    </g>
  );
}

function Mobile() {
  const phone = (x: number, y: number, tilt: number, children: React.ReactNode) => (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <rect width="170" height="340" rx="28" fill="#0e0f22" stroke={soft} strokeWidth="1.5" />
      <rect x="62" y="12" width="46" height="8" rx="4" fill="#05050c" />
      {children}
    </g>
  );
  return (
    <g>
      {phone(
        200,
        90,
        -6,
        <g>
          <rect x="18" y="42" width="134" height="120" rx="14" fill="url(#pv-area-mobile)" stroke={line} />
          <circle cx="85" cy="102" r="26" fill="none" stroke="url(#pv-brand-mobile)" strokeWidth="3" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x="18" y={180 + i * 40} width="134" height="30" rx="9" fill="#121330" stroke={line} />
          ))}
        </g>,
      )}
      {phone(
        430,
        70,
        5,
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <circle
                cx="36"
                cy={64 + i * 50}
                r="12"
                fill={i === 0 ? "url(#pv-brand-mobile)" : "#121330"}
                stroke={line}
              />
              <rect x="58" y={56 + i * 50} width="80" height="7" rx="3.5" fill={text} opacity="0.5" />
              <rect x="58" y={70 + i * 50} width="52" height="6" rx="3" fill={text} opacity="0.25" />
            </g>
          ))}
          <rect x="18" y="296" width="134" height="30" rx="15" fill="#F8FAFC" opacity="0.9" />
        </g>,
      )}
    </g>
  );
}
