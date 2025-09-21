import { SvgIcon } from '@mui/material';
import type { SvgIconProps } from '@mui/material';

/**
 * Custom Question Circle Icon component
 * SVG-based question circle icon with gray fill color for unknown status
 */
const QuestionCircleIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 14 14">
      <path 
        d="M5.42504 5.83349C5.42504 5.43169 5.5984 5.04651 5.9062 4.76895C6.214 4.49139 6.63259 4.34349 7.06671 4.34349C7.50082 4.34349 7.91941 4.49139 8.22721 4.76895C8.53501 5.04651 8.70837 5.43169 8.70837 5.83349C8.70837 6.23529 8.53501 6.62047 8.22721 6.89803C7.91941 7.17559 7.50082 7.32349 7.06671 7.32349C6.87581 7.32349 6.69283 7.39857 6.55593 7.53547C6.41903 7.67237 6.34395 7.85535 6.34395 8.04625C6.34395 8.23715 6.41903 8.42013 6.55593 8.55703C6.69283 8.69393 6.87581 8.76901 7.06671 8.76901V8.76901" 
        stroke="currentColor" 
        strokeWidth="0.966667" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M7.06671 10.6968H7.07154" 
        stroke="currentColor" 
        strokeWidth="0.966667" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M7.00004 0.333496C3.33231 0.333496 0.333374 3.33243 0.333374 7.00016C0.333374 10.6679 3.33231 13.6668 7.00004 13.6668C10.6678 13.6668 13.6667 10.6679 13.6667 7.00016C13.6667 3.33243 10.6678 0.333496 7.00004 0.333496ZM1.26361 7.00016C1.26361 3.84619 3.84607 1.26373 7.00004 1.26373C10.154 1.26373 12.7365 3.84619 12.7365 7.00016C12.7365 10.1541 10.154 12.7366 7.00004 12.7366C3.84607 12.7366 1.26361 10.1541 1.26361 7.00016Z" 
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default QuestionCircleIcon;