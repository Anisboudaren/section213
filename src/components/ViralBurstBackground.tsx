"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CheckCircle2,
  Crown,
  DollarSign,
  Eye,
  Heart,
  Megaphone,
  Percent,
  Play,
  Rocket,
  Share2,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

type Particle = {
  id: string;
  kind: "icon" | "text";
  Icon?: LucideIcon;
  text?: string;
  left: number;
  delay: number;
  duration: number;
  iconSize: number;
  drift: number;
  startOffset: number;
};

type ViralTheme = {
  label: string;
  subtitle: string;
  gradient: string;
  accent: string;
  badgeAccent: string;
  icons: LucideIcon[];
  badges: string[];
};

/** Side lanes — clear center for the phone */
const LANES = [
  { left: 6, drift: -14 },
  { left: 14, drift: 10 },
  { left: 23, drift: -8 },
  { left: 77, drift: 12 },
  { left: 85, drift: -10 },
  { left: 93, drift: 8 },
] as const;

const LANE_PATTERN: Array<"text" | "icon" | "text"> = ["text", "icon", "text"];

export const VIRAL_THEMES: ViralTheme[] = [
  {
    label: "Impressions",
    subtitle: "Views stacking up — your content is getting seen.",
    gradient: "from-sky-500/15 via-violet-500/10 to-secondary",
    accent: "text-sky-600",
    badgeAccent: "border-sky-300/50 text-sky-800",
    icons: [Eye, Play, Users, TrendingUp, BarChart3, Megaphone, Share2, Heart],
    badges: [
      "12.4K views",
      "89K reach",
      "2.1M impressions",
      "Trending now",
      "For You",
      "+4.2K today",
      "Going viral",
      "48K watched",
    ],
  },
  {
    label: "Sales",
    subtitle: "Leads convert — every view pushes toward a sale.",
    gradient: "from-emerald-500/15 via-gold/12 to-secondary",
    accent: "text-emerald-700",
    badgeAccent: "border-emerald-300/50 text-emerald-900",
    icons: [DollarSign, ShoppingCart, Percent, Zap, TrendingUp, BarChart3, Share2, Megaphone],
    badges: [
      "$12.4K revenue",
      "Sold!",
      "New lead",
      "Checkout",
      "+38% ROI",
      "Booked call",
      "Deal closed",
      "Inquiry received",
    ],
  },
  {
    label: "Success",
    subtitle: "Deals closed — your brand wins the feed and the market.",
    gradient: "from-gold/25 via-amber-500/15 to-secondary",
    accent: "text-amber-700",
    badgeAccent: "border-gold/50 text-ink",
    icons: [Trophy, Star, Crown, Rocket, Sparkles, CheckCircle2, TrendingUp, Heart],
    badges: [
      "#1 in market",
      "Sold out",
      "Viral hit",
      "Top rated",
      "Winner",
      "Crushed it",
      "Record month",
      "Client love",
    ],
  },
];

function buildParticles(theme: ViralTheme, themeIndex: number): Particle[] {
  const particles: Particle[] = [];
  let iconIdx = 0;
  let badgeIdx = 0;

  LANES.forEach((lane, laneIndex) => {
    LANE_PATTERN.forEach((kind, n) => {
      const laneJitter = ((laneIndex * 2 + n + themeIndex) % 4) - 1.5;

      particles.push({
        id: `${themeIndex}-${laneIndex}-${n}`,
        kind,
        Icon: kind === "icon" ? theme.icons[iconIdx++ % theme.icons.length] : undefined,
        text: kind === "text" ? theme.badges[badgeIdx++ % theme.badges.length] : undefined,
        left: lane.left + laneJitter,
        delay: laneIndex * 1.1 + n * 1.9 + themeIndex * 0.15,
        duration: 5 + (laneIndex % 3) * 0.7 + n * 0.35,
        iconSize: 28 + (n % 2) * 8,
        drift: lane.drift,
        startOffset: n * 12 + laneIndex * 4,
      });
    });
  });

  return particles;
}

type ViralBurstBackgroundProps = {
  themeIndex: number;
};

export function ViralBurstBackground({ themeIndex }: ViralBurstBackgroundProps) {
  const theme = VIRAL_THEMES[themeIndex] ?? VIRAL_THEMES[0];
  const particles = useMemo(() => buildParticles(theme, themeIndex), [theme, themeIndex]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className={`absolute inset-0 bg-gradient-to-b transition-all duration-700 ${theme.gradient}`}
      />

      {/* Light center fade — keeps phone readable without hiding side particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_38%_50%_at_50%_52%,transparent_45%,oklch(0.968_0.007_247.896/0.35)_88%)]" />

      <div key={themeIndex} className="absolute inset-0 viral-burst-set">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="viral-particle viral-float-pop"
            style={{
              left: `${particle.left}%`,
              bottom: `${-8 - particle.startOffset}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              ["--viral-drift" as string]: `${particle.drift}px`,
            }}
          >
            {particle.kind === "icon" && particle.Icon ? (
              <div className={`viral-icon-bubble ${theme.accent}`}>
                <particle.Icon
                  style={{ width: particle.iconSize, height: particle.iconSize }}
                  strokeWidth={2.25}
                  className="block shrink-0"
                />
              </div>
            ) : (
              <span className={`viral-badge ${theme.badgeAccent}`}>{particle.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function getViralTheme(index: number) {
  return VIRAL_THEMES[index] ?? VIRAL_THEMES[0];
}
