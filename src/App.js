import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivacyModal from './components/PrivacyModal';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

function App() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <Router>
      <Header onPrivacyClick={() => setPrivacyOpen(true)} />
      <AppContainer>
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </AppContainer>
      <Footer onPrivacyClick={() => setPrivacyOpen(true)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </Router>
  );
}

export default App;
