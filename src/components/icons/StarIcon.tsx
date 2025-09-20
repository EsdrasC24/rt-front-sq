import { SvgIcon } from '@mui/material';
import type { ComponentProps } from 'react';

interface StarIconProps extends ComponentProps<typeof SvgIcon> {}

/**
 * Custom Star Icon component with filled star design
 */
const StarIcon = (props: StarIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 18 17"
      {...props}
    >
      <path
        d="M8.106 1.05078L6.07174 5.14467L1.52034 5.80329C0.704146 5.92078 0.377044 6.91952 0.968943 7.49155L4.26177 10.6764L3.48296 15.1753C3.34277 15.9885 4.2057 16.5977 4.92844 16.2174L9.00008 14.0931L13.0717 16.2174C13.7945 16.5946 14.6574 15.9885 14.5172 15.1753L13.7384 10.6764L17.0312 7.49155C17.6231 6.91952 17.296 5.92078 16.4798 5.80329L11.9284 5.14467L9.89416 1.05078C9.52968 0.321052 8.4736 0.311776 8.106 1.05078Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default StarIcon;