export type PortfolioClient = {
  name: string;
  image: string;
  /** Invert dark logos to white for dark section backgrounds */
  whiteFilter?: boolean;
};

/** Client logos in public/portfolio/ — name derived from filename */
export const PORTFOLIO_CLIENTS: PortfolioClient[] = [
  { name: "Nova Florida", image: "/portfolio/nova florida.png" },
  { name: "Rozana Topmagic", image: "/portfolio/rozana topmagic.png" },
  { name: "Argoss", image: "/portfolio/argoss.png" },
  { name: "Selma Promotion", image: "/portfolio/selma promotion.png", whiteFilter: true },
  { name: "Ciblimmo", image: "/portfolio/ciblimmo.png", whiteFilter: true },
  { name: "Alsafa Filters", image: "/portfolio/alsafa filters.png" },
  { name: "Nardi", image: "/portfolio/nardi.png" },
  { name: "Petro Baraka", image: "/portfolio/petro baraka.png" },
];
