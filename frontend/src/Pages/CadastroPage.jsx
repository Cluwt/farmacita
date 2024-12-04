import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, TextField, AppBar, Toolbar, Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Cookies from "js-cookie"; // Caso precise para autenticação futura

const Cadastro = () => {
  const [formType, setFormType] = useState(null); // "cliente" ou "atendente"
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    cpf: "",
    email: "",
    senha: "",
  });
  const [cnpjValid, setCnpjValid] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validação de CNPJ quando o campo tiver 14 caracteres
    if (name === "cnpj" && value.length === 14) {
      axios.get(`https://api.cnpja.com/office/${value}`, {
        headers: { Authorization: '507f5121-2175-4925-8b5b-5f4ff17b3312-3165bba4-7fe0-461b-8092-5b90c99c4088' } // Substitua pelo seu token válido
      })
        .then(() => {
          setCnpjValid(true);
          setAlertMessage("CNPJ válido!");
        })
        .catch(() => {
          setCnpjValid(false);
          setAlertMessage("CNPJ inválido!");
        });
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    // Verificação de campos obrigatórios
    if (!formData.nome || !formData.email || !formData.senha ||
        (formType === "cliente" && !formData.cpf) ||
        (formType === "atendente" && !formData.cnpj)) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Verificação de CNPJ válido para atendentes
    if (formType === "atendente" && !cnpjValid) {
      setError("Por favor, insira um CNPJ válido.");
      return;
    }

    const url = formType === "atendente"
      ? "http://127.0.0.1:8000/api/atendentes/cadastrar/"
      : "http://127.0.0.1:8000/api/clientes/cadastrar/";

    const dataToSend = formType === "atendente"
      ? { nome: formData.nome, cnpj: formData.cnpj, email: formData.email, senha: formData.senha }
      : { nome: formData.nome, cpf: formData.cpf, email: formData.email, senha: formData.senha };

    try {
      const response = await axios.post(url, dataToSend);
      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      setError("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff', fontFamily: "Arial, sans-serif" }}>
      
      {/* Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", zIndex: 1000 }}>
        <Toolbar sx={{ display: "flex", alignItems: "center", padding: "0 20px" }}>
          {/* Container Flex para Alinhar Título e Links */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "30px" }}>
            <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", whiteSpace: 'pre-line' }}>
              Saúde & Bem-Estar
            </Typography>
            {/* Links da Navbar */}
            <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <RouterLink 
                to="/duvidas" 
                style={{ 
                  textDecoration: "none", 
                  color: "#333", 
                  fontSize: "16px", 
                  textUnderlineOffset: "5px", 
                  transition: "all 0.3s ease" 
                }}
              >
                Dúvidas
              </RouterLink>
              <RouterLink 
                to="/legislacao" 
                style={{ 
                  textDecoration: "none", 
                  color: "#333", 
                  fontSize: "16px", 
                  textUnderlineOffset: "5px", 
                  transition: "all 0.3s ease" 
                }}
              >
                Legislação
              </RouterLink>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Conteúdo Principal */}
      <Box sx={{ flexGrow: 1, paddingTop: "80px", paddingBottom: "40px", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", marginBottom: "50px", marginTop:"0px" }}>
          <Typography variant="h1" sx={{ fontSize: "36px", fontWeight: "bold", color: "#000" }}>
            Farmacinha
          </Typography>
          <Typography variant="h2" sx={{ fontSize: "22px", color: "#d81b1b", textDecoration: "underline", whiteSpace: 'pre-line' }}>
            Saúde & Bem-Estar
          </Typography>
        </Box>

        {/* Escolha de Tipo de Cadastro */}
        <AnimatePresence>
          {!formType ? (
            <motion.div
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px" }}
              initial={{ y: 250, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 250, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" sx={{ fontSize: "32px", color: "#333", fontWeight: "bold" }}>
                Você quer se registrar como?
              </Typography>
              <Box sx={{ display: "flex", gap: "40px" }}>
                <motion.div
                  style={{ backgroundColor: "#4CAF50", color: "#fff", padding: "30px 60px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)", textAlign: "center" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormType("atendente")}
                >
                  Atendente
                </motion.div>
                <motion.div
                  style={{ backgroundColor: "#4CAF50", color: "#fff", padding: "30px 60px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)", textAlign: "center" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormType("cliente")}
                >
                  Cliente
                </motion.div>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              style={{
                backgroundColor: "#f2f2f2",
                padding: "40px",
                borderRadius: "10px",
                boxShadow: "0 4px 19px rgba(0, 0, 0, 0.1)",
                width: "100%",
                maxWidth: "450px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" sx={{ fontSize: "26px", fontWeight: "bold" }}>
                Cadastro como {formType === "cliente" ? "Cliente" : "Atendente"}
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
              {formType === "atendente" && (
                <>
                  <TextField
                    label="CNPJ"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />
                  {alertMessage && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity={cnpjValid ? "success" : "error"}>
                      {alertMessage}
                    </Alert>
                  )}
                </>
              )}
              {formType === "cliente" && (
                <TextField
                  label="CPF"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />
              )}
              <TextField
                label="E-mail"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Button variant="contained" color="error" onClick={() => setFormType(null)}>
                  Voltar
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Registrar
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Footer */}
      <Box 
        component="footer"
        sx={{ 
          backgroundColor: "#f1f1f1", 
          padding: "20px", 
          textAlign: "left", 
          width: "100%" 
        }}
      >
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
                <img 
                  src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/svgs/brands/facebook.svg" 
                  alt="Facebook" 
                  width="30px" 
                />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/svgs/brands/linkedin.svg" 
                  alt="LinkedIn" 
                  width="30px" 
                />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/svgs/brands/youtube.svg" 
                  alt="YouTube" 
                  width="30px" 
                />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/svgs/brands/instagram.svg" 
                  alt="Instagram" 
                  width="30px" 
                />
              </a>
            </Box>
          </Box>

          {/* Seção de Serviços */}
          <Box sx={{ flex: "1 1 150px" }}>
            <Typography variant="h6">Serviços</Typography>
            <Typography>
              <RouterLink to="#" style={{ textDecoration: "none", color: "#333" }}>
                Consultas Online
              </RouterLink>
            </Typography>
            <Typography>
              <RouterLink to="#" style={{ textDecoration: "none", color: "#333" }}>
                Prescrições
              </RouterLink>
            </Typography>
            <Typography>
              <RouterLink to="#" style={{ textDecoration: "none", color: "#333" }}>
                Medicamentos
              </RouterLink>
            </Typography>
          </Box>

          {/* Seção de Ajuda */}
          <Box sx={{ flex: "1 1 150px" }}>
            <Typography variant="h6">Ajuda</Typography>
            <Typography>
              <RouterLink to="#" style={{ textDecoration: "none", color: "#333" }}>
                Central de Ajuda
              </RouterLink>
            </Typography>
            <Typography>
              <RouterLink to="#" style={{ textDecoration: "none", color: "#333" }}>
                Fale Conosco
              </RouterLink>
            </Typography>
            <Typography>
              <RouterLink to="#" style={{ textDecoration: "none", color: "#333" }}>
                Dúvidas Frequentes
              </RouterLink>
            </Typography>
          </Box>

          {/* Seção de Empresa */}
          <Box sx={{ flex: "1 1 150px" }}>
            <Typography variant="h6">Empresa</Typography>
            <Typography>
              <RouterLink to="#" style={{ textDecoration: "none", color: "#333" }}>
                Sobre Nós
              </RouterLink>
            </Typography>
            <Typography>
              <RouterLink to="#" style={{ textDecoration: "none", color: "#333" }}>
                Carreiras
              </RouterLink>
            </Typography>
            <Typography>
              <RouterLink to="#" style={{ textDecoration: "none", color: "#333" }}>
                Política de Privacidade
              </RouterLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Cadastro;
