import React, { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Importando a biblioteca do Gemini

const BularioPage = () => {
  const [medicamento, setMedicamento] = useState('Dipirona');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [medicamentoInfo, setMedicamentoInfo] = useState('');

  // Função para formatar as informações do medicamento
const formatMedicamentoInfo = (info) => {
  return info
    .replace(/(\d+\.)/g, '<strong>$&</strong>') // Deixa os números das listas em negrito
     // Deixa os títulos em negrito
    .replace(/\*\*/g, '')  // Remove os "**"
    .replace(/^\s*\n/gm, '') // Remove linhas em branco
    .replace(/^(\d+\.\s)/gm, '<li><strong>$1</strong>') // Cria uma lista de tópicos com números em negrito
    .replace(/(\n)/gm, '</li><li>')  // Coloca os itens da lista em <li>
    .replace(/<li><li>/gm, '<li>'); // Corrige múltiplas listas dentro de uma só
};

  // Função de busca do medicamento e integração com o Gemini
const fetchMedicamentoDetails = async (medicamento, setMedicamentoInfo, setError, setLoading) => {
  setLoading(true);  // Ativa o carregamento
  try {
    // Substitua a chave da API com sua chave real, se necessário
    const genAI = new GoogleGenerativeAI('AIzaSyANWW0Tlbheq1AV37hWDIYJLjJv4GaGt_Y');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Conte-me em 20 linhas tudo separadinho em tópicos sobre o bulário do medicamento: ${medicamento}.`;
    
    // Gera o conteúdo a partir do modelo de AI
    const result = await model.generateContent(prompt);
    const formattedInfo = formatMedicamentoInfo(result.response.text());  // Formatação da resposta

    // Atualiza os detalhes do medicamento
    setMedicamentoInfo(formattedInfo);
  } catch (error) {
    setError('Erro ao buscar informações do medicamento.');
    console.error(error);
  } finally {
    setLoading(false);  // Desativa o carregamento
  }
};

// Função de busca que será chamada no evento de busca
const handleSearch = async () => {
  if (!medicamento.trim()) return setError('Por favor, digite o nome de um medicamento.');

  setError(null);  // Reseta qualquer erro anterior
  await fetchMedicamentoDetails(medicamento, setMedicamentoInfo, setError, setLoading);
};

  return (
    <Box sx={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #ddd' }}>
        <div style={{ fontSize: '14px', color: '#555' }}>
          <a href="#">Saúde & Bem-Estar</a> | <a href="#">Anvisa</a> | <a href="#">Medicamentos</a>
        </div>
        <select style={{ border: 'none', background: 'none', fontSize: '14px', color: '#555', cursor: 'pointer' }}>
          <option>Olá, Usuário</option>
        </select>
      </header>

      {/* Main Content */}
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 40px', textAlign: 'left', flex: '1' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#000' }}>Farmacinha</h1>
        <h2 style={{ fontSize: '22px', color: '#d81b1b' }}>Saúde & Bem-Estar</h2>
        <h3 style={{ fontSize: '18px', color: '#000' }}>Cuidando de Você com Clareza e Confiança</h3>

        {/* Barra de Pesquisa */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', width: '100%', maxWidth: '600px' }}>
          <input
            type="text"
            placeholder="Buscar bula"
            style={{ flex: '1', padding: '10px', border: '1px solid #ccc', borderRadius: '4px 0 0 4px', fontSize: '16px' }}
            value={medicamento}
            onChange={(e) => setMedicamento(e.target.value)}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 20px',
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: '0 4px 4px 0',
              fontSize: '16px',
              cursor: 'pointer',
              border: 'none',
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Pesquisar'}
          </button>
        </div>

        {/* Informações do Medicamento */}
        <div style={{ width: '100%', maxWidth: '800px', fontSize: '16px', lineHeight: '1.6', marginTop: '20px', color: '#333' }}>
          {error && <Typography variant="body1" sx={{ color: 'red' }}>{error}</Typography>}

          {medicamentoInfo ? (
            <div dangerouslySetInnerHTML={{ __html: medicamentoInfo }} />
          ) : (
            !loading && <Typography variant="body1">Digite um nome de medicamento e clique em 'Pesquisar'.</Typography>
          )}
        </div>

        {/* Carregando... */}
        {loading && !medicamentoInfo && (
          <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
            <CircularProgress size={50} sx={{ display: 'block', margin: '0 auto' }} />
            <Typography variant="body2" sx={{ marginTop: '10px' }}>Carregando informações...</Typography>
          </Box>
        )}
      </main>
    </Box>
  );
};

export default BularioPage;
