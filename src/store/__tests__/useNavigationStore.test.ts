import { renderHook, act } from '@testing-library/react';
import { useNavigationStore } from '../useNavigationStore';
import type { PageType } from '../useNavigationStore';

// Mock zustand to ensure test isolation
jest.mock('zustand');

describe('useNavigationStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useNavigationStore.setState({
      currentPage: 'welcome',
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useNavigationStore());
      
      expect(result.current.currentPage).toBe('welcome');
      expect(typeof result.current.navigateToPage).toBe('function');
      expect(typeof result.current.navigateToHome).toBe('function');
      expect(typeof result.current.navigateToWelcome).toBe('function');
    });
  });

  describe('Navigation Actions', () => {
    it('should navigate to a specific page', () => {
      const { result } = renderHook(() => useNavigationStore());
      
      act(() => {
        result.current.navigateToPage('home');
      });
      
      expect(result.current.currentPage).toBe('home');
    });

    it('should navigate to home page', () => {
      const { result } = renderHook(() => useNavigationStore());
      
      act(() => {
        result.current.navigateToHome();
      });
      
      expect(result.current.currentPage).toBe('home');
    });

    it('should navigate to welcome page', () => {
      const { result } = renderHook(() => useNavigationStore());
      
      // First navigate to home
      act(() => {
        result.current.navigateToHome();
      });
      expect(result.current.currentPage).toBe('home');
      
      // Then navigate back to welcome
      act(() => {
        result.current.navigateToWelcome();
      });
      expect(result.current.currentPage).toBe('welcome');
    });

    it('should handle multiple navigation calls', () => {
      const { result } = renderHook(() => useNavigationStore());
      
      // Navigate through different pages
      act(() => {
        result.current.navigateToHome();
      });
      expect(result.current.currentPage).toBe('home');
      
      act(() => {
        result.current.navigateToWelcome();
      });
      expect(result.current.currentPage).toBe('welcome');
      
      act(() => {
        result.current.navigateToPage('home');
      });
      expect(result.current.currentPage).toBe('home');
    });
  });

  describe('State Consistency', () => {
    it('should maintain state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useNavigationStore());
      const { result: result2 } = renderHook(() => useNavigationStore());
      
      act(() => {
        result1.current.navigateToHome();
      });
      
      // Both hooks should reflect the same state
      expect(result1.current.currentPage).toBe('home');
      expect(result2.current.currentPage).toBe('home');
    });

    it('should handle rapid state changes', () => {
      const { result } = renderHook(() => useNavigationStore());
      
      act(() => {
        result.current.navigateToHome();
        result.current.navigateToWelcome();
        result.current.navigateToHome();
      });
      
      expect(result.current.currentPage).toBe('home');
    });
  });

  describe('Type Safety', () => {
    it('should only accept valid PageType values', () => {
      const { result } = renderHook(() => useNavigationStore());
      
      act(() => {
        result.current.navigateToPage('home' as PageType);
      });
      expect(result.current.currentPage).toBe('home');
      
      act(() => {
        result.current.navigateToPage('welcome' as PageType);
      });
      expect(result.current.currentPage).toBe('welcome');
    });
  });

  describe('Store API', () => {
    it('should expose correct store methods', () => {
      const store = useNavigationStore.getState();
      
      expect(store).toHaveProperty('currentPage');
      expect(store).toHaveProperty('navigateToPage');
      expect(store).toHaveProperty('navigateToHome');
      expect(store).toHaveProperty('navigateToWelcome');
    });

    it('should allow direct state access via getState', () => {
      const initialState = useNavigationStore.getState();
      expect(initialState.currentPage).toBe('welcome');
      
      // Change state
      useNavigationStore.getState().navigateToHome();
      
      const updatedState = useNavigationStore.getState();
      expect(updatedState.currentPage).toBe('home');
    });

    it('should allow state subscription', () => {
      const mockSubscriber = jest.fn();
      
      const unsubscribe = useNavigationStore.subscribe(mockSubscriber);
      
      act(() => {
        useNavigationStore.getState().navigateToHome();
      });
      
      expect(mockSubscriber).toHaveBeenCalled();
      
      unsubscribe();
    });
  });
});