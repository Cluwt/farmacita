import React, { useState } from "react";
import {
  Typography,
  Box,
  AppBar,
  Toolbar,
  Modal,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Rating,
} from "@mui/material";
import { Link } from "react-router-dom";
import farmaciaImage from "../Media/farmacia.jpeg"; // Certifique-se de ter esta imagem ou remova se não for necessária
import { GoogleGenerativeAI } from "@google/generative-ai"; // Importando a biblioteca do Gemini

// Estilo para o Modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

const Duvidas = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState("");
  const [searchQuery, setSearchQuery] = useState("");  // Estado para o campo de pesquisa
  const [answer, setAnswer] = useState(""); // Resposta da API
  const [loading, setLoading] = useState(false); // Estado para controle de loading
  const [error, setError] = useState(null); // Estado para controle de erro

  const handleOpenModal = (doubt) => {
    setSelectedDoubt(doubt);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDoubt("");
    setAnswer("");  // Limpar a resposta
  };

  // Função para formatar a resposta da IA
  const formatAnswer = (rawText) => {
    const formatted = rawText.split("\n").map((line, index) => {
      if (line.trim().startsWith("**")) {
        return (
          <Typography key={index} variant="h6" sx={{ fontWeight: "bold", marginBottom: "15px" }}>
            {line.replace("**", "")}
          </Typography>
        );
      }
      return <Typography key={index} variant="body1" sx={{ marginBottom: "10px" }}>{line}</Typography>;
    });
    return formatted;
  };

  // Função para buscar as informações sobre o medicamento
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Por favor, digite o nome de um medicamento.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Inicializando a API Gemini (Google Generative AI)
      const genAI = new GoogleGenerativeAI("AIzaSyANWW0Tlbheq1AV37hWDIYJLjJv4GaGt_Y"); // Substitua pela sua chave API
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Me ajude com essa dúvida farmaceuticamente? ${searchQuery}`;
      const result = await model.generateContent(prompt);

      // Certificando-se de que o texto retornado seja válido
      const formattedInfo = result.response.text();

      setAnswer(formattedInfo);
      setLoading(false);
      setOpenModal(true); // Abrir o modal após a resposta ser carregada
    } catch (error) {
      setError("Erro ao buscar informações do medicamento.");
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Barra de navegação */}
      <AppBar position="fixed" sx={{ backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", zIndex: 1000 }}>
        <Toolbar sx={{ display: "flex", alignItems: "center", padding: "0 20px" }}>
          <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", marginRight: "30px" }}>
            Saúde &<br />Bem-Estar
          </Typography>

          {/* Links alinhados ao lado do título */}
          <Box sx={{ display: "flex", gap: "30px", alignItems: "center" }}>
            <Link
              to="/duvidas"
              style={{
                textDecoration: "underline",
                color: "#333",
                fontSize: "16px",
                marginBottom: "5px",
                textUnderlineOffset: "5px",
                transition: "all 0.3s ease"
              }}
            >
              Dúvidas
            </Link>
            <Link
              to="/legislacao"
              style={{
                textDecoration: "underline",
                color: "#333",
                fontSize: "16px",
                marginBottom: "5px",
                textUnderlineOffset: "5px",
                transition: "all 0.3s ease"
              }}
            >
              Legislação
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Conteúdo Principal */}
      <Box
        sx={{
          flexGrow: 1,
          paddingTop: "80px", // Espaço para o AppBar fixo
          paddingBottom: "40px", // Espaço antes do footer
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Seção de Imagem e Texto */}
        <Box sx={{ textAlign: "center", padding: "40px 20px", width: "100%" }}>
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

        {/* Campo de Pesquisa */}
        <Box sx={{ textAlign: "center", marginTop: "30px", padding: "0 20px" }}>
          <Typography variant="h4" sx={{ fontSize: "32px", color: "#333", marginBottom: "30px" }}>
            Dúvidas Frequentes
          </Typography>

          {/* Caixa de pesquisa */}
          <TextField
            label="Pesquise por dúvidas..."
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ maxWidth: "500px", marginBottom: "20px" }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ fontWeight: "bold", padding: "10px 20px", fontSize: "16px" }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Pesquisar"}
          </Button>
          {error && (
            <Typography sx={{ color: "red", marginTop: "20px" }}>
              {error}
            </Typography>
          )}
        </Box>

        {/* Dúvidas Frequentes */}
        <Box sx={{ textAlign: "center", marginTop: "50px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: "center", marginBottom: "20px", width: '300px' }}>
            <Button
              variant="outlined"
              onClick={() => handleOpenModal("O que devo saber antes de comprar um antibiótico?")}
              sx={{ fontSize: "16px", marginBottom: "10px", width: "100%" }}
            >
              O que devo saber antes de comprar um antibiótico?
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleOpenModal("O que devo saber antes de comprar um psicotrópico?")}
              sx={{ fontSize: "16px", marginBottom: "10px", width: "100%" }}
            >
              O que devo saber antes de comprar um psicotrópico?
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleOpenModal("O que é um medicamento isento de prescrição?")}
              sx={{ fontSize: "16px", marginBottom: "10px", width: "100%" }}
            >
              O que é um medicamento isento de prescrição?
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleOpenModal("Quais são os tempos de tratamento?")}
              sx={{ fontSize: "16px", marginBottom: "10px", width: "100%" }}
            >
              Tempos de tratamento
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#f1f1f1", padding: "20px", textAlign: "left", width: "100%" }}>
        <Box
          sx={{
            maxWidth: "1216px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {/* Seção de Redes Sociais */}
          <Box sx={{ flex: "1 1 200px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Farmacinha - Saúde & Bem-Estar
            </Typography>
            <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/svgs/brands/facebook.svg" alt="Facebook" width="30px" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/svgs/brands/linkedin.svg" alt="LinkedIn" width="30px" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/svgs/brands/youtube.svg" alt="YouTube" width="30px" />
              </a>
            </Box>
          </Box>

          {/* Seção de Serviços */}
          <Box sx={{ flex: "1 1 150px" }}>
            <Typography variant="h6">Serviços</Typography>
            <Typography>
              <Link to="#" style={{ textDecoration: "none", color: "#333" }}>Consultas Online</Link>
            </Typography>
            <Typography>
              <Link to="#" style={{ textDecoration: "none", color: "#333" }}>Prescrições</Link>
            </Typography>
            <Typography>
              <Link to="#" style={{ textDecoration: "none", color: "#333" }}>Medicamentos</Link>
            </Typography>
          </Box>

          {/* Seção de Ajuda */}
          <Box sx={{ flex: "1 1 150px" }}>
            <Typography variant="h6">Ajuda</Typography>
            <Typography>
              <Link to="#" style={{ textDecoration: "none", color: "#333" }}>Central de Ajuda</Link>
            </Typography>
            <Typography>
              <Link to="#" style={{ textDecoration: "none", color: "#333" }}>Fale Conosco</Link>
            </Typography>
            <Typography>
              <Link to="#" style={{ textDecoration: "none", color: "#333" }}>Dúvidas Frequentes</Link>
            </Typography>
          </Box>

          {/* Seção de Empresa */}
          <Box sx={{ flex: "1 1 150px" }}>
            <Typography variant="h6">Empresa</Typography>
            <Typography>
              <Link to="#" style={{ textDecoration: "none", color: "#333" }}>Sobre Nós</Link>
            </Typography>
            <Typography>
              <Link to="#" style={{ textDecoration: "none", color: "#333" }}>Carreiras</Link>
            </Typography>
            <Typography>
              <Link to="#" style={{ textDecoration: "none", color: "#333" }}>Política de Privacidade</Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Modal com resposta do medicamento */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <div>
              <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                {selectedDoubt}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: "20px" }}>
                {answer ? formatAnswer(answer) : <div>Estamos processando sua consulta...</div>}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseModal}
                sx={{ fontWeight: "bold", padding: "10px 20px", fontSize: "16px" }}
              >
                Fechar
              </Button>
            </div>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Duvidas;
