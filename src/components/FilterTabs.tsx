import { Box, Button } from '@mui/material';
import FilterIcon from './icons/FilterIcon';
import { useState } from 'react';
import FilterModal from './FilterModal';
import { useFilterStore } from '../store/useFilterStore';

/**
 * Filter Tabs component for filtering between "Todos" and "Favoritos" characters
 * Features active filter highlighting and additional filter options
 */
const FilterTabs = () => {
  const { currentTab, setCurrentTab } = useFilterStore();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleTabChange = (tab: 'todos' | 'favoritos') => {
    setCurrentTab(tab);
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterModalClose = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Filters applied:', filters);
    // Here you would implement the actual filter logic
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: { xs: '16px 20px', sm: '20px 24px', md: '24px 32px' },
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Tab Buttons Container */}
      <Box
        sx={{
          display: 'inline-flex',
          gap: '4px',
          borderRadius: '32px',
          backgroundColor: '#FFFFFF',
          padding: '8px 12px 8px 8px',
          overflow: 'hidden',
          height: '48px',
          opacity: 1,
          alignItems: 'center',
        }}
      >
        {/* Todos Tab */}
        <Button
          onClick={() => handleTabChange('todos')}
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '24px',
            padding: '10px 20px',
            minWidth: 'auto',
            height: '32px',
            flex: 1,
            transition: 'all 0.3s ease',
            backgroundColor: currentTab === 'todos' ? '#B6DA8B' : 'transparent',
            color: currentTab === 'todos' ? '#354E18' : '#5E6573',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: currentTab === 'todos' ? '#7CB342' : 'rgba(0, 0, 0, 0.04)',
            },
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          Todos
        </Button>

        {/* Favoritos Tab */}
        <Button
          onClick={() => handleTabChange('favoritos')}
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '24px',
            padding: '10px 20px',
            minWidth: 'auto',
            height: '32px',
            flex: 1,
            transition: 'all 0.3s ease',
            backgroundColor: currentTab === 'favoritos' ? '#8BC34A' : 'transparent',
            color: currentTab === 'favoritos' ? '#354E18' : '#666666',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: currentTab === 'favoritos' ? '#7CB342' : 'rgba(0, 0, 0, 0.04)',
            },
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          Favoritos
        </Button>
      </Box>

      {/* Filter Icon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: '48px', sm: '52px', md: '56px' },
          height: { xs: '48px', sm: '52px', md: '56px' },
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          border: 'none',
          position: 'relative',
          '&:hover': {
            backgroundColor: '#f8f8f8',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
        }}
        onClick={handleFilterClick}
      >
        <FilterIcon 
          sx={{ 
            color: '#666666',
            fontSize: { xs: '22px', sm: '24px', md: '26px' },
          }} 
        />
      </Box>

      {/* Filter Modal */}
      <FilterModal
        open={isFilterModalOpen}
        onClose={handleFilterModalClose}
        onApplyFilters={handleApplyFilters}
      />
    </Box>
  );
};

export default FilterTabs;