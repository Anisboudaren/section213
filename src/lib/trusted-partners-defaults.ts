import { PORTFOLIO_CLIENTS } from "@/lib/portfolio-clients";

export const DEFAULT_TRUSTED_PARTNERS = PORTFOLIO_CLIENTS.map((client, index) => ({
  name: client.name,
  imageUrl: client.image,
  linkUrl: null as string | null,
  whiteFilter: client.whiteFilter ?? false,
  sortOrder: index,
  active: true,
}));
