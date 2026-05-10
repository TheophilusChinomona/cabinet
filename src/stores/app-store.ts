import { create } from "zustand";
import type { CabinetVisibilityMode } from "@/types/cabinets";
import { ROOT_CABINET_PATH } from "@/lib/cabinets/paths";

export type SectionType =
  | "home"
  | "cabinet"
  | "page"
  | "agents"
  | "agent"
  | "tasks"
  | "jobs"
  | "settings"
  | "registry";
export type SectionMode = "ops" | "cabinet";

const CABINET_VISIBILITY_STORAGE_KEY = "cabinet.visibility.modes";

export interface SelectedSection {
  type: SectionType;
  slug?: string;
  mode?: SectionMode;
  cabinetPath?: string;
  agentScopedId?: string;
  conversationId?: string;
}

interface AppState {
  section: SelectedSection;
  terminalOpen: boolean;
  aiPanelCollapsed: boolean;
  sidebarCollapsed: boolean;
  cabinetVisibilityModes: Record<string, CabinetVisibilityMode>;
  setSection: (section: SelectedSection) => void;
  toggleTerminal: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setAiPanelCollapsed: (collapsed: boolean) => void;
  setCabinetVisibilityMode: (
    cabinetPath: string,
    mode: CabinetVisibilityMode
  ) => void;
}

function normalizeVisibilityCabinetPath(cabinetPath?: string): string {
  return cabinetPath?.trim() || ROOT_CABINET_PATH;
}

function loadCabinetVisibilityModes(): Record<string, CabinetVisibilityMode> {
  if (typeof window === "undefined") {
    return { [ROOT_CABINET_PATH]: "own" };
  }
  try {
    const stored = window.localStorage.getItem(CABINET_VISIBILITY_STORAGE_KEY);
    if (!stored) {
      return { [ROOT_CABINET_PATH]: "own" };
    }

    const parsed = JSON.parse(stored) as Record<string, unknown>;
    const next: Record<string, CabinetVisibilityMode> = {};

    for (const [cabinetPath, value] of Object.entries(parsed)) {
      if (
        value === "children-1" ||
        value === "children-2" ||
        value === "all" ||
        value === "own"
      ) {
        next[normalizeVisibilityCabinetPath(cabinetPath)] = value;
      }
    }

    return Object.keys(next).length > 0
      ? next
      : { [ROOT_CABINET_PATH]: "own" };
  } catch {
    return { [ROOT_CABINET_PATH]: "own" };
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  section: { type: "home" },
  terminalOpen: false,
  aiPanelCollapsed: true,
  sidebarCollapsed: false,
  cabinetVisibilityModes: loadCabinetVisibilityModes(),

  setSection: (section) => set({ section }),

  toggleTerminal: () => {},

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setAiPanelCollapsed: (_collapsed) => {},

  setCabinetVisibilityMode: (cabinetPath, mode) => {
    const normalizedCabinetPath = normalizeVisibilityCabinetPath(cabinetPath);
    const nextModes = {
      ...get().cabinetVisibilityModes,
      [normalizedCabinetPath]: mode,
    };
    try {
      window.localStorage.setItem(
        CABINET_VISIBILITY_STORAGE_KEY,
        JSON.stringify(nextModes)
      );
    } catch {
      // ignore storage failures
    }
    set({ cabinetVisibilityModes: nextModes });
  },
}));
