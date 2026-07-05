"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { MOCK_CLIENTS } from "@/lib/mock-data/clients";
import { MOCK_LEADS } from "@/lib/mock-data/leads";
import type {
  Client,
  Lead,
} from "@/lib/types/admin";

// Replace context with TanStack Query + API routes when Neon is ready

const LEADS_STORAGE_KEY = "s213_admin_leads";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

type AdminStoreContextValue = {
  leads: Lead[];
  clients: Client[];
  addLead: (lead: Omit<Lead, "id">) => Lead;
  updateLead: (id: string, data: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addClient: (client: Omit<Client, "id">) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  upgradeLeadToClient: (leadId: string) => string;
  getLeadById: (id: string) => Lead | undefined;
  getClientById: (id: string) => Client | undefined;
};

const AdminStoreContext = createContext<AdminStoreContextValue | null>(null);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLeads(loadFromStorage(LEADS_STORAGE_KEY, MOCK_LEADS));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(LEADS_STORAGE_KEY, leads);
  }, [leads, hydrated]);

  const addLead = useCallback((lead: Omit<Lead, "id">): Lead => {
    const newLead: Lead = { ...lead, id: generateId("lead") };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  }, []);

  const updateLead = useCallback((id: string, data: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addClient = useCallback((client: Omit<Client, "id">): Client => {
    const newClient: Client = { ...client, id: generateId("client") };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  }, []);

  const updateClient = useCallback((id: string, data: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const upgradeLeadToClient = useCallback(
    (leadId: string): string => {
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) return "";

      const newClient = addClient({
        name: lead.name,
        company: lead.company ?? lead.name,
        phone: lead.phone,
        email: lead.email,
        status: "active",
        origin: "lead_upgrade",
        originLeadId: leadId,
        projectIds: [],
        notes: lead.notes,
        createdAt: new Date().toISOString(),
        showOnWebsite: false,
      });

      updateLead(leadId, { stage: "won" });
      return newClient.id;
    },
    [leads, addClient, updateLead],
  );

  const getLeadById = useCallback((id: string) => leads.find((l) => l.id === id), [leads]);
  const getClientById = useCallback((id: string) => clients.find((c) => c.id === id), [clients]);

  const value = useMemo(
    () => ({
      leads,
      clients,
      addLead,
      updateLead,
      deleteLead,
      addClient,
      updateClient,
      deleteClient,
      upgradeLeadToClient,
      getLeadById,
      getClientById,
    }),
    [
      leads,
      clients,
      addLead,
      updateLead,
      deleteLead,
      addClient,
      updateClient,
      deleteClient,
      upgradeLeadToClient,
      getLeadById,
      getClientById,
    ],
  );

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

export function useAdminStore(): AdminStoreContextValue {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) {
    throw new Error("useAdminStore must be used within AdminStoreProvider");
  }
  return ctx;
}
