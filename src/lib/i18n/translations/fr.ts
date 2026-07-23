import type { Translations } from "@/lib/i18n/translations/en";
import {
  HERO_VIDEO_DESKTOP,
  SCROLL_VIDEO_1,
  SCROLL_VIDEO_2,
  SCROLL_VIDEO_3,
} from "@/lib/hero-video-sources";

export const fr: Translations = {
  language: {
    pickerTitle: "Choisissez votre langue",
    pickerSubtitle:
      "Section 213 est disponible en anglais, en français et en arabe. Choisissez votre préférence — vous pourrez la modifier à tout moment depuis le pied de page.",
    continue: "Continuer",
    switcherLabel: "Langue",
  },
  nav: {
    services: "Offres",
    portfolio: "Portfolio",
    about: "Méthode",
    problem: "Le problème",
    listingMedia: "Médias immobiliers",
    automations: "Automatisations",
    bookAShoot: "Réserver un appel",
    soundOn: "Son activé",
    tapForSound: "Appuyez pour le son",
    muteVideos: "Couper le son",
    unmuteVideos: "Activer le son",
  },
  hero: {
    location:
      "Basés à Oran, Algérie — nous accompagnons les promoteurs au Maghreb et dans le monde entier",
    headline: "Pourquoi certains projets se remplissent… et d'autres non ?",
    subheadline:
      "La majorité des acheteurs commencent à décider avant même la visite. Nous aidons les promoteurs à réduire les incertitudes qui bloquent les réservations.",
    ctaPrimary: "Choisir une offre",
    ctaSecondary: "Découvrir notre méthode",
    visualBand: ["Découverte", "Compréhension", "Confiance", "Réservation"],
    enableSound: "Activer le son",
    scroll: "Défiler",
    scrollToContent: "Défiler vers la section suivante",
  },
  reels: {
    title: "NOUS FAISONS EXPLOSER",
    titleHighlight: "VOS ANNONCES",
    themes: [
      {
        label: "Impressions",
        subtitle: "Les vues s'accumulent — votre contenu est vu.",
      },
      {
        label: "Ventes",
        subtitle: "Les prospects convertissent — chaque vue rapproche d'une vente.",
      },
      {
        label: "Succès",
        subtitle: "Votre marque gagne — annonces vendues, deals conclus, réputation renforcée.",
      },
    ],
  },
  process: {
    title: "C'EST SIMPLE COMME",
    titleHighlight: "UN, DEUX, TROIS.",
    getStarted: "Commencer",
    steps: [
      {
        title: "Réservez votre tournage",
        desc: "Réservez en ligne et dites-nous ce dont vous avez besoin.",
      },
      {
        title: "Choisissez le forfait",
        desc: "Sélectionnez le forfait adapté à votre annonce.",
      },
      {
        title: "Jour du tournage",
        desc: "Notre équipe arrive et capture tout.",
      },
      {
        title: "Livraison des médias",
        desc: "Recevez vos médias sous 24 à 48 heures.",
      },
    ],
  },
  pricing: {
    title: "CE QUE NOUS",
    titleHighlight: "PROPOSONS",
    subtitle:
      "Médias, marketing, développement et automatisations — tout ce dont votre entreprise a besoin pour briller et fonctionner plus intelligemment en ligne.",
    explorePackage: "Découvrir le forfait",
    popular: "Populaire",
    bestValue: "Meilleur rapport",
    packages: [
      {
        name: "Starter",
        features: [
          "Photographie HDR professionnelle",
          "Jusqu'à 25 images retouchées",
          "Délai standard",
        ],
      },
      {
        name: "Signatures",
        features: [
          "Tout le Starter",
          "Vidéo de visite cinématographique",
          "Photos crépuscule en option",
          "Plans d'étage",
          "Photos drone aériennes",
        ],
      },
      {
        name: "Full Stable",
        features: [
          "Tout le Signatures",
          "Vidéo de marque cinématographique",
          "Reels sociaux (3x)",
          "Vidéo + photos drone",
          "Crépuscule + plans",
          "Highlights le jour même",
        ],
      },
      {
        name: "Sur mesure",
        price: "SUR MESURE",
        features: [
          "Adapté à vos besoins",
          "Tournages sur plusieurs jours",
          "Campagnes de marque",
          "Vidéo long format",
          "Options à la carte",
        ],
      },
    ],
  },
  digital: {
    title: "AUTOMATISATION &",
    titleHighlight: "DÉVELOPPEMENT",
    subtitle:
      "Section 213 ne s'arrête pas au contenu — nous construisons les sites, apps et automatisations qui digitalisent toute votre entreprise.",
    discussBuild: "Discuter de votre projet",
    services: [
      {
        title: "Sites web",
        desc: "Sites modernes et rapides conçus pour convertir — pages d'atterrissage, portfolios et sites complets.",
      },
      {
        title: "Applications",
        desc: "Apps mobile et web adaptées à votre flux de travail, marque et clients.",
      },
      {
        title: "Automatisations",
        desc: "Connectez vos outils, éliminez le travail manuel et laissez les systèmes tourner pendant que vous grandissez.",
      },
      {
        title: "Workflows sur mesure",
        desc: "Capture de leads, onboarding client, facturation et relances — automatisés de bout en bout.",
      },
      {
        title: "Intégrations",
        desc: "CRM, paiements, analytics, pixels et plateformes tierces connectés sans friction.",
      },
      {
        title: "Développement",
        desc: "APIs, tableaux de bord, outils internes et produits digitaux conçus pour l'échelle.",
      },
    ],
  },
  creator: {
    title: "PROGRAMME",
    titleHighlight: "CRÉATEUR DE CONTENU",
    subtitle:
      "Du contenu récurrent chaque mois, centré sur vous. Soyez présent régulièrement et construisez une marque qui se renforce.",
    exploreTiers: "Découvrir les niveaux",
  },
  travel: {
    title: "PAS BASÉ À",
    titleHighlight: "ORAN ?",
    subtitle2: "PAS DE PROBLÈME.",
    subtitle:
      "Nous nous déplaçons à travers l'Algérie, le Maghreb et le monde entier pour les tournages et projets.",
    bestValue: "Meilleur rapport",
    explorePackage: "Découvrir le forfait",
  },
  trusted: {
    title: "LA CONFIANCE DES MARQUES",
    titleHighlight: "DANS LE MONDE",
  },
  stats: {
    items: [
      { value: "2 milliards $", label: "Commercialisés en immobilier" },
      { value: "2000+", label: "Tournages réalisés" },
      { value: "5 000 000+", label: "Vues générées" },
      { value: "24", label: "États desservis" },
    ],
  },
  testimonials: {
    title: "CE QUE DISENT",
    titleHighlight: "NOS CLIENTS",
  },
  faq: {
    title: "QUESTIONS",
    titleHighlight: "FRÉQUENTES",
    stillHaveQuestions: "Encore des questions ?",
    teamReply: "Notre équipe vous répond sous 24 heures.",
    contactUs: "Nous contacter",
    categories: [{ id: "general", label: "Questions fréquentes" }],
    items: {
      general: [
        {
          q: "Est-ce que vous garantissez des ventes ?",
          a: "Non — et méfiez-vous de ceux qui le promettent. Notre rôle est d'agir sur les leviers qui font avancer un acheteur : clarté de l'offre, preuve, confiance et qualification. Résultat : plus de visites, des acheteurs plus rassurés, et une meilleure probabilité de réservation avant même le rendez-vous.",
        },
        {
          q: "Êtes-vous une agence de communication ?",
          a: "Non. Une agence produit du contenu et s'arrête là. Nous installons un système : présentation de votre offre, pages structurées pour la décision, qualification des prospects, orientation rapide et suivi de ce qui bloque vos réservations.",
        },
        {
          q: "Qu'est-ce que je reçois concrètement ?",
          a: "D'abord un résultat : un projet présenté clairement et de manière crédible, des acheteurs plus confiants avant la visite, et une visibilité sur ce qui convertit. Les livrables (vidéos stratégiques, landing page, pixel de tracking, assistant IA…) sont les moyens d'y arriver — détaillés dans chaque offre.",
        },
        {
          q: "Pourquoi le pack Growth est-il « sur étude » ?",
          a: "Growth est un système complet adapté à votre projet : infrastructure digitale, reporting, Buyer Intelligence Engine™ et accompagnement stratégique. Comme le périmètre varie d'un promoteur à l'autre, le prix est fixé après une courte étude de vos besoins.",
        },
        {
          q: "Que comprend l'assistant IA (pack Authority) ?",
          a: "Il répond automatiquement aux prospects 24h/24, qualifie les demandes et accompagne les visiteurs avant la prise de contact — pour que vous ne perdiez plus aucun acheteur intéressé.",
        },
        {
          q: "Mon projet est en dehors d'Oran, est-ce possible ?",
          a: "Oui. Les projets situés hors d'Oran peuvent nécessiter des frais de déplacement et d'hébergement. Le montant est calculé automatiquement lors de la réservation, en toute transparence.",
        },
        {
          q: "Comment se passe la réservation ?",
          a: "En quelques étapes simples : vous choisissez votre date de tournage, vous présentez votre projet, vous précisez votre objectif, puis vous sélectionnez votre offre. Vous recevez un récapitulatif, puis une confirmation.",
        },
        {
          q: "Dois-je payer immédiatement ?",
          a: "À la réservation, vous validez date, projet, objectif et offre. Selon l'option choisie, un acompte peut être demandé au moment du checkout ; sinon, notre équipe vous recontacte pour finaliser.",
        },
        {
          q: "Combien de temps avant de voir des résultats ?",
          a: "Le tournage se planifie dès la réservation, et vos assets (vidéos, landing page) sont livrés rapidement pour être mis en ligne. L'objectif est simple : réduire l'incertitude de vos acheteurs le plus tôt possible.",
        },
      ],
    },
  },
  instagramCta: {
    title: "DEVENEZ L'AGENT SUR",
    titleHighlight: "INSTAGRAM",
    subtitle:
      "En 6 à 12 mois, les clients Section 213 dominent leur marché local avec un contenu cinématographique qui convertit.",
    bookACall: "Réserver un appel",
  },
  contact: {
    metaTitle: "Contact — Section 213",
    title: "Contactez",
    titleHighlight: "nous",
    subtitle: "Une question, un projet ? Notre équipe vous répond sous 24h.",
    detailsTitle: "Coordonnées",
    emptyDetails: "Les coordonnées seront bientôt disponibles.",
    address: "Adresse",
    hours: "Horaires",
    email: "Email",
    phone: "Téléphone",
    socials: "Réseaux",
    viewMap: "Voir sur la carte",
    whatsappCta: "Écrire sur WhatsApp",
    bookCta: "Réserver un appel",
    formTitle: "Envoyez un message",
    formSubtitle: "Décrivez votre projet — nous vous orientons vers la bonne offre.",
    backHome: "Retour à l'accueil",
    successTitle: "Message envoyé",
    successMessage: "Notre équipe vous contactera dans les 24h.",
    sourceFrom: "Lien depuis",
    firstName: "Prénom",
    lastName: "Nom",
    phoneLabel: "Téléphone",
    emailLabel: "Email",
    interestedIn: "Je suis intéressé par…",
    message: "Message / Projet",
    messagePlaceholder: "Décrivez brièvement votre besoin…",
    submit: "Envoyer ma demande",
    validation: {
      firstNameRequired: "Prénom requis",
      lastNameRequired: "Nom requis",
      phoneRequired: "Téléphone requis",
      emailInvalid: "Email invalide",
    },
    leadSources: {
      website: "Site web",
      instagram: "Instagram",
      facebook: "Facebook / Messenger",
      whatsapp: "WhatsApp",
      google: "Recherche Google",
      tiktok: "TikTok",
      referral: "Référence / réseau",
      cold: "Prospection directe",
      other: "Autre",
    },
    hoursDefault: "Lun–Ven 9h–18h",
  },
  footer: {
    tagline: "Digital complet pour les entreprises modernes.",
    services: "Services",
    serviceItems: [
      "Médias immobiliers",
      "Reels sociaux",
      "Stratégie marketing",
      "Sites & Apps",
      "Automatisations",
    ],
    company: "Entreprise",
    companyItems: ["À propos", "Portfolio", "Contact"],
    follow: "Suivez-nous",
    contact: "Contact",
    rights: "© 2026 Section 213. Tous droits réservés.",
  },
  homeV2: {
    method: {
      index: "002",
      title: "LA",
      titleHighlight: "MÉTHODE 213",
      subtitle:
        "Quatre étapes qui transforment un contenu qui capte l'attention en momentum business réel.",
      steps: [
        {
          title: "Attention",
          desc: "Accrochez le fil en une seconde — des visuels cinématographiques faits pour stopper le scroll.",
        },
        {
          title: "Perception",
          desc: "Façonnez l'image de votre marque — premium, cohérente, impossible à confondre.",
        },
        {
          title: "Confiance",
          desc: "Apportez la preuve et la régularité pour que vos clients vous fassent confiance avant même de vous écrire.",
        },
        {
          title: "Opportunité",
          desc: "Convertissez l'attention en leads, annonces et revenus — du contenu qui conclut.",
        },
      ],
    },
    trusted: {
      index: "003",
      title: "ILS NOUS FONT",
      titleHighlight: "DÉJÀ CONFIANCE",
      subtitle:
        "Des opérateurs et marques qui misent sur un contenu qui performe — pas seulement qui plaît.",
    },
    solutions: {
      index: "004",
      title: "NOS",
      titleHighlight: "SOLUTIONS",
      subtitle:
        "Média, marketing et builds digitaux complets — une seule équipe du tournage à l'automatisation.",
      items: [
        {
          title: "Médias immobiliers",
          desc: "Photo, vidéo, drone et reels conçus pour la viralité.",
        },
        {
          title: "Contenu de marque",
          desc: "Programmes créateurs et campagnes mensuelles qui amplifient votre portée.",
        },
        {
          title: "Sites & apps",
          desc: "Produits digitaux modernes, rapides et pensés pour convertir.",
        },
        {
          title: "Automatisations",
          desc: "CRM, leads et workflows connectés pour que votre business tourne pendant que vous créez.",
        },
      ],
      cta: "Voir les forfaits",
    },
    caseStudies: {
      index: "005",
      title: "ÉTUDES DE",
      titleHighlight: "CAS",
      subtitle: "Travaux récents — livraison cinématographique, portée mesurable.",
      items: [
        {
          title: "Visite annonce de luxe",
          category: "Immobilier · Oran",
          media: SCROLL_VIDEO_1,
        },
        {
          title: "Reel marque agent",
          category: "Marque personnelle · Alger",
          media: SCROLL_VIDEO_2,
        },
        {
          title: "Combo drone + intérieur",
          category: "Cinématographique · Tlemcen",
          media: SCROLL_VIDEO_3,
        },
        {
          title: "Film de lancement",
          category: "Production complète · Maghreb",
          media: HERO_VIDEO_DESKTOP,
        },
      ],
    },
    why: {
      index: "004",
      title: "POURQUOI",
      titleHighlight: "SECTION 213",
      subtitle:
        "Un studio pour le contenu, le code et la croissance — conçu pour les opérateurs qui avancent vite.",
      points: [
        {
          title: "Créatif full-stack",
          desc: "Photo, vidéo, social, web et automatisations sous un même toit — zéro handoff.",
        },
        {
          title: "Conçu pour devenir viral",
          desc: "Chaque livrable est structuré pour l'algorithme et le parcours acheteur.",
        },
        {
          title: "Racines Maghreb, portée mondiale",
          desc: "Basés à Oran, tournages locaux et déplacements worldwide pour votre marque.",
        },
        {
          title: "Rapidité sans compromis",
          desc: "Livraison média 24–48h et sprints dev agiles quand il faut shipper.",
        },
      ],
    },
    problem: {
      index: "001",
      title: "POURQUOI LES ACHETEURS",
      titleHighlight: "HÉSITENT-ILS ?",
      subtitle: "Pourquoi les acheteurs hésitent-ils avant de réserver ?",
      paragraphs: [
        "Aujourd'hui, la décision commence bien avant la visite.",
        "Un acheteur découvre votre projet.",
        "Il regarde.",
        "Il compare.",
        "Il se fait une opinion.",
        "En quelques secondes.",
        "Et avant même de parler à un commercial, il décide déjà :",
        "« Est-ce que je peux avancer sans risque ? »",
      ],
      closingBefore: "La plupart des projets essaient de générer plus d'attention.",
      closingHighlight: "Les meilleurs réduisent l'incertitude avant la visite.",
      channels: ["Instagram", "Facebook", "Landing", "Ads", "Videos", "Stories"],
      follow: "Suivre",
      reelSounds: [
        "Son original — Section 213",
        "Audio tendance — Section 213",
        "Mix viral — Section 213",
      ],
    },
    offers: {
      index: "005",
      title: "NOS",
      titleHighlight: "OFFRES",
      intro: "Choisissez votre objectif.",
      priceFrom: "À partir de",
      pricesStartFrom: "À partir de",
      seeDetails: "Voir le détail",
      hideDetails: "Masquer le détail",
      packPrice: "Pack",
      totalValue: "Valeur totale",
      alaCarteTitle: "Services à la carte",
      cartValueTitle: "Valeur à la carte",
      travelNote:
        "Les projets situés en dehors d'Oran peuvent nécessiter des frais de déplacement et d'hébergement. Le montant est calculé lors de la réservation.",
    },
    bookCta: {
      index: "006",
      title: "Réservez un appel découverte.",
      subtitle:
        "Choisissez une date, présentez votre projet et sélectionnez votre offre — nous vous appellerons pour planifier la suite.",
      cta: "Réserver un appel",
    },
  },
  booking: {
    title: "Réservez un appel découverte.",
    steps: ["Appel", "Projet", "Objectif", "Offre", "Récap"],
    next: "Suivant",
    previous: "Précédent",
    select: "Sélectionner",
    recommended: "Recommandé",
    alaCarteTitle: "Services à la carte",
    flexibleDate: "Je suis flexible sur la date d'appel",
    preferredTimeSlot: "Créneau d'appel préféré",
    descriptionPlaceholder: "Décrivez votre projet…",
    projectName: "Nom du projet",
    projectNamePlaceholder: "Ex. Résidence Les Oliviers",
    location: "Localisation",
    locationPlaceholder: "Quartier, commune…",
    projectTypeLabel: "Type de projet",
    descriptionLabel: "Description du projet",
    optional: "optionnel",
    uploads: {
      title: "Fichiers utiles",
      plans: "Fichier AutoCAD",
      visuels: "Catalogue",
      logo: "Logo",
      documents: "Charte graphique",
      uploading: "Envoi en cours…",
      add: "Ajouter un fichier",
    },
    descriptionRemaining: "Encore {count} caractères requis dans la description.",
    wilaya: "Wilaya",
    wilayaPlaceholder: "Sélectionnez votre wilaya",
    travelNote:
      "Les projets situés en dehors d'Oran peuvent nécessiter des frais de déplacement et d'hébergement.",
    timeSlots: {
      matin: "Matin",
      apres_midi: "Après-midi",
      flexible: "Flexible",
    },
    contact: {
      fullName: "Nom complet",
      phone: "Téléphone",
      email: "Email (optionnel)",
      company: "Entreprise (optionnel)",
    },
    deposit: {
      title: "Décision acompte",
      optionA: "Option A — Sans acompte",
      optionADesc:
        "Confirmation par l'équipe, sans paiement immédiat. Manquer votre appel programmé vous empêchera de choisir cette option lors de futures réservations.",
      optionB: "Option B — Acompte 50%",
      optionBDesc: "Réservez votre créneau d'appel avec un acompte",
      methodTitle: "Mode de paiement",
      cash: "Espèces en main",
      transferReceipt: "Reçu Baridi Mob / CCP",
      transferProof: "Justificatif de virement",
      transferProofHint:
        "Téléversez une photo ou un PDF de votre reçu Baridi Mob ou CCP.",
      transferProofUploading: "Envoi du reçu…",
      transferProofAdd: "Ajouter le reçu",
      transferProofUploaded: "Reçu ajouté",
    },
    recap: {
      title: "Récapitulatif",
      hint: "Vérifiez les informations avant de confirmer votre réservation d'appel.",
      pricingTitle: "Estimation tarifaire",
      contactTitle: "Vos coordonnées",
      submit: "Réserver mon appel",
      submitting: "Réservation de l'appel…",
    },
    projectTypes: {
      residence: "Résidence",
      lotissement: "Lotissement",
      immeuble: "Immeuble",
      villa: "Villa",
      commercial: "Commercial",
      other: "Autre",
    },
    objectives: {
      visites: "Générer plus de visites",
      vendre_vite: "Vendre plus rapidement",
      confiance: "Renforcer la confiance",
      diaspora: "Attirer la diaspora",
      nouveau_projet: "Lancer un nouveau projet",
      autre: "Autre",
    },
    charCount: "{count}/500",
    phoneHint: "Format algérien : +213 ou 0…",
    gdprNote:
      "En soumettant ce formulaire, vous acceptez que Section 213 vous contacte concernant votre demande.",
    confirmation: {
      title: "Appel réservé",
      message:
        "Votre réservation d'appel est confirmée. Notre équipe vous appellera à la date et au créneau choisis.",
      home: "Retour à l'accueil",
      portfolio: "Voir nos réalisations",
    },
    summary: {
      date: "Date d'appel",
      time: "Heure d'appel",
      project: "Projet",
      projectName: "Nom du projet",
      location: "Localisation",
      objective: "Objectif",
      offer: "Offre",
      options: "Options à la carte",
      wilaya: "Wilaya",
      contact: "Contact",
      deposit: "Acompte",
      files: "Fichiers",
      total: "Total estimé",
    },
    validation: {
      required: "Ce champ est requis",
      min48h: "La date d'appel doit être au moins 48h dans le futur",
      min10: "Minimum 10 caractères",
      max500: "Maximum 500 caractères",
      min2: "Minimum 2 caractères",
      phone: "Numéro invalide",
      phoneFormat: "Format algérien (+213 ou 0…)",
      email: "Email invalide",
      fileRequired: "Ajoutez au moins un fichier (AutoCAD, catalogue, logo ou charte graphique)",
      proofRequired: "Ajoutez une photo ou un PDF de votre reçu de virement",
    },
  },
  caseStudiesPage: {
    metaTitle: "Études de cas — Section 213",
    metaDescription: "Contenus cinématographiques immobiliers qui renforcent la confiance avant la visite.",
    backHome: "Accueil",
    heroIndex: "PORTFOLIO",
    title: "ÉTUDES DE",
    titleHighlight: "CAS",
    subtitle: "Travaux récents — livraison cinématographique, portée mesurable.",
    featured: "À la une",
    viewProject: "Voir le projet",
    results: "Résultats",
    services: "Services",
    client: "Client",
    bookCta: "Lancer mon projet",
    contactCta: "Nous contacter",
    notFound: "Étude de cas introuvable",
    notFoundDesc: "Ce projet a peut-être été retiré ou n'est plus publié.",
    backToPortfolio: "Retour au portfolio",
  },
};
