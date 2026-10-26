"use client";

import { useEffect, useRef } from "react";

/**
 * Sistema de nós em órbita (Canvas 2D, sem segundo contexto WebGL).
 * Três órbitas inclinadas em torno de um núcleo; nós próximos se conectam e
 * pacotes de dados percorrem algumas conexões. Pausa fora da tela.
 */
type Node = { orbit: number; angle: number; speed: number; size: number };

const ORBITS = [
  { rx: 0.42, ry: 0.15, tilt: -0.42, depth: 1.0 },
  { rx: 0.32, ry: 0.22, tilt: 0.55, depth: 0.7 },
  { rx: 0.2, ry: 0.11, tilt: -0.1, depth: 0.45 },
];

export function NodeField({ label }: { label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(cv);

    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const nodes: Node[] = [];
    ORBITS.forEach((_, o) => {
      const count = [9, 7, 5][o];
      for (let i = 0; i < count; i++) {
        nodes.push({
          orbit: o,
          angle: (i / count) * Math.PI * 2 + rnd() * 0.5,
          speed: (0.05 + rnd() * 0.03) * (o % 2 ? -1 : 1),
          size: 1.6 + rnd() * 2.2,
        });
      }
    });
    const packets = Array.from({ length: 6 }, () => ({ a: Math.floor(rnd() * nodes.length), b: 0, t: rnd() }));

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false, px: -9999, py: -9999 };
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      pointer.px = e.clientX - r.left;
      pointer.py = e.clientY - r.top;
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
      pointer.inside = false;
    };
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);

    const pos = nodes.map(() => ({ x: 0, y: 0, z: 0 }));

    function draw(time: number) {
      if (!ctx) return;
      const s = Math.min(w, h);
      const cx = w / 2;
      const cy = h / 2;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      ctx.clearRect(0, 0, w, h);

      // órbitas
      ORBITS.forEach((o) => {
        ctx.save();
        ctx.translate(cx + pointer.x * 14 * o.depth, cy + pointer.y * 10 * o.depth);
        ctx.rotate(o.tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, o.rx * s, o.ry * s, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.07)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });

      // posições
      nodes.forEach((n, i) => {
        const o = ORBITS[n.orbit];
        const a = n.angle + time * n.speed;
        const ex = Math.cos(a) * o.rx * s;
        const ey = Math.sin(a) * o.ry * s;
        const c = Math.cos(o.tilt);
        const sn = Math.sin(o.tilt);
        pos[i].x = cx + ex * c - ey * sn + pointer.x * 14 * o.depth;
        pos[i].y = cy + ex * sn + ey * c + pointer.y * 10 * o.depth;
        pos[i].z = Math.sin(a); // frente/trás da órbita
      });

      // conexões
      const maxD = s * 0.26;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = pos[i].x - pos[j].x;
          const dy = pos[i].y - pos[j].y;
          const d = Math.hypot(dx, dy);
          if (d > maxD) continue;
          const alpha = (1 - d / maxD) * 0.32;
          const g = ctx.createLinearGradient(pos[i].x, pos[i].y, pos[j].x, pos[j].y);
          g.addColorStop(0, `rgba(146,108,216,${alpha})`);
          g.addColorStop(1, `rgba(180,151,232,${alpha})`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pos[i].x, pos[i].y);
          ctx.lineTo(pos[j].x, pos[j].y);
          ctx.stroke();
        }
      }

      // pacotes viajando entre nós vizinhos
      packets.forEach((p) => {
        if (!reduced) p.t += 0.006;
        if (p.t >= 1 || p.b === p.a) {
          if (p.t >= 1) p.a = p.b;
          p.t = 0;
          // próximo destino: o vizinho mais perto que não seja o próprio nó
          let best = -1;
          let bestD = Infinity;
          for (let j = 0; j < nodes.length; j++) {
            if (j === p.a) continue;
            const d = Math.hypot(pos[p.a].x - pos[j].x, pos[p.a].y - pos[j].y) * (0.6 + Math.random() * 0.8);
            if (d < bestD) {
              bestD = d;
              best = j;
            }
          }
          p.b = best;
        }
        const A = pos[p.a];
        const B = pos[p.b];
        const x = A.x + (B.x - A.x) * p.t;
        const y = A.y + (B.y - A.y) * p.t;
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,252,243,0.9)";
        ctx.fill();
      });

      // núcleo
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 0.09);
      core.addColorStop(0, "rgba(255,252,243,0.95)");
      core.addColorStop(0.2, "rgba(167,139,250,0.6)");
      core.addColorStop(1, "rgba(146,108,216,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx + pointer.x * 4, cy + pointer.y * 3, s * 0.09, 0, Math.PI * 2);
      ctx.fill();

      // nós (os de trás mais apagados; os perto do cursor acendem)
      nodes.forEach((n, i) => {
        const p = pos[i];
        const near = pointer.inside ? Math.max(0, 1 - Math.hypot(p.x - pointer.px, p.y - pointer.py) / 90) : 0;
        const depth = 0.55 + 0.45 * (p.z * 0.5 + 0.5);
        const r = n.size * depth + near * 2.5;
        if (near > 0.05) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6);
          glow.addColorStop(0, `rgba(139,92,246,${0.5 * near})`);
          glow.addColorStop(1, "rgba(139,92,246,0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(200 + 48 * near)},${Math.round(205 + 45 * near)},255,${0.35 + 0.55 * depth})`;
        ctx.fill();
      });
    }

    let raf = 0;
    let running = false;
    let last = performance.now();
    let clock = 0;
    const loop = (now: number) => {
      clock += Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(clock);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduced) draw(0);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "100px" });
    io.observe(cv);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvas} role="img" aria-label={label} className="h-full w-full" />;
}
