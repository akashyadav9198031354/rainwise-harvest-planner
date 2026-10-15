import { useCallback, useEffect, useState } from "react";
import { DEFAULT_MAINTENANCE, type ImpactRecord, type MaintenanceItem, type SiteProfile } from "./rainwater";

const KEYS = { sites: "r2r.sites", records: "r2r.records", maint: "r2r.maintenance", active: "r2r.activeSite" };
const EVT = "r2r-storage";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(EVT));
    return true;
  } catch {
    return false;
  }
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setValue(read(key, fallback));
    sync();
    setReady(true);
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback((next: T) => write(key, next), [key]);
  return [value, set, ready] as const;
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function useSites() {
  const [sites, setSites, ready] = useStored<SiteProfile[]>(KEYS.sites, []);
  const [activeId, setActiveId] = useStored<string | null>(KEYS.active, null);
  const active = sites.find((s) => s.id === activeId) ?? sites[0] ?? null;
  return {
    ready,
    sites,
    active,
    setActive: (id: string) => setActiveId(id),
    save: (site: SiteProfile) => {
      const exists = sites.some((s) => s.id === site.id);
      const ok = setSites(exists ? sites.map((s) => (s.id === site.id ? site : s)) : [...sites, site]);
      setActiveId(site.id);
      return ok;
    },
    remove: (id: string) => {
      setSites(sites.filter((s) => s.id !== id));
      if (activeId === id) setActiveId(null);
    },
  };
}

export function useRecords() {
  const [records, setRecords, ready] = useStored<ImpactRecord[]>(KEYS.records, []);
  return {
    ready,
    records,
    add: (r: ImpactRecord) => setRecords([...records, r]),
    addMany: (rs: ImpactRecord[]) => setRecords([...records, ...rs]),
    remove: (id: string) => setRecords(records.filter((r) => r.id !== id)),
    clearDemo: (siteId: string) => setRecords(records.filter((r) => !(r.isDemoData && r.siteId === siteId))),
  };
}

export function useMaintenance() {
  const [items, setItems] = useStored<MaintenanceItem[]>(KEYS.maint, DEFAULT_MAINTENANCE);
  return {
    items,
    toggle: (id: string) =>
      setItems(
        items.map((i) =>
          i.id === id ? { ...i, completed: !i.completed, completedAt: !i.completed ? new Date().toISOString() : undefined } : i,
        ),
      ),
    reset: () => setItems(DEFAULT_MAINTENANCE),
  };
}
