import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes';

/**
 * Main Application Router Component
 * Configures React Router with all application routes
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
        {/* Fallback route - redirect to welcome for any unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;