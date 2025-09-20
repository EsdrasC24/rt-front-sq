import { Box, Typography } from '@mui/material';

/**
 * Footer component with copyright information
 * Displays The Cartoon Network copyright text with responsive design
 */
const Footer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#2D2D2D',
        padding: { xs: '16px 20px', sm: '20px 24px', md: '24px 32px' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTop: '1px solid #444',
        marginTop: 'auto',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'Montserrat',
          fontSize: { xs: '12px', sm: '13px', md: '14px' },
          color: '#FFFFFF',
          textAlign: 'center',
          fontWeight: 400,
          letterSpacing: '0.5px',
          lineHeight: 1.4,
          maxWidth: '800px',
          opacity: 0.9,
        }}
      >
        TM & © 2024 The Cartoon Network, Inc. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;