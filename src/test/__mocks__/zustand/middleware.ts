/**
 * Mock for zustand/middleware persist
 */
export const persist = (storeInitializer: any, _options?: any) => {
  // Return the store initializer without persistence for testing
  return storeInitializer;
};