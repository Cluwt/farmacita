import React, { useState } from "react";
import { TextField, Button, Box, AppBar, Toolbar, Typography, CircularProgress, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

// Estilos do Modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const RedefinirSenhaPage = () => {
  const [cpf, setCpf] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [step, setStep] = useState(1); // Controla a exibição das etapas
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Função para lidar com a mudança no campo de CPF
  const handleCpfChange = (event) => {
    const value = event.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setCpf(value);
    }
  };

  // Função para lidar com a mudança no campo do código
  const handleCodigoChange = (event) => {
    setCodigo(event.target.value);
  };

  // Função para lidar com a mudança no campo da nova senha
  const handleNovaSenhaChange = (event) => {
    setNovaSenha(event.target.value);
  };

  // Função para enviar o CPF ao backend para gerar e enviar o código de redefinição
  const handleEnviar = async () => {
    setLoading(true);

    try {
        const response = await axios.post('http://localhost:8000/api/redefinir-senha/', { cpf });
        setMessage(response.data.message);
        setStep(2);  // Passa para a etapa 2 (inserir código)
    } catch (error) {
        setMessage('Erro ao enviar solicitação. Verifique o CPF ou tente novamente.');
    }

    setLoading(false);
  };

  // Função para validar o código inserido e permitir redefinir a senha
  const handleValidarCodigo = async () => {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/validar-codigo/', { cpf, codigo, nova_senha: novaSenha });
      setMessage(response.data.message);
      setStep(3); // Passa para a etapa 3 (confirmação de sucesso)
    } catch (error) {
      setMessage('Código inválido ou expirado. Tente novamente.');
    }

    setLoading(false);
  };

  // Função para cancelar e redirecionar para a página home
  const handleCancelar = () => {
    window.location.href = '/'; // Redireciona para a página home
  };

  return (
    <Box sx={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9" }}>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
            Farmacinha
          </Typography>
          <Box>
            <Link to="/login" style={{ textDecoration: "none", margin: "0 10px", color: "#333" }}>
              Entrar
            </Link>
            <Link to="/cadastro" style={{ textDecoration: "none", margin: "0 10px", color: "#333" }}>
              Cadastre-se
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ textAlign: "center", padding: "120px 20px 40px", maxWidth: "800px", margin: "0 auto" }}>
        <Typography variant="h4" sx={{ fontSize: "48px", fontWeight: "bold", color: "black", marginBottom: "20px" }}>
          Farmacinha
        </Typography>
        <Typography variant="h4" sx={{ fontSize: "24px", fontWeight: "bold", color: "red", marginBottom: "20px" }}>
          Saúde e bem estar!
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "16px", color: "#777", marginBottom: "40px" }}>
          {step === 1 && "Para redefinir sua senha, informe o seu CPF."}
          {step === 2 && `Insira o código enviado ao seu e-mail do CPF: ${cpf}`}
          {step === 3 && "Senha redefinida com sucesso!"}
        </Typography>

        {/* Formulário */}
        {step === 1 && (
          <form onSubmit={handleEnviar}>
            <TextField
              label="CPF"
              variant="outlined"
              value={cpf}
              onChange={handleCpfChange}
              maxLength="11"
              fullWidth
              sx={{ marginBottom: "20px" }}
              required
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{ fontWeight: "bold", padding: "10px 20px", fontSize: "16px" }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Enviar"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                type="button"
                onClick={handleCancelar}
                sx={{ fontWeight: "bold", padding: "10px 20px", fontSize: "16px" }}
              >
                Cancelar
              </Button>
            </Box>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); handleValidarCodigo(); }}>
            <TextField
              label="Código de Redefinição"
              variant="outlined"
              value={codigo}
              onChange={handleCodigoChange}
              fullWidth
              sx={{ marginBottom: "20px" }}
              required
            />
            <TextField
              label="Nova Senha"
              variant="outlined"
              type="password"
              value={novaSenha}
              onChange={handleNovaSenhaChange}
              fullWidth
              sx={{ marginBottom: "20px" }}
              required
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{ fontWeight: "bold", padding: "10px 20px", fontSize: "16px" }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Redefinir Senha"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                type="button"
                onClick={handleCancelar}
                sx={{ fontWeight: "bold", padding: "10px 20px", fontSize: "16px" }}
              >
                Cancelar
              </Button>
            </Box>
          </form>
        )}
      </Box>

      {/* Modal com a mensagem de sucesso */}
      <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box sx={style}>
          <Typography variant="h6" sx={{ marginBottom: "20px" }}>
            {message}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(false)}
            sx={{ fontWeight: "bold", padding: "10px 20px", fontSize: "16px" }}
          >
            Fechar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default RedefinirSenhaPage;
