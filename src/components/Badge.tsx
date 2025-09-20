import { Box, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface BadgeProps {
  /**
   * The main content of the badge
   */
  children: ReactNode;
  /**
   * Optional icon to display before the content
   */
  preIcon?: ReactNode;
  /**
   * Optional icon to display after the content
   */
  postIcon?: ReactNode;
  /**
   * Whether the badge should show a remove button
   * @default false
   */
  removable?: boolean;
  /**
   * Callback function when the remove button is clicked
   */
  onRemove?: () => void;
  /**
   * Custom styling variant for the badge
   * @default 'default'
   */
  variant?: 'default' | 'species' | 'status';
}

/**
 * Badge component for displaying content with optional icons and remove functionality
 * Supports different visual variants and flexible icon positioning
 */
const Badge = ({ children, preIcon, postIcon, removable = false, onRemove, variant = 'default' }: BadgeProps) => {
  // Define styling based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'species':
        return {
          backgroundColor: '#e8f5e8',
          color: '#2e7d32',
          border: '1px solid #c8e6c9',
        };
      case 'status':
        return {
          backgroundColor: '#fff3e0',
          color: '#f57c00',
          border: '1px solid #ffcc02',
        };
      default:
        return {
          backgroundColor: '#f5f5f5',
          color: '#666666',
          border: '1px solid #e0e0e0',
        };
    }
  };

  const variantStyles = getVariantStyles();

  if (removable) {
    // Removable badge with close button
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: { xs: '12px', sm: '13px', md: '14px' },
          fontWeight: 500,
          padding: { xs: '6px 8px 6px 12px', sm: '7px 9px 7px 13px', md: '8px 10px 8px 14px' },
          borderRadius: '20px',
          gap: '6px',
          transition: 'all 0.2s ease',
          cursor: 'default',
          ...variantStyles,
          '&:hover': {
            backgroundColor: variant === 'species' ? '#d4edd4' : 
                           variant === 'status' ? '#ffe0b2' : '#eeeeee',
          },
        }}
      >
        {/* Pre Icon */}
        {preIcon}

        {/* Badge Content */}
        <Box component="span" sx={{ lineHeight: 1 }}>
          {children}
        </Box>

        {/* Post Icon */}
        {postIcon}

        {/* Remove Button */}
        <IconButton
          size="small"
          onClick={onRemove}
          sx={{
            width: '16px',
            height: '16px',
            padding: 0,
            color: 'inherit',
            opacity: 0.7,
            '&:hover': {
              opacity: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: '12px' }} />
        </IconButton>
      </Box>
    );
  }

  // Non-removable badge
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: { xs: '12px', sm: '13px', md: '14px' },
        fontWeight: 500,
        padding: { xs: '8px 12px', sm: '9px 13px', md: '10px 14px' },
        borderRadius: '20px',
        gap: '6px',
        transition: 'all 0.2s ease',
        cursor: 'default',
        ...variantStyles,
        '&:hover': {
          backgroundColor: variant === 'species' ? '#d4edd4' : 
                         variant === 'status' ? '#ffe0b2' : '#eeeeee',
        },
      }}
    >
      {/* Pre Icon */}
      {preIcon}

      {/* Badge Content */}
      <Box component="span" sx={{ lineHeight: 1 }}>
        {children}
      </Box>

      {/* Post Icon */}
      {postIcon}
    </Box>
  );
};

export default Badge;