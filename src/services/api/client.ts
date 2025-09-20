/**
 * Base API client for Rick and Morty API
 * Handles common HTTP operations and error handling
 */

import type { ApiError } from '../types/api.types';

/**
 * Base URL for Rick and Morty API
 */
export const API_BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Custom error class for API-related errors
 */
export class ApiClientError extends Error {
  public status?: number;
  public response?: unknown;

  constructor(
    message: string,
    status?: number,
    response?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.response = response;
  }
}

/**
 * HTTP request options interface
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Base API client with common functionality
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Execute HTTP request with error handling
   */
  private async request<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<T> {
    const { method = 'GET', headers = {}, body, signal } = options;
    
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }));
        
        throw new ApiClientError(
          errorData.error || `Request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error; // Preserve the original AbortError
      }
      
      throw new ApiClientError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Execute GET request
   */
  async get<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', signal });
  }

  /**
   * Build query string from parameters
   */
  public buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient();