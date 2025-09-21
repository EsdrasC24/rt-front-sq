import Badge from './Badge';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import QuestionCircleIcon from './icons/QuestionCircleIcon';
import { CharacterMapper } from '../services/mappers/character.mapper';
import type { CharacterStatus } from '../services/types/api.types';

interface StatusBadgeProps {
  /**
   * Character status from Rick and Morty API
   */
  status: CharacterStatus;
}

/**
 * StatusBadge component for displaying character status with appropriate styling and icons
 * Handles different states: Alive (with check icon), Dead, and Unknown
 */
const StatusBadge = ({ status }: StatusBadgeProps) => {
  // Get icon for status (each status has its own icon)
  const getStatusIcon = (status: CharacterStatus) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return <CheckCircleIcon sx={{ fontSize: '14px' }} />;
      case 'dead':
        return <XCircleIcon sx={{ fontSize: '14px' }} />;
      case 'unknown':
      default:
        return <QuestionCircleIcon sx={{ fontSize: '14px' }} />;
    }
  };

  // Get styles for status
  const getStatusStyles = (status: CharacterStatus) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return {
          backgroundColor: '#e8f5e8',
          color: '#2e7d32',
          '&:hover': {
            backgroundColor: '#d4edd4',
          },
        };
      case 'dead':
        return {
          backgroundColor: '#ffebee',
          color: '#c62828',
          '&:hover': {
            backgroundColor: '#ffcdd2',
          },
        };
      case 'unknown':
      default:
        return {
          backgroundColor: '#f5f5f5',
          color: '#666666',
          '&:hover': {
            backgroundColor: '#eeeeee',
          },
        };
    }
  };

  return (
    <Badge
      preIcon={getStatusIcon(status)}
      sx={{
        ...getStatusStyles(status),
        height: '32px',
      }}
    >
      {CharacterMapper.getStatusInSpanish(status)}
    </Badge>
  );
};

export default StatusBadge;