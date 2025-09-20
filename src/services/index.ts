/**
 * Main API services index
 * Central export point for all API services, types, and mappers
 */

// API Client
export { ApiClient, apiClient, ApiClientError } from './api/client';

// Services
export { CharacterService, characterService } from './api/character.service';
export { EpisodeService, episodeService } from './api/episode.service';

// Mappers
export { CharacterMapper, type Character } from './mappers/character.mapper';

// Types
export type {
  ApiCharacter,
  ApiEpisode,
  ApiResponse,
  CharacterFilters,
  CharacterStatus,
  CharacterGender,
  ApiError
} from './types/api.types';