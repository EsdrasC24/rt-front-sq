import { Box, Typography, Modal, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';
import Badge from './Badge';
import Button from './Button';
import { useActiveFilters, useSetActiveFilters } from '../hooks';
import { CharacterMapper } from '../services';
import type { CharacterFilters } from '../services';

interface FilterModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;
  /**
   * Callback function when the modal is closed
   */
  onClose: () => void;
  /**
   * Callback function when filters are applied
   */
  onApplyFilters?: (filters: CharacterFilters) => void;
}

// UI filter state (Spanish labels)
interface UIFilterState {
  species: string[];
  gender: string[];
  status: string[];
}

/**
 * Advanced Filters Modal component
 * Allows users to filter characters by species, gender, and status
 */
const FilterModal = ({ open, onClose, onApplyFilters }: FilterModalProps) => {
  const activeFilters = useActiveFilters();
  const setActiveFilters = useSetActiveFilters();
  const [localFilters, setLocalFilters] = useState<UIFilterState>({
    species: [],
    gender: [],
    status: [],
  });

  // Drag state for mobile bottom sheet
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load current filters when modal opens
  useEffect(() => {
    if (open) {
      // Convert API filters back to UI filters for display
      const uiFilters: UIFilterState = {
        species: activeFilters.species ? 
          (Array.isArray(activeFilters.species) 
            ? activeFilters.species.map(value => getUIValue('species', value))
            : [getUIValue('species', activeFilters.species)]
          ) : [],
        gender: activeFilters.gender ? 
          (Array.isArray(activeFilters.gender) 
            ? activeFilters.gender.map(value => getUIValue('gender', value))
            : [getUIValue('gender', activeFilters.gender)]
          ) : [],
        status: activeFilters.status ? 
          (Array.isArray(activeFilters.status) 
            ? activeFilters.status.map(value => getUIValue('status', value))
            : [getUIValue('status', activeFilters.status)]
          ) : [],
      };
      setLocalFilters(uiFilters);
    }
  }, [open, activeFilters]);

  // Helper function to get UI value from API value (inverse of mapSpanishToEnglish)
  const getUIValue = (category: 'species' | 'gender' | 'status', apiValue: string): string => {
    const mappings = {
      species: {
        'Human': 'Humano',
        'Cronenberg': 'Cronenbergs',
        'Meeseeks': 'Meeseeks',
        'Giant Spider': 'Arañas gigantes telépatas',
      },
      gender: {
        'Male': 'Masculino',
        'Female': 'Femenino',
        'unknown': 'Desconocido',
      },
      status: {
        'Alive': 'Vivo',
        'Dead': 'Muerto',
        'unknown': 'Desconocido',
      },
    };

    return mappings[category][apiValue as keyof typeof mappings[typeof category]] || apiValue;
  };

  // Helper function to convert UI filters to API filters
  const convertToAPIFilters = (uiFilters: UIFilterState): CharacterFilters => {
    const apiFilters: CharacterFilters = {};

    if (uiFilters.species.length > 0) {
      apiFilters.species = uiFilters.species.map(spanishValue => 
        CharacterMapper.mapSpanishToEnglish('species', spanishValue)
      ) as any;
    }

    if (uiFilters.gender.length > 0) {
      apiFilters.gender = uiFilters.gender.map(spanishValue => 
        CharacterMapper.mapSpanishToEnglish('gender', spanishValue)
      ) as any;
    }

    if (uiFilters.status.length > 0) {
      apiFilters.status = uiFilters.status.map(spanishValue => 
        CharacterMapper.mapSpanishToEnglish('status', spanishValue)
      ) as any;
    }

    return apiFilters;
  };

  const handleFilterToggle = (category: keyof UIFilterState, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setLocalFilters({
      species: [],
      gender: [],
      status: [],
    });
  };

  const handleApplyFilters = () => {
    const apiFilters = convertToAPIFilters(localFilters);
    setActiveFilters(apiFilters);
    if (onApplyFilters) {
      onApplyFilters(apiFilters);
    }
    onClose();
  };

  // Get filter options from mapper
  const filterOptions = {
    species: CharacterMapper.getFilterOptionsInSpanish().species,
    gender: CharacterMapper.getFilterOptionsInSpanish().gender,
    status: CharacterMapper.getFilterOptionsInSpanish().status,
  };

  // Count active filters
  const totalActiveFilters = localFilters.species.length + localFilters.gender.length + localFilters.status.length;

  // Touch handlers for mobile drag functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth > 600) return; // Only on mobile
    
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || window.innerWidth > 600) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    
    // Only allow dragging down
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || window.innerWidth > 600) return;
    
    setIsDragging(false);
    
    // If dragged down more than 100px, close modal
    if (dragY > 100) {
      onClose();
    }
    
    // Reset drag position
    setDragY(0);
  };

  const handleClose = () => {
    if (isDragging) return; // Don't close if currently dragging
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="filter-modal-title"
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-end', sm: 'center' },
        justifyContent: 'center',
        padding: { xs: 0, sm: 2 },
      }}
    >
      <Box
        ref={modalRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: { xs: '24px 24px 0 0', sm: '16px' },
          maxWidth: { xs: '100vw', sm: '600px' },
          width: '100%',
          maxHeight: { xs: '85vh', sm: '80vh' },
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
          position: 'relative',
          outline: 'none',
          transform: { xs: `translateY(${dragY}px)`, sm: 'none' },
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Fixed Header Section */}
        <Box
          sx={{
            flexShrink: 0,
            padding: { xs: '0 24px', sm: '32px 32px 0 32px' },
          }}
        >
          {/* Mobile drag handle */}
          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              justifyContent: 'center',
              paddingTop: '12px',
              paddingBottom: '8px',
            }}
          >
            <Box
              sx={{
                width: '32px',
                height: '4px',
                backgroundColor: '#E0E0E0',
                borderRadius: '2px',
              }}
            />
          </Box>

          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: { xs: '16px', sm: '24px' },
              paddingTop: { xs: '16px', sm: '0' },
            }}
          >
            <Typography
              id="filter-modal-title"
              variant="h6"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                fontSize: { xs: '20px', sm: '24px' },
              }}
            >
              Filtros
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: '#666666',
                padding: '8px',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            padding: { xs: '0 24px', sm: '0 32px' },
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: '#a8a8a8',
              },
            },
          }}
        >
          {/* Species Filter */}
          <Box sx={{ marginBottom: '24px' }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                marginBottom: '12px',
                fontSize: '16px',
              }}
            >
              Especies
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {filterOptions.species.map((species) => (
                <Box
                  key={species}
                  onClick={() => handleFilterToggle('species', species)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Badge
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: localFilters.species.includes(species) ? 600 : 400,
                      backgroundColor: localFilters.species.includes(species) 
                        ? '#8BC547' 
                        : '#f5f5f5',
                      color: localFilters.species.includes(species) 
                        ? '#ffffff' 
                        : '#666666',
                      border: localFilters.species.includes(species) 
                        ? '1px solid #8BC547' 
                        : '1px solid #e0e0e0',
                      '&:hover': {
                        backgroundColor: localFilters.species.includes(species) 
                          ? '#7AB33D' 
                          : '#eeeeee',
                        borderColor: localFilters.species.includes(species) 
                          ? '#7AB33D' 
                          : '#d0d0d0',
                      },
                    }}
                  >
                    {species}
                  </Badge>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Gender Filter */}
          <Box sx={{ marginBottom: '24px' }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                marginBottom: '12px',
                fontSize: '16px',
              }}
            >
              Géneros
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {filterOptions.gender.map((gender) => (
                <Box
                  key={gender}
                  onClick={() => handleFilterToggle('gender', gender)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Badge
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: localFilters.gender.includes(gender) ? 600 : 400,
                      backgroundColor: localFilters.gender.includes(gender) 
                        ? '#8BC547' 
                        : '#f5f5f5',
                      color: localFilters.gender.includes(gender) 
                        ? '#ffffff' 
                        : '#666666',
                      border: localFilters.gender.includes(gender) 
                        ? '1px solid #8BC547' 
                        : '1px solid #e0e0e0',
                      '&:hover': {
                        backgroundColor: localFilters.gender.includes(gender) 
                          ? '#7AB33D' 
                          : '#eeeeee',
                        borderColor: localFilters.gender.includes(gender) 
                          ? '#7AB33D' 
                          : '#d0d0d0',
                      },
                    }}
                  >
                    {gender}
                  </Badge>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Status Filter */}
          <Box sx={{ marginBottom: '24px' }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                marginBottom: '12px',
                fontSize: '16px',
              }}
            >
              Estados
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {filterOptions.status.map((status) => (
                <Box
                  key={status}
                  onClick={() => handleFilterToggle('status', status)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Badge
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: localFilters.status.includes(status) ? 600 : 400,
                      backgroundColor: localFilters.status.includes(status) 
                        ? '#8BC547' 
                        : '#f5f5f5',
                      color: localFilters.status.includes(status) 
                        ? '#ffffff' 
                        : '#666666',
                      border: localFilters.status.includes(status) 
                        ? '1px solid #8BC547' 
                        : '1px solid #e0e0e0',
                      '&:hover': {
                        backgroundColor: localFilters.status.includes(status) 
                          ? '#7AB33D' 
                          : '#eeeeee',
                        borderColor: localFilters.status.includes(status) 
                          ? '#7AB33D' 
                          : '#d0d0d0',
                      },
                    }}
                  >
                    {status}
                  </Badge>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Fixed Footer Section */}
        <Box
          sx={{
            flexShrink: 0,
            padding: { xs: '24px', sm: '24px 32px 32px 32px' },
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#ffffff',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: { xs: '12px', sm: '16px' },
            }}
          >
            {/* Clear Filters Button */}
            {totalActiveFilters > 0 && (
              <Button
                onClick={clearFilters}
                sx={{
                  backgroundColor: 'transparent',
                  color: '#666666',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  padding: '8px 16px',
                  minHeight: '40px',
                  width: { xs: '100%', sm: 'auto' },
                  order: { xs: 2, sm: 1 },
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    color: '#333333',
                  },
                }}
              >
                Limpiar filtros
              </Button>
            )}
            
            {/* Apply Button */}
            <Button 
              onClick={handleApplyFilters}
              sx={{
                width: { xs: '100%', sm: '148px' },
                marginLeft: { xs: '0', sm: 'auto' },
                order: { xs: 1, sm: 2 },
              }}
            >
              Aplicar filtros
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterModal;