import React from 'react';
import styled from 'styled-components';

const FooterBar = styled.footer`
  width: 100%;
  background: #f8f9fa;
  color: #2c3e50;
  padding: 24px 0 12px 0;
  margin-top: 40px;
  border-top: 1px solid #e0e0e0;
`;

const FooterContent = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 1em;
`;

const Rgpd = styled.div`
  font-size: 0.98em;
  color: #555;
  text-align: center;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 18px;
  margin-bottom: 6px;
`;

const FooterLink = styled.a`
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  font-size: 1em;
  transition: color 0.2s;
  &:hover {
    color: #217dbb;
    text-decoration: underline;
  }
`;

const FooterButton = styled.button`
  color: #3498db;
  background: none;
  border: none;
  font-weight: 600;
  font-size: 1em;
  cursor: pointer;
  transition: color 0.2s;
  &:hover, &:focus {
    color: #217dbb;
    text-decoration: underline;
    outline: none;
  }
`;

const Copyright = styled.div`
  font-size: 0.95em;
  color: #888;
`;

const Footer = ({ onPrivacyClick }) => (
  <FooterBar>
    <FooterContent>
      <FooterLinks>
        <FooterButton onClick={onPrivacyClick} aria-label="Ouvrir la politique de confidentialité">Politique de confidentialité</FooterButton>
        <FooterLink href="mailto:contact@pokedex.fr">Contactez-nous</FooterLink>
      </FooterLinks>
      <Rgpd>
        Ce site respecte la réglementation RGPD. Vos données ne sont ni stockées, ni revendues. Consultez la politique de confidentialité pour plus d'informations.
      </Rgpd>
      <Copyright>
        © {new Date().getFullYear()} Pokédex React — Projet pédagogique
      </Copyright>
    </FooterContent>
  </FooterBar>
);

export default Footer; 