import type { CaseStudySection } from "@/lib/case-study-sections";
import type { CaseStudyInput } from "@/lib/schemas/case-study-schema";
import {
  HERO_VIDEO_DESKTOP,
  SCROLL_VIDEO_1,
  SCROLL_VIDEO_2,
  SCROLL_VIDEO_3,
} from "@/lib/hero-video-sources";

function buildSeedSections(
  excerpt: string,
  videoUrl: string,
  results: { label: string; value: string }[],
  extra?: CaseStudySection[],
): CaseStudySection[] {
  return [
    {
      id: "intro",
      type: "text",
      heading: "Le contexte",
      body: excerpt,
    },
    {
      id: "showreel",
      type: "media",
      url: videoUrl,
      mediaType: "video",
      fullWidth: true,
      caption: "Extrait du film livré",
    },
    ...(extra ?? []),
    {
      id: "results",
      type: "stats",
      heading: "Résultats",
      items: results,
    },
  ];
}

export const CASE_STUDY_SEED: CaseStudyInput[] = [
  {
    slug: "visite-annonce-luxe-oran",
    title: "Visite annonce de luxe",
    clientName: "Promoteur Oran",
    industry: "Immobilier",
    categoryLabel: "Immobilier · Oran",
    excerpt:
      "Film de visite cinématographique pour une résidence haut de gamme — confiance avant la visite terrain.",
    videoUrl: SCROLL_VIDEO_1,
    services: ["Reels Production", "Video Production"],
    results: [
      { label: "Vues organiques", value: "180K+" },
      { label: "Leads qualifiés", value: "34" },
      { label: "Délai de vente", value: "-40%" },
    ],
    sections: buildSeedSections(
      "Le promoteur avait besoin de rassurer les acheteurs diaspora avant le déplacement. Nous avons conçu un film de visite qui met en scène les finitions, la lumière et le quartier — sans sensation publicitaire.",
      SCROLL_VIDEO_1,
      [
        { label: "Vues organiques", value: "180K+" },
        { label: "Leads qualifiés", value: "34" },
        { label: "Délai de vente", value: "-40%" },
      ],
      [
        {
          id: "approach",
          type: "split",
          heading: "Notre approche",
          body: "Storyboard orienté confiance : plans larges du quartier, détails matière en gros plan, voix off sobre. Livraison en reels + version longue pour WhatsApp.",
          url: SCROLL_VIDEO_1,
          mediaType: "video",
          mediaPosition: "right",
        },
        {
          id: "quote",
          type: "quote",
          text: "Les acheteurs arrivent en visite déjà convaincus par le sérieux du projet.",
          attribution: "Directeur commercial, promoteur Oran",
        },
      ],
    ),
    published: true,
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "reel-marque-agent-alger",
    title: "Reel marque agent",
    clientName: "Agent immobilier",
    industry: "Marque personnelle",
    categoryLabel: "Marque personnelle · Alger",
    excerpt: "Série de reels pour positionner un agent comme référence locale sur Instagram.",
    videoUrl: SCROLL_VIDEO_2,
    services: ["Reels Production", "Social Content"],
    results: [
      { label: "Croissance abonnés", value: "+220%" },
      { label: "Engagement moyen", value: "8.4%" },
    ],
    sections: buildSeedSections(
      "Série de reels pour positionner un agent comme référence locale sur Instagram — ton expert, pas vendeur.",
      SCROLL_VIDEO_2,
      [
        { label: "Croissance abonnés", value: "+220%" },
        { label: "Engagement moyen", value: "8.4%" },
      ],
    ),
    published: true,
    featured: false,
    sortOrder: 2,
  },
  {
    slug: "combo-drone-interieur-tlemcen",
    title: "Combo drone + intérieur",
    clientName: "Résidence Tlemcen",
    industry: "Immobilier",
    categoryLabel: "Cinématographique · Tlemcen",
    excerpt: "Prises aériennes et intérieurs pour un lotissement en montagne — storytelling diaspora.",
    videoUrl: SCROLL_VIDEO_3,
    services: ["Video Production", "Photography"],
    results: [
      { label: "Réservations visite", value: "+65%" },
      { label: "Partages WhatsApp", value: "1.2K" },
    ],
    sections: buildSeedSections(
      "Prises aériennes et intérieurs pour un lotissement en montagne — storytelling diaspora et preuve de cadre de vie.",
      SCROLL_VIDEO_3,
      [
        { label: "Réservations visite", value: "+65%" },
        { label: "Partages WhatsApp", value: "1.2K" },
      ],
      [
        {
          id: "gallery",
          type: "gallery",
          heading: "Extraits du tournage",
          items: [
            { url: SCROLL_VIDEO_3, mediaType: "video", caption: "Drone + intérieur" },
            { url: SCROLL_VIDEO_2, mediaType: "video", caption: "Reel social" },
          ],
        },
      ],
    ),
    published: true,
    featured: false,
    sortOrder: 3,
  },
  {
    slug: "film-lancement-maghreb",
    title: "Film de lancement",
    clientName: "Groupe promoteur",
    industry: "Immobilier",
    categoryLabel: "Production complète · Maghreb",
    excerpt: "Film manifeste pour le lancement d'un nouveau programme — hero, reels et landing.",
    videoUrl: HERO_VIDEO_DESKTOP,
    services: ["Video Production", "Website", "Brand Identity"],
    results: [
      { label: "Taux de complétion", value: "78%" },
      { label: "Inscriptions J+7", value: "320" },
    ],
    sections: buildSeedSections(
      "Film manifeste pour le lancement d'un nouveau programme — hero, reels et landing alignés sur un seul message.",
      HERO_VIDEO_DESKTOP,
      [
        { label: "Taux de complétion", value: "78%" },
        { label: "Inscriptions J+7", value: "320" },
      ],
    ),
    published: true,
    featured: false,
    sortOrder: 4,
  },
];

export const MEDIA_ASSET_SEED = [
  {
    url: SCROLL_VIDEO_1,
    pathname: "vids/scroll-1.mp4",
    filename: "scroll-1.mp4",
    mimeType: "video/mp4",
    folder: "case-studies/videos",
    label: "Scroll reel 1",
  },
  {
    url: SCROLL_VIDEO_2,
    pathname: "vids/scroll-2.mp4",
    filename: "scroll-2.mp4",
    mimeType: "video/mp4",
    folder: "case-studies/videos",
    label: "Scroll reel 2",
  },
  {
    url: SCROLL_VIDEO_3,
    pathname: "vids/scroll-3.mp4",
    filename: "scroll-3.mp4",
    mimeType: "video/mp4",
    folder: "case-studies/videos",
    label: "Scroll reel 3",
  },
  {
    url: HERO_VIDEO_DESKTOP,
    pathname: "vids/hero.mp4",
    filename: "hero.mp4",
    mimeType: "video/mp4",
    folder: "case-studies/videos",
    label: "Hero desktop",
  },
] as const;
