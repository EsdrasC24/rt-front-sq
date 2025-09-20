import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Grid,
  Avatar,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Character } from '../services';
import { useEpisode } from '../hooks/useEpisode';
import { characterService } from '../services';
import RelatedCharacterCard from './RelatedCharacterCard';
import StarIcon from './icons/StarIcon';
import bgImage from '../assets/bg.png';

interface CharacterDetailModalProps {
  character: Character | null;
  open: boolean;
  onClose: () => void;
}

export function CharacterDetailModal({ character, open, onClose }: CharacterDetailModalProps) {
  const [relatedCharacters, setRelatedCharacters] = useState<Character[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [episodeNames, setEpisodeNames] = useState<Record<string, string>>({});
  const { getEpisodeName, loading: episodeLoading } = useEpisode();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return '#4CAF50';
      case 'dead':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  // Load related characters when modal opens
  useEffect(() => {
    if (character && open) {
      setLoadingRelated(true);
      characterService.getCharacters({
        species: character.species,
        status: character.status,
      })
        .then(response => {
          // Filter out the current character and take up to 6 related ones
          const filtered = response.results
            .filter(c => c.id !== character.id)
            .slice(0, 6);
          setRelatedCharacters(filtered);
        })
        .catch(error => {
          console.error('Error loading related characters:', error);
          setRelatedCharacters([]);
        })
        .finally(() => {
          setLoadingRelated(false);
        });
    }
  }, [character, open]);

  // Load episode names when character changes
  useEffect(() => {
    if (character && open) {
      const loadEpisodeNames = async () => {
        const names: Record<string, string> = {};
        for (const episodeUrl of character.episode) {
          try {
            const name = await getEpisodeName(episodeUrl);
            names[episodeUrl] = name;
          } catch (error) {
            console.error('Error loading episode name:', error);
            const episodeId = episodeUrl.split('/').pop();
            names[episodeUrl] = `Episode ${episodeId}`;
          }
        }
        setEpisodeNames(names);
      };
      loadEpisodeNames();
    }
  }, [character, open, getEpisodeName]);

  if (!character) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxHeight: '95vh',
          position: 'relative',
          minHeight: '80vh',
          overflow: 'hidden',
          backgroundColor: 'white',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header with Rick and Morty Background */}
        <Box sx={{ 
          position: 'relative',
          height: '200px',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
          {/* Close button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            p: 2,
          }}>
            <IconButton 
              onClick={onClose}
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                width: 40,
                height: 40,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Character Info Card - Separate from header */}
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}>
            {/* Character Image */}
            <Avatar
              src={character.image}
              alt={character.name}
              sx={{ 
                width: 60, 
                height: 60,
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            />

            {/* Character Info */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#333', 
                    fontWeight: 'bold',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '1.25rem',
                  }}
                >
                  {character.name}
                </Typography>
                <StarIcon sx={{ fontSize: '18px', color: '#B6DA8B' }} />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666', 
                  fontFamily: 'Montserrat, sans-serif',
                  mt: 0.5,
                }}
              >
                {character.species}
              </Typography>
            </Box>

            {/* Three dots menu */}
            <IconButton size="small" sx={{ color: '#999', alignSelf: 'flex-start' }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '2px',
                width: '3px',
              }}>
                <Box sx={{ width: '3px', height: '3px', backgroundColor: 'currentColor', borderRadius: '50%' }} />
                <Box sx={{ width: '3px', height: '3px', backgroundColor: 'currentColor', borderRadius: '50%' }} />
                <Box sx={{ width: '3px', height: '3px', backgroundColor: 'currentColor', borderRadius: '50%' }} />
              </Box>
            </IconButton>
          </Box>
        </Box>

        {/* Content Sections */}
        <Box sx={{ px: 3, pb: 3, backgroundColor: '#f5f5f5' }}>
          <Grid container spacing={3}>
            {/* Information Card */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                backgroundColor: 'white', 
                borderRadius: 2, 
                p: 3,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                height: 'fit-content',
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3, 
                  color: '#333',
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  Información
                </Typography>
                
                {/* Gender */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 'bold', 
                    color: '#999', 
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontSize: '0.75rem'
                  }}>
                    Género
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#333', fontWeight: '500' }}>
                    {character.gender === 'Male' ? 'Masculino' : character.gender === 'Female' ? 'Femenino' : character.gender}
                  </Typography>
                </Box>

                {/* Origin */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 'bold', 
                    color: '#999', 
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontSize: '0.75rem'
                  }}>
                    Origen
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#333', fontWeight: '500' }}>
                    {character.origin?.name || 'Tierra (C-137)'}
                  </Typography>
                </Box>

                {/* Status */}
                <Box>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 'bold', 
                    color: '#999', 
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontSize: '0.75rem'
                  }}>
                    Estado
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(character.status),
                      }}
                    />
                    <Typography variant="body1" sx={{ color: '#333', fontWeight: '500' }}>
                      {character.status === 'Alive' ? 'Vivo' : character.status === 'Dead' ? 'Muerto' : 'Desconocido'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Episodes Card */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                backgroundColor: 'white', 
                borderRadius: 2, 
                p: 3,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                height: 'fit-content',
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3, 
                  color: '#333',
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  Episodios
                </Typography>
                {episodeLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} />
                  </Box>
                ) : (
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {character.episode.slice(0, 5).map((episodeUrl) => {
                      const episodeId = episodeUrl.split('/').pop();
                      const name = episodeNames[episodeUrl] || 'Piloto';
                      
                      return (
                        <Box 
                          key={episodeUrl}
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            py: 1.5,
                            borderBottom: '1px solid #F0F0F0',
                            '&:last-child': {
                              borderBottom: 'none',
                            },
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 'bold', 
                              color: '#333',
                              fontSize: '0.875rem'
                            }}>
                              S01 E{episodeId?.padStart(2, '0')}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: '#666',
                              fontSize: '0.8rem'
                            }}>
                              {name}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Location Information Section */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ 
              backgroundColor: 'white', 
              borderRadius: 2, 
              p: 3,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}>
              <Grid container spacing={4}>
                {/* First seen in */}
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 'bold', 
                    color: '#999', 
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontSize: '0.75rem'
                  }}>
                    First seen in
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#333', fontWeight: '500' }}>
                    Never Ricking Morty
                  </Typography>
                </Grid>

                {/* Last known location */}
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 'bold', 
                    color: '#999', 
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontSize: '0.75rem'
                  }}>
                    Last known location
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#333', fontWeight: '500' }}>
                    {character.location?.name || 'Story Train'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Related Characters Section */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ 
              backgroundColor: 'white', 
              borderRadius: 2, 
              p: 3,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 3, 
                color: '#333',
                fontFamily: 'Montserrat, sans-serif',
              }}>
                Personajes relacionados
              </Typography>
              {loadingRelated ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {relatedCharacters.slice(0, 6).map((relatedChar) => (
                    <Grid item xs={12} sm={6} md={4} key={relatedChar.id}>
                      <RelatedCharacterCard character={relatedChar} />
                    </Grid>
                  ))}
                  {relatedCharacters.length === 0 && (
                    <Grid item xs={12}>
                      <Typography 
                        variant="body2" 
                        sx={{ color: '#666', textAlign: 'center', py: 2 }}
                      >
                        No se encontraron personajes relacionados
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}