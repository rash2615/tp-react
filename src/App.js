import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
