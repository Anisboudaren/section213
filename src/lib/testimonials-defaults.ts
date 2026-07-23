export type DefaultTestimonial = {
  name: string;
  role: string;
  company: string;
  quoteEn: string;
  quoteFr: string;
  quoteAr: string | null;
  photoUrl: string | null;
  instagramHandle: string | null;
  email: string | null;
  sortOrder: number;
  active: boolean;
};

export const DEFAULT_TESTIMONIALS: DefaultTestimonial[] = [
  {
    name: "Youcef Bouaalm",
    role: "Responsable marketing",
    company: "Benamar Promotion · Hôtel Bladi",
    quoteFr:
      "Section 213 a compris nos enjeux dès le premier brief. Entre Benamar Promotion et Hôtel Bladi, ils ont livré des contenus qui renforcent réellement la confiance de nos clients avant même la première visite.",
    quoteEn:
      "Section 213 understood our challenges from the very first brief. Across Benamar Promotion and Hôtel Bladi, they delivered content that genuinely builds our clients' trust before they even visit.",
    quoteAr:
      "فهم فريق Section 213 تحدياتنا منذ أول اجتماع. بين Benamar Promotion وفندق Bladi، قدّموا محتوى يعزز فعلاً ثقة عملائنا حتى قبل الزيارة الأولى.",
    photoUrl: null,
    instagramHandle: "youcefbm",
    email: null,
    sortOrder: 0,
    active: true,
  },
  {
    name: "Abderrahim Bennabi",
    role: "Directeur marketing",
    company: "Chiali Trading · Nova Florida",
    quoteFr:
      "Un vrai partenaire stratégique. La qualité de production et la rigueur de Section 213 nous ont permis d'aligner l'image de Chiali Trading et Nova Florida sur nos ambitions.",
    quoteEn:
      "A true strategic partner. Section 213's production quality and rigor helped us align the image of Chiali Trading and Nova Florida with our ambitions.",
    quoteAr:
      "شريك استراتيجي حقيقي. جودة الإنتاج واحترافية Section 213 مكّنتانا من جعل صورة Chiali Trading وNova Florida في مستوى طموحاتنا.",
    photoUrl: null,
    instagramHandle: "benn_rahim",
    email: null,
    sortOrder: 1,
    active: true,
  },
  {
    name: "Eyes of Sylia",
    role: "Diplômée avocate & créatrice de contenu",
    company: "De Nice à Oran",
    quoteFr:
      "Travailler avec Section 213, c'est simple et efficace : une équipe à l'écoute, des contenus soignés et un rendu qui me ressemble vraiment. Je recommande les yeux fermés !",
    quoteEn:
      "Working with Section 213 is simple and efficient: a team that truly listens, polished content, and a result that actually feels like me. I recommend them with my eyes closed!",
    quoteAr:
      "العمل مع Section 213 سهل وفعّال: فريق يستمع فعلاً، محتوى متقن، ونتيجة تشبهني حقاً. أنصح بهم وأنا مغمضة العينين!",
    photoUrl: null,
    instagramHandle: "eyes.of.sylia",
    email: "eyesofsylia@gmail.com",
    sortOrder: 2,
    active: true,
  },
  {
    name: "Younes Boukil",
    role: "Fondateur",
    company: "BKL Real Estate · BKL Immobilier Algérie",
    quoteFr:
      "Dans l'immobilier, la confiance fait tout. Section 213 a donné à BKL une image à la hauteur de nos projets, de Dubaï jusqu'en Algérie.",
    quoteEn:
      "In real estate, trust is everything. Section 213 gave BKL an image that matches the scale of our projects, from Dubai to Algeria.",
    quoteAr:
      "في العقار، الثقة هي كل شيء. منح فريق Section 213 علامة BKL صورة في مستوى مشاريعنا، من دبي إلى الجزائر.",
    photoUrl: null,
    instagramHandle: "bkl.realestate",
    email: null,
    sortOrder: 3,
    active: true,
  },
];
