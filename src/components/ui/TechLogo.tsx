/* eslint-disable @next/next/no-img-element -- tiny static SVGs; next/image adds nothing here */
import type { ReactNode } from "react";

/** Official logos in /public/logos (devicon "original" + simple-icons). Colour = brand tint for glows. */
export const BRAND: Record<string, { src: string; color: string }> = {
  C: { src: "c.svg", color: "#A8B9CC" },
  "C++": { src: "cplusplus.svg", color: "#00599C" },
  Java: { src: "java.svg", color: "#ED8B00" },
  Python: { src: "python.svg", color: "#3776AB" },
  TypeScript: { src: "typescript.svg", color: "#3178C6" },
  JavaScript: { src: "javascript.svg", color: "#F7DF1E" },
  HTML: { src: "html5.svg", color: "#E34F26" },
  CSS: { src: "css3.svg", color: "#1572B6" },
  TailwindCSS: { src: "tailwindcss.svg", color: "#06B6D4" },
  "React.js": { src: "react.svg", color: "#61DAFB" },
  "Next.js": { src: "nextjs.svg", color: "#000000" },
  "Node.js": { src: "nodejs.svg", color: "#5FA04E" },
  "Express.js": { src: "express.svg", color: "#000000" },
  Firebase: { src: "firebase.svg", color: "#FFCA28" },
  Postman: { src: "postman.svg", color: "#FF6C37" },
  JWT: { src: "jwt.svg", color: "#000000" },
  MySQL: { src: "mysql.svg", color: "#4479A1" },
  MongoDB: { src: "mongodb.svg", color: "#47A248" },
  "SQL Server": { src: "microsoftsqlserver.svg", color: "#CC2927" },
  Docker: { src: "docker.svg", color: "#2496ED" },
  Render: { src: "render.svg", color: "#000000" },
  Netlify: { src: "netlify.svg", color: "#00C7B7" },
  "Socket.io": { src: "socketio.svg", color: "#010101" },
  Flask: { src: "flask.svg", color: "#000000" },
  FastAPI: { src: "fastapi.svg", color: "#009688" },
  PostgreSQL: { src: "postgresql.svg", color: "#4169E1" },
  Redis: { src: "redis.svg", color: "#FF4438" },
  Vitest: { src: "vitest.svg", color: "#6E9F18" },
  Stripe: { src: "stripe.svg", color: "#635BFF" },
};

/** Thin line icons for concepts and honours, drawn on a 24px grid in currentColor. */
export const CONCEPT: Record<string, ReactNode> = {
  "REST APIs": (
    <>
      <path d="M8 5c-2 0-2.5 1-2.5 2.5v2c0 1.2-.8 2-2 2.5 1.2.5 2 1.3 2 2.5v2C5.5 18 6 19 8 19" />
      <path d="M16 5c2 0 2.5 1 2.5 2.5v2c0 1.2.8 2 2 2.5-1.2.5-2 1.3-2 2.5v2c0 1.5-.5 2.5-2.5 2.5" />
      <path d="M9.5 12h5M12.5 10l2 2-2 2" />
    </>
  ),
  OOP: (
    <>
      <path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z" />
      <path d="M4 7.5 12 12l8-4.5M12 12v9" />
    </>
  ),
  "Operating Systems": (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M3 8h18M6 6h.01M8.5 6h.01M9 21h6M12 17v4" />
    </>
  ),
  DBMS: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </>
  ),
  "Computer Networks": (
    <>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <circle cx="12" cy="13" r="1.5" />
      <path d="M12 7v4.5M10.8 13.9 6.5 16.8M13.2 13.9l4.3 2.9M7 18h10" />
    </>
  ),
  medal: (
    <>
      <path d="M8 3h8l-2.5 6h-3L8 3Z" />
      <circle cx="12" cy="15" r="6" />
      <path d="m12 12 .9 1.9 2.1.3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1-1.5-1.4 2.1-.3L12 12Z" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H5v1.5A3 3 0 0 0 8 10.5M16 6h3v1.5a3 3 0 0 1-3 3M12 13v4M8.5 20h7M10 17h4" />
    </>
  ),
  donate: (
    <>
      <path d="M12 11.5s-4-2.4-4-5a2.2 2.2 0 0 1 4-1.3 2.2 2.2 0 0 1 4 1.3c0 2.6-4 5-4 5Z" />
      <path d="M3 14h3l3.5 2H13a1.5 1.5 0 0 1 0 3H9M6 21H3v-7M13 17.5l4.6-2.3a1.6 1.6 0 0 1 1.9 2.4L15 21H6" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
};

export const isBrand = (name: string) => name in BRAND;
export const brandColor = (name: string) => BRAND[name]?.color;

export function TechLogo({ name, size = 24, className = "" }: { name: string; size?: number; className?: string }) {
  const brand = BRAND[name];
  if (brand) {
    return (
      <img
        src={`/logos/${brand.src}`}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  const icon = CONCEPT[name];
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={size > 60 ? 0.9 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {icon}
    </svg>
  );
}
