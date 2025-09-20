import { Box, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import logoImage from '../../assets/logo.png';
import bgImage from '../../assets/bg.png';

const Header = () => {
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
          backgroundColor: '#00000099',
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '20px', sm: '22px', md: '24px' }
                    }} 
                  />
                </InputAdornment>
              ),
              sx: {
                fontFamily: 'Montserrat',
                backgroundColor: '#3D403AB2',
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