/**
 * Versão estática da paisagem (CSS + SVG). Aparece instantaneamente, fica por
 * baixo do canvas e é a cena definitiva quando não há WebGL.
 */

// Linha de montanhas determinística (mesma no servidor e no cliente).
function ridgePath(seed: number, base: number, amp: number, peaks: number, edgeRise: number) {
  const rand = (i: number) => {
    const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const steps = 120;
  let d = `M0 1000 L0 ${base}`;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const xn = t * 2 - 1;
    let h = 0;
    let a = 1;
    let f = peaks;
    for (let o = 0; o < 4; o++) {
      const p = t * f;
      const i0 = Math.floor(p);
      const fr = p - i0;
      const u = fr * fr * (3 - 2 * fr);
      const n = rand(i0 + o * 97) * (1 - u) + rand(i0 + 1 + o * 97) * u;
      h += a * Math.pow(1 - Math.abs(n * 2 - 1), 2);
      a *= 0.5;
      f *= 2.1;
    }
    const y = base - h * amp - Math.pow(Math.abs(xn), 2.6) * edgeRise;
    d += ` L${(t * 1600).toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} L1600 1000 Z`;
}

const layers = [
  { d: ridgePath(3, 640, 120, 6, 60), fill: "url(#fb-far)" },
  { d: ridgePath(8, 700, 110, 9, 140), fill: "url(#fb-mid)" },
  { d: ridgePath(14, 770, 60, 14, 260), fill: "#03030b" },
];

export function SceneFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{
        animation: "fallback-reveal 1.8s var(--ease-soft) both",
        background: "radial-gradient(120% 70% at 50% 62%, #1a1240 0%, #0b0a1f 38%, #05050c 72%)",
      }}
    >
      {/* halo atrás do planeta */}
      <div
        className="absolute left-[60%] top-[38%] aspect-square w-[min(150vh,150vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(146,108,216,0.32) 0%, rgba(91,60,220,0.14) 28%, rgba(5,5,12,0) 60%)",
        }}
      />
      {/* planeta */}
      <div
        className="absolute left-[60%] top-[40%] aspect-square w-[min(58vh,64vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle at 38% 28%, #9b6cf0 0%, #5b2bb8 22%, #2a1260 52%, #0d0626 78%)",
          boxShadow:
            "0 0 60px 6px rgba(167,139,250,0.45), 0 0 160px 40px rgba(146,108,216,0.22), inset 0 6px 22px rgba(236,225,255,0.55), inset -30px -40px 80px rgba(5,5,12,0.75)",
        }}
      />
      {/* névoa do horizonte */}
      <div
        className="absolute inset-x-0 top-[52%] h-[22%]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(61,111,224,0.38) 0%, rgba(61,111,224,0.08) 55%, transparent 80%)",
        }}
      />
      <svg
        className="absolute inset-x-0 bottom-0 h-[62%] w-full"
        viewBox="0 380 1600 620"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="fb-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.45" stopColor="#141a3c" />
            <stop offset="0.75" stopColor="#24427f" />
          </linearGradient>
          <linearGradient id="fb-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.5" stopColor="#0a0c22" />
            <stop offset="0.8" stopColor="#173068" />
          </linearGradient>
        </defs>
        {layers.map((l, i) => (
          <path key={i} d={l.d} fill={l.fill} />
        ))}
      </svg>
      {/* estrelas esparsas */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 12% 18%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 27% 8%, #c7d2fe 50%, transparent 51%), radial-gradient(1.5px 1.5px at 81% 14%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 66% 31%, #e9d5ff 50%, transparent 51%), radial-gradient(1px 1px at 92% 38%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 6% 42%, #c7d2fe 50%, transparent 51%), radial-gradient(1.5px 1.5px at 44% 6%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 57% 19%, #fff 50%, transparent 51%)",
        }}
      />
    </div>
  );
}
