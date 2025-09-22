import { Box, TextField, InputAdornment } from '@mui/material';
import { useState, useEffect, useCallback, useMemo } from 'react';
import SearchIcon from '../icons/SearchIcon';
import logoImage from '../../assets/logo.png';
import bgImage from '../../assets/bg.png';
import { useSearchTerm, useSetSearchTerm } from '../../hooks';

const Header = () => {
  const searchTerm = useSearchTerm();
  const setSearchTerm = useSetSearchTerm();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Memoized debounce function to prevent recreation on every render
  const debouncedSetSearchTerm = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (term: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSearchTerm(term);
      }, 300);
    };
  }, [setSearchTerm]);

  // Update local search term when global search term changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Handle search input change
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearchTerm(value);
    debouncedSetSearchTerm(value);
  }, [debouncedSetSearchTerm]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: '250px', sm: '280px', md: '320px' },
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: '24px', sm: '32px', md: '40px' },
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
      }}
    >
      {/* Background overlay for better text readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(34.13% 49.16% at 49.24% 34.3%, rgba(0, 0, 0, 0) 5.64%, rgba(0, 0, 0, 0.7) 100%)',
          backgroundBlendMode: 'multiply',
          zIndex: 1,
        }}
      />

      {/* Content Container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1400px',
          gap: { xs: 3, sm: 4, md: 5 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Rick and Morty Logo */}
        <Box
          component="img"
          src={logoImage}
          alt="Rick and Morty"
          sx={{
            height: { xs: '80px', sm: '100px', md: '120px' },
            width: 'auto',
            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.5))',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        {/* Search Input */}
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '320px', sm: '480px', md: '720px', lg: '960px', xl: '1040px' },
            display: 'flex',
            justifyContent: 'center',
            px: { xs: 1, sm: 2 },
          }}
        >
          <TextField
            placeholder="Buscar personaje por nombre"
            variant="outlined"
            fullWidth
            value={localSearchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon 
                    sx={{ 
                      fontSize: { xs: '20px', sm: '22px', md: '24px' }
                    }} 
                  />
                </InputAdornment>
              ),
              sx: {
                fontFamily: 'Montserrat',
                background: '#3D403AB2',
                backgroundBlendMode: 'multiply',
                borderRadius: '8px',
                fontSize: { xs: '14px', sm: '15px', md: '16px' },
                height: '56px',
                opacity: 1,
                '& .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #808C73',
                  borderRadius: '8px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #808C73',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #808C73',
                  boxShadow: 'none',
                },
                '& input': {
                  padding: { xs: '12px 14px', sm: '14px 16px', md: '16px 18px' },
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '14px', sm: '15px', md: '16px' },
                  color: 'rgba(255, 255, 255, 0.9)',
                  height: 'auto',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                    fontFamily: 'Montserrat',
                  },
                },
              },
            }}
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: 'Montserrat',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Header;