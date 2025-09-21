import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme/theme';
import AppRouter from './router/AppRouter';

/**
 * Main App component with React Router navigation
 * Provides theme and routing configuration for the entire application
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
