import type { Project } from "@/lib/types/admin";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Q1 Reels Campaign",
    clientId: "client-1",
    status: "active",
    dueDate: "2026-04-15",
    createdAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "proj-2",
    name: "Website Redesign",
    clientId: "client-1",
    status: "active",
    dueDate: "2026-05-01",
    createdAt: "2026-02-01T09:00:00.000Z",
  },
  {
    id: "proj-3",
    name: "Brand Refresh",
    clientId: "client-2",
    status: "completed",
    createdAt: "2025-11-20T14:00:00.000Z",
  },
  {
    id: "proj-4",
    name: "Product Launch Video",
    clientId: "client-3",
    status: "active",
    dueDate: "2026-03-30",
    createdAt: "2026-02-15T11:00:00.000Z",
  },
  {
    id: "proj-5",
    name: "Social Content Retainer",
    clientId: "client-4",
    status: "active",
    dueDate: "2026-06-30",
    createdAt: "2026-01-05T08:00:00.000Z",
  },
  {
    id: "proj-6",
    name: "E-commerce Integration",
    clientId: "client-5",
    status: "on_hold",
    createdAt: "2025-12-01T16:00:00.000Z",
  },
];
