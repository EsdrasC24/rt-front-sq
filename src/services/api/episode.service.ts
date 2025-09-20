/**
 * Episode service for Rick and Morty API
 * Handles episode-related API operations needed for character cards
 */

import { apiClient } from './client';
import type { ApiEpisode } from '../types/api.types';

/**
 * Episode service class with episode-related API operations
 */
export class EpisodeService {
  private readonly endpoint = '/episode';

  /**
   * Get a single episode by ID
   */
  async getEpisodeById(
    id: number,
    signal?: AbortSignal
  ): Promise<ApiEpisode> {
    return apiClient.get<ApiEpisode>(`${this.endpoint}/${id}`, signal);
  }

  /**
   * Get multiple episodes by IDs
   */
  async getEpisodesByIds(
    ids: number[],
    signal?: AbortSignal
  ): Promise<ApiEpisode[]> {
    if (ids.length === 0) {
      return [];
    }
    
    const idsString = ids.join(',');
    return apiClient.get<ApiEpisode[]>(`${this.endpoint}/${idsString}`, signal);
  }

  /**
   * Extract episode ID from episode URL
   * Example: "https://rickandmortyapi.com/api/episode/1" -> 1
   */
  extractEpisodeId(episodeUrl: string): number | null {
    const match = episodeUrl.match(/\/episode\/(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Extract multiple episode IDs from episode URLs
   */
  extractEpisodeIds(episodeUrls: string[]): number[] {
    return episodeUrls
      .map(url => this.extractEpisodeId(url))
      .filter((id): id is number => id !== null);
  }

  /**
   * Get episode name by URL (utility method for character cards)
   */
  async getEpisodeNameByUrl(
    episodeUrl: string,
    signal?: AbortSignal
  ): Promise<string> {
    try {
      const episodeId = this.extractEpisodeId(episodeUrl);
      if (!episodeId) {
        return 'Unknown Episode';
      }

      const episode = await this.getEpisodeById(episodeId, signal);
      return episode.name;
    } catch (error) {
      // Don't log abort errors as they are expected when components unmount
      if (error instanceof Error && error.name === 'AbortError') {
        throw error; // Re-throw abort errors to be handled by the caller
      }
      
      // Only log actual errors, not aborts
      if (!(error instanceof Error) || !error.message.includes('aborted')) {
        console.warn(`Failed to fetch episode name for URL: ${episodeUrl}`, error);
      }
      
      return 'Unknown Episode';
    }
  }

  /**
   * Get first episode name from character's episode list
   * Used for "First seen in" field in character cards
   */
  async getFirstEpisodeName(
    episodeUrls: string[],
    signal?: AbortSignal
  ): Promise<string> {
    if (episodeUrls.length === 0) {
      return 'Unknown Episode';
    }

    return this.getEpisodeNameByUrl(episodeUrls[0], signal);
  }
}

/**
 * Default episode service instance
 */
export const episodeService = new EpisodeService();