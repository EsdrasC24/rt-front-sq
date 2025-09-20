/**
 * Character Service Tests
 * Testing character API operations and data fetching
 */

// Mock apiClient antes de importar CharacterService
const mockApiClient = {
  get: jest.fn(),
  buildQueryString: jest.fn()
};

jest.doMock('../client', () => ({
  apiClient: mockApiClient
}));

import { CharacterService } from '../character.service';
import type { 
  ApiCharacter, 
  CharacterFilters,
  ApiResponse 
} from '../../types/api.types';

describe('CharacterService', () => {
  let characterService: CharacterService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock behavior for buildQueryString
    mockApiClient.buildQueryString.mockImplementation((params: Record<string, any>) => {
      if (!params || Object.keys(params).length === 0) return '';
      
      const queryParts = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${key}=${value}`);
      
      return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    });
    
    characterService = new CharacterService();
  });

  describe('getCharacters', () => {
    it('should get characters without filters', async () => {
      const mockResponse: ApiResponse<ApiCharacter> = {
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null
        },
        results: [{
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          type: '',
          gender: 'Male',
          origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
          location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/20' },
          image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          episode: ['https://rickandmortyapi.com/api/episode/1'],
          url: 'https://rickandmortyapi.com/api/character/1',
          created: '2017-11-04T18:48:46.250Z'
        }]
      };
      
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await characterService.getCharacters();

      expect(mockApiClient.buildQueryString).toHaveBeenCalledWith({});
      expect(mockApiClient.get).toHaveBeenCalledWith('/character', undefined);
      expect(result).toEqual(mockResponse);
    });

    it('should get characters with filters', async () => {
      const filters: CharacterFilters = {
        name: 'Rick',
        status: 'Alive'
      };
      
      const mockResponse: ApiResponse<ApiCharacter> = {
        info: { count: 1, pages: 1, next: null, prev: null },
        results: []
      };
      
      mockApiClient.get.mockResolvedValue(mockResponse);
      mockApiClient.buildQueryString.mockReturnValue('?name=Rick&status=Alive');

      const result = await characterService.getCharacters(filters);

      expect(mockApiClient.buildQueryString).toHaveBeenCalledWith(filters);
      expect(mockApiClient.get).toHaveBeenCalledWith('/character?name=Rick&status=Alive', undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCharacterById', () => {
    it('should get character by ID', async () => {
      const mockCharacter: ApiCharacter = {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/20' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: ['https://rickandmortyapi.com/api/episode/1'],
        url: 'https://rickandmortyapi.com/api/character/1',
        created: '2017-11-04T18:48:46.250Z'
      };
      
      mockApiClient.get.mockResolvedValue(mockCharacter);

      const result = await characterService.getCharacterById(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/character/1', undefined);
      expect(result).toEqual(mockCharacter);
    });

    it('should pass AbortSignal to API client', async () => {
      const controller = new AbortController();
      const mockCharacter: ApiCharacter = {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/20' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: ['https://rickandmortyapi.com/api/episode/1'],
        url: 'https://rickandmortyapi.com/api/character/1',
        created: '2017-11-04T18:48:46.250Z'
      };
      
      mockApiClient.get.mockResolvedValue(mockCharacter);

      await characterService.getCharacterById(1, controller.signal);

      expect(mockApiClient.get).toHaveBeenCalledWith('/character/1', controller.signal);
    });
  });

  describe('getCharactersByIds', () => {
    it('should get multiple characters by IDs', async () => {
      const mockCharacters: ApiCharacter[] = [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          type: '',
          gender: 'Male',
          origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
          location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/20' },
          image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          episode: ['https://rickandmortyapi.com/api/episode/1'],
          url: 'https://rickandmortyapi.com/api/character/1',
          created: '2017-11-04T18:48:46.250Z'
        }
      ];
      
      mockApiClient.get.mockResolvedValue(mockCharacters);

      const result = await characterService.getCharactersByIds([1, 2]);

      expect(mockApiClient.get).toHaveBeenCalledWith('/character/1,2', undefined);
      expect(result).toEqual(mockCharacters);
    });

    it('should return empty array for empty IDs', async () => {
      const result = await characterService.getCharactersByIds([]);

      expect(result).toEqual([]);
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      const errorMessage = 'Character not found';
      mockApiClient.get.mockRejectedValue(new Error(errorMessage));

      await expect(characterService.getCharacterById(999)).rejects.toThrow(errorMessage);
    });
  });
});