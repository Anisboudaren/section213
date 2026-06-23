export const adminEn = {
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    actions: "Actions",
    all: "All",
    yes: "Yes",
    no: "No",
    loading: "Loading…",
    noResults: "No results found",
    confirm: "Confirm",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    copy: "Copy",
    copied: "Copied!",
    uploadComingSoon: "Upload coming soon",
    view: "View",
    create: "Create",
    update: "Update",
    required: "Required",
    optional: "Optional",
    status: "Status",
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    notes: "Notes",
    created: "Created",
    published: "Published",
    draft: "Draft",
    active: "Active",
    inactive: "Inactive",
    featured: "Featured",
    order: "Order",
    description: "Description",
    industry: "Industry",
    revenue: "Revenue",
    projects: "Projects",
    overview: "Overview",
    kanban: "Kanban",
    list: "List",
    grid: "Grid",
    selectAll: "Select all",
    clearFilters: "Clear filters",
    linkProject: "Link Project",
    viewSourceLead: "View Source Lead",
    showOnWebsite: "Show on website",
    fixedPrice: "Fixed price",
    customLabel: "Custom label",
    priceLabel: "Price label",
    price: "Price",
    features: "Features",
    services: "Services",
    results: "Results",
    addRow: "Add row",
    removeRow: "Remove",
    activityLog: "Activity log",
    noActivity: "No activity recorded yet.",
    comingSoon: "Coming soon",
  },
  nav: {
    dashboard: "Dashboard",
    leads: "Leads",
    clients: "Clients",
    caseStudies: "Case Studies",
    offers: "Offers",
    projects: "Projects",
    pixels: "Pixels",
    team: "Team",
    settings: "Settings",
    search: "Search",
    help: "Help & Support",
    signOut: "Sign out",
    adminCrm: "Admin CRM",
  },
  permissions: {
    managersOnly: "Only managers can do this.",
    noBillingAccess: "Billing access restricted.",
    tasksOnly: "You have tasks-only access.",
  },
  leads: {
    title: "Leads",
    addLead: "Add Lead",
    editLead: "Edit Lead",
    count: "{count} leads",
    newCount: "{count} new",
    searchPlaceholder: "Search leads…",
    filterSource: "Filter by source",
    filterStage: "Filter by stage",
    upgradeToClient: "Upgrade to Client",
    upgradeConfirmTitle: "Upgrade to Client?",
    upgradeConfirmDescription:
      "This will create a new client record from {name} and mark the lead as won.",
    upgradeConfirm: "Yes, upgrade",
    assignedTo: "Assigned to",
    unassigned: "Unassigned",
    lastContacted: "Last contacted",
    interestedIn: "Interested in",
    sourceSection: "Source & Tracking",
    utmCampaign: "UTM Campaign",
    utmMedium: "UTM Medium",
    pixelEvent: "Pixel event fired",
    stage: "Stage",
    emptyTitle: "No leads yet",
    emptyDescription: "Add your first lead or wait for inbound bookings.",
    stages: {
      new: "New",
      contacted: "Contacted",
      qualified: "Qualified",
      proposal_sent: "Proposal Sent",
      won: "Won",
      lost: "Lost",
    },
    sources: {
      instagram: "Instagram",
      tiktok: "TikTok",
      facebook: "Facebook",
      google: "Google",
      referral: "Referral",
      website: "Website",
      cold: "Cold Outreach",
      other: "Other",
    },
    activity: {
      created: "Lead created",
      contacted: "Marked as contacted",
      stageChanged: "Stage changed to {stage}",
      assigned: "Assigned to {name}",
    },
  },
  clients: {
    title: "Clients",
    addClient: "Add Client",
    editClient: "Edit Client",
    count: "{count} clients",
    searchPlaceholder: "Search clients…",
    filterStatus: "Filter by status",
    activeProjects: "Active projects",
    totalRevenue: "Total revenue",
    origin: "Origin",
    originLead: "Lead upgrade",
    originDirect: "Direct",
    emptyTitle: "No clients yet",
    emptyDescription: "Upgrade a lead or add a client manually.",
    statuses: {
      active: "Active",
      inactive: "Inactive",
      vip: "VIP",
    },
    tabs: {
      overview: "Overview",
      projects: "Projects",
      notes: "Notes",
    },
    notFound: "Client not found",
    notFoundDescription: "This client may have been removed.",
  },
  caseStudies: {
    title: "Case Studies",
    addCaseStudy: "Add Case Study",
    editCaseStudy: "Edit Case Study",
    count: "{count} case studies",
    clientName: "Client name",
    clientOverride: "Client name override",
    selectClient: "Select client",
    videoUrl: "Video URL",
    thumbnailUrl: "Thumbnail URL",
    emptyTitle: "No case studies yet",
    emptyDescription: "Create your first case study to showcase on the website.",
    publishToggle: "Published on website",
    dragToReorder: "Drag to reorder (visual only)",
  },
  offers: {
    title: "Offers",
    addOffer: "Add Offer",
    editOffer: "Edit Offer",
    deleteOffer: "Delete Offer",
    deleteConfirm: "Are you sure you want to delete this offer?",
    slug: "Slug",
    category: "Category",
    nameAr: "Name (Arabic)",
    nameFr: "Name (French)",
    descriptionFr: "Description (French)",
    featuresFr: "Features (French)",
    cta: "CTA label",
    emptyTitle: "No offers in this category",
    emptyDescription: "Add an offer to make it available on the public site.",
    drivesPublicSite:
      "This data drives the public / Solutions section and /book flow when i18n is migrated.",
    categories: {
      media: "Media",
      brand_content: "Brand & Content",
      websites_apps: "Websites & Apps",
      automations: "Automations",
    },
  },
  pixels: {
    title: "Pixel & Tracking",
    description: "Configure tracking pixels for Meta, TikTok, GA4, and more.",
    testMode: "Test mode",
    testModeWarning:
      "Test mode is enabled. Pixels will not fire real events in production.",
    testModeDescription: "Disable real pixel firing for development.",
    save: "Save configuration",
    saved: "Pixel configuration saved.",
    copyId: "Copy ID",
    platforms: {
      meta: "Meta Pixel",
      tiktok: "TikTok Pixel",
      ga4: "Google Analytics 4",
      google_ads: "Google Ads",
      snapchat: "Snapchat Pixel",
    },
    helpers: {
      meta: "Find in Meta Events Manager → Data Sources → your pixel ID.",
      tiktok: "Find in TikTok Ads Manager → Assets → Events → Web Events.",
      ga4: "Find in Google Analytics → Admin → Data Streams → Measurement ID.",
      google_ads: "Find in Google Ads → Tools → Conversions → Tag setup.",
      snapchat: "Find in Snapchat Ads Manager → Events Manager → Pixel ID.",
    },
    accessToken: "Access Token (Conversions API)",
    accessTokenPlaceholder: "Placeholder — connect via API when backend is ready",
    statusActive: "Active",
    statusInactive: "Inactive",
    enable: "Enable",
    disable: "Disable",
    layoutTodo:
      "TODO: read activePixels from DB/API and inject in layout.tsx head",
  },
  team: {
    title: "Team",
    description: "Organization structure and role responsibilities.",
    reportsTo: "Reports to",
    responsibilities: "Responsibilities",
    accessLevel: "Access level",
    noReports: "No direct reports",
    accessLevels: {
      full: "Full access",
      full_no_billing: "Full (no billing)",
      tasks_only: "Tasks only",
    },
    roles: {
      ceo: "CEO",
      cto: "CTO",
      web_dev: "Web Developer",
      videographer: "Videographer",
      designer: "Designer",
    },
  },
  projects: {
    title: "Projects",
    scaffold: "Projects module scaffold — full implementation coming soon.",
    status: {
      active: "Active",
      completed: "Completed",
      on_hold: "On Hold",
    },
  },
  table: {
    sortAsc: "Sort ascending",
    sortDesc: "Sort descending",
    noData: "No data to display",
  },
  form: {
    validation: {
      required: "This field is required",
      email: "Enter a valid email",
      phone: "Enter a valid phone number",
      minLength: "Must be at least {min} characters",
      maxLength: "Must be at most {max} characters",
    },
  },
} as const;

export type AdminTranslations = typeof adminEn;

type NestedKeyOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

export type AdminKey = NestedKeyOf<AdminTranslations>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function adminT(
  key: AdminKey,
  vars?: Record<string, string | number>,
): string {
  let text = getNestedValue(adminEn as unknown as Record<string, unknown>, key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return text;
}
