import { Box, Typography, Modal, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
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
      },
    };

    return mappings[category][apiValue as keyof typeof mappings[typeof category]] || apiValue;
  };

  // Helper function to convert UI filters to API filters
  const convertToAPIFilters = (uiFilters: UIFilterState): CharacterFilters => {
    const apiFilters: CharacterFilters = {};
    
    if (uiFilters.species.length > 0) {
      const apiValues = uiFilters.species.map(species => 
        CharacterMapper.mapSpanishToEnglish('species', species)
      ).filter(Boolean);
      if (apiValues.length === 1) {
        apiFilters.species = apiValues[0];
      } else if (apiValues.length > 1) {
        apiFilters.species = apiValues;
      }
    }
    
    if (uiFilters.gender.length > 0) {
      const apiValues = uiFilters.gender.map(gender => 
        CharacterMapper.mapSpanishToEnglish('gender', gender)
      ).filter(Boolean) as ('Male' | 'Female' | 'Genderless' | 'unknown')[];
      if (apiValues.length === 1) {
        apiFilters.gender = apiValues[0];
      } else if (apiValues.length > 1) {
        apiFilters.gender = apiValues;
      }
    }
    
    if (uiFilters.status.length > 0) {
      const apiValues = uiFilters.status.map(status => 
        CharacterMapper.mapSpanishToEnglish('status', status)
      ).filter(Boolean) as ('Alive' | 'Dead' | 'unknown')[];
      if (apiValues.length === 1) {
        apiFilters.status = apiValues[0];
      } else if (apiValues.length > 1) {
        apiFilters.status = apiValues;
      }
    }
    
    return apiFilters;
  };

  // Get filter options from CharacterMapper
  const filterOptions = CharacterMapper.getFilterOptionsInSpanish();
  const { species: speciesOptions, gender: genderOptions, status: statusOptions } = filterOptions;

  const handleFilterToggle = (category: keyof UIFilterState, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item: string) => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleApplyFilters = () => {
    const apiFilters = convertToAPIFilters(localFilters);
    setActiveFilters(apiFilters);
    if (onApplyFilters) {
      onApplyFilters(apiFilters);
    }
    onClose();
  };

  const handleClearFilters = () => {
    setLocalFilters({
      species: [],
      gender: [],
      status: [],
    });
  };

  const hasActiveLocalFilters = localFilters.species.length > 0 || 
                               localFilters.gender.length > 0 || 
                               localFilters.status.length > 0;

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="filter-modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: { xs: '24px', sm: '32px' },
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
          position: 'relative',
          outline: 'none',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <Typography
            id="filter-modal-title"
            variant="h6"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: '18px',
              color: '#333333',
              margin: 0,
            }}
          >
            Filtros avanzados
          </Typography>
          
          <IconButton
            onClick={handleClose}
            sx={{
              padding: '4px',
              color: '#666666',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: '20px' }} />
          </IconButton>
        </Box>

        {/* Species Filter */}
        <Box sx={{ marginBottom: '24px' }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              color: '#333333',
              marginBottom: '12px',
            }}
          >
            Especie
          </Typography>
          <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {speciesOptions.map((species) => (
              <Box
                key={species}
                onClick={() => handleFilterToggle('species', species)}
                sx={{ cursor: 'pointer' }}
              >
                <Badge
                  sx={localFilters.species.includes(species) ? {
                    backgroundColor: '#C7CBC2',
                    color: '#333333',
                    border: '1px solid #B5BAB0',
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    textAlign: 'center',
                    '&:hover': {
                      backgroundColor: '#B5BAB0',
                    },
                  } : {
                    backgroundColor: 'transparent',
                    color: '#666666',
                    border: '1px solid #e0e0e0',
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    textAlign: 'center',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
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
            variant="subtitle2"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              color: '#333333',
              marginBottom: '12px',
            }}
          >
            Género
          </Typography>
          <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {genderOptions.map((gender) => (
              <Box
                key={gender}
                onClick={() => handleFilterToggle('gender', gender)}
                sx={{ cursor: 'pointer' }}
              >
                <Badge
                  sx={localFilters.gender.includes(gender) ? {
                    backgroundColor: '#C7CBC2',
                    color: '#333333',
                    border: '1px solid #B5BAB0',
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    textAlign: 'center',
                    '&:hover': {
                      backgroundColor: '#B5BAB0',
                    },
                  } : {
                    backgroundColor: 'transparent',
                    color: '#666666',
                    border: '1px solid #e0e0e0',
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    textAlign: 'center',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
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
        <Box sx={{ marginBottom: '32px' }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              color: '#333333',
              marginBottom: '12px',
            }}
          >
            Estado
          </Typography>
          <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {statusOptions.map((status) => (
              <Box
                key={status}
                onClick={() => handleFilterToggle('status', status)}
                sx={{ cursor: 'pointer' }}
              >
                <Badge
                  sx={localFilters.status.includes(status) ? {
                    backgroundColor: '#C7CBC2',
                    color: '#333333',
                    border: '1px solid #B5BAB0',
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    textAlign: 'center',
                    '&:hover': {
                      backgroundColor: '#B5BAB0',
                    },
                  } : {
                    backgroundColor: 'transparent',
                    color: '#666666',
                    border: '1px solid #e0e0e0',
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    textAlign: 'center',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  {status}
                </Badge>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px',
            gap: '12px',
          }}
        >
          {/* Clear Filters Button */}
          {hasActiveLocalFilters && (
            <Box
              component="button"
              onClick={handleClearFilters}
              sx={{
                background: 'none',
                border: 'none',
                color: '#666666',
                fontSize: '14px',
                fontFamily: 'Montserrat, sans-serif',
                cursor: 'pointer',
                padding: '8px 0',
                '&:hover': {
                  color: '#333333',
                },
              }}
            >
              Limpiar filtros
            </Box>
          )}
          
          {/* Apply Button */}
          <Button onClick={handleApplyFilters}
            sx={{
              width: '148px',
              marginLeft: 'auto',
            }}
          >
            Aplicar filtros
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterModal;