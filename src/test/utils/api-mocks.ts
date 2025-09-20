import { 
  mockApiResponse, 
  mockApiResponsePage2, 
  mockEmptyApiResponse, 
  mockCharacter,
  mockEpisode,
  createMockFetchResponse,
  createMockFetchErrorResponse,
  createMockAbortError,
  createMockNetworkError 
} from './mock-data';

/**
 * Base URL for Rick and Morty API
 */
export const API_BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Mock fetch implementation for successful requests
 */
export const createMockFetch = (responses: Record<string, any> = {}) => {
  return jest.fn().mockImplementation((url: string | URL, options?: RequestInit) => {
    const urlStr = typeof url === 'string' ? url : url.toString();
    
    // Handle AbortController
    if (options?.signal?.aborted) {
      return Promise.reject(createMockAbortError());
    }
    
    // Default responses for common endpoints
    const defaultResponses: Record<string, any> = {
      // Characters endpoints
      [`${API_BASE_URL}/character`]: mockApiResponse,
      [`${API_BASE_URL}/character?page=1`]: mockApiResponse,
      [`${API_BASE_URL}/character?page=2`]: mockApiResponsePage2,
      [`${API_BASE_URL}/character/1`]: mockCharacter,
      [`${API_BASE_URL}/character/2`]: mockCharacter,
      
      // Episodes endpoints
      [`${API_BASE_URL}/episode/1`]: mockEpisode,
      
      // Search endpoints
      [`${API_BASE_URL}/character?name=Rick`]: {
        ...mockApiResponse,
        results: [mockCharacter]
      },
      [`${API_BASE_URL}/character?name=NonExistent`]: mockEmptyApiResponse,
      
      // Filter endpoints
      [`${API_BASE_URL}/character?status=Alive`]: mockApiResponse,
      [`${API_BASE_URL}/character?species=Human`]: mockApiResponse,
      [`${API_BASE_URL}/character?gender=Male`]: mockApiResponse,
      
      ...responses
    };
    
    // Find matching response
    const response = defaultResponses[urlStr];
    
    if (response) {
      return Promise.resolve(createMockFetchResponse(response));
    }
    
    // Handle parameterized URLs (like search with query params)
    const entries = Object.entries(defaultResponses);
    for (const [pattern, mockResponse] of entries) {
      if (urlStr.includes(pattern) || pattern.includes(urlStr.split('?')[0])) {
        return Promise.resolve(createMockFetchResponse(mockResponse));
      }
    }
    
    // Default 404 response
    return Promise.resolve(createMockFetchErrorResponse(404, 'Not Found'));
  });
};

/**
 * Mock fetch for error scenarios
 */
export const createMockFetchWithErrors = () => {
  return jest.fn().mockImplementation((url: string | URL, _options?: RequestInit) => {
    const urlStr = typeof url === 'string' ? url : url.toString();
    
    // Simulate different error types
    if (urlStr.includes('network-error')) {
      return Promise.reject(createMockNetworkError());
    }
    
    if (urlStr.includes('abort-error')) {
      return Promise.reject(createMockAbortError());
    }
    
    if (urlStr.includes('500-error')) {
      return Promise.resolve(createMockFetchErrorResponse(500, 'Internal Server Error'));
    }
    
    if (urlStr.includes('404-error')) {
      return Promise.resolve(createMockFetchErrorResponse(404, 'Not Found'));
    }
    
    // Default success
    return Promise.resolve(createMockFetchResponse(mockApiResponse));
  });
};

/**
 * Mock AbortController for testing cancellation
 */
export const createMockAbortController = () => {
  const mockSignal = {
    aborted: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
  
  const mockController = {
    signal: mockSignal,
    abort: jest.fn(() => {
      mockSignal.aborted = true;
    }),
  };
  
  return mockController;
};

/**
 * Setup API mocks for tests
 */
export const setupApiMocks = () => {
  const mockFetch = createMockFetch();
  globalThis.fetch = mockFetch;
  
  // Mock AbortController
  const mockAbortController = createMockAbortController();
  (globalThis as any).AbortController = jest.fn(() => mockAbortController);
  
  return {
    mockFetch,
    mockAbortController,
  };
};

/**
 * Setup API error mocks for error testing
 */
export const setupApiErrorMocks = () => {
  const mockFetch = createMockFetchWithErrors();
  globalThis.fetch = mockFetch;
  
  return { mockFetch };
};

/**
 * Reset API mocks between tests
 */
export const resetApiMocks = () => {
  jest.clearAllMocks();
  
  if (globalThis.fetch) {
    (globalThis.fetch as jest.Mock).mockClear();
  }
};

/**
 * Mock successful character fetch
 */
export const mockCharacterFetch = (characters = [mockCharacter]) => {
  const response = {
    ...mockApiResponse,
    results: characters,
    info: {
      ...mockApiResponse.info,
      count: characters.length,
    }
  };
  
  globalThis.fetch = jest.fn().mockResolvedValue(
    createMockFetchResponse(response)
  );
};

/**
 * Mock failed character fetch
 */
export const mockCharacterFetchError = (status = 500, message = 'Server Error') => {
  globalThis.fetch = jest.fn().mockResolvedValue(
    createMockFetchErrorResponse(status, message)
  );
};

/**
 * Mock network error
 */
export const mockNetworkError = () => {
  globalThis.fetch = jest.fn().mockRejectedValue(createMockNetworkError());
};

/**
 * Mock abort error
 */
export const mockAbortError = () => {
  globalThis.fetch = jest.fn().mockRejectedValue(createMockAbortError());
};

/**
 * Utility to wait for async operations in tests
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Helper to simulate delayed API responses
 */
export const createDelayedMockFetch = (delay = 100) => {
  return jest.fn().mockImplementation((_url: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(createMockFetchResponse(mockApiResponse));
      }, delay);
    });
  });
};