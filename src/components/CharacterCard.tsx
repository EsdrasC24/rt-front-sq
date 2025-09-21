import { Box, Typography, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import StarIcon from './icons/StarIcon';
import { useEpisodeCache } from '../hooks';
import { useIsFavorite, useToggleFavorite } from '../hooks';
import { CharacterMapper } from '../services';

interface CharacterCardProps {
  /**
   * Character data
   */
  character: {
    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    image: string;
    location: {
      name: string;
    };
    episode: string[];
  };
  /**
   * Callback when favorite status changes (optional, for external tracking)
   */
  onFavoriteChange?: (id: number, isFavorite: boolean) => void;
  /**
   * Callback when character card is clicked
   */
  onClick?: () => void;
}

/**
 * Character Card component for displaying Rick and Morty character information
 * Features character image, status badge, favorite functionality, and character details
 */
const CharacterCard = ({ character, onFavoriteChange, onClick }: CharacterCardProps) => {
  const [firstEpisodeName, setFirstEpisodeName] = useState<string>('Cargando...');
  const { getFirstEpisodeName } = useEpisodeCache();
  
  // Use favorites store instead of local state
  const isCharacterFavorite = useIsFavorite(character.id);
  const toggleFavorite = useToggleFavorite();

  // Load first episode name
  useEffect(() => {
    let isMounted = true;

    const loadEpisodeName = async () => {
      if (character.episode && character.episode.length > 0) {
        try {
          const episodeName = await getFirstEpisodeName(character.episode);
          if (isMounted) {
            setFirstEpisodeName(episodeName);
          }
        } catch (error) {
          if (isMounted) {
            setFirstEpisodeName('Desconocido');
          }
        }
      } else {
        if (isMounted) {
          setFirstEpisodeName('Desconocido');
        }
      }
    };

    loadEpisodeName();

    return () => {
      isMounted = false;
    };
  }, [character.episode, getFirstEpisodeName]);

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click when clicking favorite
    toggleFavorite(character.id);
    if (onFavoriteChange) {
      onFavoriteChange(character.id, !isCharacterFavorite);
    }
  };

  // Get first episode name
  const getFirstEpisode = () => {
    return firstEpisodeName;
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        height: { xs: 'auto', sm: '145px' },
        width: { xs: '100%', sm: 'auto' },
        maxWidth: { xs: '300px', sm: 'none' },
        margin: { xs: '0 auto', sm: '0' },
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
          width: { xs: '100%', sm: '145px' },
          height: { xs: '200px', sm: '145px' },
          flexShrink: 0,
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
          }}
        />

        {/* Favorite Button */}
        <Box
          sx={{
            position: 'absolute',
            top: '8px',
            left: { xs: 'auto', sm: '8px' },
            right: { xs: '8px', sm: 'auto' },
          }}
        >
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              backgroundColor: isCharacterFavorite ? '#B6DA8B' : '#FFFFFF',
              width: '44px',
              height: '44px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: isCharacterFavorite ? '#A5C97A' : '#FFFFFF',
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
          padding: { xs: '16px', sm: '16px' },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          minHeight: { xs: 'auto', sm: 'auto' },
        }}
      >
        {/* Top Section - Name, Species and Status Badge */}
        <Box>
          {/* Character Name and Status Badge */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: { xs: '20px', sm: '18px' },
                color: '#333333',
                lineHeight: 1.2,
                flex: 1,
                marginBottom: 0,
              }}
            >
              {character.name}
            </Typography>
            
            <StatusBadge status={character.status} />
          </Box>

          {/* Species */}
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              color: '#666666',
              marginBottom: '16px',
            }}
          >
            {CharacterMapper.mapEnglishToSpanish('species', character.species)}
          </Typography>
        </Box>

        {/* Bottom Section - Location and Episode Info */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row', // Siempre en fila, tanto móvil como desktop
            justifyContent: 'space-between',
            gap: { xs: '8px', sm: '16px' }, // Gap más pequeño en móvil
          }}
        >
          {/* Last Known Location */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '11px',
                color: '#808C73',
                textTransform: 'uppercase',
                marginBottom: '4px',
                display: 'block',
              }}
            >
              Última ubicación conocida
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '13px',
                color: '#575B52',
                lineHeight: 1.3,
              }}
            >
              {character.location.name}
            </Typography>
          </Box>

          {/* First Seen In */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '11px',
                color: '#808C73',
                textTransform: 'uppercase',
                marginBottom: '4px',
                display: 'block',
              }}
            >
              Primera aparición en
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '13px',
                color: '#575B52',
                lineHeight: 1.3,
              }}
            >
              {getFirstEpisode()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterCard;