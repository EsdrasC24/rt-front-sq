import { renderHook, act } from '@testing-library/react';
import { useFavoritesStore } from '../useFavoritesStore';

// Mock zustand to ensure test isolation
jest.mock('zustand');

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('useFavoritesStore', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset store to initial state before each test
    useFavoritesStore.setState({
      favorites: new Set<number>(),
    });
    
    // Reset localStorage mock
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      expect(result.current.favorites).toBeInstanceOf(Set);
      expect(result.current.favorites.size).toBe(0);
      expect(result.current.getFavoritesCount()).toBe(0);
      expect(result.current.getFavoritesList()).toEqual([]);
    });

    it('should expose all required methods', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      expect(typeof result.current.addFavorite).toBe('function');
      expect(typeof result.current.removeFavorite).toBe('function');
      expect(typeof result.current.toggleFavorite).toBe('function');
      expect(typeof result.current.isFavorite).toBe('function');
      expect(typeof result.current.getFavoritesList).toBe('function');
      expect(typeof result.current.getFavoritesCount).toBe('function');
      expect(typeof result.current.clearFavorites).toBe('function');
    });
  });

  describe('Add Favorite', () => {
    it('should add a character to favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
      });
      
      expect(result.current.isFavorite(1)).toBe(true);
      expect(result.current.getFavoritesCount()).toBe(1);
      expect(result.current.getFavoritesList()).toEqual([1]);
    });

    it('should add multiple characters to favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
        result.current.addFavorite(2);
        result.current.addFavorite(3);
      });
      
      expect(result.current.getFavoritesCount()).toBe(3);
      expect(result.current.isFavorite(1)).toBe(true);
      expect(result.current.isFavorite(2)).toBe(true);
      expect(result.current.isFavorite(3)).toBe(true);
      
      const favoritesList = result.current.getFavoritesList();
      expect(favoritesList).toContain(1);
      expect(favoritesList).toContain(2);
      expect(favoritesList).toContain(3);
    });

    it('should not add duplicate favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
        result.current.addFavorite(1);
        result.current.addFavorite(1);
      });
      
      expect(result.current.getFavoritesCount()).toBe(1);
      expect(result.current.getFavoritesList()).toEqual([1]);
    });

    it('should handle large character IDs', () => {
      const { result } = renderHook(() => useFavoritesStore());
      const largeId = 999999;
      
      act(() => {
        result.current.addFavorite(largeId);
      });
      
      expect(result.current.isFavorite(largeId)).toBe(true);
      expect(result.current.getFavoritesList()).toEqual([largeId]);
    });
  });

  describe('Remove Favorite', () => {
    it('should remove a character from favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      // Add then remove
      act(() => {
        result.current.addFavorite(1);
      });
      expect(result.current.isFavorite(1)).toBe(true);
      
      act(() => {
        result.current.removeFavorite(1);
      });
      expect(result.current.isFavorite(1)).toBe(false);
      expect(result.current.getFavoritesCount()).toBe(0);
    });

    it('should handle removing non-existent favorite', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.removeFavorite(999);
      });
      
      expect(result.current.getFavoritesCount()).toBe(0);
      expect(result.current.isFavorite(999)).toBe(false);
    });

    it('should remove specific favorite while keeping others', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
        result.current.addFavorite(2);
        result.current.addFavorite(3);
      });
      
      act(() => {
        result.current.removeFavorite(2);
      });
      
      expect(result.current.isFavorite(1)).toBe(true);
      expect(result.current.isFavorite(2)).toBe(false);
      expect(result.current.isFavorite(3)).toBe(true);
      expect(result.current.getFavoritesCount()).toBe(2);
      
      const favoritesList = result.current.getFavoritesList();
      expect(favoritesList).toContain(1);
      expect(favoritesList).toContain(3);
      expect(favoritesList).not.toContain(2);
    });
  });

  describe('Toggle Favorite', () => {
    it('should add favorite when not present', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      expect(result.current.isFavorite(1)).toBe(false);
      
      act(() => {
        result.current.toggleFavorite(1);
      });
      
      expect(result.current.isFavorite(1)).toBe(true);
      expect(result.current.getFavoritesCount()).toBe(1);
    });

    it('should remove favorite when present', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
      });
      expect(result.current.isFavorite(1)).toBe(true);
      
      act(() => {
        result.current.toggleFavorite(1);
      });
      expect(result.current.isFavorite(1)).toBe(false);
      expect(result.current.getFavoritesCount()).toBe(0);
    });

    it('should handle multiple toggles correctly', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      // Toggle on
      act(() => {
        result.current.toggleFavorite(1);
      });
      expect(result.current.isFavorite(1)).toBe(true);
      
      // Toggle off
      act(() => {
        result.current.toggleFavorite(1);
      });
      expect(result.current.isFavorite(1)).toBe(false);
      
      // Toggle on again
      act(() => {
        result.current.toggleFavorite(1);
      });
      expect(result.current.isFavorite(1)).toBe(true);
    });
  });

  describe('Is Favorite', () => {
    it('should return false for non-favorite character', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      expect(result.current.isFavorite(1)).toBe(false);
      expect(result.current.isFavorite(999)).toBe(false);
    });

    it('should return true for favorite character', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
      });
      
      expect(result.current.isFavorite(1)).toBe(true);
    });

    it('should handle checking multiple characters', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
        result.current.addFavorite(3);
      });
      
      expect(result.current.isFavorite(1)).toBe(true);
      expect(result.current.isFavorite(2)).toBe(false);
      expect(result.current.isFavorite(3)).toBe(true);
    });
  });

  describe('Get Favorites List', () => {
    it('should return empty array when no favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      expect(result.current.getFavoritesList()).toEqual([]);
    });

    it('should return array of favorite IDs', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
        result.current.addFavorite(5);
        result.current.addFavorite(10);
      });
      
      const favoritesList = result.current.getFavoritesList();
      expect(favoritesList).toHaveLength(3);
      expect(favoritesList).toContain(1);
      expect(favoritesList).toContain(5);
      expect(favoritesList).toContain(10);
    });

    it('should return updated list after modifications', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
        result.current.addFavorite(2);
      });
      expect(result.current.getFavoritesList()).toHaveLength(2);
      
      act(() => {
        result.current.removeFavorite(1);
      });
      expect(result.current.getFavoritesList()).toEqual([2]);
    });
  });

  describe('Get Favorites Count', () => {
    it('should return 0 when no favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      expect(result.current.getFavoritesCount()).toBe(0);
    });

    it('should return correct count with favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
      });
      expect(result.current.getFavoritesCount()).toBe(1);
      
      act(() => {
        result.current.addFavorite(2);
        result.current.addFavorite(3);
      });
      expect(result.current.getFavoritesCount()).toBe(3);
    });

    it('should update count after removals', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
        result.current.addFavorite(2);
        result.current.addFavorite(3);
      });
      expect(result.current.getFavoritesCount()).toBe(3);
      
      act(() => {
        result.current.removeFavorite(2);
      });
      expect(result.current.getFavoritesCount()).toBe(2);
    });
  });

  describe('Clear Favorites', () => {
    it('should clear all favorites', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
        result.current.addFavorite(2);
        result.current.addFavorite(3);
      });
      expect(result.current.getFavoritesCount()).toBe(3);
      
      act(() => {
        result.current.clearFavorites();
      });
      
      expect(result.current.getFavoritesCount()).toBe(0);
      expect(result.current.getFavoritesList()).toEqual([]);
      expect(result.current.isFavorite(1)).toBe(false);
      expect(result.current.isFavorite(2)).toBe(false);
      expect(result.current.isFavorite(3)).toBe(false);
    });

    it('should handle clearing when already empty', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.clearFavorites();
      });
      
      expect(result.current.getFavoritesCount()).toBe(0);
      expect(result.current.getFavoritesList()).toEqual([]);
    });
  });

  describe('Persistence', () => {
    it('should maintain favorites state during testing', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
      });
      
      // In testing environment with mocked persist, state should still be maintained
      expect(result.current.isFavorite(1)).toBe(true);
    });

    it('should handle state changes without localStorage dependencies', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
        result.current.addFavorite(2);
      });
      
      // Should work despite localStorage not being involved in testing
      expect(result.current.getFavoritesCount()).toBe(2);
      expect(result.current.getFavoritesList()).toHaveLength(2);
    });

    it('should work correctly with mocked persistence', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
        result.current.addFavorite(2);
      });
      
      // Verify internal state management works without real persistence
      expect(result.current.favorites).toBeInstanceOf(Set);
      expect(result.current.favorites.has(1)).toBe(true);
      expect(result.current.favorites.has(2)).toBe(true);
    });
  });

  describe('Store Integration', () => {
    it('should maintain state consistency across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useFavoritesStore());
      const { result: result2 } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result1.current.addFavorite(1);
      });
      
      expect(result2.current.isFavorite(1)).toBe(true);
      expect(result2.current.getFavoritesCount()).toBe(1);
    });

    it('should handle rapid state changes', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
        result.current.addFavorite(2);
        result.current.removeFavorite(1);
        result.current.toggleFavorite(3);
        result.current.toggleFavorite(2);
      });
      
      expect(result.current.isFavorite(1)).toBe(false);
      expect(result.current.isFavorite(2)).toBe(false);
      expect(result.current.isFavorite(3)).toBe(true);
      expect(result.current.getFavoritesCount()).toBe(1);
    });

    it('should handle concurrent operations correctly', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        // Simulate concurrent operations
        result.current.addFavorite(1);
        result.current.addFavorite(2);
        result.current.addFavorite(3);
        
        result.current.toggleFavorite(1); // Remove 1
        result.current.toggleFavorite(4); // Add 4
        result.current.removeFavorite(2); // Remove 2
      });
      
      expect(result.current.isFavorite(1)).toBe(false);
      expect(result.current.isFavorite(2)).toBe(false);
      expect(result.current.isFavorite(3)).toBe(true);
      expect(result.current.isFavorite(4)).toBe(true);
      expect(result.current.getFavoritesCount()).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative IDs', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(-1);
      });
      
      expect(result.current.isFavorite(-1)).toBe(true);
      expect(result.current.getFavoritesList()).toEqual([-1]);
    });

    it('should handle zero ID', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(0);
      });
      
      expect(result.current.isFavorite(0)).toBe(true);
      expect(result.current.getFavoritesList()).toEqual([0]);
    });

    it('should maintain Set uniqueness with various operations', () => {
      const { result } = renderHook(() => useFavoritesStore());
      
      act(() => {
        result.current.addFavorite(1);
        result.current.toggleFavorite(1); // Remove
        result.current.toggleFavorite(1); // Add back
        result.current.addFavorite(1); // Try to add duplicate
      });
      
      expect(result.current.getFavoritesCount()).toBe(1);
      expect(result.current.getFavoritesList()).toEqual([1]);
    });
  });
});