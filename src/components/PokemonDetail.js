import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { typeIcons } from '../utils/typeIcons';
import { typeColors } from '../utils/typeColors';
import { typeTranslate } from '../utils/typeTranslate';

const statColors = {
  hp: '#4caf50',
  attack: '#e53935',
  defense: '#fbc02d',
  speed: '#039be5',
  specialattack: '#8e24aa',
  specialdefense: '#43a047',
  special_attack: '#8e24aa',
  special_defense: '#43a047',
};

const FlexLayout = styled.div`
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  margin: 40px auto 0 auto;
  max-width: 1100px;
  min-height: 80vh;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 24px;
    align-items: center;
    max-width: 98vw;
  }
`;

const LeftCol = styled.div`
  flex: 1 1 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const RightCol = styled.div`
  flex: 2 1 500px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;

const PokemonImage = styled.img`
  width: 220px;
  height: 220px;
  object-fit: contain;
  background: white;
  padding: 18px;
  border-radius: 50%;
  box-shadow: 0 4px 24px #c3cfe2;
  margin-bottom: 8px;
`;

const PokemonName = styled.h1`
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 2.1em;
  font-weight: 800;
  text-align: center;
  text-transform: capitalize;
`;

const PokemonTypes = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const TypeBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => typeColors[props.type]};
  padding: 4px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.10);
  img {
    filter: brightness(0) invert(1);
    width: 22px;
    height: 22px;
  }
`;

const StatsContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 18px;
  margin-top: 18px;
`;

const StatChip = styled.div`
  background: ${({ stat }) => statColors[stat.toLowerCase().replace(/\s|_/g, '')] || '#3498db'}22;
  border: 2px solid ${({ stat }) => statColors[stat.toLowerCase().replace(/\s|_/g, '')] || '#3498db'};
  border-radius: 16px;
  padding: 16px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  box-shadow: 0 1px 4px rgba(44,62,80,0.07);
`;

const StatName = styled.div`
  font-size: 1em;
  font-weight: 600;
  color: ${({ stat }) => statColors[stat.toLowerCase().replace(/\s|_/g, '')] || '#3498db'};
  margin-bottom: 6px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.3em;
  font-weight: 700;
  color: #222;
`;

const EvolutionsContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem 2rem;
`;

const EvoTitle = styled.h2`
  margin-bottom: 10px;
  text-align: center;
`;

const EvoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: center;
  margin-top: 18px;
`;

const EvoCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.10);
  padding: 18px 12px 10px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(.4,2,.6,1);
  &:hover, &:focus {
    transform: translateY(-5px) scale(1.07);
    box-shadow: 0 8px 24px rgba(44,62,80,0.18);
    outline: none;
  }
  img {
    width: 90px;
    height: 90px;
    object-fit: contain;
    margin-bottom: 8px;
    filter: drop-shadow(0 2px 8px #c3cfe2);
  }
  div {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.1em;
    margin-top: 2px;
  }
`;

const EvoNone = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.1em;
  margin: 24px 0 0 0;
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

const BackButton = styled.button`
  padding: 10px 22px;
  background: linear-gradient(90deg, #3498db 60%, #6dd5fa 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  margin: 32px 0 0 32px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.08);
  transition: background 0.2s, transform 0.2s;
  &:hover, &:focus {
    background: linear-gradient(90deg, #217dbb 60%, #3498db 100%);
    transform: translateY(-2px) scale(1.04);
    outline: none;
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
    return <Spinner />;
  }

  if (!pokemon) {
    return <div>Pokémon non trouvé</div>;
  }

  let statsArray = [];
  if (Array.isArray(pokemon.stats)) {
    statsArray = pokemon.stats;
  } else if (pokemon.stats && typeof pokemon.stats === 'object') {
    statsArray = Object.entries(pokemon.stats).map(([name, value]) => ({ name, value }));
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', width: '100%' }}>
      <BackButton onClick={() => navigate('/')} aria-label="Retour à la liste">← Retour à la liste</BackButton>
      <FlexLayout>
        <LeftCol>
          <PokemonImage src={pokemon.image} alt={pokemon.name} />
          <PokemonName>{pokemon.name}</PokemonName>
          <PokemonTypes>
            {pokemon.types.map(type => {
              const typeKey = typeTranslate[type.name.toLowerCase()] || 'normal';
              return (
                <TypeBadge key={type.id} type={typeKey} title={type.name}>
                  <img src={typeIcons[typeKey]} alt={type.name} />
                </TypeBadge>
              );
            })}
          </PokemonTypes>
        </LeftCol>
        <RightCol>
          <StatsContainer>
            <h2>Statistiques</h2>
            <StatsGrid>
              {statsArray.map(stat => (
                <StatChip key={stat.name} stat={stat.name}>
                  <StatName stat={stat.name}>{stat.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</StatName>
                  <StatValue>{stat.value}</StatValue>
                </StatChip>
              ))}
            </StatsGrid>
          </StatsContainer>
          <EvolutionsContainer>
            <EvoTitle>Évolutions</EvoTitle>
            {pokemon.evolutions && pokemon.evolutions.length > 0 ? (
              <EvoGrid>
                {pokemon.evolutions.map(evolution => (
                  <EvoCard key={evolution.id} tabIndex={0} aria-label={`Voir ${evolution.name}`}
                    onClick={() => navigate(`/pokemon/${evolution.id}`)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/pokemon/${evolution.id}`); }}
                  >
                    <img
                      src={evolution.image || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'}
                      alt={evolution.name}
                    />
                    <div>{evolution.name}</div>
                  </EvoCard>
                ))}
              </EvoGrid>
            ) : (
              <EvoNone>Aucune évolution</EvoNone>
            )}
          </EvolutionsContainer>
        </RightCol>
      </FlexLayout>
    </div>
  );
};

export default PokemonDetail; 