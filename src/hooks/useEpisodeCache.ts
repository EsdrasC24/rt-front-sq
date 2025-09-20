/**
 * Global episode cache hook
 * Provides centralized episode name management with deduplication
 */

import { useCallback, useRef, useEffect } from 'react';
import { episodeService } from '../services';

/**
 * Global episode cache to avoid repeated API calls
 */
const globalEpisodeCache = new Map<string, string>();

/**
 * Global pending requests to avoid duplicate calls
 */
const globalPendingRequests = new Map<string, Promise<string>>();

/**
 * Global abort controllers for cleanup
 */
const globalAbortControllers = new Map<string, AbortController>();

/**
 * Hook for cached episode name fetching
 */
export const useEpisodeCache = () => {
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Get episode name with global caching and deduplication
   */
  const getEpisodeName = useCallback(async (episodeUrl: string): Promise<string> => {
    // Check cache first
    if (globalEpisodeCache.has(episodeUrl)) {
      return globalEpisodeCache.get(episodeUrl)!;
    }

    // Check if there's already a pending request for this URL
    if (globalPendingRequests.has(episodeUrl)) {
      return globalPendingRequests.get(episodeUrl)!;
    }

    // Cancel any existing request for this URL
    if (globalAbortControllers.has(episodeUrl)) {
      globalAbortControllers.get(episodeUrl)!.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    globalAbortControllers.set(episodeUrl, abortController);

    // Create the promise and store it to avoid duplicates
    const promise = (async () => {
      try {
        const episodeName = await episodeService.getEpisodeNameByUrl(
          episodeUrl,
          abortController.signal
        );

        // Only cache if component is still mounted and request wasn't aborted
        if (mountedRef.current && !abortController.signal.aborted) {
          globalEpisodeCache.set(episodeUrl, episodeName);
        }
        
        return episodeName;
      } catch (err) {
        // Handle abort gracefully
        if (err instanceof Error && err.name === 'AbortError') {
          return 'Unknown Episode';
        }

        // Cache fallback value to avoid repeated failed requests
        const fallback = 'Unknown Episode';
        if (mountedRef.current) {
          globalEpisodeCache.set(episodeUrl, fallback);
        }
        return fallback;
      } finally {
        // Cleanup
        globalPendingRequests.delete(episodeUrl);
        globalAbortControllers.delete(episodeUrl);
      }
    })();

    // Store the promise to avoid duplicate requests
    globalPendingRequests.set(episodeUrl, promise);

    return promise;
  }, []);

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
    getEpisodeName,
    getFirstEpisodeName,
  };
};