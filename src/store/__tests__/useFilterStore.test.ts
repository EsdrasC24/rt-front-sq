import { renderHook, act } from '@testing-library/react';
import { useFilterStore } from '../useFilterStore';
import type { CharacterFilters } from '../../services';

// Mock zustand to ensure test isolation
jest.mock('zustand');

describe('useFilterStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useFilterStore.setState({
      searchTerm: '',
      activeFilters: {},
      currentTab: 'todos',
      isFiltering: false,
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useFilterStore());
      
      expect(result.current.searchTerm).toBe('');
      expect(result.current.activeFilters).toEqual({});
      expect(result.current.currentTab).toBe('todos');
      expect(result.current.isFiltering).toBe(false);
    });

    it('should expose all required methods', () => {
      const { result } = renderHook(() => useFilterStore());
      
      expect(typeof result.current.setSearchTerm).toBe('function');
      expect(typeof result.current.setActiveFilters).toBe('function');
      expect(typeof result.current.updateFilter).toBe('function');
      expect(typeof result.current.setCurrentTab).toBe('function');
      expect(typeof result.current.setIsFiltering).toBe('function');
      expect(typeof result.current.removeFilter).toBe('function');
      expect(typeof result.current.clearAllFilters).toBe('function');
      expect(typeof result.current.getCombinedFilters).toBe('function');
      expect(typeof result.current.hasActiveFilters).toBe('function');
    });
  });

  describe('Search Term Management', () => {
    it('should set search term', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setSearchTerm('Rick');
      });
      
      expect(result.current.searchTerm).toBe('Rick');
    });

    it('should handle empty search term', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setSearchTerm('Rick');
      });
      expect(result.current.searchTerm).toBe('Rick');
      
      act(() => {
        result.current.setSearchTerm('');
      });
      expect(result.current.searchTerm).toBe('');
    });

    it('should handle special characters in search term', () => {
      const { result } = renderHook(() => useFilterStore());
      const specialTerm = 'Rick-C137!@#$%';
      
      act(() => {
        result.current.setSearchTerm(specialTerm);
      });
      
      expect(result.current.searchTerm).toBe(specialTerm);
    });
  });

  describe('Active Filters Management', () => {
    it('should set active filters', () => {
      const { result } = renderHook(() => useFilterStore());
      const filters: CharacterFilters = {
        status: 'Alive' as const,
        species: 'Human',
        gender: 'Male' as const
      };
      
      act(() => {
        result.current.setActiveFilters(filters);
      });
      
      expect(result.current.activeFilters).toEqual(filters);
    });

    it('should update specific filter', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.updateFilter('status', 'Dead' as const);
      });
      
      expect(result.current.activeFilters.status).toBe('Dead');
    });

    it('should update multiple filters individually', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.updateFilter('status', 'Alive' as const);
        result.current.updateFilter('gender', 'Female' as const);
        result.current.updateFilter('species', 'Human');
      });
      
      expect(result.current.activeFilters).toEqual({
        status: 'Alive',
        gender: 'Female',
        species: 'Human'
      });
    });

    it('should overwrite existing filter value', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.updateFilter('status', 'Alive' as const);
      });
      expect(result.current.activeFilters.status).toBe('Alive');
      
      act(() => {
        result.current.updateFilter('status', 'Dead' as const);
      });
      expect(result.current.activeFilters.status).toBe('Dead');
    });

    it('should remove specific filter', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setActiveFilters({
          status: 'Alive' as const,
          gender: 'Male' as const,
          species: 'Human'
        });
      });
      
      act(() => {
        result.current.removeFilter('gender');
      });
      
      expect(result.current.activeFilters).toEqual({
        status: 'Alive',
        species: 'Human'
      });
    });

    it('should handle removing non-existent filter', () => {
      const { result } = renderHook(() => useFilterStore());
      const initialFilters = { status: 'Alive' as const };
      
      act(() => {
        result.current.setActiveFilters(initialFilters);
      });
      
      act(() => {
        result.current.removeFilter('gender');
      });
      
      expect(result.current.activeFilters).toEqual(initialFilters);
    });
  });

  describe('Tab Management', () => {
    it('should set current tab to todos', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setCurrentTab('todos');
      });
      
      expect(result.current.currentTab).toBe('todos');
    });

    it('should set current tab to favoritos', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setCurrentTab('favoritos');
      });
      
      expect(result.current.currentTab).toBe('favoritos');
    });

    it('should handle tab switching', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setCurrentTab('favoritos');
      });
      expect(result.current.currentTab).toBe('favoritos');
      
      act(() => {
        result.current.setCurrentTab('todos');
      });
      expect(result.current.currentTab).toBe('todos');
    });
  });

  describe('Filtering State Management', () => {
    it('should set filtering state to true', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setIsFiltering(true);
      });
      
      expect(result.current.isFiltering).toBe(true);
    });

    it('should set filtering state to false', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setIsFiltering(true);
      });
      expect(result.current.isFiltering).toBe(true);
      
      act(() => {
        result.current.setIsFiltering(false);
      });
      expect(result.current.isFiltering).toBe(false);
    });
  });

  describe('Clear All Filters', () => {
    it('should clear all filters and reset to initial state', () => {
      const { result } = renderHook(() => useFilterStore());
      
      // Set some state
      act(() => {
        result.current.setSearchTerm('Rick');
        result.current.setActiveFilters({ status: 'Alive', gender: 'Male' });
        result.current.setCurrentTab('favoritos');
      });
      
      // Verify state is set
      expect(result.current.searchTerm).toBe('Rick');
      expect(result.current.activeFilters).toEqual({ status: 'Alive', gender: 'Male' });
      expect(result.current.currentTab).toBe('favoritos');
      
      // Clear all filters
      act(() => {
        result.current.clearAllFilters();
      });
      
      // Verify state is reset
      expect(result.current.searchTerm).toBe('');
      expect(result.current.activeFilters).toEqual({});
      expect(result.current.currentTab).toBe('todos');
    });

    it('should not affect isFiltering state', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setSearchTerm('Rick');
        result.current.setIsFiltering(true);
      });
      
      act(() => {
        result.current.clearAllFilters();
      });
      
      expect(result.current.isFiltering).toBe(true);
    });
  });

  describe('Combined Filters', () => {
    it('should return empty filters when no search term or active filters', () => {
      const { result } = renderHook(() => useFilterStore());
      
      const combined = result.current.getCombinedFilters();
      expect(combined).toEqual({});
    });

    it('should combine search term with active filters', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setSearchTerm('Rick');
        result.current.setActiveFilters({ status: 'Alive' as const, gender: 'Male' as const });
      });
      
      const combined = result.current.getCombinedFilters();
      expect(combined).toEqual({
        name: 'Rick',
        status: 'Alive',
        gender: 'Male'
      });
    });

    it('should only include name when only search term is present', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setSearchTerm('Morty');
      });
      
      const combined = result.current.getCombinedFilters();
      expect(combined).toEqual({ name: 'Morty' });
    });

    it('should only include active filters when no search term', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setActiveFilters({ status: 'Dead' as const, species: 'Alien' });
      });
      
      const combined = result.current.getCombinedFilters();
      expect(combined).toEqual({ status: 'Dead', species: 'Alien' });
    });

    it('should trim whitespace from search term', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setSearchTerm('  Rick  ');
      });
      
      const combined = result.current.getCombinedFilters();
      expect(combined).toEqual({ name: 'Rick' });
    });

    it('should not include name when search term is only whitespace', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setSearchTerm('   ');
        result.current.setActiveFilters({ status: 'Alive' as const });
      });
      
      const combined = result.current.getCombinedFilters();
      expect(combined).toEqual({ status: 'Alive' });
    });
  });

  describe('Has Active Filters', () => {
    it('should return false when no filters are active', () => {
      const { result } = renderHook(() => useFilterStore());
      
      expect(result.current.hasActiveFilters()).toBe(false);
    });

    it('should return true when search term is present', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setSearchTerm('Rick');
      });
      
      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should return true when active filters are present', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setActiveFilters({ status: 'Alive' as const });
      });
      
      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should return true when both search term and active filters are present', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setSearchTerm('Rick');
        result.current.setActiveFilters({ status: 'Alive' });
      });
      
      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should return false when search term is only whitespace', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setSearchTerm('   ');
      });
      
      expect(result.current.hasActiveFilters()).toBe(false);
    });

    it('should update correctly after clearing filters', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setSearchTerm('Rick');
        result.current.setActiveFilters({ status: 'Alive' });
      });
      expect(result.current.hasActiveFilters()).toBe(true);
      
      act(() => {
        result.current.clearAllFilters();
      });
      expect(result.current.hasActiveFilters()).toBe(false);
    });
  });

  describe('Store Integration', () => {
    it('should maintain state consistency across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useFilterStore());
      const { result: result2 } = renderHook(() => useFilterStore());
      
      act(() => {
        result1.current.setSearchTerm('Rick');
        result1.current.setCurrentTab('favoritos');
      });
      
      expect(result2.current.searchTerm).toBe('Rick');
      expect(result2.current.currentTab).toBe('favoritos');
    });

    it('should handle complex filter operations', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setSearchTerm('Rick');
        result.current.updateFilter('status', 'Alive' as const);
        result.current.updateFilter('gender', 'Male' as const);
        result.current.setCurrentTab('favoritos');
        result.current.setIsFiltering(true);
      });
      
      expect(result.current.searchTerm).toBe('Rick');
      expect(result.current.activeFilters).toEqual({
        status: 'Alive',
        gender: 'Male'
      });
      expect(result.current.currentTab).toBe('favoritos');
      expect(result.current.isFiltering).toBe(true);
      expect(result.current.hasActiveFilters()).toBe(true);
      
      const combined = result.current.getCombinedFilters();
      expect(combined).toEqual({
        name: 'Rick',
        status: 'Alive',
        gender: 'Male'
      });
    });
  });
});