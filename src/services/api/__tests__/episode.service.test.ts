/**
 * Episode Service Tests
 * Testing episode API operations and URL parsing
 */

// Mock apiClient antes de importar EpisodeService
const mockApiClient = {
  get: jest.fn()
};

jest.doMock('../client', () => ({
  apiClient: mockApiClient
}));

import { EpisodeService } from '../episode.service';
import type { ApiEpisode } from '../../types/api.types';

describe('EpisodeService', () => {
  let episodeService: EpisodeService;

  beforeEach(() => {
    jest.clearAllMocks();
    episodeService = new EpisodeService();
  });

  describe('getEpisodeById', () => {
    it('should fetch episode by ID', async () => {
      const mockEpisode: ApiEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: ['https://rickandmortyapi.com/api/character/1'],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z'
      };
      
      mockApiClient.get.mockResolvedValue(mockEpisode);

      const result = await episodeService.getEpisodeById(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/episode/1', undefined);
      expect(result).toEqual(mockEpisode);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Episode not found';
      mockApiClient.get.mockRejectedValue(new Error(errorMessage));

      await expect(episodeService.getEpisodeById(999)).rejects.toThrow(errorMessage);
    });

    it('should pass AbortSignal when provided', async () => {
      const controller = new AbortController();
      const mockEpisode: ApiEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: ['https://rickandmortyapi.com/api/character/1'],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z'
      };
      
      mockApiClient.get.mockResolvedValue(mockEpisode);

      await episodeService.getEpisodeById(1, controller.signal);

      expect(mockApiClient.get).toHaveBeenCalledWith('/episode/1', controller.signal);
    });
  });

  describe('getEpisodesByIds', () => {
    it('should fetch multiple episodes by IDs', async () => {
      const mockEpisodes: ApiEpisode[] = [
        {
          id: 1,
          name: 'Pilot',
          air_date: 'December 2, 2013',
          episode: 'S01E01',
          characters: ['https://rickandmortyapi.com/api/character/1'],
          url: 'https://rickandmortyapi.com/api/episode/1',
          created: '2017-11-10T12:56:33.798Z'
        }
      ];
      
      mockApiClient.get.mockResolvedValue(mockEpisodes);

      const result = await episodeService.getEpisodesByIds([1, 2]);

      expect(mockApiClient.get).toHaveBeenCalledWith('/episode/1,2', undefined);
      expect(result).toEqual(mockEpisodes);
    });

    it('should handle empty ID array', async () => {
      const result = await episodeService.getEpisodesByIds([]);

      expect(result).toEqual([]);
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });
  });

  describe('extractEpisodeId', () => {
    it('should extract episode ID from valid URL', () => {
      const url = 'https://rickandmortyapi.com/api/episode/1';
      const result = episodeService.extractEpisodeId(url);
      expect(result).toBe(1);
    });

    it('should extract episode ID from URL with trailing slash', () => {
      const url = 'https://rickandmortyapi.com/api/episode/1/';
      const result = episodeService.extractEpisodeId(url);
      expect(result).toBe(1);
    });

    it('should return null for invalid URL', () => {
      const url = 'https://invalidurl.com';
      const result = episodeService.extractEpisodeId(url);
      expect(result).toBeNull();
    });

    it('should return null for URL without episode ID', () => {
      const url = 'https://rickandmortyapi.com/api/episode/';
      const result = episodeService.extractEpisodeId(url);
      expect(result).toBeNull();
    });

    it('should handle various episode ID formats', () => {
      expect(episodeService.extractEpisodeId('https://rickandmortyapi.com/api/episode/42')).toBe(42);
      expect(episodeService.extractEpisodeId('https://rickandmortyapi.com/api/episode/123/')).toBe(123);
    });
  });

  describe('extractEpisodeIds', () => {
    it('should extract multiple episode IDs from URLs', () => {
      const urls = [
        'https://rickandmortyapi.com/api/episode/1',
        'https://rickandmortyapi.com/api/episode/2',
      ];
      const result = episodeService.extractEpisodeIds(urls);
      expect(result).toEqual([1, 2]);
    });

    it('should filter out invalid URLs', () => {
      const urls = [
        'https://rickandmortyapi.com/api/episode/1',
        'https://invalidurl.com',
        'https://rickandmortyapi.com/api/episode/2',
      ];
      const result = episodeService.extractEpisodeIds(urls);
      expect(result).toEqual([1, 2]);
    });

    it('should handle empty array', () => {
      const result = episodeService.extractEpisodeIds([]);
      expect(result).toEqual([]);
    });
  });

  describe('getEpisodeNameByUrl', () => {
    it('should get episode name from valid URL', async () => {
      const mockEpisode: ApiEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: ['https://rickandmortyapi.com/api/character/1'],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z'
      };
      
      mockApiClient.get.mockResolvedValue(mockEpisode);

      const result = await episodeService.getEpisodeNameByUrl('https://rickandmortyapi.com/api/episode/1');

      expect(mockApiClient.get).toHaveBeenCalledWith('/episode/1', undefined);
      expect(result).toBe('Pilot');
    });

    it('should return "Unknown Episode" for invalid URL', async () => {
      const result = await episodeService.getEpisodeNameByUrl('https://invalidurl.com');

      expect(result).toBe('Unknown Episode');
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });

    it('should return "Unknown Episode" on API error', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      const result = await episodeService.getEpisodeNameByUrl('https://rickandmortyapi.com/api/episode/1');

      expect(result).toBe('Unknown Episode');
    });
  });

  describe('getFirstEpisodeName', () => {
    it('should get first episode name from episode URLs', async () => {
      const mockEpisode: ApiEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: ['https://rickandmortyapi.com/api/character/1'],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z'
      };
      
      mockApiClient.get.mockResolvedValue(mockEpisode);

      const result = await episodeService.getFirstEpisodeName([
        'https://rickandmortyapi.com/api/episode/1',
        'https://rickandmortyapi.com/api/episode/2'
      ]);

      expect(mockApiClient.get).toHaveBeenCalledWith('/episode/1', undefined);
      expect(result).toBe('Pilot');
    });

    it('should return "Unknown Episode" for empty array', async () => {
      const result = await episodeService.getFirstEpisodeName([]);

      expect(result).toBe('Unknown Episode');
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });
  });
});