import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Crosshair,
  Film,
  Handshake,
  Home,
  Image,
  MoreHorizontal,
  Package,
  Settings,
  UserPlus,
  UserX,
} from "lucide-react";

export type SidebarBadge = "newLeads" | "overdueProjects";

export type NavItemConfig = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: SidebarBadge;
  badgeColor?: "amber" | "red";
};

export type NavGroupConfig = {
  label: string | null;
  items: NavItemConfig[];
};

export const NAV_GROUPS: NavGroupConfig[] = [
  {
    label: "Vue générale",
    items: [{ label: "Dashboard", href: "/admin", icon: Home }],
  },
  {
    label: "CRM",
    items: [
      { label: "Abandoned Leads", href: "/admin/leads/abandoned", icon: UserX },
      { label: "Leads", href: "/admin/leads", icon: UserPlus, badge: "newLeads", badgeColor: "amber" },
      { label: "Clients", href: "/admin/clients", icon: Building2 },
      {
        label: "Projets",
        href: "/admin/projects",
        icon: Briefcase,
        badge: "overdueProjects",
        badgeColor: "red",
      },
    ],
  },
  {
    label: "Contenu",
    items: [
      { label: "Études de cas", href: "/admin/case-studies", icon: Film },
      { label: "Médias", href: "/admin/media", icon: Image },
      { label: "Ils nous font confiance", href: "/admin/trusted", icon: Handshake },
      { label: "Offres", href: "/admin/offers", icon: Package },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Pixels", href: "/admin/marketing/pixels", icon: Crosshair },
    ],
  },
  {
    label: "Paramètres",
    items: [
      { label: "Paramètres", href: "/admin/settings/platform", icon: Settings },
    ],
  },
];

export const HIDDEN_NAV_ITEMS = [
  { label: "Pipeline", href: "/admin/pipeline" },
  { label: "Facturation", href: "/admin/billing/invoices" },
  { label: "Équipe", href: "/admin/team/users" },
  { label: "Analytiques", href: "/admin/analytics" },
] as const;

export const MOBILE_TABS = [
  { label: "Accueil", href: "/admin", icon: Home, badge: false as const },
  { label: "Leads", href: "/admin/leads", icon: UserPlus, badge: "newLeads" as const },
  { label: "Clients", href: "/admin/clients", icon: Building2, badge: false as const },
  { label: "Projets", href: "/admin/projects", icon: Briefcase, badge: false as const },
  { label: "Plus", href: null, icon: MoreHorizontal, badge: false as const },
] as const;

export function isNavActive(href: string, pathname: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin" || pathname === "/admin/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
