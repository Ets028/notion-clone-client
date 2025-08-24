import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  isMobile: boolean; // Ditambahkan untuk melacak status mobile
  theme: 'light' | 'dark';
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setIsMobile: (isMobile: boolean) => void; // Ditambahkan untuk mengatur status mobile
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  isMobile: false, // Nilai awal
  theme: 'light',

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  setTheme: (theme) => set({ theme }),
  
  setIsMobile: (isMobile) => set({ isMobile }), // Implementasi fungsi
}));
