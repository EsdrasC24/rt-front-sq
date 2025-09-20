/**
 * Custom hook for episode data management
 * Handles episode name fetching for character cards
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { episodeService } from '../services';

/**
 * Episode cache to avoid repeated API calls
 */
const episodeCache = new Map<string, string>();

/**
 * Pending requests to avoid duplicate calls
 */
const pendingRequests = new Map<string, Promise<string>>();

/**
 * Hook for fetching episode names
 */
export const useEpisode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Cleanup function
   */
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  /**
   * Get episode name by URL with caching and deduplication
   */
  const getEpisodeName = useCallback(async (episodeUrl: string): Promise<string> => {
    // Check cache first
    if (episodeCache.has(episodeUrl)) {
      return episodeCache.get(episodeUrl)!;
    }

    // Check if there's already a pending request for this URL
    if (pendingRequests.has(episodeUrl)) {
      return pendingRequests.get(episodeUrl)!;
    }

    cleanup();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    // Create the promise and store it to avoid duplicates
    const promise = (async () => {
      try {
        const episodeName = await episodeService.getEpisodeNameByUrl(
          episodeUrl,
          abortControllerRef.current?.signal
        );

        // Cache the result
        episodeCache.set(episodeUrl, episodeName);
        
        setLoading(false);
        return episodeName;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return 'Unknown Episode';
        }

        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch episode';
        setError(errorMessage);
        setLoading(false);
        
        // Return fallback value
        const fallback = 'Unknown Episode';
        episodeCache.set(episodeUrl, fallback);
        return fallback;
      } finally {
        // Remove from pending requests
        pendingRequests.delete(episodeUrl);
      }
    })();

    // Store the promise to avoid duplicate requests
    pendingRequests.set(episodeUrl, promise);

    return promise;
  }, [cleanup]);

  /**
   * Get first episode name from episode list
   */
  const getFirstEpisodeName = useCallback(async (episodeUrls: string[]): Promise<string> => {
    if (episodeUrls.length === 0) {
      return 'Unknown Episode';
    }

    return getEpisodeName(episodeUrls[0]);
  }, [getEpisodeName]);

  return {
    loading,
    error,
    getEpisodeName,
    getFirstEpisodeName,
    cleanup,
  };
};