import React, { useState } from "react";
import { TextField, Button, Typography, Box, AppBar, Toolbar, CircularProgress, Modal, Rating} from "@mui/material"; // Importando todos os componentes necessários do MUI
import { Link } from "react-router-dom";
import farmaciaImage from "../Media/farmacia.jpeg"; // Imagem do farmacinha
import { GoogleGenerativeAI } from "@google/generative-ai"; // Importando a biblioteca do Gemini



// Estilos do Modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,  // Tamanho maior para o modal
  height: 600, // Definindo a altura do modal
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: "auto", // Permitindo rolagem se o conteúdo for maior
};

const Home = () => {
  const [medicamento, setMedicamento] = useState(""); // Armazenar o nome do medicamento
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState(null); // Estado de erro
  const [open, setOpen] = useState(false); // Controle do modal
  const [medicamentoInfo, setMedicamentoInfo] = useState(""); // Informações do medicamento

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Função para formatar as informações do medicamento
  const formatMedicamentoInfo = (info) => {
    // Formata as informações para aplicar negrito e outras estilizações
    return info
      .replace(/(\d+\.)/g, "<strong>$&</strong>") // Deixa os números das listas em negrito
      .replace(/([A-Za-z ]+)(?=:)/g, "<strong>$1</strong>")  // Deixa os títulos (ex: "Classe Terapêutica") em negrito
      .replace(/\*\*/g, "");  // Remove os "**" 
  };

  // Função de busca do medicamento e integração com o Gemini
  const handleSearch = async () => {
    if (!medicamento.trim()) {
      setError("Por favor, digite o nome de um medicamento.");
      return;
    }

    setError(null);
    setLoading(true); // Ativa o carregamento
    handleOpen(); // Abre o modal

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyANWW0Tlbheq1AV37hWDIYJLjJv4GaGt_Y"); // Substitua com sua chave API do Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Prompt que você passará para o modelo de IA
      const prompt = `Conte-me em 20 linhas tudo separadinho em tópicos sobre o medicamento: ${medicamento}.`;

      // Fazendo a chamada à API do Gemini para obter informações sobre o medicamento
      const result = await model.generateContent(prompt);
      const formattedInfo = formatMedicamentoInfo(result.response.text()); // Formata as informações
      setMedicamentoInfo(formattedInfo); // Armazenando as informações no estado
    } catch (error) {
      setError("Erro ao buscar informações do medicamento.");
      console.error("Erro ao buscar medicamento:", error);
    } finally {
      setLoading(false); // Desativa o carregamento
    }
  };

  return (
    <Box sx={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9" }}>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", zIndex: 1000 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
            Saúde &<br />Bem-Estar
          </Typography>
          <Box>
            <Link to="/login" style={{ textDecoration: "none", margin: "0 10px", color: "#333", fontWeight: "bold" }}>
              Entrar
            </Link>
            <Link to="/cadastro" style={{ textDecoration: "none", margin: "0 10px", color: "#333", fontWeight: "bold" }}>
              Cadastre-se
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ textAlign: "center", padding: "120px 20px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant="h1" sx={{ fontSize: "64px", fontWeight: "bold", color: "#333" }}>
          Farmacinha
        </Typography>
        <Typography variant="h2" sx={{ fontSize: "48px", fontWeight: "600", color: "red" }}>
          Saúde & Bem-Estar
        </Typography>
        <Typography variant="h5" sx={{ marginTop: "20px", fontSize: "32px", color: "#555" }}>
          Cuidando de Você com Clareza e Confiança
        </Typography>
        <Typography variant="body1" sx={{ marginTop: "10px", fontSize: "20px", fontStyle: "italic", color: "#777" }}>
          Dúvidas sobre medicamentos ou prescrições? Encontre orientações e respostas com segurança aqui.
        </Typography>
      </Box>

      {/* Barra de Pesquisa */}
      <Box sx={{ textAlign: "center", marginTop: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <TextField
          label="Digite o nome do medicamento"
          variant="outlined"
          value={medicamento}
          onChange={(e) => setMedicamento(e.target.value)}
          sx={{ width: "80%", marginBottom: "20px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
          sx={{ fontWeight: "bold", padding: "10px 20px", fontSize: "18px" }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Buscar"}
        </Button>
      </Box>


      <Box sx={{ textAlign: "center", marginTop: "40px" }}>
  <img src={farmaciaImage} alt="Farmacinha" style={{ width: "100%", maxWidth: "600px", borderRadius: "8px" }} />
</Box>


      <Box sx={{ backgroundColor: "#f1f1f1", padding: "20px", textAlign: "left" }}>
  <Box sx={{ maxWidth: "1216px", margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Farmacinha - Saúde & Bem-Estar
      </Typography>
      <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <a href="#">
          <img src="icon-facebook.svg" alt="Facebook" />
        </a>
        <a href="#">
          <img src="icon-linkedin.svg" alt="LinkedIn" />
        </a>
        <a href="#">
          <img src="icon-youtube.svg" alt="YouTube" />
        </a>
      </Box>
    </Box>

    <Box sx={{ padding: "40px 20px", backgroundColor: "#fafafa", textAlign: "center" }}>
  <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
    O que nossos usuários estão dizendo
  </Typography>

  <Box sx={{ display: "flex", justifyContent: "center", gap: "30px" }}>
    <Box sx={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <Typography variant="h6">João Silva</Typography>
      <Rating name="read-only" value={5} readOnly sx={{ marginTop: "10px", marginBottom: "10px" }} />
      <Typography variant="body2">
        "Excelente! A Farmacinha me ajudou muito a entender os medicamentos que estava tomando. Super recomendo!"
      </Typography>
    </Box>

    <Box sx={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <Typography variant="h6">Maria Oliveira</Typography>
      <Rating name="read-only" value={4} readOnly sx={{ marginTop: "10px", marginBottom: "10px" }} />
      <Typography variant="body2">
        "Muito bom, mas acho que poderia ter mais informações sobre os medicamentos. Mas gostei bastante!"
      </Typography>
    </Box>
  </Box>
</Box>


    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
      <Box>
        <Typography variant="h6">Serviços</Typography>
        <Typography><a href="#">Consultas Online</a></Typography>
        <Typography><a href="#">Prescrições</a></Typography>
        <Typography><a href="#">Medicamentos</a></Typography>
      </Box>

      <Box>
        <Typography variant="h6">Ajuda</Typography>
        <Typography><a href="#">Central de Ajuda</a></Typography>
        <Typography><a href="#">Fale Conosco</a></Typography>
        <Typography><a href="#">Dúvidas Frequentes</a></Typography>
      </Box>

      <Box>
        <Typography variant="h6">Empresa</Typography>
        <Typography><a href="#">Sobre Nós</a></Typography>
        <Typography><a href="#">Carreiras</a></Typography>
        <Typography><a href="#">Política de Privacidade</a></Typography>
      </Box>
    </Box>
  </Box>
</Box>


      {/* Modal com as Informações do Medicamento */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <CircularProgress size={60} sx={{ display: "block", margin: "0 auto" }} />
          ) : (
            <div>
              <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
                Informações sobre {medicamento}
              </Typography>
              <Typography
                id="modal-description"
                variant="body1"
                sx={{ fontSize: "16px", lineHeight: "1.8", color: "#333", textAlign: "left", whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{ __html: medicamentoInfo }}
              />
            </div>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;
