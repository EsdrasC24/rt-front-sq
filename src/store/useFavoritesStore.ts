import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Favorites store for managing character favorites with persistence
 * Uses Zustand with localStorage persistence for favorites management
 */

interface FavoritesState {
  /**
   * Set of favorite character IDs
   */
  favorites: Set<number>;
  
  /**
   * Add a character to favorites
   */
  addFavorite: (id: number) => void;
  
  /**
   * Remove a character from favorites
   */
  removeFavorite: (id: number) => void;
  
  /**
   * Toggle favorite status of a character
   */
  toggleFavorite: (id: number) => void;
  
  /**
   * Check if a character is in favorites
   */
  isFavorite: (id: number) => boolean;
  
  /**
   * Get list of favorite character IDs
   */
  getFavoritesList: () => number[];
  
  /**
   * Get count of favorites
   */
  getFavoritesCount: () => number;
  
  /**
   * Clear all favorites
   */
  clearFavorites: () => void;
}

/**
 * Custom storage for Set serialization/deserialization
 */
const favoritesStorage = {
  getItem: (name: string): any => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    
    try {
      const parsed = JSON.parse(str);
      // Convert array back to Set
      if (parsed?.state?.favorites && Array.isArray(parsed.state.favorites)) {
        return {
          ...parsed,
          state: {
            ...parsed.state,
            favorites: new Set(parsed.state.favorites)
          }
        };
      }
      return parsed;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: any): void => {
    try {
      const serialized = {
        ...value,
        state: {
          ...value.state,
          favorites: Array.from(value.state.favorites)
        }
      };
      localStorage.setItem(name, JSON.stringify(serialized));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  }
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: new Set<number>(),
      
      addFavorite: (id: number) => {
        set((state) => ({
          favorites: new Set([...state.favorites, id])
        }));
      },
      
      removeFavorite: (id: number) => {
        set((state) => {
          const newFavorites = new Set(state.favorites);
          newFavorites.delete(id);
          return { favorites: newFavorites };
        });
      },
      
      toggleFavorite: (id: number) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(id)) {
          removeFavorite(id);
        } else {
          addFavorite(id);
        }
      },
      
      isFavorite: (id: number) => {
        return get().favorites.has(id);
      },
      
      getFavoritesList: () => {
        return Array.from(get().favorites);
      },
      
      getFavoritesCount: () => {
        return get().favorites.size;
      },
      
      clearFavorites: () => {
        set({ favorites: new Set<number>() });
      }
    }),
    {
      name: 'rick-morty-favorites',
      storage: favoritesStorage as any,
      version: 1,
    }
  )
);