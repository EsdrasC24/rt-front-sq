import { CharacterMapper } from '../character.mapper';
import type { ApiCharacter } from '../../types/api.types';

describe('CharacterMapper', () => {
  const mockApiCharacter: ApiCharacter = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: {
      name: 'Earth (C-137)',
      url: 'https://rickandmortyapi.com/api/location/1'
    },
    location: {
      name: 'Citadel of Ricks',
      url: 'https://rickandmortyapi.com/api/location/3'
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: [
      'https://rickandmortyapi.com/api/episode/1',
      'https://rickandmortyapi.com/api/episode/2'
    ],
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2017-11-04T18:48:46.250Z'
  };

  describe('toCharacter', () => {
    it('should map API character to domain character correctly', () => {
      const result = CharacterMapper.toCharacter(mockApiCharacter);

      expect(result).toEqual({
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: {
          name: 'Earth (C-137)',
          url: 'https://rickandmortyapi.com/api/location/1'
        },
        location: {
          name: 'Citadel of Ricks',
          url: 'https://rickandmortyapi.com/api/location/3'
        },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: [
          'https://rickandmortyapi.com/api/episode/1',
          'https://rickandmortyapi.com/api/episode/2'
        ]
      });
    });

    it('should handle character with minimal data', () => {
      const minimalApiCharacter: ApiCharacter = {
        ...mockApiCharacter,
        type: '',
        origin: { name: 'unknown', url: '' },
        location: { name: 'unknown', url: '' },
        episode: []
      };

      const result = CharacterMapper.toCharacter(minimalApiCharacter);

      expect(result.type).toBe('');
      expect(result.origin).toEqual({ name: 'unknown', url: '' });
      expect(result.location).toEqual({ name: 'unknown', url: '' });
      expect(result.episode).toEqual([]);
    });

    it('should preserve all character properties', () => {
      const result = CharacterMapper.toCharacter(mockApiCharacter);

      // Check all required properties exist
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('species');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('gender');
      expect(result).toHaveProperty('origin');
      expect(result).toHaveProperty('location');
      expect(result).toHaveProperty('image');
      expect(result).toHaveProperty('episode');

      // Check that origin and location have correct structure
      expect(result.origin).toHaveProperty('name');
      expect(result.origin).toHaveProperty('url');
      expect(result.location).toHaveProperty('name');
      expect(result.location).toHaveProperty('url');
    });
  });

  describe('toCharacters', () => {
    it('should map array of API characters to domain characters', () => {
      const apiCharacters: ApiCharacter[] = [mockApiCharacter];
      const result = CharacterMapper.toCharacters(apiCharacters);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(CharacterMapper.toCharacter(mockApiCharacter));
    });

    it('should handle empty array', () => {
      const result = CharacterMapper.toCharacters([]);
      expect(result).toEqual([]);
    });

    it('should map multiple characters correctly', () => {
      const secondCharacter: ApiCharacter = {
        ...mockApiCharacter,
        id: 2,
        name: 'Morty Smith',
        status: 'Alive'
      };

      const apiCharacters: ApiCharacter[] = [mockApiCharacter, secondCharacter];
      const result = CharacterMapper.toCharacters(apiCharacters);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Rick Sanchez');
      expect(result[1].id).toBe(2);
      expect(result[1].name).toBe('Morty Smith');
    });
  });

  describe('getStatusInSpanish', () => {
    it('should return correct Spanish translations', () => {
      expect(CharacterMapper.getStatusInSpanish('Alive')).toBe('Vivo');
      expect(CharacterMapper.getStatusInSpanish('Dead')).toBe('Muerto');
      expect(CharacterMapper.getStatusInSpanish('unknown')).toBe('Desconocido');
    });

    it('should handle case insensitive input', () => {
      expect(CharacterMapper.getStatusInSpanish('Alive')).toBe('Vivo');
      expect(CharacterMapper.getStatusInSpanish('Dead')).toBe('Muerto');
      expect(CharacterMapper.getStatusInSpanish('unknown')).toBe('Desconocido');
    });

    it('should return default for invalid status', () => {
      expect(CharacterMapper.getStatusInSpanish('invalid' as any)).toBe('Desconocido');
    });
  });

  describe('getStatusVariant', () => {
    it('should return correct variants for status badges', () => {
      expect(CharacterMapper.getStatusVariant('Alive')).toBe('species');
      expect(CharacterMapper.getStatusVariant('Dead')).toBe('status');
      expect(CharacterMapper.getStatusVariant('unknown')).toBe('status');
    });

    it('should handle case insensitive input', () => {
      expect(CharacterMapper.getStatusVariant('Alive')).toBe('species');
      expect(CharacterMapper.getStatusVariant('Dead')).toBe('status');
    });
  });

  describe('getFilterOptions', () => {
    it('should return valid filter options', () => {
      const options = CharacterMapper.getFilterOptions();

      expect(options).toHaveProperty('species');
      expect(options).toHaveProperty('gender');
      expect(options).toHaveProperty('status');

      expect(Array.isArray(options.species)).toBe(true);
      expect(Array.isArray(options.gender)).toBe(true);
      expect(Array.isArray(options.status)).toBe(true);

      expect(options.species.length).toBeGreaterThan(0);
      expect(options.gender.length).toBeGreaterThan(0);
      expect(options.status.length).toBeGreaterThan(0);
    });
  });

  describe('mapSpanishToEnglish', () => {
    it('should map Spanish species to English', () => {
      expect(CharacterMapper.mapSpanishToEnglish('species', 'Humano')).toBe('Human');
      expect(CharacterMapper.mapSpanishToEnglish('species', 'Cronenbergs')).toBe('Cronenberg');
    });

    it('should map Spanish gender to English', () => {
      expect(CharacterMapper.mapSpanishToEnglish('gender', 'Masculino')).toBe('Male');
      expect(CharacterMapper.mapSpanishToEnglish('gender', 'Femenino')).toBe('Female');
      expect(CharacterMapper.mapSpanishToEnglish('gender', 'Desconocido')).toBe('unknown');
    });

    it('should map Spanish status to English', () => {
      expect(CharacterMapper.mapSpanishToEnglish('status', 'Vivo')).toBe('Alive');
      expect(CharacterMapper.mapSpanishToEnglish('status', 'Muerto')).toBe('Dead');
    });

    it('should return original value for unmapped items', () => {
      expect(CharacterMapper.mapSpanishToEnglish('species', 'UnknownSpecies')).toBe('UnknownSpecies');
      expect(CharacterMapper.mapSpanishToEnglish('gender', 'UnknownGender')).toBe('UnknownGender');
      expect(CharacterMapper.mapSpanishToEnglish('status', 'UnknownStatus')).toBe('UnknownStatus');
    });
  });
});