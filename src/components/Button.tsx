import { Button as MuiButton } from '@mui/material';
import type { ButtonProps as MuiButtonProps } from '@mui/material';

interface CustomButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
  /**
   * The text content of the button
   */
  children: React.ReactNode;
}

/**
 * Custom Button component with specific design specifications
 * Features fixed dimensions, custom styling and Montserrat font
 */
const Button = ({ children, ...props }: CustomButtonProps) => {
  return (
    <MuiButton
      {...props}
      sx={{
        // Dimensions
        width: '143px',
        height: '44px',
        
        // Padding (spacing/2xs interpreted as 4px)
        paddingTop: '4px',
        paddingRight: '22px',
        paddingBottom: '4px',
        paddingLeft: '22px',
        
        // Layout
        gap: '8px',
        
        // Visual properties
        opacity: 1,
        borderRadius: '24px',
        
        // Background
        backgroundColor: '#8BC547',
        
        // Typography
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 700,
        fontStyle: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0%',
        textAlign: 'center',
        textTransform: 'none',
        
        // Text color
        color: '#354E18',
        
        // Remove default button styles
        border: 'none',
        boxShadow: 'none',
        
        // Hover and focus states
        '&:hover': {
          backgroundColor: '#7CB342', // Darker shade on hover
          color: '#354E18',
          boxShadow: 'none',
        },
        
        '&:focus': {
          backgroundColor: '#8BC547',
          color: '#354E18',
          boxShadow: 'none',
        },
        
        '&:active': {
          backgroundColor: '#689F38', // Even darker on active
          color: '#354E18',
          boxShadow: 'none',
        },
        
        // Ensure text is centered vertically and horizontally
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        
        // Override any other styles
        ...props.sx,
      }}
    >
      {children}
    </MuiButton>
  );
};

export default Button;