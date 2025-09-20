import { ApiClient, ApiClientError, API_BASE_URL } from '../client';

// Mock fetch globally
const mockFetch = jest.fn();
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true,
});

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should use default base URL when none provided', () => {
      const client = new ApiClient();
      expect(client).toBeInstanceOf(ApiClient);
    });

    it('should use custom base URL when provided', () => {
      const customUrl = 'https://custom-api.com/api';
      const client = new ApiClient(customUrl);
      expect(client).toBeInstanceOf(ApiClient);
    });
  });

  describe('GET Requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Rick Sanchez' };
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockData),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/character/1');

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/character/1`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          signal: undefined,
        })
      );
    });

    it('should handle GET request with AbortSignal', async () => {
      const mockData = { id: 1, name: 'Rick Sanchez' };
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockData),
      };

      const abortController = new AbortController();
      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/character/1', abortController.signal);

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: abortController.signal,
        })
      );
    });

    it('should handle AbortError correctly', async () => {
      const abortError = new Error('Operation was aborted');
      abortError.name = 'AbortError';
      
      mockFetch.mockRejectedValue(abortError);

      await expect(apiClient.get('/character/1')).rejects.toThrow('Operation was aborted');
    });
  });

  describe('Error Handling', () => {
    it('should throw ApiClientError for 404 responses', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({ error: 'Character not found' }),
      };

      mockFetch.mockResolvedValue(mockErrorResponse);

      await expect(apiClient.get('/character/999')).rejects.toThrow(ApiClientError);

      try {
        await apiClient.get('/character/999');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        expect((error as ApiClientError).status).toBe(404);
        expect((error as ApiClientError).message).toBe('Character not found');
      }
    });

    it('should throw ApiClientError for 500 responses', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({ error: 'Internal server error' }),
      };

      mockFetch.mockResolvedValue(mockErrorResponse);

      await expect(apiClient.get('/character/1')).rejects.toThrow(ApiClientError);
    });

    it('should handle responses without JSON error data', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 400,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      };

      mockFetch.mockResolvedValue(mockErrorResponse);

      await expect(apiClient.get('/character/1')).rejects.toThrow(ApiClientError);

      try {
        await apiClient.get('/character/1');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        expect((error as ApiClientError).status).toBe(400);
      }
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(apiClient.get('/character/1')).rejects.toThrow(ApiClientError);

      try {
        await apiClient.get('/character/1');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        expect((error as ApiClientError).message).toContain('Network error');
      }
    });

    it('should handle unknown errors', async () => {
      mockFetch.mockRejectedValue('Unknown error');

      await expect(apiClient.get('/character/1')).rejects.toThrow(ApiClientError);

      try {
        await apiClient.get('/character/1');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        expect((error as ApiClientError).message).toContain('Unknown error');
      }
    });
  });

  describe('Query String Builder', () => {
    it('should build empty query string for empty params', () => {
      const queryString = apiClient.buildQueryString({});
      expect(queryString).toBe('');
    });

    it('should build query string with single parameter', () => {
      const queryString = apiClient.buildQueryString({ name: 'Rick' });
      expect(queryString).toBe('?name=Rick');
    });

    it('should build query string with multiple parameters', () => {
      const queryString = apiClient.buildQueryString({
        name: 'Rick',
        status: 'Alive'
      });
      expect(queryString).toBe('?name=Rick&status=Alive');
    });

    it('should exclude undefined values', () => {
      const queryString = apiClient.buildQueryString({
        name: 'Rick',
        status: undefined
      });
      expect(queryString).toBe('?name=Rick');
    });

    it('should exclude null values', () => {
      const queryString = apiClient.buildQueryString({
        name: 'Rick',
        status: null
      });
      expect(queryString).toBe('?name=Rick');
    });

    it('should exclude empty string values', () => {
      const queryString = apiClient.buildQueryString({
        name: 'Rick',
        status: ''
      });
      expect(queryString).toBe('?name=Rick');
    });

    it('should handle special characters in values', () => {
      const queryString = apiClient.buildQueryString({
        name: 'Rick & Morty'
      });
      expect(queryString).toBe('?name=Rick+%26+Morty');
    });

    it('should handle numeric values', () => {
      const queryString = apiClient.buildQueryString({
        page: 1,
        id: 42
      });
      expect(queryString).toBe('?page=1&id=42');
    });

    it('should handle boolean values', () => {
      const queryString = apiClient.buildQueryString({
        active: true,
        disabled: false
      });
      expect(queryString).toBe('?active=true&disabled=false');
    });
  });

  describe('Request Headers', () => {
    it('should include default Content-Type header', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await apiClient.get('/character/1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });

  describe('Base URL Configuration', () => {
    it('should construct correct URLs with default base URL', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await apiClient.get('/character/1');

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/character/1`,
        expect.any(Object)
      );
    });

    it('should construct correct URLs with custom base URL', async () => {
      const customUrl = 'https://custom-api.com/api';
      const customClient = new ApiClient(customUrl);
      
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await customClient.get('/character/1');

      expect(mockFetch).toHaveBeenCalledWith(
        `${customUrl}/character/1`,
        expect.any(Object)
      );
    });
  });

  describe('Request Configuration', () => {
    it('should use GET method by default', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await apiClient.get('/character/1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should not include body in GET requests', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await apiClient.get('/character/1');

      const fetchCall = mockFetch.mock.calls[0];
      const requestConfig = fetchCall[1];

      expect(requestConfig.body).toBeUndefined();
    });
  });
});