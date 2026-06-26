"use server";

import {
  getTrustedPartnersPublic,
  getTrustedSectionCopyAdmin,
  type TrustedPartnerDto,
  type TrustedSectionCopyDto,
} from "@/lib/actions/trusted-partners";
import { PORTFOLIO_CLIENTS } from "@/lib/portfolio-clients";

export type TrustedSectionData = {
  partners: TrustedPartnerDto[];
  copy: TrustedSectionCopyDto;
};

export async function getTrustedSection(): Promise<TrustedSectionData> {
  const [partners, copyResult] = await Promise.all([
    getTrustedPartnersPublic(),
    getTrustedSectionCopyAdmin(),
  ]);

  const copy =
    copyResult.success
      ? copyResult.data
      : await fallbackCopy();

  const resolvedPartners =
    partners.length > 0
      ? partners
      : PORTFOLIO_CLIENTS.map((client, index) => ({
          id: `default-${index}`,
          name: client.name,
          imageUrl: client.image,
          whiteFilter: client.whiteFilter ?? false,
          sortOrder: index,
          active: true,
        }));

  return { partners: resolvedPartners, copy };
}

async function fallbackCopy(): Promise<TrustedSectionCopyDto> {
  const { en } = await import("@/lib/i18n/translations/en");
  const { fr } = await import("@/lib/i18n/translations/fr");
  return {
    index: en.homeV2.trusted.index,
    en: en.homeV2.trusted,
    fr: fr.homeV2.trusted,
  };
}
