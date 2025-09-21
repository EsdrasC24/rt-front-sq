import { useMemo } from 'react';
import { useFilterStore } from '../store/useFilterStore';
import { useFavoritesStore } from '../store/useFavoritesStore';

/**
 * Optimized hooks for Zustand stores using specific selectors
 * These hooks prevent unnecessary re-renders by subscribing only to specific state slices
 */

// Filter Store Optimized Hooks
export const useSearchTerm = () => 
  useFilterStore(state => state.searchTerm);

export const useSetSearchTerm = () =>
  useFilterStore(state => state.setSearchTerm);

export const useSetActiveFilters = () =>
  useFilterStore(state => state.setActiveFilters);

export const useActiveFilters = () =>
  useFilterStore(state => state.activeFilters);

export const useFilterActions = () => {
  const setActiveFilters = useFilterStore(state => state.setActiveFilters);
  const updateFilter = useFilterStore(state => state.updateFilter);
  const removeFilter = useFilterStore(state => state.removeFilter);
  const clearAllFilters = useFilterStore(state => state.clearAllFilters);
  
  return useMemo(() => ({
    setActiveFilters,
    updateFilter,
    removeFilter,
    clearAllFilters,
  }), [setActiveFilters, updateFilter, removeFilter, clearAllFilters]);
};

export const useCurrentTab = () =>
  useFilterStore(state => state.currentTab);

export const useSetCurrentTab = () =>
  useFilterStore(state => state.setCurrentTab);

export const useToggleFavorite = () =>
  useFavoritesStore(state => state.toggleFavorite);

export const useFilterUtilities = () => {
  const getCombinedFilters = useFilterStore(state => state.getCombinedFilters);
  const hasActiveFilters = useFilterStore(state => state.hasActiveFilters);
  const isFiltering = useFilterStore(state => state.isFiltering);
  const setIsFiltering = useFilterStore(state => state.setIsFiltering);
  
  return useMemo(() => ({
    getCombinedFilters,
    hasActiveFilters,
    isFiltering,
    setIsFiltering,
  }), [getCombinedFilters, hasActiveFilters, isFiltering, setIsFiltering]);
};

// Combined hook for components that need multiple filter states
export const useOptimizedFilters = () => {
  const searchTerm = useFilterStore(state => state.searchTerm);
  const activeFilters = useFilterStore(state => state.activeFilters);
  const currentTab = useFilterStore(state => state.currentTab);
  const isFiltering = useFilterStore(state => state.isFiltering);
  
  return useMemo(() => ({
    searchTerm,
    activeFilters,
    currentTab,
    isFiltering,
  }), [searchTerm, activeFilters, currentTab, isFiltering]);
};

// Combined hook for components that need filter actions
export const useOptimizedFilterActions = () => {
  const setSearchTerm = useFilterStore(state => state.setSearchTerm);
  const setActiveFilters = useFilterStore(state => state.setActiveFilters);
  const updateFilter = useFilterStore(state => state.updateFilter);
  const removeFilter = useFilterStore(state => state.removeFilter);
  const clearAllFilters = useFilterStore(state => state.clearAllFilters);
  const setCurrentTab = useFilterStore(state => state.setCurrentTab);
  const setIsFiltering = useFilterStore(state => state.setIsFiltering);
  const getCombinedFilters = useFilterStore(state => state.getCombinedFilters);
  const hasActiveFilters = useFilterStore(state => state.hasActiveFilters);
  
  return useMemo(() => ({
    setSearchTerm,
    setActiveFilters,
    updateFilter,
    removeFilter,
    clearAllFilters,
    setCurrentTab,
    setIsFiltering,
    getCombinedFilters,
    hasActiveFilters,
  }), [setSearchTerm, setActiveFilters, updateFilter, removeFilter, clearAllFilters, setCurrentTab, setIsFiltering, getCombinedFilters, hasActiveFilters]);
};

// Favorites Store Optimized Hooks
export const useFavoritesList = () => {
  const favorites = useFavoritesStore(state => state.favorites);
  return useMemo(() => Array.from(favorites), [favorites]);
};

export const useFavoritesCount = () =>
  useFavoritesStore(state => state.getFavoritesCount());

export const useIsFavorite = (id: number) =>
  useFavoritesStore(state => state.isFavorite(id));

export const useFavoriteActions = () => {
  const addFavorite = useFavoritesStore(state => state.addFavorite);
  const removeFavorite = useFavoritesStore(state => state.removeFavorite);
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);
  const clearFavorites = useFavoritesStore(state => state.clearFavorites);
  
  return useMemo(() => ({
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  }), [addFavorite, removeFavorite, toggleFavorite, clearFavorites]);
};

// Combined hook for components that need favorites state and actions
export const useOptimizedFavorites = () => {
  const favorites = useFavoritesStore(state => state.favorites);
  const getFavoritesCount = useFavoritesStore(state => state.getFavoritesCount);
  const addFavorite = useFavoritesStore(state => state.addFavorite);
  const removeFavorite = useFavoritesStore(state => state.removeFavorite);
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);
  const isFavorite = useFavoritesStore(state => state.isFavorite);
  const clearFavorites = useFavoritesStore(state => state.clearFavorites);
  
  const favoritesList = useMemo(() => Array.from(favorites), [favorites]);
  
  return useMemo(() => ({
    getFavoritesList: () => favoritesList,
    getFavoritesCount,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  }), [favoritesList, getFavoritesCount, addFavorite, removeFavorite, toggleFavorite, isFavorite, clearFavorites]);
};