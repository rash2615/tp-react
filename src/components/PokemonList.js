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
    padding: 16px 4px;
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
  gap: 32px;
  margin-bottom: 32px;
  background-color: #f8f9fa;
  padding: 24px 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.06);
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
`;

const FilterLabel = styled.label`
  font-size: 1em;
  color: #666;
  font-weight: 600;
  margin-bottom: 2px;
`;

const InputWrapper = styled.div`
  position: relative;
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
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  min-width: 120px;
  background: #fff;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const TypeFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 5px;
  max-width: 400px;
`;

const TypeButton = styled.button`
  padding: 8px;
  border: 2px solid ${props => typeColors[props.type] || '#e0e0e0'};
  border-radius: 50%;
  background-color: ${props => props.selected ? typeColors[props.type] : 'black'};
  cursor: pointer;
  transition: all 0.2s;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: ${props => props.selected ? '0 4px 12px rgba(44,62,80,0.12)' : '0 1px 2px rgba(44,62,80,0.04)'};
  &:hover {
    transform: scale(1.13) rotate(-6deg);
    box-shadow: 0 6px 18px rgba(44,62,80,0.18);
    z-index: 2;
  }
  img {
    width: 26px;
    height: 26px;
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

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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

  return (
    <PageWrapper>
      <MainCard>
        <Header>
          <Pokeball src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" alt="Pokeball" />
          <Title>Pokédex</Title>
        </Header>
        <Filters>
          <FilterGroup>
            <FilterLabel>Rechercher un Pokémon</FilterLabel>
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
            <FilterLabel>Filtrer par type</FilterLabel>
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
                  >
                    <img src={typeIcons[typeKey]} alt={type.name} />
                  </TypeButton>
                );
              })}
            </TypeFilterContainer>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Nombre de Pokémon par page</FilterLabel>
            <Select value={limit} onChange={handleLimitChange}>
              <option value={10}>10 Pokémon</option>
              <option value={20}>20 Pokémon</option>
              <option value={50}>50 Pokémon</option>
              <option value={100}>100 Pokémon</option>
            </Select>
          </FilterGroup>
        </Filters>

        <PokemonGrid>
          {pokemons.map(pokemon => (
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
        {loading && <LoadingSpinner>Chargement...</LoadingSpinner>}
      </MainCard>
    </PageWrapper>
  );
};

export default PokemonList; 