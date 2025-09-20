/**
 * Character service for Rick and Morty API
 * Handles all character-related API operations
 */

import { apiClient } from './client';
import type { 
  ApiCharacter, 
  ApiResponse, 
  CharacterFilters 
} from '../types/api.types';

/**
 * Character service class with all character-related API operations
 */
export class CharacterService {
  private readonly endpoint = '/character';

  /**
   * Get paginated list of characters with optional filters
   */
  async getCharacters(
    filters: CharacterFilters = {},
    signal?: AbortSignal
  ): Promise<ApiResponse<ApiCharacter>> {
    const queryString = apiClient.buildQueryString(filters as Record<string, unknown>);
    const fullEndpoint = `${this.endpoint}${queryString}`;
    
    return apiClient.get<ApiResponse<ApiCharacter>>(fullEndpoint, signal);
  }

  /**
   * Get a single character by ID
   */
  async getCharacterById(
    id: number,
    signal?: AbortSignal
  ): Promise<ApiCharacter> {
    return apiClient.get<ApiCharacter>(`${this.endpoint}/${id}`, signal);
  }

  /**
   * Get multiple characters by IDs
   */
  async getCharactersByIds(
    ids: number[],
    signal?: AbortSignal
  ): Promise<ApiCharacter[]> {
    if (ids.length === 0) {
      return [];
    }
    
    const idsString = ids.join(',');
    return apiClient.get<ApiCharacter[]>(`${this.endpoint}/${idsString}`, signal);
  }

  /**
   * Search characters by name with debounced pagination
   */
  async searchCharactersByName(
    name: string,
    page: number = 1,
    signal?: AbortSignal
  ): Promise<ApiResponse<ApiCharacter>> {
    const filters: CharacterFilters = { name, page };
    return this.getCharacters(filters, signal);
  }

  /**
   * Filter characters by status
   */
  async getCharactersByStatus(
    status: CharacterFilters['status'],
    page: number = 1,
    signal?: AbortSignal
  ): Promise<ApiResponse<ApiCharacter>> {
    const filters: CharacterFilters = { status, page };
    return this.getCharacters(filters, signal);
  }

  /**
   * Filter characters by species
   */
  async getCharactersBySpecies(
    species: string,
    page: number = 1,
    signal?: AbortSignal
  ): Promise<ApiResponse<ApiCharacter>> {
    const filters: CharacterFilters = { species, page };
    return this.getCharacters(filters, signal);
  }

  /**
   * Filter characters by gender
   */
  async getCharactersByGender(
    gender: CharacterFilters['gender'],
    page: number = 1,
    signal?: AbortSignal
  ): Promise<ApiResponse<ApiCharacter>> {
    const filters: CharacterFilters = { gender, page };
    return this.getCharacters(filters, signal);
  }

  /**
   * Apply multiple filters to characters
   */
  async getFilteredCharacters(
    filters: Omit<CharacterFilters, 'page'>,
    page: number = 1,
    signal?: AbortSignal
  ): Promise<ApiResponse<ApiCharacter>> {
    const fullFilters: CharacterFilters = { ...filters, page };
    return this.getCharacters(fullFilters, signal);
  }
}

/**
 * Default character service instance
 */
export const characterService = new CharacterService();