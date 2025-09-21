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
import Badge from './Badge';
import bgImage from '../assets/bg-character-detail.jpg';

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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Drag functionality for related characters section
  const handleMouseDown = (e: React.MouseEvent) => {
    // Solo iniciar drag si no se está haciendo click en un botón
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return; // No iniciar drag si se hace click en un botón
    }
    
    setIsDragging(true);
    const slider = e.currentTarget as HTMLElement;
    setStartX(e.pageX - slider.offsetLeft);
    setScrollLeft(slider.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const slider = e.currentTarget as HTMLElement;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    slider.scrollLeft = scrollLeft - walk;
  };

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

  const getStatusBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return {
          backgroundColor: '#e8f5e8',
          color: '#2e7d32',
          border: '1px solid #4caf50',
          '&:hover': {
            backgroundColor: '#d4edd4',
          },
        };
      case 'dead':
        return {
          backgroundColor: '#ffebee',
          color: '#c62828',
          border: '1px solid #f44336',
          '&:hover': {
            backgroundColor: '#ffcdd2',
          },
        };
      default:
        return {
          backgroundColor: '#fff3e0',
          color: '#ef6c00',
          border: '1px solid #ff9800',
          '&:hover': {
            backgroundColor: '#ffe0b2',
          },
        };
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
          maxWidth: '600px',
          maxHeight: '95vh',
          position: 'relative',
          minHeight: '80vh',
          overflow: 'hidden',
          backgroundColor: '#e6e7e3',
        },
      }}
    >
      <DialogContent sx={{ 
        p: 0,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::-webkit-scrollbar': {
          opacity: 1,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#B6DA8B',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#A5C97A',
          },
        },
        '&::-webkit-scrollbar-thumb:active': {
          backgroundColor: '#94B369',
        },
        // Firefox
        scrollbarWidth: 'thin',
        scrollbarColor: '#B6DA8B #f1f1f1',
      }}>
        {/* Header with Rick and Morty Background */}
        <Box sx={{ 
          position: 'relative',
          height: '128px',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#00000066',
            zIndex: 1,
          },
        }}>
          {/* Close button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            p: 2,
            position: 'relative',
            zIndex: 2,
          }}>
            <IconButton 
              onClick={onClose}
              sx={{ 
                color: '#808c73',
                backgroundColor: '#FAFAFA',
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
        <Box sx={{ px:3,  pt:1, pb:3, position: 'relative', }}>
          <Box sx={{
            borderRadius: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, // Columna en móvil, fila en desktop
            alignItems: { xs: 'center', sm: 'flex-end' },
            gap: 2,
            paddingLeft: { xs: 0, sm: '140px' }, // Sin padding left en móvil
            textAlign: { xs: 'center', sm: 'left' }, // Centrado en móvil
          }}>
            <Box sx={{
              position: { xs: 'relative', sm: 'absolute' }, // Relativo en móvil, absoluto en desktop
              left: { xs: 'auto', sm: '24px' },
              top: { xs: 0, sm: '-60px' },
              mb: { xs: 2, sm: 0 }, // Margen bottom en móvil
            }}>
              {/* Character Image */}
              <Avatar
                src={character.image}
                alt={character.name}
                sx={{ 
                  width: 128, 
                  height: 128,
                  border: '4px solid #e6e7e3',
                  zIndex: 9999,
                }}
              />
            </Box>

            {/* Character Info */}
            <Box sx={{ 
              flex: 1, 
              paddingBottom: { xs: 0, sm: '16px' },
              width: { xs: '100%', sm: 'auto' }, // Full width en móvil
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                justifyContent: { xs: 'center', sm: 'flex-start' }, // Centrado en móvil
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#333630', 
                    fontWeight: 'semibold',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: { xs: '1.5rem', sm: '2rem' }, // Tamaño responsive
                  }}
                >
                  {character.name}
                </Typography>
                <StarIcon sx={{ fontSize: '18px', color: '#8BC547' }} />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666', 
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '.875rem',
                }}
              >
                {character.species}
              </Typography>
            </Box>

            {/* Three dots menu */}
            <IconButton 
              size="small" 
              sx={{ 
                color: '#999', 
                alignSelf: { xs: 'center', sm: 'flex-start' },
                position: { xs: 'absolute', sm: 'static' },
                top: { xs: '16px', sm: 'auto' },
                right: { xs: '16px', sm: 'auto' },
              }}
            >
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
        <Box sx={{ px: 3, pb: 3 }}>
          <Grid container spacing={3}>
            {/* Information Card */}
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                backgroundColor: 'white', 
                borderRadius: 2, 
                p: 3,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
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
                  <Badge
                    preIcon={
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: getStatusColor(character.status),
                        }}
                      />
                    }
                    sx={getStatusBadgeStyles(character.status)}
                  >
                    {character.status === 'Alive' ? 'Vivo' : character.status === 'Dead' ? 'Muerto' : 'Desconocido'}
                  </Badge>
                </Box>
              </Box>
            </Grid>

            {/* Episodes Card */}
            <Grid item xs={12} md={8}>
              <Box sx={{ 
                backgroundColor: 'white', 
                borderRadius: 2, 
                p: 3,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3, 
                  color: '#333',
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  Episodios
                </Typography>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {episodeLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, flex: 1, alignItems: 'center' }}>
                      <CircularProgress size={32} />
                    </Box>
                  ) : (
                    <Box sx={{ maxHeight: 300, overflow: 'auto', flex: 1,
                      '&::-webkit-scrollbar': {
                        width: '8px',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover::-webkit-scrollbar': {
                        opacity: 1,
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f1f1',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#B6DA8B',
                        borderRadius: '4px',
                        '&:hover': {
                          backgroundColor: '#A5C97A',
                        },
                      },
                      '&::-webkit-scrollbar-thumb:active': {
                        backgroundColor: '#94B369',
                      },
                      // Firefox
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#B6DA8B #f1f1f1',
                    }}>
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
              </Box>
            </Grid>
          </Grid>

          {/* Location Information Section */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ 
              borderRadius: 2, 
              p: 3,
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
                <Box 
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  sx={{ 
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    pb: 1,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                    MsOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    scrollBehavior: isDragging ? 'auto' : 'smooth',
                  }}
                >
                  {relatedCharacters.slice(0, 6).map((relatedChar) => (
                    <Box 
                      key={relatedChar.id}
                      sx={{ 
                        minWidth: '200px',
                        flex: '0 0 auto',
                      }}
                    >
                      <RelatedCharacterCard character={relatedChar} />
                    </Box>
                  ))}
                  {relatedCharacters.length === 0 && (
                    <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ color: '#666' }}
                      >
                        No se encontraron personajes relacionados
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}