import React from 'react';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import userEvent from '@testing-library/user-event';
import theme from '../../theme/theme';

/**
 * Custom render function that includes Material-UI ThemeProvider
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

/**
 * Custom render function with Material-UI theme
 */
export const renderWithTheme = (
  ui: ReactElement,
  options?: CustomRenderOptions
): RenderResult => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

/**
 * Custom render function with Material-UI theme and user event setup
 */
export const renderWithThemeAndUser = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const user = userEvent.setup();
  const result = renderWithTheme(ui, options);
  
  return {
    user,
    ...result,
  };
};

/**
 * Mock store provider for testing components that use Zustand stores
 */
export const MockStoreProvider = ({ 
  children, 
  stores: _stores = {} 
}: { 
  children: React.ReactNode;
  stores?: Record<string, any>;
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

/**
 * Helper to create mock props for testing
 */
export const createMockProps = <T extends Record<string, any>>(
  overrides: Partial<T> = {}
): T => {
  const defaultProps = {
    onClick: jest.fn(),
    onChange: jest.fn(),
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    onOpen: jest.fn(),
    ...overrides,
  };
  
  return defaultProps as unknown as T;
};

/**
 * Helper to wait for async operations
 */
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 100));

/**
 * Helper to mock window.scroll
 */
export const mockWindowScroll = () => {
  Object.defineProperty(window, 'scrollTo', {
    value: jest.fn(),
    writable: true,
  });
};

/**
 * Helper to mock console methods
 */
export const mockConsole = () => {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  });
  
  afterEach(() => {
    Object.assign(console, originalConsole);
  });
};

/**
 * Test helper to assert component rendering
 */
export const expectElementToBeInDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument();
};

/**
 * Test helper for checking loading states
 */
export const expectLoadingState = (container: HTMLElement) => {
  expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
};

/**
 * Test helper for checking error states
 */
export const expectErrorState = (container: HTMLElement, errorMessage?: string) => {
  const alertElement = container.querySelector('[role="alert"]');
  expect(alertElement).toBeInTheDocument();
  
  if (errorMessage) {
    expect(alertElement).toHaveTextContent(errorMessage);
  }
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { userEvent };