import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { typeIcons } from '../utils/typeIcons';
import { typeColors } from '../utils/typeColors';
import { typeTranslate } from '../utils/typeTranslate';

const gradientBg = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 0;
`;

const MainCard = styled.div`
  max-width: 100%;
  margin: 40px auto 0 auto;
  background: white;
  border-radius: 24px;
  padding: 32px 24px 40px 24px;
  @media (max-width: 900px) {
    padding: 12px 2px 24px 2px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
`;

const Pokeball = styled.img`
  width: auto;
  height: 48px;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin: 0;
`;

const Filters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
  background-color: #f8f9fa;
  padding: 16px 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.06);
`;

const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  @media (max-width: 1200px) {
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const TypeFilterRow = styled(FilterRow)`
  padding-top: 8px;
  border-top: 1px solid #e0e0e0;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: auto;
  @media (max-width: 1200px) {
    min-width: 180px;
  }
`;

const FilterLabel = styled.label`
  font-size: 0.9em;
  color: #666;
  font-weight: 600;
  white-space: nowrap;
`;

const InputWrapper = styled.div`
  position: relative;
  min-width: 200px;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #bdbdbd;
  font-size: 1.2em;
`;

const Input = styled.input`
  padding: 10px 10px 10px 38px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  transition: border 0.2s;
  box-shadow: 0 1px 2px rgba(44,62,80,0.03);
  &:focus {
    outline: none;
    border-color: #3498db;
    background: #f5faff;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9em;
  min-width: 160px;
  background: #fff;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const TypeFilterContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 0;
  max-width: none;
  flex-wrap: wrap;
  justify-content: center;
`;

const TypeButton = styled.button`
  padding: 6px;
  border: 2px solid ${props => typeColors[props.type] || '#e0e0e0'};
  border-radius: 50%;
  background-color: ${props => props.selected ? typeColors[props.type] : 'black'};
  cursor: pointer;
  transition: all 0.2s;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: ${props => props.selected ? '0 4px 12px rgba(44,62,80,0.12)' : '0 1px 2px rgba(44,62,80,0.04)'};
  outline: none;
  &:hover, &:focus {
    transform: scale(1.1) rotate(-6deg);
    box-shadow: 0 6px 18px rgba(44,62,80,0.18);
    z-index: 2;
    border-color: #222;
  }
  &:focus-visible {
    border: 2.5px solid #222;
    box-shadow: 0 0 0 3px #b3dafe;
  }
  img {
    width: 20px;
    height: 20px;
    filter: ${props => props.selected ? 'brightness(0) invert(1)' : 'none'};
    transition: filter 0.2s;
  }
`;

const TypeIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const TypeBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => typeColors[props.type]};
  padding: 4px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  img {
    filter: brightness(0) invert(1);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: none; }
`;

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 28px;
  padding: 20px 0;
  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 8px 0;
  }
`;

const PokemonCard = styled.div`
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(44,62,80,0.10);
  padding: 18px 12px 16px 12px;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(.4,2,.6,1);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.5s;
  &:hover {
    transform: translateY(-8px) scale(1.04) rotate(-2deg);
    box-shadow: 0 8px 32px rgba(44,62,80,0.18);
    background: #f5faff;
  }
`;

const PokemonImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 10px;
  filter: drop-shadow(0 2px 8px #c3cfe2);
`;

const PokemonName = styled.h3`
  margin: 10px 0 6px 0;
  text-align: center;
  color: #2c3e50;
  font-size: 1.25em;
  font-weight: 700;
  letter-spacing: 1px;
`;

const PokemonTypes = styled.div`
  display: flex;
  gap: 7px;
  justify-content: center;
  flex-wrap: wrap;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #2c3e50;
  font-size: 1.2em;
`;

const Spinner = styled.div`
  display: inline-block;
  width: 48px;
  height: 48px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 32px auto 0 auto;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NoResult = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.2em;
  margin: 40px 0 0 0;
  font-weight: 500;
`;

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState('none');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get('https://nestjs-pokedex-api.vercel.app/types');
        setTypes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des types:', error);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    setPokemons([]);
    setPage(1);
    setHasMore(true);
  }, [nameFilter, selectedTypes, limit]);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
          ...(nameFilter && { name: nameFilter }),
          ...(selectedTypes.length > 0 && { types: selectedTypes }),
        };
        const response = await axios.get('https://nestjs-pokedex-api.vercel.app/pokemons', { params });
        if (page === 1) {
          setPokemons(response.data);
        } else {
          setPokemons(prev => [...prev, ...response.data]);
        }
        setHasMore(response.data.length === limit);
      } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemons();
    // eslint-disable-next-line
  }, [page, nameFilter, selectedTypes, limit]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        !loading && hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleTypeClick = (typeId) => {
    setSelectedTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      }
      return [...prev, typeId];
    });
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPokemons([]);
    setPage(1);
  };

  const handlePokemonClick = (id) => {
    navigate(`/pokemon/${id}`);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const calculateTotalPower = (pokemon) => {
    if (!pokemon.stats) return 0;
    return Object.values(pokemon.stats).reduce((sum, stat) => sum + Number(stat), 0);
  };

  const sortedPokemons = [...pokemons].sort((a, b) => {
    if (sortOrder === 'none') return 0;
    const powerA = calculateTotalPower(a);
    const powerB = calculateTotalPower(b);
    return sortOrder === 'asc' ? powerA - powerB : powerB - powerA;
  });

  return (
    <PageWrapper>
      <MainCard>
        <Header>
          <Pokeball src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Pokeball" />
          <Title>Pokédex</Title>
        </Header>

        <Filters>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Rechercher:</FilterLabel>
              <InputWrapper>
                <SearchIcon>🔍</SearchIcon>
                <Input
                  type="text"
                  placeholder="Nom du Pokémon..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </InputWrapper>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Par page:</FilterLabel>
              <Select value={limit} onChange={handleLimitChange}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Puissance:</FilterLabel>
              <Select value={sortOrder} onChange={handleSortChange}>
                <option value="none">Sans tri</option>
                <option value="desc">↓ Plus fort</option>
                <option value="asc">↑ Plus faible</option>
              </Select>
            </FilterGroup>
          </FilterRow>

          <TypeFilterRow>
            <FilterGroup>
              <FilterLabel>Types:</FilterLabel>
              <TypeFilterContainer>
                {types.map(type => {
                  const typeKey = typeTranslate[type.name.toLowerCase()] || 'normal';
                  return (
                    <TypeButton
                      key={type.id}
                      type={typeKey}
                      selected={selectedTypes.includes(type.id)}
                      onClick={() => handleTypeClick(type.id)}
                      title={type.name}
                      aria-label={`Filtrer par type ${type.name}`}
                      tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleTypeClick(type.id); }}
                    >
                      <img src={typeIcons[typeKey]} alt={type.name} />
                    </TypeButton>
                  );
                })}
              </TypeFilterContainer>
            </FilterGroup>
          </TypeFilterRow>
        </Filters>

        <PokemonGrid>
          {sortedPokemons.map(pokemon => (
            <PokemonCard key={pokemon.id} onClick={() => handlePokemonClick(pokemon.id)}>
              <PokemonImage src={pokemon.image} alt={pokemon.name} />
              <PokemonName>{pokemon.name}</PokemonName>
              <PokemonTypes>
                {pokemon.types.map(type => {
                  const typeKey = typeTranslate[type.name.toLowerCase()] || 'normal';
                  return (
                    <TypeBadge key={type.id} type={typeKey} title={type.name}>
                      <TypeIcon src={typeIcons[typeKey]} alt={type.name} />
                    </TypeBadge>
                  );
                })}
              </PokemonTypes>
            </PokemonCard>
          ))}
        </PokemonGrid>
        {loading && <Spinner />}
        {!loading && pokemons.length === 0 && <NoResult>Aucun résultat trouvé.</NoResult>}
      </MainCard>
    </PageWrapper>
  );
};

export default PokemonList; 