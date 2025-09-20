import { create } from 'zustand';

/**
 * Navigation store for managing current page/view state
 * Uses Zustand for lightweight state management without React Router
 */

export type PageType = 'welcome' | 'home';

interface NavigationState {
  currentPage: PageType;
  navigateToPage: (page: PageType) => void;
  navigateToHome: () => void;
  navigateToWelcome: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'welcome',
  
  navigateToPage: (page: PageType) => 
    set({ currentPage: page }),
  
  navigateToHome: () => 
    set({ currentPage: 'home' }),
  
  navigateToWelcome: () => 
    set({ currentPage: 'welcome' }),
}));