import { Box, Typography, Container } from '@mui/material';
import bgImage from '../assets/bg.png';
import logoImage from '../assets/logo.png';
import { useNavigationStore } from '../store/useNavigationStore';
import Button from './Button';

const Welcome = () => {
  const navigateToHome = useNavigationStore((state) => state.navigateToHome);
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {/* Overlay for better text readability */}
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
      
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'white',
          fontFamily: 'Montserrat, sans-serif',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 4, sm: 6, md: 8 },
        }}
      >
        {/* Rick and Morty Logo */}
        <Box
          component="img"
          src={logoImage}
          alt="Rick and Morty"
          sx={{
            maxWidth: { xs: '280px', sm: '350px', md: '400px', lg: '450px' },
            width: '100%',
            height: 'auto',
            marginBottom: { xs: 2, sm: 3, md: 4 },
            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.5))',
          }}
        />
        
        {/* Welcome Title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontStyle: 'normal',
            fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
            lineHeight: '100%',
            letterSpacing: '0%',
            textAlign: 'center',
            marginBottom: { xs: 1.5, sm: 2, md: 2.5 },
            color: 'white',
            px: { xs: 1, sm: 2 },
          }}
        >
          Bienvenido a Rick and Morty
        </Typography>
        
        {/* Description Text */}
        <Typography
          variant="body1"
          component="p"
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            marginBottom: { xs: 3, sm: 4, md: 5 },
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
            maxWidth: { xs: '100%', sm: '500px', md: '600px', lg: '700px' },
            margin: { 
              xs: '0 auto 1.5rem auto', 
              sm: '0 auto 2rem auto', 
              md: '0 auto 2.5rem auto' 
            },
            lineHeight: { xs: 1.4, sm: 1.5, md: 1.6 },
            fontSize: { xs: '14px', sm: '16px', md: '18px', lg: '20px' },
            textAlign: 'center',
            color: 'white',
            px: { xs: 1, sm: 2 },
          }}
        >
          En esta prueba, evaluaremos tu capacidad para construir la aplicación mediante el análisis de
          código y la reproducción del siguiente diseño.
        </Typography>
        
        {/* Start Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            px: { xs: 1, sm: 0 },
          }}
        >
          <Button onClick={navigateToHome}>
            Comenzar
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Welcome;