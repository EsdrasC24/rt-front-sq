import { Box, Typography, Modal, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import Badge from './Badge';
import Button from './Button';
import { useFilterStore } from '../store/useFilterStore';
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

// Mapping between Spanish UI and English API values
const UI_TO_API_MAPPING = {
  species: {
    'Humano': 'Human',
    'Cronenbergs': 'Cronenberg',
    'Meeseeks': 'Meeseeks',
    'Arañas gigantes telépatas': 'Giant Spider'
  },
  gender: {
    'Masculino': 'Male',
    'Femenino': 'Female',
    'Desconocido': 'unknown'
  },
  status: {
    'Vivo': 'Alive',
    'Muerto': 'Dead'
  }
} as const;

/**
 * Advanced Filters Modal component
 * Allows users to filter characters by species, gender, and status
 */
const FilterModal = ({ open, onClose, onApplyFilters }: FilterModalProps) => {
  const { activeFilters, setActiveFilters } = useFilterStore();
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
        species: activeFilters.species ? [getUIValue('species', activeFilters.species)] : [],
        gender: activeFilters.gender ? [getUIValue('gender', activeFilters.gender)] : [],
        status: activeFilters.status ? [getUIValue('status', activeFilters.status)] : [],
      };
      setLocalFilters(uiFilters);
    }
  }, [open, activeFilters]);

  // Helper function to get UI value from API value
  const getUIValue = (category: keyof typeof UI_TO_API_MAPPING, apiValue: string): string => {
    const mapping = UI_TO_API_MAPPING[category];
    for (const [uiValue, mappedApiValue] of Object.entries(mapping)) {
      if (mappedApiValue === apiValue) {
        return uiValue;
      }
    }
    return apiValue;
  };

  // Helper function to convert UI filters to API filters
  const convertToAPIFilters = (uiFilters: UIFilterState): CharacterFilters => {
    const apiFilters: CharacterFilters = {};
    
    if (uiFilters.species.length > 0) {
      const apiValue = UI_TO_API_MAPPING.species[uiFilters.species[0] as keyof typeof UI_TO_API_MAPPING.species];
      if (apiValue) apiFilters.species = apiValue;
    }
    
    if (uiFilters.gender.length > 0) {
      const apiValue = UI_TO_API_MAPPING.gender[uiFilters.gender[0] as keyof typeof UI_TO_API_MAPPING.gender];
      if (apiValue) apiFilters.gender = apiValue;
    }
    
    if (uiFilters.status.length > 0) {
      const apiValue = UI_TO_API_MAPPING.status[uiFilters.status[0] as keyof typeof UI_TO_API_MAPPING.status];
      if (apiValue) apiFilters.status = apiValue;
    }
    
    return apiFilters;
  };

  // Filter options
  const speciesOptions = ['Humano', 'Cronenbergs', 'Meeseeks', 'Arañas gigantes telépatas'];
  const genderOptions = ['Masculino', 'Femenino', 'Desconocido'];
  const statusOptions = ['Vivo', 'Muerto'];

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
          maxWidth: '480px',
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
                  variant={localFilters.species.includes(species) ? 'species' : 'default'}
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
                  variant={localFilters.gender.includes(gender) ? 'species' : 'default'}
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
                  variant={localFilters.status.includes(status) ? 'status' : 'default'}
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
          <Button onClick={handleApplyFilters}>
            Aplicar filtros
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterModal;