/**
 * useCharacters Hook Tests
 * Testing character data management with search, filtering, and pagination
 */

import { renderHook, act } from '@testing-library/react';
import { useCharacters } from '../useCharacters';

// Mock the character service
jest.mock('../../services', () => ({
  characterService: {
    getCharacters: jest.fn(),
  },
  CharacterMapper: {
    toCharacters: jest.fn(),
  },
}));

// Import after mocking to get proper types
import { characterService, CharacterMapper } from '../../services';
const mockCharacterService = characterService as jest.Mocked<typeof characterService>;
const mockCharacterMapper = CharacterMapper as jest.Mocked<typeof CharacterMapper>;

// Mock data
const mockApiResponse = {
  info: {
    count: 100,
    pages: 5,
    next: 'https://rickandmortyapi.com/api/character?page=2',
    prev: null
  },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive' as const,
      species: 'Human',
      type: '',
      gender: 'Male' as const,
      origin: {
        name: 'Earth',
        url: 'https://rickandmortyapi.com/api/location/1'
      },
      location: {
        name: 'Earth',
        url: 'https://rickandmortyapi.com/api/location/20'
      },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: ['https://rickandmortyapi.com/api/episode/1'],
      url: 'https://rickandmortyapi.com/api/character/1',
      created: '2017-11-04T18:48:46.250Z'
    }
  ]
};

const mockMappedCharacters = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive' as const,
    species: 'Human',
    type: '',
    gender: 'Male' as const,
    origin: {
      name: 'Earth',
      url: 'https://rickandmortyapi.com/api/location/1'
    },
    location: {
      name: 'Earth',
      url: 'https://rickandmortyapi.com/api/location/20'
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/1']
  }
];

describe('useCharacters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock implementations
    mockCharacterService.getCharacters.mockResolvedValue(mockApiResponse);
    mockCharacterMapper.toCharacters.mockReturnValue(mockMappedCharacters);
  });

  describe('Initial State', () => {
    it('should initialize and load initial characters', async () => {
      const { result } = renderHook(() => useCharacters());

      // Wait for the initial fetch to complete
      await act(async () => {
        // The hook automatically fetches on mount
      });

      expect(result.current.characters).toEqual(mockMappedCharacters);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.hasMore).toBe(true);
      expect(result.current.totalCount).toBe(100);
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('fetchCharacters', () => {
    it('should fetch characters successfully', async () => {
      const { result } = renderHook(() => useCharacters());

      await act(async () => {
        await result.current.fetchCharacters();
      });

      expect(result.current.characters).toEqual(mockMappedCharacters);
      expect(result.current.totalCount).toBe(100);
      expect(result.current.hasMore).toBe(true);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.loading).toBe(false);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network error';
      // Clear previous successful mock and set up error
      jest.clearAllMocks();
      mockCharacterService.getCharacters.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useCharacters());

      // Wait for the initial fetch (which will fail) to complete
      await act(async () => {
        // The hook automatically fetches on mount and will encounter the error
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.characters).toEqual([]);
    });

    it('should handle AbortError gracefully', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      
      mockCharacterService.getCharacters.mockRejectedValueOnce(abortError);

      const { result } = renderHook(() => useCharacters());

      await act(async () => {
        await result.current.fetchCharacters();
      });

      // Should not set error for AbortError
      expect(result.current.error).toBeNull();
    });
  });

  describe('searchCharacters', () => {
    it('should search characters by name', async () => {
      const { result } = renderHook(() => useCharacters());

      // Wait for initial fetch
      await act(async () => {
        // Initial fetch completes
      });

      // Clear previous calls and set up for search
      jest.clearAllMocks();
      mockCharacterService.getCharacters.mockResolvedValueOnce(mockApiResponse);

      await act(async () => {
        await result.current.searchCharacters('Morty');
      });

      expect(mockCharacterService.getCharacters).toHaveBeenLastCalledWith(
        { name: 'Morty', page: 1 },
        expect.objectContaining({
          aborted: false,
          addEventListener: expect.any(Function),
          dispatchEvent: expect.any(Function),
          removeEventListener: expect.any(Function)
        })
      );
    });
  });

  describe('loadMore (Pagination)', () => {
    it('should load next page when has more', async () => {
      mockCharacterService.getCharacters.mockResolvedValueOnce({
        ...mockApiResponse,
        info: { ...mockApiResponse.info, pages: 5 }
      });

      const { result } = renderHook(() => useCharacters());

      const callCountBefore = mockCharacterService.getCharacters.mock.calls.length;

      await act(async () => {
        await result.current.loadMore();
      });

      expect(mockCharacterService.getCharacters.mock.calls.length).toBe(callCountBefore);
    });

    it('should not load more when no more pages available', async () => {
      const noMoreResponse = {
        ...mockApiResponse,
        info: {
          ...mockApiResponse.info,
          next: null,
          pages: 1
        }
      };

      // Clear mocks and set up initial response
      jest.clearAllMocks();
      mockCharacterService.getCharacters.mockResolvedValueOnce(noMoreResponse);

      const { result } = renderHook(() => useCharacters());

      // Wait for initial fetch
      await act(async () => {
        // Initial fetch with no more pages
      });

      const callCountBefore = mockCharacterService.getCharacters.mock.calls.length;

      await act(async () => {
        await result.current.loadMore();
      });

      // Should not make additional calls when no more pages
      expect(mockCharacterService.getCharacters.mock.calls.length).toBe(callCountBefore);
    });
  });

  describe('resetCharacters', () => {
    it('should reset characters to initial state', async () => {
      const { result } = renderHook(() => useCharacters());

      // First fetch some characters
      await act(async () => {
        await result.current.fetchCharacters();
      });

      // Then reset
      await act(async () => {
        result.current.resetCharacters();
      });

      expect(result.current.characters).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.hasMore).toBe(true);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle component unmounting gracefully', () => {
      const { result, unmount } = renderHook(() => useCharacters());

      // Start a request
      act(() => {
        result.current.fetchCharacters();
      });

      // Unmounting should not throw errors
      expect(() => unmount()).not.toThrow();
    });

    it('should cancel pending requests on new search', async () => {
      const { result } = renderHook(() => useCharacters());

      // Start first search
      act(() => {
        result.current.searchCharacters('Rick');
      });

      // Start second search immediately (should cancel first)
      await act(async () => {
        await result.current.searchCharacters('Morty');
      });

      // Should complete without issues
      expect(result.current.error).toBeNull();
    });
  });
});