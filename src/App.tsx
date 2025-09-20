import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Welcome from './components/Welcome';
import Home from './pages/Home';
import theme from './theme/theme';
import { useNavigationStore } from './store/useNavigationStore';

/**
 * Main App component with Zustand-based navigation
 * Conditionally renders Welcome or Home page based on navigation state
 */
function App() {
  const currentPage = useNavigationStore((state) => state.currentPage);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'welcome':
      default:
        return <Welcome />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {renderCurrentPage()}
    </ThemeProvider>
  );
}

export default App;
