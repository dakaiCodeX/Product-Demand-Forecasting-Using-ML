import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface SettingsState {
  theme: ThemeMode;
  accent: string;
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  scrollbarThickness: number;
  scrollbarColor: string;
  contentGap: number;
  showTopbar: boolean;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: string) => void;
  setSidebarWidth: (width: number) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setScrollbar: (thickness: number, color: string) => void;
  setContentGap: (gap: number) => void;
  setShowTopbar: (show: boolean) => void;
}

const defaultAccent = '#38bdf8';

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark',
  accent: defaultAccent,
  sidebarWidth: 280,
  sidebarCollapsed: false,
  scrollbarThickness: 6,
  scrollbarColor: 'rgba(148, 163, 184, 0.6)',
  contentGap: 24,
  showTopbar: true,
  setTheme: (theme) => set({ theme }),
  setAccent: (accent) => set({ accent }),
  setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setScrollbar: (scrollbarThickness, scrollbarColor) => set({ scrollbarThickness, scrollbarColor }),
  setContentGap: (contentGap) => set({ contentGap }),
  setShowTopbar: (showTopbar) => set({ showTopbar }),
}));
