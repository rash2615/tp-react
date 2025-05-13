import React from 'react';
import styled from 'styled-components';

const HeaderBar = styled.header`
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 12px rgba(44,62,80,0.07);
  padding: 0 0 0 0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 10px;
    padding: 12px 4px;
  }
`;

const LogoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Pokeball = styled.img`
  width: auto;
  height: 38px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0;
  letter-spacing: 1px;
`;

const RgpdLink = styled.button`
  color: #3498db;
  font-weight: 600;
  text-decoration: none;
  font-size: 1.05em;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  &:hover, &:focus {
    color: #217dbb;
    text-decoration: underline;
    outline: none;
  }
`;

const Header = ({ onPrivacyClick }) => (
  <HeaderBar>
    <HeaderContent>
      <LogoTitle>
        <Pokeball src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" alt="Pokeball" />
        <Title>Pokédex</Title>
      </LogoTitle>
      <RgpdLink onClick={onPrivacyClick} aria-label="Ouvrir la politique de confidentialité">Politique de confidentialité</RgpdLink>
    </HeaderContent>
  </HeaderBar>
);

export default Header; 