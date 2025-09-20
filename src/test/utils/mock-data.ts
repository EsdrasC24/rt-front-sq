import type { Character, ApiCharacter, ApiResponse, ApiEpisode } from '../../services';

/**
 * Mock API Character data
 */
export const mockApiCharacter: ApiCharacter = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  origin: {
    name: "Earth (C-137)",
    url: "https://rickandmortyapi.com/api/location/1"
  },
  location: {
    name: "Citadel of Ricks",
    url: "https://rickandmortyapi.com/api/location/3"
  },
  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  episode: [
    "https://rickandmortyapi.com/api/episode/1",
    "https://rickandmortyapi.com/api/episode/2"
  ],
  url: "https://rickandmortyapi.com/api/character/1",
  created: "2017-11-04T18:48:46.250Z"
};

/**
 * Mock Character data (mapped)
 */
export const mockCharacter: Character = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  origin: {
    name: "Earth (C-137)",
    url: "https://rickandmortyapi.com/api/location/1"
  },
  location: {
    name: "Citadel of Ricks",
    url: "https://rickandmortyapi.com/api/location/3"
  },
  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  episode: [
    "https://rickandmortyapi.com/api/episode/1",
    "https://rickandmortyapi.com/api/episode/2"
  ]
};

/**
 * Mock second character for testing lists
 */
export const mockCharacter2: Character = {
  id: 2,
  name: "Morty Smith",
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  origin: {
    name: "unknown",
    url: ""
  },
  location: {
    name: "Citadel of Ricks",
    url: "https://rickandmortyapi.com/api/location/3"
  },
  image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
  episode: [
    "https://rickandmortyapi.com/api/episode/1",
    "https://rickandmortyapi.com/api/episode/2"
  ]
};

/**
 * Mock dead character for testing different statuses
 */
export const mockDeadCharacter: Character = {
  id: 3,
  name: "Summer Smith",
  status: "Dead",
  species: "Human",
  type: "",
  gender: "Female",
  origin: {
    name: "Earth (Replacement Dimension)",
    url: "https://rickandmortyapi.com/api/location/20"
  },
  location: {
    name: "Earth (Replacement Dimension)",
    url: "https://rickandmortyapi.com/api/location/20"
  },
  image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
  episode: [
    "https://rickandmortyapi.com/api/episode/6",
    "https://rickandmortyapi.com/api/episode/7"
  ]
};

/**
 * Mock characters list
 */
export const mockCharactersList: Character[] = [
  mockCharacter,
  mockCharacter2,
  mockDeadCharacter,
];

/**
 * Mock API Response
 */
export const mockApiResponse: ApiResponse<ApiCharacter> = {
  info: {
    count: 826,
    pages: 42,
    next: "https://rickandmortyapi.com/api/character?page=2",
    prev: null
  },
  results: [mockApiCharacter]
};

/**
 * Mock API Response with pagination
 */
export const mockApiResponsePage2: ApiResponse<ApiCharacter> = {
  info: {
    count: 826,
    pages: 42,
    next: "https://rickandmortyapi.com/api/character?page=3",
    prev: "https://rickandmortyapi.com/api/character?page=1"
  },
  results: [
    {
      ...mockApiCharacter,
      id: 21,
      name: "Aqua Morty",
    }
  ]
};

/**
 * Mock API Response - Last page
 */
export const mockApiResponseLastPage: ApiResponse<ApiCharacter> = {
  info: {
    count: 826,
    pages: 42,
    next: null,
    prev: "https://rickandmortyapi.com/api/character?page=41"
  },
  results: [
    {
      ...mockApiCharacter,
      id: 826,
      name: "Last Character",
    }
  ]
};

/**
 * Mock empty API Response
 */
export const mockEmptyApiResponse: ApiResponse<ApiCharacter> = {
  info: {
    count: 0,
    pages: 0,
    next: null,
    prev: null
  },
  results: []
};

/**
 * Mock Episode data
 */
export const mockEpisode: ApiEpisode = {
  id: 1,
  name: "Pilot",
  air_date: "December 2, 2013",
  episode: "S01E01",
  characters: [
    "https://rickandmortyapi.com/api/character/1",
    "https://rickandmortyapi.com/api/character/2"
  ],
  url: "https://rickandmortyapi.com/api/episode/1",
  created: "2017-11-10T12:56:33.798Z"
};

/**
 * Mock Episode Response
 */
export const mockEpisodeResponse: ApiResponse<ApiEpisode> = {
  info: {
    count: 51,
    pages: 3,
    next: "https://rickandmortyapi.com/api/episode?page=2",
    prev: null
  },
  results: [mockEpisode]
};

/**
 * Mock Error Response
 */
export const mockErrorResponse = {
  error: "There is nothing here"
};

/**
 * Mock Fetch Response - Success
 */
export const createMockFetchResponse = <T>(data: T, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: jest.fn().mockResolvedValue(data),
  text: jest.fn().mockResolvedValue(JSON.stringify(data)),
});

/**
 * Mock Fetch Response - Error
 */
export const createMockFetchErrorResponse = (status = 500, message = "Internal Server Error") => ({
  ok: false,
  status,
  statusText: message,
  json: jest.fn().mockResolvedValue({ error: message }),
  text: jest.fn().mockResolvedValue(JSON.stringify({ error: message })),
});

/**
 * Mock AbortError
 */
export const createMockAbortError = () => {
  const error = new DOMException('The operation was aborted.', 'AbortError');
  return error;
};

/**
 * Mock Network Error
 */
export const createMockNetworkError = () => {
  const error = new Error('Network request failed');
  error.name = 'NetworkError';
  return error;
};

/**
 * Store initial states for testing
 */
export const mockStoreStates = {
  filterStore: {
    searchTerm: '',
    activeFilters: {},
    currentTab: 'todos' as const,
    isFiltering: false,
  },
  favoritesStore: {
    favorites: new Set<number>(),
  },
  navigationStore: {
    currentPage: 'home' as const,
  },
};

/**
 * Mock localStorage data
 */
export const mockLocalStorageData = {
  favorites: JSON.stringify([1, 2, 3]),
  theme: 'light',
  language: 'es',
};