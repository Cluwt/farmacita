import React, { useState } from "react";
import { TextField, Button, Typography, Box, AppBar, Toolbar, CircularProgress, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { GoogleGenerativeAI } from '@google/generative-ai'; // Importando a biblioteca do Gemini
import farmaciaImage1 from "../Media/farmacia.jpeg"; // Imagem do farmacinha



// Usando uma imagem genérica de exemplo (Farmacinha)
const farmaciaImage = farmaciaImage1;

const PacientePage2 = () => {
  const [medicamento, setMedicamento] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [medicamentoDetails, setMedicamentoDetails] = useState(null); // Detalhes do medicamento

  const handleSearch = async () => {
    if (!medicamento.trim()) {
      setError("Por favor, digite o nome de um medicamento.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Inicializando o Gemini API (GoogleGenerativeAI)
      const genAI = new GoogleGenerativeAI("AIzaSyANWW0Tlbheq1AV37hWDIYJLjJv4GaGt_Y"); // Coloque a chave da API aqui
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Me ajude com o que posso comprar na farmácia? ${medicamento}`;
      const result = await model.generateContent(prompt);

      // Certificando-se de que o texto retornado seja válido
      const formattedInfo = formatMedicamentoInfo(result.response.text());

      setMedicamentoDetails(formattedInfo);
      setLoading(false);
    } catch (error) {
      setError("Erro ao buscar informações do medicamento.");
      setLoading(false);
      console.error(error);
    }
  };

  // Função para formatar o conteúdo do medicamento (caso necessário)
  const formatMedicamentoInfo = (text) => {
    return {
      nome: medicamento,
      descricao: text || "",
    };
  };

 // Função para formatar a resposta do texto
const formatDescription = (description) => {
  const lines = description.split("\n");

  return lines.map((line, index) => {
    // Verifica se a linha é um título ou uma linha com asterisco no início e no final
    const isTitleOrHighlighted = line.startsWith("**") && line.endsWith(":**");

    if (isTitleOrHighlighted) {
      // Se for título ou linha com asterisco, coloca em negrito
      const cleanedLine = line.replace(/\*\*/g, ""); // Remove os asteriscos
      return (
        <Typography key={index} variant="h6" sx={{ fontWeight: "bold", marginTop: "20px", color: "#333" }}>
          {cleanedLine}
        </Typography>
      );
    }

    // Caso contrário, exibe o texto normalmente
    return (
      <Typography key={index} variant="body1" sx={{ fontSize: "16px", color: "#555", lineHeight: "1.6", marginTop: "10px" }}>
        {line}
      </Typography>
    );
  });
};

  return (
    <Box sx={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      {/* Barra de navegação */}
      <AppBar position="fixed" sx={{ backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", zIndex: 1000 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: "0 20px" }}>
          <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", marginRight: "30px" }}>
            Saúde &<br />Bem-Estar
          </Typography>
          <Box sx={{ display: "flex", gap: "30px", alignItems: "center" }}>
            <Link to="/duvidas" style={{ textDecoration: "underline", color: "#333", fontSize: "16px", marginBottom: "5px", textUnderlineOffset: "5px", transition: "all 0.3s ease" }}>
              Dúvidas
            </Link>
            <Link to="/legislacao" style={{ textDecoration: "underline", color: "#333", fontSize: "16px", marginBottom: "5px", textUnderlineOffset: "5px", transition: "all 0.3s ease" }}>
              Legislação
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Seção de Imagem e Texto */}
      <Box sx={{ textAlign: "center", padding: "120px 20px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant="h1" sx={{ fontSize: "64px", fontWeight: "bold", color: "#333", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>
          Farmacinha
        </Typography>
        <Typography variant="h2" sx={{ fontSize: "48px", fontWeight: "600", color: "red" }}>
          Saúde & Bem-Estar
        </Typography>
        <Typography variant="h5" sx={{ marginTop: "20px", fontSize: "32px", color: "#555" }}>
          Cuidando de Você com Clareza e Confiança
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "18px", color: "#777", lineHeight: "1.6", maxWidth: "800px", margin: "0 auto", marginTop: "30px" }}>
          Se você está buscando medicamentos com qualidade e preço justo, a Farmacinha é a solução ideal! Oferecemos a melhor experiência de compra online com rapidez e eficiência. Encontre os melhores produtos para o seu bem-estar.
        </Typography>
      </Box>

      {/* Barra de Pesquisa */}
      <Box sx={{ textAlign: "center", marginTop: "20px", maxWidth: "1400px", margin: "0 auto" }}>
        <TextField
          label="Digite o que está sentindo! Iremos ajudar!"
          variant="outlined"
          value={medicamento}
          onChange={(e) => setMedicamento(e.target.value)}
          sx={{ width: "100%", marginBottom: "20px" }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "black",
            color: "white",
            fontWeight: "normal",
            padding: "10px 20px",
            fontSize: "18px",
            marginLeft: "10px",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Buscar"}
        </Button>
      </Box>

      {/* Exibindo o Conteúdo Carregado */}
      <Box sx={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", marginTop: "40px" }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8} sx={{ textAlign: "left" }}>
            {loading ? (
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}>
                Carregando informações...
              </Typography>
            ) : (
              <div>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", marginBottom: "20px", textAlign: "center" }}>
                  {medicamentoDetails?.nome || ""}
                </Typography>
                <div>
                  {formatDescription(medicamentoDetails?.descricao || "")}
                </div>
              </div>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PacientePage2;
