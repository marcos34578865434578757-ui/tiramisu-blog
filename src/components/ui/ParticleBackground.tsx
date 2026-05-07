"use client";

const particles = [
  { left: "8%", top: "10%", size: 10, delay: "0s" },
  { left: "22%", top: "28%", size: 8, delay: "1.2s" },
  { left: "72%", top: "18%", size: 12, delay: "0.6s" },
  { left: "86%", top: "32%", size: 7, delay: "1.8s" },
  { left: "58%", top: "70%", size: 10, delay: "0.2s" },
  { left: "16%", top: "82%", size: 6, delay: "1.4s" },
  { left: "36%", top: "58%", size: 9, delay: "2s" },
  { left: "90%", top: "74%", size: 11, delay: "0.8s" },
];

export function ParticleBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle, index) => (
        <span
          key={`${particle.left}-${index}`}
          className="particle-orbit absolute rounded-full bg-white/70 shadow-[0_0_24px_rgba(255,255,255,0.6)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: particle.delay,
            opacity: 0.45,
          }}
        />
      ))}
    </div>
  );
}
