import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Contact,
  GitBranch,
  ClipboardList,
  FileText,
  Inbox,
  Wrench,
  Camera,
  Megaphone,
  Handshake,
  Globe,
  Bot,
  FolderKanban,
  ListTodo,
  Calendar,
  Image,
  FolderOpen,
  Briefcase,
  Target,
  Crosshair,
  Zap,
  PieChart,
  BarChart3,
  TrendingUp,
  LineChart,
  FileBarChart,
  Download,
  Mail,
  MessageSquare,
  Bell,
  Receipt,
  FileSignature,
  CreditCard,
  Shield,
  KeyRound,
  UserCog,
  ScrollText,
  Plug,
  Settings,
  User,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  highlight?: string;
  description: string;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const adminNavSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
        highlight: "Dashboard",
        description: "KPIs, recent activity, alerts, and quick actions across the platform.",
      },
    ],
  },
  {
    label: "CRM",
    items: [
      {
        title: "Clients",
        url: "/admin/clients",
        icon: Users,
        description: "Active business accounts and ongoing relationships.",
      },
      {
        title: "Leads",
        url: "/admin/leads",
        icon: UserPlus,
        description: "Pre-sale prospects and inbound opportunities.",
      },
      {
        title: "Case Studies",
        url: "/admin/case-studies",
        icon: FolderOpen,
        description: "Portfolio case studies for the public website.",
      },
      {
        title: "Media Library",
        url: "/admin/media",
        icon: Image,
        description: "Browse and reuse uploaded blob assets across the admin.",
      },
      {
        title: "Trusted Section",
        url: "/admin/trusted",
        icon: Handshake,
        description: "Homepage “They already trust us” logos, links, and copy.",
      },
      {
        title: "Contacts",
        url: "/admin/contacts",
        icon: Contact,
        description: "People tied to clients, leads, and projects.",
      },
      {
        title: "Pipeline",
        url: "/admin/pipeline",
        icon: GitBranch,
        description: "Deal stages across photography, marketing, digital, and more.",
      },
      {
        title: "Onboarding",
        url: "/admin/onboarding",
        icon: ClipboardList,
        description: "New client intake status and onboarding checklists.",
      },
    ],
  },
  {
    label: "Forms",
    items: [
      {
        title: "Form Templates",
        url: "/admin/forms/templates",
        icon: FileText,
        description: "Reusable intake forms and questionnaires.",
      },
      {
        title: "Submissions",
        url: "/admin/forms/submissions",
        icon: Inbox,
        description: "Completed form responses and client submissions.",
      },
      {
        title: "Form Builder",
        url: "/admin/forms/builder",
        icon: Wrench,
        description: "Visual form builder for custom client intake flows.",
      },
    ],
  },
  {
    label: "Services",
    items: [
      {
        title: "Service Catalog",
        url: "/admin/services",
        icon: LayoutDashboard,
        description: "All offerings, packages, and service definitions.",
      },
      {
        title: "Offers",
        url: "/admin/offers",
        icon: Briefcase,
        description: "Public-facing offers for Solutions and booking flow.",
      },
      {
        title: "Photography & Media",
        url: "/admin/services/photography",
        icon: Camera,
        description: "Shoots, deliverables, and media production jobs.",
      },
      {
        title: "Marketing Strategy",
        url: "/admin/services/marketing",
        icon: Megaphone,
        description: "Campaign plans, content strategy, and growth initiatives.",
      },
      {
        title: "Sponsors & Partners",
        url: "/admin/services/sponsors",
        icon: Handshake,
        description: "Sponsor deals, partnerships, and co-marketing programs.",
      },
      {
        title: "Websites & Apps",
        url: "/admin/services/digital",
        icon: Globe,
        description: "Web and app projects, builds, and launches.",
      },
      {
        title: "Automations",
        url: "/admin/services/automations",
        icon: Bot,
        description: "Workflows, integrations, and business automations.",
      },
    ],
  },
  {
    label: "Projects",
    items: [
      {
        title: "All Projects",
        url: "/admin/projects",
        icon: FolderKanban,
        description: "Cross-service project list and status overview.",
      },
      {
        title: "Tasks",
        url: "/admin/projects/tasks",
        icon: ListTodo,
        description: "Team task board and assignments.",
      },
      {
        title: "Calendar",
        url: "/admin/projects/calendar",
        icon: Calendar,
        description: "Shoots, deadlines, launches, and team schedule.",
      },
      {
        title: "Assets & Media",
        url: "/admin/projects/assets",
        icon: Image,
        description: "Files, galleries, and client deliverables.",
      },
    ],
  },
  {
    label: "Marketing & Pixels",
    items: [
      {
        title: "Campaigns",
        url: "/admin/marketing/campaigns",
        icon: Target,
        description: "Paid and organic campaign management.",
      },
      {
        title: "Tracking Pixels",
        url: "/admin/marketing/pixels",
        icon: Crosshair,
        description: "Meta, GA4, TikTok, and custom tracking pixels.",
      },
      {
        title: "Conversion Events",
        url: "/admin/marketing/events",
        icon: Zap,
        description: "Event mapping, firing rules, and conversion tracking.",
      },
      {
        title: "Attribution",
        url: "/admin/marketing/attribution",
        icon: PieChart,
        description: "UTM tracking and multi-channel attribution.",
      },
      {
        title: "Audiences",
        url: "/admin/marketing/audiences",
        icon: Users,
        description: "Retargeting segments and audience lists.",
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        title: "Analytics Overview",
        url: "/admin/analytics",
        icon: BarChart3,
        highlight: "Overview",
        description: "Executive summary and platform-wide performance metrics.",
      },
      {
        title: "Revenue & Billing",
        url: "/admin/analytics/revenue",
        icon: TrendingUp,
        description: "MRR, invoices, lifetime value, and revenue trends.",
      },
      {
        title: "Client Growth",
        url: "/admin/analytics/clients",
        icon: Users,
        description: "Acquisition, churn, retention, and client health.",
      },
      {
        title: "Service Performance",
        url: "/admin/analytics/services",
        icon: LineChart,
        description: "Which services convert, retain, and drive revenue.",
      },
      {
        title: "Marketing ROI",
        url: "/admin/analytics/marketing",
        icon: Target,
        description: "Ad spend vs. pipeline and revenue outcomes.",
      },
      {
        title: "Form Conversions",
        url: "/admin/analytics/forms",
        icon: FileBarChart,
        description: "Funnel from form submission to signed client.",
      },
      {
        title: "Pixel & Event Data",
        url: "/admin/analytics/pixels",
        icon: Crosshair,
        description: "Raw event streams, trends, and pixel diagnostics.",
      },
      {
        title: "Custom Reports",
        url: "/admin/analytics/reports",
        icon: FileText,
        description: "Saved reports and custom analysis views.",
      },
      {
        title: "Data Exports",
        url: "/admin/analytics/exports",
        icon: Download,
        description: "CSV exports and scheduled data delivery.",
      },
    ],
  },
  {
    label: "Communications",
    items: [
      {
        title: "Inbox",
        url: "/admin/communications/inbox",
        icon: Mail,
        description: "Client messages, threads, and conversation history.",
      },
      {
        title: "Message Templates",
        url: "/admin/communications/templates",
        icon: MessageSquare,
        description: "Email and SMS templates for client outreach.",
      },
      {
        title: "Notifications",
        url: "/admin/communications/notifications",
        icon: Bell,
        description: "System alerts and user notification preferences.",
      },
    ],
  },
  {
    label: "Billing",
    items: [
      {
        title: "Invoices",
        url: "/admin/billing/invoices",
        icon: Receipt,
        description: "Billing history and payment status.",
      },
      {
        title: "Quotes & Proposals",
        url: "/admin/billing/quotes",
        icon: FileSignature,
        description: "Pre-sale pricing, proposals, and approvals.",
      },
      {
        title: "Subscriptions",
        url: "/admin/billing/subscriptions",
        icon: CreditCard,
        description: "Recurring plans and subscription management.",
      },
    ],
  },
  {
    label: "Team & Access",
    items: [
      {
        title: "Organization",
        url: "/admin/team",
        icon: Users,
        description: "Team org chart, roles, and responsibilities.",
      },
      {
        title: "Users",
        url: "/admin/team/users",
        icon: UserCog,
        description: "Staff accounts and team member profiles.",
      },
      {
        title: "Roles & Permissions",
        url: "/admin/team/roles",
        icon: Shield,
        description: "Role-based access control and permission matrix.",
      },
      {
        title: "Invitations",
        url: "/admin/team/invitations",
        icon: KeyRound,
        description: "Pending team invites and onboarding links.",
      },
      {
        title: "Audit Log",
        url: "/admin/team/audit",
        icon: ScrollText,
        description: "Activity history and change audit trail.",
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "Integrations",
        url: "/admin/settings/integrations",
        icon: Plug,
        description: "Stripe, Meta, Google, and third-party connections.",
      },
      {
        title: "Platform Settings",
        url: "/admin/settings/platform",
        icon: Settings,
        description: "Organization name, defaults, and platform branding.",
      },
      {
        title: "My Profile",
        url: "/admin/settings/profile",
        icon: User,
        description: "Your account preferences and personal settings.",
      },
    ],
  },
];

export const allNavItems: NavItem[] = adminNavSections.flatMap((section) => section.items);

export function getPageMeta(url: string): NavItem | undefined {
  return allNavItems.find((item) => item.url === url);
}

export function isNavItemActive(itemUrl: string, pathname: string): boolean {
  if (itemUrl === "/admin") {
    return pathname === "/admin" || pathname === "/admin/";
  }
  return pathname === itemUrl || pathname.startsWith(`${itemUrl}/`);
}
