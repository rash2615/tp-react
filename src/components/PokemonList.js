import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { typeIcons } from '../utils/typeIcons';
import { typeColors } from '../utils/typeColors';
import { typeTranslate } from '../utils/typeTranslate';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
`;

const Filters = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FilterLabel = styled.label`
  font-size: 0.9em;
  color: #666;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const TypeFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
  max-width: 400px;
`;

const TypeButton = styled.button`
  padding: 8px;
  border: 2px solid ${props => typeColors[props.type] || '#e0e0e0'};
  background-color: ${props => props.selected ? typeColors[props.type] : 'black'};
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  img {
    width: 24px;
    height: 24px;
    filter: ${props => props.selected ? 'brightness(0) invert(1)' : 'none'};
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

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px 0;
`;

const PokemonCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;

const PokemonImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  margin-bottom: 10px;
`;

const PokemonName = styled.h3`
  margin: 10px 0;
  text-align: center;
  color: #2c3e50;
  font-size: 1.2em;
`;

const PokemonTypes = styled.div`
  display: flex;
  gap: 5px;
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
  const navigate = useNavigate();

  const fetchTypes = async () => {
    try {
      const response = await axios.get('https://nestjs-pokedex-api.vercel.app/types');
      setTypes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des types:', error);
    }
  };

  const fetchPokemons = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...(nameFilter && { name: nameFilter }),
        ...(selectedTypes.length > 0 && { types: selectedTypes }),
      };

      const response = await axios.get('https://nestjs-pokedex-api.vercel.app/pokemons', { params });
      setPokemons(prev => [...prev, ...response.data]);
    } catch (error) {
      console.error('Erreur lors de la récupération des Pokémon:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, nameFilter, selectedTypes]);

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    setPokemons([]);
    setPage(1);
  }, [limit]);

  useEffect(() => {
    if (pokemons.length === 0) {
      fetchPokemons();
    }
    // eslint-disable-next-line
  }, [limit]);

  useEffect(() => {
    fetchPokemons();
  }, [page]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      setPage(prev => prev + 1);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
    <Container>
      <Title>Pokédex</Title>
      <Filters>
        <FilterGroup>
          <FilterLabel>Rechercher un Pokémon</FilterLabel>
          <Input
            type="text"
            placeholder="Nom du Pokémon..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
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
    </Container>
  );
};

export default PokemonList; 