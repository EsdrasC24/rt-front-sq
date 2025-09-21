/**
 * Core API types and interfaces for Rick and Morty API
 * Base URL: https://rickandmortyapi.com/api
 */

// Character related types
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

/**
 * Character data structure from Rick and Morty API
 */
export interface ApiCharacter {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
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
  url: string;
  created: string;
}

/**
 * Episode data structure from Rick and Morty API
 */
export interface ApiEpisode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

/**
 * Generic API response with pagination info
 */
export interface ApiResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}

/**
 * Character filter parameters for API requests
 */
export interface CharacterFilters {
  name?: string;
  status?: CharacterStatus | CharacterStatus[];
  species?: string | string[];
  type?: string;
  gender?: CharacterGender | CharacterGender[];
  page?: number;
}

/**
 * Error response from API
 */
export interface ApiError {
  error: string;
}