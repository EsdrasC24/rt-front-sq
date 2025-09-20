/**
 * Character data mappers
 * Transform API data to application-specific interfaces
 */

import type { ApiCharacter, CharacterStatus } from '../types/api.types';

/**
 * Application character interface (simplified for UI)
 */
export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
}

/**
 * Character mapper class for data transformation
 */
export class CharacterMapper {
  /**
   * Transform API character to application character
   */
  static toCharacter(apiCharacter: ApiCharacter): Character {
    return {
      id: apiCharacter.id,
      name: apiCharacter.name,
      status: apiCharacter.status,
      species: apiCharacter.species,
      type: apiCharacter.type,
      gender: apiCharacter.gender,
      origin: {
        name: apiCharacter.origin.name,
        url: apiCharacter.origin.url,
      },
      location: {
        name: apiCharacter.location.name,
        url: apiCharacter.location.url,
      },
      image: apiCharacter.image,
      episode: apiCharacter.episode,
    };
  }

  /**
   * Transform multiple API characters to application characters
   */
  static toCharacters(apiCharacters: ApiCharacter[]): Character[] {
    return apiCharacters.map(this.toCharacter);
  }

  /**
   * Get status in Spanish for UI display
   */
  static getStatusInSpanish(status: CharacterStatus): string {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'Vivo';
      case 'dead':
        return 'Muerto';
      default:
        return 'Desconocido';
    }
  }

  /**
   * Get status variant for badge styling
   */
  static getStatusVariant(status: CharacterStatus): 'species' | 'status' {
    return status.toLowerCase() === 'alive' ? 'species' : 'status';
  }

  /**
   * Filter options for the application
   */
  static getFilterOptions() {
    return {
      species: ['Human', 'Alien', 'Humanoid', 'Poopybutthole', 'Mythological Creature', 'Animal', 'Robot'],
      gender: ['Female', 'Male', 'Genderless', 'unknown'],
      status: ['Alive', 'Dead', 'unknown'] as CharacterStatus[],
    };
  }

  /**
   * Map filter options to Spanish for UI
   */
  static getFilterOptionsInSpanish() {
    return {
      species: ['Humano', 'Cronenbergs', 'Meeseeks', 'Arañas gigantes telépatas'],
      gender: ['Masculino', 'Femenino', 'Desconocido'],
      status: ['Vivo', 'Muerto'],
    };
  }

  /**
   * Map Spanish filter values back to English for API
   */
  static mapSpanishToEnglish(category: 'species' | 'gender' | 'status', value: string): string {
    const mappings = {
      species: {
        'Humano': 'Human',
        'Cronenbergs': 'Cronenberg',
        'Meeseeks': 'Meeseeks',
        'Arañas gigantes telépatas': 'Alien',
      },
      gender: {
        'Masculino': 'Male',
        'Femenino': 'Female',
        'Desconocido': 'unknown',
      },
      status: {
        'Vivo': 'Alive',
        'Muerto': 'Dead',
      },
    };

    return mappings[category][value as keyof typeof mappings[typeof category]] || value;
  }
}