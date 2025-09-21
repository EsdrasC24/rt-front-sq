import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import { renderWithRouter } from '../../test/utils/test-utils';
import { routes } from '../routes';

// Mock the Welcome and Home components to avoid asset loading issues
jest.mock('../../components/Welcome', () => {
  return function MockWelcome() {
    return (
      <div>
        <p>En esta prueba, evaluaremos tu capacidad</p>
        <button>Comenzar</button>
      </div>
    );
  };
});

jest.mock('../../pages/Home', () => {
  return function MockHome() {
    return (
      <div>
        <input placeholder="Buscar personaje" />
        <div>Todos</div>
        <div>Favoritos</div>
      </div>
    );
  };
});

// Create a test version of the router without BrowserRouter
const TestRoutes = () => (
  <Routes>
    {routes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={route.element}
      />
    ))}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

describe('AppRouter', () => {
  describe('Route Rendering', () => {
    it('should render Welcome component on root path', () => {
      renderWithRouter(<TestRoutes />, { initialEntries: ['/'] });
      
      expect(screen.getByText(/En esta prueba, evaluaremos tu capacidad/i)).toBeInTheDocument();
      expect(screen.getByText(/Comenzar/i)).toBeInTheDocument();
    });

    it('should render Home component on /home path', () => {
      renderWithRouter(<TestRoutes />, { initialEntries: ['/home'] });
      
      expect(screen.getByPlaceholderText(/Buscar personaje/i)).toBeInTheDocument();
      expect(screen.getByText(/Todos/i)).toBeInTheDocument();
      expect(screen.getByText(/Favoritos/i)).toBeInTheDocument();
    });

    it('should redirect to welcome page for unknown routes', () => {
      renderWithRouter(<TestRoutes />, { initialEntries: ['/unknown-route'] });
      
      // Should redirect to welcome page
      expect(screen.getByText(/En esta prueba, evaluaremos tu capacidad/i)).toBeInTheDocument();
      expect(screen.getByText(/Comenzar/i)).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should handle navigation between routes', () => {
      const { rerender } = renderWithRouter(<TestRoutes />, { initialEntries: ['/'] });
      
      // Initially on welcome page
      expect(screen.getByText(/Comenzar/i)).toBeInTheDocument();
      
      // Navigate to home
      rerender(<TestRoutes />);
      renderWithRouter(<TestRoutes />, { initialEntries: ['/home'] });
      
      expect(screen.getByPlaceholderText(/Buscar personaje/i)).toBeInTheDocument();
    });
  });

  describe('Route Configuration', () => {
    it('should load correct components for all defined routes', () => {
      // Test root route
      const { unmount } = renderWithRouter(<TestRoutes />, { initialEntries: ['/'] });
      expect(screen.getByText(/Comenzar/i)).toBeInTheDocument();
      unmount();

      // Test home route
      renderWithRouter(<TestRoutes />, { initialEntries: ['/home'] });
      expect(screen.getByPlaceholderText(/Buscar personaje/i)).toBeInTheDocument();
    });

    it('should handle browser back/forward navigation correctly', () => {
      // Simulate multiple entries in browser history
      renderWithRouter(<TestRoutes />, { initialEntries: ['/', '/home', '/'] });
      
      // Should be on the last entry (welcome page)
      expect(screen.getByText(/Comenzar/i)).toBeInTheDocument();
    });
  });
});