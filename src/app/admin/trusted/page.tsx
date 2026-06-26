import { TrustedSectionView } from "@/components/admin/trusted/TrustedSectionView";
import {
  getTrustedPartnersAdmin,
  getTrustedSectionCopyAdmin,
} from "@/lib/actions/trusted-partners";
import { en } from "@/lib/i18n/translations/en";
import { fr } from "@/lib/i18n/translations/fr";

export default async function TrustedSectionAdminPage() {
  const [partnersResult, copyResult] = await Promise.all([
    getTrustedPartnersAdmin(),
    getTrustedSectionCopyAdmin(),
  ]);

  const partners = partnersResult.success ? partnersResult.data : [];
  const copy = copyResult.success
    ? copyResult.data
    : {
        index: en.homeV2.trusted.index,
        en: en.homeV2.trusted,
        fr: fr.homeV2.trusted,
      };

  return <TrustedSectionView initialPartners={partners} initialCopy={copy} />;
}
