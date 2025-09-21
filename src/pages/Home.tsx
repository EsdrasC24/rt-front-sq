import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useState, useEffect, useMemo, useRef } from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import FilterTabs from '../components/FilterTabs';
import CharacterCard from '../components/CharacterCard';
import { CharacterDetailModal } from '../components/CharacterDetailModal';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { useCharacters } from '../hooks';
import { 
  useOptimizedFilters, 
  useOptimizedFilterActions, 
  useFavoritesList 
} from '../hooks';
import type { Character, CharacterFilters } from '../services';

/**
 * Home page component that displays the main application interface
 * Features the Rick and Morty header with search functionality and footer
 */
const Home = () => {
  // Optimized store subscriptions
  const { searchTerm, activeFilters, currentTab } = useOptimizedFilters();
  const { removeFilter, setSearchTerm, clearAllFilters, updateFilter } = useOptimizedFilterActions();
  const favoritesList = useFavoritesList();
  const { 
    characters, 
    loading, 
    error, 
    hasMore,
    totalCount,
    loadMore,
    fetchCharacters
  } = useCharacters();

  // Modal state
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ref to track previous filters to avoid unnecessary API calls
  const prevFiltersRef = useRef<string>('');

  // React to filter changes
  useEffect(() => {
    if (currentTab === 'todos') {
      const combinedFilters: CharacterFilters = { ...activeFilters };
      
      if (searchTerm.trim()) {
        combinedFilters.name = searchTerm.trim();
      }

      // Create a string representation to compare filters
      const filtersString = JSON.stringify(combinedFilters);
      
      // Only fetch if filters actually changed
      if (filtersString !== prevFiltersRef.current) {
        prevFiltersRef.current = filtersString;
        fetchCharacters(combinedFilters, 1);
      }
    }
  }, [searchTerm, activeFilters, currentTab]); // Removed fetchCharacters dependency

  // Filter characters for favorites tab
  const displayedCharacters = useMemo(() => {
    if (currentTab === 'favoritos') {
      return characters.filter(character => favoritesList.includes(character.id));
    }
    return characters;
  }, [characters, currentTab, favoritesList]);

  // Function to get filter display value
  const getFilterDisplayValue = (key: keyof CharacterFilters, value: string) => {
    switch (key) {
      case 'species':
        return value;
      case 'gender':
        return value === 'Male' ? 'Masculino' : value === 'Female' ? 'Femenino' : value;
      case 'status':
        return value === 'Alive' ? 'Vivo' : value === 'Dead' ? 'Muerto' : 'Desconocido';
      case 'name':
        return `"${value}"`;
      default:
        return value;
    }
  };

  // Function to handle filter removal
  const handleRemoveFilter = (key: keyof CharacterFilters, index?: number) => {
    if (key === 'name') {
      setSearchTerm('');
    } else {
      const currentValue = activeFilters[key];
      if (Array.isArray(currentValue) && typeof index === 'number') {
        // Remove specific item from array
        const newArray = currentValue.filter((_, i) => i !== index);
        if (newArray.length === 0) {
          removeFilter(key);
        } else {
          // Update the filter with the new array
          updateFilter(key, newArray);
        }
      } else {
        // Remove entire filter
        removeFilter(key);
      }
    }
  };

  // Get all active filters including search term
  const getAllActiveFilters = () => {
    const filters: Array<{ key: keyof CharacterFilters; value: string; index?: number }> = [];
    
    if (searchTerm.trim()) {
      filters.push({ key: 'name', value: searchTerm.trim() });
    }
    
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          // Handle array values - create a badge for each value
          value.forEach((singleValue, index) => {
            filters.push({ 
              key: key as keyof CharacterFilters, 
              value: singleValue as string,
              index 
            });
          });
        } else {
          // Handle single values
          filters.push({ key: key as keyof CharacterFilters, value: value as string });
        }
      }
    });
    
    return filters;
  };

  const allActiveFilters = getAllActiveFilters();

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#e6e7e3',
        fontFamily: 'Montserrat, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header Component */}
      <Header />
      
      {/* Filter Tabs */}
      <FilterTabs />
      
      {/* Records Counter and Applied Filters Header */}
      <Box
        sx={{
          padding: { xs: '16px 16px 0', sm: '16px 24px 0', md: '16px 32px 0' },
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: allActiveFilters.length > 0 && currentTab === 'todos' ? 2 : 0,
          }}
        >
          {/* Applied Filters Title */}
          {currentTab === 'todos' && allActiveFilters.length > 0 && (
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '600',
                color: '#666',
                fontSize: '14px',
              }}
            >
              Filtros aplicados
            </Typography>
          )}
          
          {/* Spacer for when no filters */}
          {!(currentTab === 'todos' && allActiveFilters.length > 0) && <Box />}
          
          {/* Records Counter */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography
              variant="h4"
              component="h4"
              sx={{
                fontFamily: 'Montserrat',
                fontWeight: 600,
                fontStyle: 'normal',
                fontSize: '18px',
                lineHeight: '32px',
                letterSpacing: '0px',
                textAlign: 'center',
                color: '#333630',
              }}
            >
              {currentTab === 'favoritos' 
                ? displayedCharacters.length
                : totalCount
              }
            </Typography>
            <Typography
              variant="h6"
              component="h6"
              sx={{
                fontFamily: 'Montserrat',
                fontWeight: 600,
                fontStyle: 'normal',
                fontSize: '16px',
                lineHeight: '100%',
                letterSpacing: '2%',
                textAlign: 'center',
                color: '#575B52',
              }}
            >
              {currentTab === 'favoritos' 
                ? `${displayedCharacters.length === 1 ? 'favorito' : 'favoritos'}`
                : searchTerm.trim() || Object.keys(activeFilters).length > 0
                  ? `${totalCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}`
                  : `${totalCount === 1 ? 'personaje' : 'personajes'}`
              }
            </Typography>
          </Box>
        </Box>
        
        {/* Applied Filters Badges */}
        {currentTab === 'todos' && allActiveFilters.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 2,
            }}
          >
            {allActiveFilters.map(({ key, value, index }, badgeIndex) => (
              <Badge
                key={`${key}-${index !== undefined ? index : 'single'}-${badgeIndex}`}
                sx={{
                  backgroundColor: '#C7CBC2',
                  color: '#333333',
                  border: '1px solid #B5BAB0',
                  '&:hover': {
                    backgroundColor: '#B5BAB0',
                  },
                }}
                removable
                onRemove={() => handleRemoveFilter(key, index)}
              >
                {getFilterDisplayValue(key, value)}
              </Badge>
            ))}
          </Box>
        )}
      </Box>
      
      
      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          padding: { xs: 2, sm: 3, md: 4 },
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Character Cards Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr',                    // 1 columna en móvil
              sm: '1fr',                    // 1 columna en tablet pequeño
              md: 'repeat(2, 1fr)',         // 2 columnas en tablet y escritorio
              lg: 'repeat(2, 1fr)',         // 2 columnas en pantallas grandes
              xl: 'repeat(2, 1fr)'          // 2 columnas en pantallas extra grandes
            },
            gap: '16px',
            padding: '20px 0',
            maxWidth: { xs: '600px', md: '1200px' },
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* Loading State */}
          {loading && displayedCharacters.length === 0 && (
            <Box
              sx={{
                gridColumn: '1 / -1', // Ocupa todas las columnas
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
              }}
            >
              <CircularProgress sx={{ color: '#8BC34A' }} />
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                gridColumn: '1 / -1', // Ocupa todas las columnas
                margin: '20px 0' 
              }}
            >
              <Typography variant="body1">
                Error al cargar personajes: {error}
              </Typography>
            </Alert>
          )}

          {/* Characters List */}
          {displayedCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onFavoriteChange={() => {
                // Favorite status updated
              }}
              onClick={() => handleCharacterClick(character)}
            />
          ))}

          {/* Empty State */}
          {!loading && displayedCharacters.length === 0 && !error && (
            <Box
              sx={{
                gridColumn: '1 / -1', // Ocupa todas las columnas
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '60px 20px',
                textAlign: 'center',
              }}
            >
              {currentTab === 'favoritos' ? (
                // Favoritos empty state
                <>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      color: '#666666',
                      marginBottom: '8px',
                    }}
                  >
                    No tienes personajes favoritos
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      color: '#999999',
                    }}
                  >
                    Marca algunos personajes como favoritos para verlos aquí
                  </Typography>
                </>
              ) : allActiveFilters.length > 0 ? (
                // Filtered results empty state (Rick and Morty style)
                <>
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 'bold',
                      color: '#333',
                      fontSize: { xs: '48px', sm: '64px', md: '72px' },
                      marginBottom: '16px',
                    }}
                  >
                    Oh no!
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      color: '#666',
                      fontSize: { xs: '16px', sm: '18px', md: '20px' },
                      marginBottom: '32px',
                      fontWeight: 400,
                    }}
                  >
                    ¡Pareces perdido en tu viaje!
                  </Typography>
                  <Button
                    onClick={clearAllFilters}
                    sx={{
                      backgroundColor: '#8BC34A',
                      color: '#ffffff',
                      borderRadius: '25px',
                      padding: '12px 32px',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(139, 195, 74, 0.3)',
                      width: 'auto', // Override fixed width from Button component
                      height: 'auto', // Override fixed height from Button component
                      '&:hover': {
                        backgroundColor: '#7CB342',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(139, 195, 74, 0.4)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </>
              ) : (
                // Default empty state (no filters applied)
                <>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      color: '#666666',
                      marginBottom: '8px',
                    }}
                  >
                    No se encontraron personajes
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      color: '#999999',
                    }}
                  >
                    Intenta con otros filtros de búsqueda
                  </Typography>
                </>
              )}
            </Box>
          )}
        </Box>

        {/* Load More Button - Fuera de la cuadrícula */}
        {currentTab === 'todos' && hasMore && characters.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <Button
              onClick={loadMore}
              disabled={loading}
              sx={{
                padding: '12px 24px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.3s ease',
                width: 'auto', // Override fixed width from Button component
                height: 'auto', // Override fixed height from Button component
                '&:hover': {
                  backgroundColor: loading ? '#B6DA8B' : '#7CB342',
                },
                '&:disabled': {
                  backgroundColor: '#B6DA8B',
                  color: '#ffffff',
                  opacity: 0.6,
                },
              }}
            >
              {loading ? 'Cargando...' : 'Cargar más'}
            </Button>
          </Box>
        )}
      </Box>

      {/* Footer Component */}
      <Footer />

      {/* Character Detail Modal */}
      <CharacterDetailModal
        character={selectedCharacter}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default Home;