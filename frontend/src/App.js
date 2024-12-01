import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe os componentes corretamente
import Home from './Pages/HomePage';  // Export default
import Cadastro from './Pages/CadastroPage';  // Export default
import Login from './Pages/LoginPage.jsx';  // Export default
import Atendente from './Pages/AtendentePage';  // Export default
import Paciente from './Pages/PacientePage';  // Export default
import Bulario from './Pages/BularioPage';  // Export default
import Legislacao from './Pages/LegislacaoPage';  // Export default
import RedefinirSenhaPage from './Pages/RedefinirSenhaPage';  // Export default
import PacientePage from './Pages/PacientePage';  // Export default
import Duvidas from './Pages/RandomPage.jsx';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/atendente" element={<Atendente />} />
        <Route path="/bulario" element={<Bulario />} />
        <Route path="/legislacao" element={<Legislacao />} />
        <Route path="/redefinir" element={<RedefinirSenhaPage />} />      
        <Route path="/duvidas" element={<Duvidas />} />
        <Route path="/paciente" element={<PacientePage />} />

      </Routes>
    </Router>
  );
}

export default App;
