import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Filters = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const PokemonCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const PokemonImage = styled.img`
  width: 100%;
  height: auto;
`;

const PokemonName = styled.h3`
  margin: 10px 0;
  text-align: center;
`;

const PokemonTypes = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
`;

const TypeBadge = styled.span`
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
`;

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
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
    fetchPokemons();
  }, [nameFilter, selectedTypes]);

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

  const handleTypeChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTypes(value);
  };

  const handlePokemonClick = (id) => {
    navigate(`/pokemon/${id}`);
  };

  return (
    <Container>
      <Filters>
        <Input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <Select multiple value={selectedTypes} onChange={handleTypeChange}>
          {types.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </Select>
      </Filters>

      <PokemonGrid>
        {pokemons.map(pokemon => (
          <PokemonCard key={pokemon.id} onClick={() => handlePokemonClick(pokemon.id)}>
            <PokemonImage src={pokemon.image} alt={pokemon.name} />
            <PokemonName>{pokemon.name}</PokemonName>
            <PokemonTypes>
              {pokemon.types.map(type => (
                <TypeBadge key={type.id}>{type.name}</TypeBadge>
              ))}
            </PokemonTypes>
          </PokemonCard>
        ))}
      </PokemonGrid>
      {loading && <div>Chargement...</div>}
    </Container>
  );
};

export default PokemonList; 