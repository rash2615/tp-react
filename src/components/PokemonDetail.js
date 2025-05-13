import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const PokemonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const PokemonImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
`;

const PokemonInfo = styled.div`
  flex: 1;
`;

const PokemonName = styled.h1`
  margin: 0 0 10px 0;
`;

const PokemonTypes = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const TypeBadge = styled.span`
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 4px;
`;

const StatsContainer = styled.div`
  margin-top: 30px;
`;

const StatBar = styled.div`
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const StatProgress = styled.div`
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
`;

const StatFill = styled.div`
  height: 100%;
  background-color: #4CAF50;
  width: ${props => props.value}%;
`;

const EvolutionsContainer = styled.div`
  margin-top: 30px;
`;

const EvolutionChain = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 20px;
`;

const EvolutionCard = styled.div`
  text-align: center;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`https://nestjs-pokedex-api.vercel.app/pokemons/${id}`);
        setPokemon(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!pokemon) {
    return <div>Pokémon non trouvé</div>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>← Retour</BackButton>
      
      <PokemonHeader>
        <PokemonImage src={pokemon.image} alt={pokemon.name} />
        <PokemonInfo>
          <PokemonName>{pokemon.name}</PokemonName>
          <PokemonTypes>
            {pokemon.types.map(type => (
              <TypeBadge key={type.id}>{type.name}</TypeBadge>
            ))}
          </PokemonTypes>
        </PokemonInfo>
      </PokemonHeader>

      <StatsContainer>
        <h2>Statistiques</h2>
        {pokemon.stats.map(stat => (
          <StatBar key={stat.name}>
            <StatLabel>
              <span>{stat.name}</span>
              <span>{stat.value}</span>
            </StatLabel>
            <StatProgress>
              <StatFill value={(stat.value / 255) * 100} />
            </StatProgress>
          </StatBar>
        ))}
      </StatsContainer>

      {pokemon.evolutions && pokemon.evolutions.length > 0 && (
        <EvolutionsContainer>
          <h2>Évolutions</h2>
          <EvolutionChain>
            {pokemon.evolutions.map(evolution => (
              <EvolutionCard key={evolution.id} onClick={() => navigate(`/pokemon/${evolution.id}`)}>
                <img src={evolution.image} alt={evolution.name} style={{ width: '100px', height: '100px' }} />
                <div>{evolution.name}</div>
              </EvolutionCard>
            ))}
          </EvolutionChain>
        </EvolutionsContainer>
      )}
    </Container>
  );
};

export default PokemonDetail; 