/**
 * useEpisode Hook Tests
 * Testing episode name fetching with caching and deduplication
 */

import { renderHook, act } from '@testing-library/react';
import { useEpisode } from '../useEpisode';

// Mock the episode service
jest.mock('../../services', () => ({
  episodeService: {
    getEpisodeNameByUrl: jest.fn()
  }
}));

// Import after mocking to get proper types
import { episodeService } from '../../services';
const mockEpisodeService = episodeService as jest.Mocked<typeof episodeService>;

describe('useEpisode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEpisodeService.getEpisodeNameByUrl.mockReset();
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useEpisode());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.getEpisodeName).toBe('function');
      expect(typeof result.current.getFirstEpisodeName).toBe('function');
    });
  });

  describe('getEpisodeName', () => {
    it('should fetch episode name successfully', async () => {
      const episodeName = 'Pilot';
      const episodeUrl = 'https://rickandmortyapi.com/api/episode/1';
      
      mockEpisodeService.getEpisodeNameByUrl.mockResolvedValueOnce(episodeName);

      const { result } = renderHook(() => useEpisode());

      let fetchedName: string | undefined;

      await act(async () => {
        fetchedName = await result.current.getEpisodeName(episodeUrl);
      });

      expect(fetchedName).toBe(episodeName);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle API errors gracefully', async () => {
      const episodeUrl = 'https://rickandmortyapi.com/api/episode/999';
      
      mockEpisodeService.getEpisodeNameByUrl.mockRejectedValueOnce(
        new Error('Episode not found')
      );

      const { result } = renderHook(() => useEpisode());

      let fetchedName: string | undefined;

      await act(async () => {
        fetchedName = await result.current.getEpisodeName(episodeUrl);
      });

      expect(fetchedName).toBe('Unknown Episode');
      expect(result.current.error).toBe('Episode not found');
    });

    it('should handle AbortError gracefully', async () => {
      // Clear all mocks and use unique URL to avoid cache interference
      jest.clearAllMocks();
      const episodeUrl = 'https://rickandmortyapi.com/api/episode/abort-test-999';
      
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      
      mockEpisodeService.getEpisodeNameByUrl.mockRejectedValueOnce(abortError);

      const { result } = renderHook(() => useEpisode());

      let fetchedName: string | undefined;

      await act(async () => {
        fetchedName = await result.current.getEpisodeName(episodeUrl);
      });

      expect(fetchedName).toBe('Unknown Episode');
      expect(result.current.error).toBe(null);
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

      const { result } = renderHook(() => useEpisode());

      let fetchedName: string | undefined;
      
      await act(async () => {
        fetchedName = await result.current.getFirstEpisodeName(episodeUrls);
      });

      expect(fetchedName).toBe(firstEpisodeName);
    });

    it('should return "Unknown Episode" for empty array', async () => {
      const { result } = renderHook(() => useEpisode());

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
      const { result, unmount } = renderHook(() => useEpisode());

      // Start a request
      act(() => {
        result.current.getEpisodeName('https://rickandmortyapi.com/api/episode/1');
      });

      // Unmounting should not throw errors
      expect(() => unmount()).not.toThrow();
    });
  });
});