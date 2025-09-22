import { Box, Typography, IconButton } from '@mui/material';
import type { Character } from '../services';
import { CharacterMapper } from '../services';
import StarIcon from './icons/StarIcon';
import { useIsFavorite, useToggleFavorite } from '../hooks';

interface RelatedCharacterCardProps {
  /**
   * Character data for the related character card
   */
  character: Character;
  /**
   * Callback when favorite status changes
   */
  onFavoriteChange?: (id: number, isFavorite: boolean) => void;
  /**
   * Callback when the card is clicked
   */
  onClick?: (character: Character) => void;
}

/**
 * Related Character Card component for displaying small character cards
 * Used in the character detail modal's "Personajes relacionados" section
 */
const RelatedCharacterCard = ({ 
  character, 
  onFavoriteChange,
  onClick 
}: RelatedCharacterCardProps) => {
  // Use favorites store instead of local state
  const isCharacterFavorite = useIsFavorite(character.id);
  const toggleFavorite = useToggleFavorite();

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering card click
    toggleFavorite(character.id);
    if (onFavoriteChange) {
      onFavoriteChange(character.id, !isCharacterFavorite);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(character);
    }
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        minWidth: '140px',
        width: '100%',
        maxWidth: '200px',
        '&:hover': {
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Character Image Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: '144px',
          maxHeight: '200px',
          overflow: 'hidden',
        }}
      >
        {/* Character Image */}
        <Box
          component="img"
          src={character.image}
          alt={character.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
          }}
        />

        {/* Favorite Button */}
        <Box
          sx={{
            position: 'absolute',
            top: '6px',
            right: '15px',
          }}
        >
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              backgroundColor: isCharacterFavorite ? '#B6DA8B' : 'rgba(255, 255, 255, 0.9)',
              width: '44px',
              height: '44px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: isCharacterFavorite ? '#A5C97A' : 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            {isCharacterFavorite ? (
              <StarIcon sx={{ fontSize: '15px' }} />
            ) : (
              <StarIcon sx={{ color: '#808C73', fontSize: '15px' }} />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Character Information */}
      <Box
        sx={{
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Character Name */}
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            fontSize: '18px',
            color: '#333630',
            lineHeight: '2rem',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {character.name}
        </Typography>

        {/* Species */}
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: '#575B52',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {CharacterMapper.mapEnglishToSpanish('species', character.species)}
        </Typography>
      </Box>
    </Box>
  );
};

export default RelatedCharacterCard;