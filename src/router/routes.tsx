import type { ReactElement } from 'react';
import Welcome from '../components/Welcome';
import Home from '../pages/Home';

/**
 * Route configuration for the application
 * Defines all available routes and their corresponding components
 */
export interface RouteConfig {
  path: string;
  element: ReactElement;
  title?: string;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Welcome />,
    title: 'Welcome - Rick and Morty Explorer'
  },
  {
    path: '/home',
    element: <Home />,
    title: 'Home - Rick and Morty Explorer'
  }
];

/**
 * Route paths constants for type-safe navigation
 */
export const ROUTES = {
  WELCOME: '/',
  HOME: '/home'
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];