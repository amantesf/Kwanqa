import type { NextConfig } from "next";

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const google = "https://accounts.google.com";
const turnstile = "https://challenges.cloudflare.com";

// What the browser may load. Next.js and Google sign-in use inline scripts and
// styles, so those stay allowed; everything else is limited to kwanqa itself,
// Supabase (accounts and progress), Google (the sign-in button) and
// Cloudflare Turnstile (the "are you human?" check).
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} ${google}/gsi/client ${turnstile}`,
  `style-src 'self' 'unsafe-inline' ${google}/gsi/style`,
  "img-src 'self' data: blob: https://*.googleusercontent.com",
  "font-src 'self' data:",
  "media-src 'self'",
  `connect-src 'self' ${supabase} ${supabase.replace("https://", "wss://")} ${google}/gsi/`,
  `frame-src ${google}/gsi/ ${turnstile}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Google sign-in needs the "identity-credentials-get" feature, so it isn't blocked here.
  // The microphone is allowed for kwanqa itself (Talk with Walia), never for embedded sites.
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
