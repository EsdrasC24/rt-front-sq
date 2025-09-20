/**
 * Custom hook for character data management
 * Handles loading states, error handling, and data fetching
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  characterService, 
  type ApiResponse, 
  type CharacterFilters,
  type ApiCharacter,
  CharacterMapper,
  type Character
} from '../services';

/**
 * Hook state interface
 */
interface UseCharactersState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
}

/**
 * Hook return interface
 */
interface UseCharactersReturn extends UseCharactersState {
  fetchCharacters: (filters?: CharacterFilters, page?: number) => Promise<void>;
  searchCharacters: (name: string) => Promise<void>;
  loadMore: () => Promise<void>;
  resetCharacters: () => void;
  refreshCharacters: () => Promise<void>;
}

/**
 * Custom hook for managing character data from Rick and Morty API
 */
export const useCharacters = (initialFilters: CharacterFilters = {}): UseCharactersReturn => {
  const [state, setState] = useState<UseCharactersState>({
    characters: [],
    loading: false,
    error: null,
    hasMore: true,
    totalCount: 0,
    currentPage: 1,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const currentFiltersRef = useRef<CharacterFilters>(initialFilters);

  /**
   * Cleanup function to abort ongoing requests
   */
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Fetch characters with filters and pagination
   */
  const fetchCharacters = useCallback(async (
    filters: CharacterFilters = {},
    page: number = 1,
    append: boolean = false
  ) => {
    // Cleanup previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response: ApiResponse<ApiCharacter> = 
        await characterService.getCharacters(
          { ...filters, page },
          abortControllerRef.current.signal
        );

      const mappedCharacters = CharacterMapper.toCharacters(response.results);

      setState(prev => ({
        ...prev,
        characters: append ? [...prev.characters, ...mappedCharacters] : mappedCharacters,
        loading: false,
        hasMore: !!response.info.next,
        totalCount: response.info.count,
        currentPage: page,
      }));

      currentFiltersRef.current = filters;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was aborted, don't update state
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch characters',
      }));
    }
  }, []);

  /**
   * Search characters by name
   */
  const searchCharacters = useCallback(async (name: string) => {
    const filters: CharacterFilters = { ...currentFiltersRef.current, name };
    await fetchCharacters(filters, 1, false);
  }, []);

  /**
   * Load more characters (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.loading) {
      return;
    }

    const nextPage = state.currentPage + 1;
    await fetchCharacters(currentFiltersRef.current, nextPage, true);
  }, [state.hasMore, state.loading, state.currentPage]);

  /**
   * Reset characters list
   */
  const resetCharacters = useCallback(() => {
    cleanup();
    setState({
      characters: [],
      loading: false,
      error: null,
      hasMore: true,
      totalCount: 0,
      currentPage: 1,
    });
    currentFiltersRef.current = {};
  }, [cleanup]);

  /**
   * Refresh current characters list
   */
  const refreshCharacters = useCallback(async () => {
    await fetchCharacters(currentFiltersRef.current, 1, false);
  }, []);

  /**
   * Wrapper for fetchCharacters to match interface
   */
  const fetchCharactersWrapper = useCallback(async (filters?: CharacterFilters, page?: number) => {
    await fetchCharacters(filters || {}, page || 1, false);
  }, []);

  /**
   * Initial load effect
   */
  useEffect(() => {
    fetchCharacters(initialFilters);
    return cleanup;
  }, []); // Solo ejecutar una vez al montar el componente

  return {
    ...state,
    fetchCharacters: fetchCharactersWrapper,
    searchCharacters,
    loadMore,
    resetCharacters,
    refreshCharacters,
  };
};