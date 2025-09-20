import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Welcome from './components/Welcome';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Welcome />
    </ThemeProvider>
  );
}

export default App;
