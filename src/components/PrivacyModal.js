import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(44,62,80,0.25);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.18);
  max-width: 500px;
  width: 95vw;
  padding: 32px 24px 24px 24px;
  position: relative;
  @media (max-width: 600px) {
    padding: 18px 6px 16px 6px;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 1.7em;
  color: #888;
  cursor: pointer;
  &:hover, &:focus {
    color: #3498db;
    outline: none;
  }
`;

const Title = styled.h2`
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.4em;
`;

const Text = styled.p`
  color: #444;
  font-size: 1.05em;
  margin-bottom: 1em;
`;

const PrivacyModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <Overlay aria-modal="true" role="dialog" tabIndex={-1}>
      <Modal>
        <CloseBtn aria-label="Fermer la politique de confidentialité" onClick={onClose}>&times;</CloseBtn>
        <Title>Politique de confidentialité</Title>
        <Text>
          Ce site respecte la réglementation RGPD. Aucune donnée personnelle n'est collectée, stockée ou revendue. Les recherches et filtres sont traités localement dans votre navigateur. Pour toute question, contactez-nous à contact@pokedex.fr.
        </Text>
        <Text>
          En utilisant ce site, vous acceptez que les seules données échangées soient celles nécessaires à l'affichage des Pokémon depuis l'API publique. Aucune donnée n'est utilisée à des fins commerciales ou publicitaires.
        </Text>
      </Modal>
    </Overlay>
  );
};

export default PrivacyModal; 