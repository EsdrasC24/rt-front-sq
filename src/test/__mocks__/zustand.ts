import { act } from '@testing-library/react';

/**
 * Mock Zustand store creator
 * This allows us to reset stores between tests and control their state
 */
const actualCreate = jest.requireActual('zustand').create;

// Store for keeping track of all stores created during tests
const storeResetFns = new Set<() => void>();

/**
 * Mock create function that tracks stores for resetting
 */
const create = (createState: any) => {
  // Handle both regular stores and stores with middleware (like persist)
  let store;
  try {
    store = actualCreate(createState);
  } catch (error) {
    // If createState is a function that expects parameters (like persist middleware)
    // try to handle it gracefully
    try {
      if (typeof createState === 'function') {
        // For persist middleware, we'll create a simplified version
        const stateInitializer = createState(
          () => {}, // mock set function
          () => ({}), // mock get function
          {} // mock api
        );
        store = actualCreate(() => stateInitializer);
      } else {
        store = actualCreate(() => createState);
      }
    } catch (innerError) {
      // If all else fails, create a minimal store
      store = actualCreate(() => ({}));
    }
  }
  
  const initialState = store.getState ? store.getState() : {};
  
  // Add reset function to our set
  storeResetFns.add(() => {
    if (store.setState) {
      store.setState(initialState, true);
    }
  });
  
  return store;
};

/**
 * Reset all Zustand stores to their initial state
 * Call this in beforeEach of your tests
 */
export const resetAllStores = () => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
};

/**
 * Mock store creator for testing
 */
export const createMockStore = <T>(initialState: T) => {
  const store = actualCreate(() => initialState);
  
  return {
    store,
    setState: (state: Partial<T>) => act(() => store.setState(state as T)),
    getState: () => store.getState(),
    reset: () => act(() => store.setState(initialState, true)),
  };
};

/**
 * Clear all store mocks
 */
export const clearStoreMocks = () => {
  storeResetFns.clear();
};

// Export the mocked create function
export { create };

// Mock the zustand module
export default { create };