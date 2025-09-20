import { create } from 'zustand';
import type { CharacterFilters } from '../services';

/**
 * Filter store for managing global filter state
 * Handles search terms, advanced filters, and current tab selection
 */

export type FilterTab = 'todos' | 'favoritos';

interface FilterState {
  /**
   * Current search term
   */
  searchTerm: string;
  
  /**
   * Active advanced filters (species, gender, status)
   */
  activeFilters: CharacterFilters;
  
  /**
   * Current active tab (todos/favoritos)
   */
  currentTab: FilterTab;
  
  /**
   * Whether filters are currently being applied
   */
  isFiltering: boolean;
  
  /**
   * Set search term
   */
  setSearchTerm: (term: string) => void;
  
  /**
   * Set advanced filters
   */
  setActiveFilters: (filters: CharacterFilters) => void;
  
  /**
   * Add or update specific filter
   */
  updateFilter: <K extends keyof CharacterFilters>(
    key: K, 
    value: CharacterFilters[K]
  ) => void;
  
  /**
   * Set current tab
   */
  setCurrentTab: (tab: FilterTab) => void;
  
  /**
   * Set filtering state
   */
  setIsFiltering: (isFiltering: boolean) => void;
  
  /**
   * Remove specific filter
   */
  removeFilter: (key: keyof CharacterFilters) => void;
  
  /**
   * Clear all filters
   */
  clearAllFilters: () => void;
  
  /**
   * Get combined filters (search + advanced)
   */
  getCombinedFilters: () => CharacterFilters;
  
  /**
   * Check if any filters are active
   */
  hasActiveFilters: () => boolean;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  searchTerm: '',
  activeFilters: {},
  currentTab: 'todos',
  isFiltering: false,
  
  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },
  
  setActiveFilters: (filters: CharacterFilters) => {
    set({ activeFilters: filters });
  },
  
  updateFilter: (key, value) => {
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        [key]: value
      }
    }));
  },
  
  removeFilter: (key) => {
    set((state) => {
      const newFilters = { ...state.activeFilters };
      delete newFilters[key];
      return { activeFilters: newFilters };
    });
  },
  
  setCurrentTab: (tab: FilterTab) => {
    set({ currentTab: tab });
  },
  
  setIsFiltering: (isFiltering: boolean) => {
    set({ isFiltering });
  },
  
  clearAllFilters: () => {
    set({
      searchTerm: '',
      activeFilters: {},
      currentTab: 'todos'
    });
  },
  
  getCombinedFilters: () => {
    const { searchTerm, activeFilters } = get();
    const combinedFilters: CharacterFilters = { ...activeFilters };
    
    if (searchTerm.trim()) {
      combinedFilters.name = searchTerm.trim();
    }
    
    return combinedFilters;
  },
  
  hasActiveFilters: () => {
    const { searchTerm, activeFilters } = get();
    return (
      searchTerm.trim().length > 0 ||
      Object.keys(activeFilters).length > 0
    );
  }
}));