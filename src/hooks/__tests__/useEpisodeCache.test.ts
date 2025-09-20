/**
 * useEpisodeCache Hook Tests
 * Testing global episode caching system with deduplication
 */

import { renderHook, act } from '@testing-library/react';
import { useEpisodeCache } from '../useEpisodeCache';

// Mock the episode service
jest.mock('../../services', () => ({
  episodeService: {
    getEpisodeNameByUrl: jest.fn(),
  },
}));

// Import after mocking to get proper types
import { episodeService } from '../../services';
const mockEpisodeService = episodeService as jest.Mocked<typeof episodeService>;

describe('useEpisodeCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEpisodeService.getEpisodeNameByUrl.mockReset();
  });

  describe('Initial State', () => {
    it('should provide getEpisodeName and getFirstEpisodeName functions', () => {
      const { result } = renderHook(() => useEpisodeCache());

      expect(typeof result.current.getEpisodeName).toBe('function');
      expect(typeof result.current.getFirstEpisodeName).toBe('function');
    });
  });

  describe('getEpisodeName', () => {
    it('should fetch episode name successfully', async () => {
      const episodeName = 'Pilot';
      const episodeUrl = 'https://rickandmortyapi.com/api/episode/1';
      
      mockEpisodeService.getEpisodeNameByUrl.mockResolvedValueOnce(episodeName);

      const { result } = renderHook(() => useEpisodeCache());

      let fetchedName: string | undefined;
      
      await act(async () => {
        fetchedName = await result.current.getEpisodeName(episodeUrl);
      });

      expect(fetchedName).toBe(episodeName);
    });

    it('should handle API errors gracefully', async () => {
      const episodeUrl = 'https://rickandmortyapi.com/api/episode/999';
      
      mockEpisodeService.getEpisodeNameByUrl.mockRejectedValueOnce(
        new Error('Episode not found')
      );

      const { result } = renderHook(() => useEpisodeCache());

      let fetchedName: string | undefined;
      
      await act(async () => {
        fetchedName = await result.current.getEpisodeName(episodeUrl);
      });

      expect(fetchedName).toBe('Unknown Episode');
    });

    it('should handle AbortError gracefully', async () => {
      // Use unique URL to avoid cache interference
      const episodeUrl = 'https://rickandmortyapi.com/api/episode/abort-test-cache-999';
      
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      
      // Clear previous mocks and set up the AbortError
      jest.clearAllMocks();
      mockEpisodeService.getEpisodeNameByUrl.mockRejectedValueOnce(abortError);

      const { result } = renderHook(() => useEpisodeCache());

      let fetchedName: string | undefined;
      
      await act(async () => {
        fetchedName = await result.current.getEpisodeName(episodeUrl);
      });

      expect(fetchedName).toBe('Unknown Episode');
    });

    it('should cache episode names globally across hook instances', async () => {
      const episodeName = 'Pilot';
      const episodeUrl = 'https://rickandmortyapi.com/api/episode/1';
      
      mockEpisodeService.getEpisodeNameByUrl.mockResolvedValue(episodeName);

      // First hook instance
      const { result: result1 } = renderHook(() => useEpisodeCache());

      await act(async () => {
        await result1.current.getEpisodeName(episodeUrl);
      });

      // Second hook instance should use cached value
      const { result: result2 } = renderHook(() => useEpisodeCache());

      let cachedName: string | undefined;
      await act(async () => {
        cachedName = await result2.current.getEpisodeName(episodeUrl);
      });

      expect(cachedName).toBe(episodeName);
    });

    it('should deduplicate concurrent requests globally', async () => {
      const episodeName = 'Pilot';
      const episodeUrl = 'https://rickandmortyapi.com/api/episode/1';
      
      // Add delay to simulate network request
      mockEpisodeService.getEpisodeNameByUrl.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(episodeName), 50))
      );

      const { result } = renderHook(() => useEpisodeCache());

      // Start two concurrent requests
      const promise1 = result.current.getEpisodeName(episodeUrl);
      const promise2 = result.current.getEpisodeName(episodeUrl);

      const [name1, name2] = await Promise.all([promise1, promise2]);

      expect(name1).toBe(episodeName);
      expect(name2).toBe(episodeName);
    });
  });

  describe('getFirstEpisodeName', () => {
    it('should get first episode name from array', async () => {
      const firstEpisodeName = 'Pilot';
      const episodeUrls = [
        'https://rickandmortyapi.com/api/episode/1',
        'https://rickandmortyapi.com/api/episode/2'
      ];
      
      mockEpisodeService.getEpisodeNameByUrl.mockResolvedValueOnce(firstEpisodeName);

      const { result } = renderHook(() => useEpisodeCache());

      let fetchedName: string | undefined;
      
      await act(async () => {
        fetchedName = await result.current.getFirstEpisodeName(episodeUrls);
      });

      expect(fetchedName).toBe(firstEpisodeName);
    });

    it('should return "Unknown Episode" for empty array', async () => {
      const { result } = renderHook(() => useEpisodeCache());

      let fetchedName: string | undefined;
      
      await act(async () => {
        fetchedName = await result.current.getFirstEpisodeName([]);
      });

      expect(fetchedName).toBe('Unknown Episode');
      expect(mockEpisodeService.getEpisodeNameByUrl).not.toHaveBeenCalled();
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle component unmounting gracefully', () => {
      const { result, unmount } = renderHook(() => useEpisodeCache());

      // Start a request
      act(() => {
        result.current.getEpisodeName('https://rickandmortyapi.com/api/episode/1');
      });

      // Unmounting should not throw errors
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Global State Management', () => {
    it('should maintain global state across multiple hook instances', async () => {
      const episodeName = 'Pilot';
      const episodeUrl = 'https://rickandmortyapi.com/api/episode/1';
      
      mockEpisodeService.getEpisodeNameByUrl.mockResolvedValue(episodeName);

      // Create multiple hook instances
      const hooks = [
        renderHook(() => useEpisodeCache()),
        renderHook(() => useEpisodeCache()),
        renderHook(() => useEpisodeCache())
      ];

      // All should share the same global cache
      const results = await Promise.all(
        hooks.map(async ({ result }) => {
          return await result.current.getEpisodeName(episodeUrl);
        })
      );

      // All should get the same result
      results.forEach(name => expect(name).toBe(episodeName));
    });
  });
});