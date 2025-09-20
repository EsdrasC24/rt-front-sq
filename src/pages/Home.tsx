import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useState, useEffect, useMemo, useRef } from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import FilterTabs from '../components/FilterTabs';
import CharacterCard from '../components/CharacterCard';
import { CharacterDetailModal } from '../components/CharacterDetailModal';
import Badge from '../components/Badge';
import { useCharacters } from '../hooks';
import { useFilterStore } from '../store/useFilterStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import type { Character, CharacterFilters } from '../services';

/**
 * Home page component that displays the main application interface
 * Features the Rick and Morty header with search functionality and footer
 */
const Home = () => {
  const { searchTerm, activeFilters, currentTab, removeFilter, setSearchTerm, clearAllFilters } = useFilterStore();
  const { getFavoritesList } = useFavoritesStore();
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
      const favoriteIds = getFavoritesList();
      return characters.filter(character => favoriteIds.includes(character.id));
    }
    return characters;
  }, [characters, currentTab, getFavoritesList]);

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
  const handleRemoveFilter = (key: keyof CharacterFilters) => {
    if (key === 'name') {
      setSearchTerm('');
    } else {
      removeFilter(key);
    }
  };

  // Get all active filters including search term
  const getAllActiveFilters = () => {
    const filters: Array<{ key: keyof CharacterFilters; value: string }> = [];
    
    if (searchTerm.trim()) {
      filters.push({ key: 'name', value: searchTerm.trim() });
    }
    
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        filters.push({ key: key as keyof CharacterFilters, value: value as string });
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
        backgroundColor: '#f5f5f5',
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
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 'bold',
              color: '#333',
              fontSize: { xs: '18px', sm: '20px', md: '24px' },
            }}
          >
            {currentTab === 'favoritos' 
              ? `${displayedCharacters.length} ${displayedCharacters.length === 1 ? 'favorito' : 'favoritos'}`
              : searchTerm.trim() || Object.keys(activeFilters).length > 0
                ? `${totalCount} ${totalCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}`
                : `${totalCount} ${totalCount === 1 ? 'personaje' : 'personajes'}`
            }
          </Typography>
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
            {allActiveFilters.map(({ key, value }) => (
              <Badge
                key={key}
                variant={key === 'species' ? 'species' : key === 'status' ? 'status' : 'default'}
                removable
                onRemove={() => handleRemoveFilter(key)}
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
              onFavoriteChange={(id, isFavorite) => {
                console.log(`Character ${id} favorite status: ${isFavorite}`);
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
                  <Box
                    component="button"
                    onClick={clearAllFilters}
                    sx={{
                      backgroundColor: '#8BC34A',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '12px 32px',
                      fontSize: '16px',
                      fontWeight: 600,
                      fontFamily: 'Montserrat, sans-serif',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(139, 195, 74, 0.3)',
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
                  </Box>
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
            <Box
              component="button"
              onClick={loadMore}
              disabled={loading}
              sx={{
                backgroundColor: '#8BC34A',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Montserrat, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: loading ? '#8BC34A' : '#7CB342',
                },
              }}
            >
              {loading ? 'Cargando...' : 'Cargar más'}
            </Box>
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