import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const PokemonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const PokemonImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const PokemonInfo = styled.div`
  flex: 1;
`;

const PokemonName = styled.h1`
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 2em;
  text-transform: capitalize;
`;

const PokemonTypes = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const TypeBadge = styled.span`
  background-color: #3498db;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9em;
  text-transform: capitalize;
`;

const StatsContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const StatBar = styled.div`
  margin-bottom: 15px;
`;

const StatLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: #2c3e50;
  font-weight: 500;
`;

const StatProgress = styled.div`
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
`;

const StatFill = styled.div`
  height: 100%;
  background-color: #3498db;
  width: ${props => props.value}%;
  transition: width 0.3s ease;
`;

const EvolutionsContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const EvolutionChain = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 20px;
  justify-content: center;
`;

const EvolutionCard = styled.div`
  text-align: center;
  cursor: pointer;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #2c3e50;
  font-size: 1.2em;
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
    return <LoadingSpinner>Chargement...</LoadingSpinner>;
  }

  if (!pokemon) {
    return <div>Pokémon non trouvé</div>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>← Retour à la liste</BackButton>
      
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