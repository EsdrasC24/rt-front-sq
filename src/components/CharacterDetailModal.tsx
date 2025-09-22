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
import { characterService, CharacterMapper, episodeService } from '../services';
import RelatedCharacterCard from './RelatedCharacterCard';
import StarIcon from './icons/StarIcon';
import StatusBadge from './StatusBadge';
import bgImage from '../assets/bg-character-detail.jpg';
import { useIsFavorite } from '../hooks';

interface CharacterDetailModalProps {
  character: Character | null;
  open: boolean;
  onClose: () => void;
}

export function CharacterDetailModal({ character, open, onClose }: CharacterDetailModalProps) {
  const [relatedCharacters, setRelatedCharacters] = useState<Character[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [episodeNames, setEpisodeNames] = useState<Record<string, string>>({});
  const [episodeDetails, setEpisodeDetails] = useState<Record<string, { name: string; episode: string }>>({});
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Check if current character is favorite
  const isCharacterFavorite = useIsFavorite(character?.id || 0);

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
      const loadEpisodeDetails = async () => {
        setLoadingEpisodes(true);
        const names: Record<string, string> = {};
        const details: Record<string, { name: string; episode: string }> = {};
        
        try {
          for (const episodeUrl of character.episode) {
            try {
              const episodeId = episodeService.extractEpisodeId(episodeUrl);
              if (episodeId) {
                const episodeData = await episodeService.getEpisodeById(episodeId);
                names[episodeUrl] = episodeData.name;
                details[episodeUrl] = {
                  name: episodeData.name,
                  episode: episodeData.episode
                };
              } else {
                throw new Error('Invalid episode URL');
              }
            } catch (error) {
              console.error('Error loading episode details for URL:', episodeUrl, error);
              const episodeId = episodeUrl.split('/').pop();
              const fallbackName = `Episodio ${episodeId}`;
              names[episodeUrl] = fallbackName;
              details[episodeUrl] = {
                name: fallbackName,
                episode: `S01 E${episodeId?.padStart(2, '0') || '01'}`
              };
            }
          }
        } catch (error) {
          console.error('Error loading episodes:', error);
        } finally {
          setEpisodeNames(names);
          setEpisodeDetails(details);
          setLoadingEpisodes(false);
        }
      };
      loadEpisodeDetails();
    }
  }, [character, open]);

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
        {/* Header Section */}
        <Box sx={{ 
          p: 0,
          position: 'relative',
          width: '100%',}}>
          {/* Header with Rick and Morty Background */}
          <Box sx={{ 
            position: 'relative',
            top: { xs: 0, sm: 'auto' },
            left: { xs: 0, sm: 'auto' },
            width: '100%',
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
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Character Info Card - Separate from header */}
          <Box sx={{ 
            px: 3,  
            pt: 1, 
            pb: 3, 
            position: 'relative',
            mt: { xs: '-55px', sm: 0 },
          }}>
            <Box sx={{
              borderRadius: 2,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }, // Columna en móvil, fila en desktop
              alignItems: { xs: 'center', sm: 'flex-end' },
              gap: { xs: 0, sm: 2 },
              paddingLeft: { xs: 0, sm: '140px' }, // Sin padding left en móvil
              textAlign: { xs: 'center', sm: 'left' }, // Centrado en móvil
            }}>
              <Box sx={{
                position: { xs: 'relative', sm: 'absolute' }, // Relativo en móvil, absoluto en desktop
                left: { xs: 'auto', sm: '24px' },
                top: { xs: 0, sm: '-60px' },
                // mb: { xs: 2, sm: 0 }, // Margen bottom en móvil
              }}>
                {/* Character Image */}
                <Avatar
                  src={character.image}
                  alt={character.name}
                  sx={{ 
                    width: { xs: 112, sm: 128 }, 
                    height: { xs: 112, sm: 128 },
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
                  {isCharacterFavorite && (
                    <StarIcon sx={{ fontSize: '18px', color: '#8BC547' }} />
                  )}
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#666', 
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '.875rem',
                  }}
                >
                  {CharacterMapper.mapEnglishToSpanish('species', character.species)}
                </Typography>
              </Box>

              {/* Three dots menu */}
              {/* <IconButton 
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
              </IconButton> */}
            </Box>
          </Box>
        </Box>

        {/* Content Sections */}
        <Box sx={{ px: 3, pb: 3 }}>
          <Grid container spacing={3}>
            {/* Information Card */}
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                backgroundColor: '#fafafa', 
                borderRadius: 2, 
                p: 3,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Typography variant="h6" sx={{ 
                  fontFamily: 'Montserrat',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '2%',
                  mb: 3, 
                  color: '#333',
                }}>
                  Información
                </Typography>
                
                {/* Gender */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ 
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '2%',
                    color: '#999', 
                    mb: 0.5,
                  }}>
                    Género
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '0%',
                    color: '#333',
                  }}>
                    {CharacterMapper.mapEnglishToSpanish('gender', character.gender)}
                  </Typography>
                </Box>

                {/* Origin */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ 
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '2%',
                    color: '#999', 
                    mb: 0.5,
                  }}>
                    Origen
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '0%',
                    color: '#575B52',
                  }}>
                    {character.origin?.name || 'Tierra (C-137)'}
                  </Typography>
                </Box>

                {/* Status */}
                <Box>
                  <Typography variant="body2" sx={{ 
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '2%',
                    color: '#999', 
                    mb: 0.5,
                  }}>
                    Estado
                  </Typography>
                  <StatusBadge status={character.status} />
                </Box>
              </Box>
            </Grid>

            {/* Episodes Card */}
            <Grid item xs={12} md={8}>
              <Box sx={{ 
                backgroundColor: '#fafafa', 
                borderRadius: 2, 
                p: 3,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Typography variant="h6" sx={{ 
                  fontFamily: 'Montserrat',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '2%',
                  mb: 3, 
                  color: '#333',
                }}>
                  Episodios
                </Typography>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {loadingEpisodes ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, flex: 1, alignItems: 'center' }}>
                      <CircularProgress 
                        size={32} 
                        sx={{ color: '#8BC547' }}
                      />
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
                      const episodeDetail = episodeDetails[episodeUrl];
                      const name = episodeDetail?.name || episodeNames[episodeUrl] || 'Cargando...';
                      const episodeCode = episodeDetail?.episode?.replace('E', ' E') || 'S?? E??';
                      
                      return (
                        <Box 
                          key={episodeUrl}
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            py: 1.5,
                        
                          }}
                        >
                          <Box sx={{ flex: 1, display: 'flex' }}>
                            <Typography variant="body2" sx={{ 
                              fontFamily: 'Montserrat',
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '20px',
                              letterSpacing: '0%',
                              color: '#808C73',
                              mr: 1,
                            }}>
                              {episodeCode}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              fontFamily: 'Montserrat',
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '20px',
                              letterSpacing: '0%',
                              color: '#575B52',
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
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '2%',
                    color: '#999', 
                    mb: 0.5,
                    textTransform: 'uppercase',
                  }}>
                    First seen in
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '0%',
                    color: '#333',
                  }}>
                    Never Ricking Morty
                  </Typography>
                </Grid>

                {/* Last known location */}
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ 
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '2%',
                    color: '#999', 
                    mb: 0.5,
                    textTransform: 'uppercase',
                  }}>
                    Last known location
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '0%',
                    color: '#333',
                  }}>
                    {character.location?.name || 'Story Train'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Related Characters Section */}
          <Box sx={{ mt: 1 }}>
            <Box sx={{ 
              borderRadius: 2, 
              px: 1,
            }}>
              <Typography variant="h4" sx={{ 
                fontFamily: 'Montserrat',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '100%',
                letterSpacing: '2%',
                mb: 3, 
                color: '#333630',
              }}>
                Personajes relacionados
              </Typography>
              {loadingRelated ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress 
                    size={32} 
                    sx={{ color: '#8BC547' }}
                  />
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