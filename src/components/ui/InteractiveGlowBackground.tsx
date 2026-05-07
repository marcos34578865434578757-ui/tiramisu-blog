"use client";

import { useEffect, useRef } from "react";

type GlowLayer = {
  x: number;
  y: number;
  radius: number;
  driftX: number;
  driftY: number;
  pull: number;
  phase: number;
};

const layers: GlowLayer[] = [
  { x: 0.18, y: 0.18, radius: 0.3, driftX: 0.034, driftY: 0.025, pull: 0.04, phase: 0.2 },
  { x: 0.74, y: 0.22, radius: 0.34, driftX: -0.028, driftY: 0.03, pull: 0.05, phase: 1.1 },
  { x: 0.64, y: 0.7, radius: 0.28, driftX: 0.02, driftY: -0.03, pull: 0.035, phase: 2.2 },
  { x: 0.28, y: 0.82, radius: 0.24, driftX: -0.018, driftY: -0.02, pull: 0.03, phase: 3.4 },
];

function getPalette(isDark: boolean) {
  return isDark
    ? [
        "103, 216, 208",
        "159, 230, 205",
        "120, 191, 173",
        "220, 250, 243",
      ]
    : [
        "143, 220, 194",
        "183, 245, 200",
        "207, 232, 255",
        "255, 255, 255",
      ];
}

export function InteractiveGlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointer = (event: PointerEvent) => {
      pointerRef.current.tx = event.clientX / window.innerWidth;
      pointerRef.current.ty = event.clientY / window.innerHeight;
    };

    const handleLeave = () => {
      pointerRef.current.tx = 0.5;
      pointerRef.current.ty = 0.5;
    };

    const draw = (time: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pointer = pointerRef.current;
      const easing = media.matches ? 0.035 : 0.065;

      pointer.x += (pointer.tx - pointer.x) * easing;
      pointer.y += (pointer.ty - pointer.y) * easing;

      const isDark = document.documentElement.dataset.theme === "dark";
      const palette = getPalette(isDark);
      const baseAlpha = isDark ? 0.2 : 0.28;

      context.clearRect(0, 0, width, height);

      for (const [index, layer] of layers.entries()) {
        const driftX = Math.sin(time * 0.00018 + layer.phase) * width * layer.driftX;
        const driftY = Math.cos(time * 0.00016 + layer.phase * 1.3) * height * layer.driftY;
        const followX = (pointer.x - 0.5) * width * layer.pull;
        const followY = (pointer.y - 0.5) * height * layer.pull;
        const x = width * layer.x + driftX + followX;
        const y = height * layer.y + driftY + followY;
        const radius = Math.max(width, height) * layer.radius;
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

        gradient.addColorStop(0, `rgba(${palette[index % palette.length]}, ${baseAlpha})`);
        gradient.addColorStop(
          0.45,
          `rgba(${palette[(index + 1) % palette.length]}, ${baseAlpha * 0.42})`,
        );
        gradient.addColorStop(1, `rgba(${palette[index % palette.length]}, 0)`);

        context.fillStyle = gradient;
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }

      const mist = context.createRadialGradient(
        width * 0.5,
        height * 0.18,
        0,
        width * 0.5,
        height * 0.18,
        Math.max(width, height) * 0.95,
      );
      mist.addColorStop(0, isDark ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.58)");
      mist.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = mist;
      context.fillRect(0, 0, width, height);

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    frameId = window.requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointer);
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerleave", handleLeave);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="h-full w-full opacity-100 transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28),transparent_54%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_58%)]" />
    </div>
  );
}
