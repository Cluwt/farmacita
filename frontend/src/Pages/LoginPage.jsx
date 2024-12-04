import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Link as RouterLink } from 'react-router-dom';  // Importar Link do React Router
import { Typography, Box, Button, TextField, AppBar, Toolbar, CircularProgress, Grid } from '@mui/material'; // Importando componentes do MUI

const Login = () => {
  const [formType, setFormType] = useState(null); // Estado para alternar entre Cliente e Atendente
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");  // Para Atendente
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // Para mostrar erros no login
  
  const handleLogin = async () => {
    try {
      // Enviar o 'email' para atendente e 'cpf' para cliente
      const loginData = formType === "cliente"
        ? { cpf, senha: password }
        : { email, senha: password }; // Para o atendente, enviamos o 'email'
  
      const response = await axios.post(
        formType === "cliente"
          ? "http://127.0.0.1:8000/api/clientes/login/" // URL para login de cliente
          : "http://127.0.0.1:8000/api/atendentes/login/", // URL para login de atendente
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      console.log("Login successful:", response.data);
      alert("Login realizado com sucesso!");
  
      Cookies.set("auth_token", response.data.token, { expires: 1 });
  
      // Redirecionar para o local correto (paciente ou atendente)
      window.location.href = formType === "cliente" ? "/paciente" : "/atendente";  // Ajuste o redirecionamento
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Erro ao fazer login, verifique as credenciais!");
    }
  };

  const renderForm = () => (
    <motion.div
      style={styles.loginBox}
      initial={{ y: 250, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 250, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" sx={styles.formTitle}>
        Login como {formType === "cliente" ? "Cliente" : "Atendente"}
      </Typography>
      {error && <Typography sx={{ color: 'red' }}>{error}</Typography>}
      <TextField
        type="text"
        placeholder={formType === "cliente" ? "CPF" : "Email"}
        value={formType === "cliente" ? cpf : email}
        onChange={(e) => formType === "cliente" ? setCpf(e.target.value) : setEmail(e.target.value)}
        variant="outlined"
        fullWidth
        sx={styles.input}
      />
      <TextField
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
        fullWidth
        sx={styles.input}
      />
      <Button
        variant="contained"
        sx={{ ...styles.button, ...styles.btnEntrar }}
        onClick={handleLogin}
      >
        ENTRAR
      </Button>
      <Button
        variant="contained"
        sx={{ ...styles.button, ...styles.btnCancelar }}
        onClick={() => setFormType(null)}
      >
        VOLTAR
      </Button>
      <RouterLink to="/redefinir" style={styles.link}>
        Redefinir senha (SEM FUNCIONAMENTO)
      </RouterLink>
    </motion.div>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#fff',
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Barra de navegação */}
      <AppBar position="fixed" sx={{ backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", zIndex: 1000 }}>
        <Toolbar sx={{ display: "flex", alignItems: "center", padding: "0 20px" }}>
          {/* Container Flex para Alinhar Título e Links */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "30px" }}>
            <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", whiteSpace: 'pre-line' }}>
              Saúde &{'\n'}Bem-Estar
            </Typography>
            {/* Links da Navbar */}
            <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <RouterLink 
                to="/duvidas" 
                style={{ 
                  textDecoration: "underline", 
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
                  textDecoration: "underline", 
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
        {/* Header */}
        <Box sx={{ textAlign: "center", marginBottom: "50px", marginTop:"0px" }}>
          <Typography variant="h1" sx={{ fontSize: "36px", fontWeight: "bold", color: "#000" }}>
            Farmacinha
          </Typography>
          <Typography variant="h2" sx={{ fontSize: "22px", color: "#d81b1b", textDecoration: "underline", whiteSpace: 'pre-line' }}>
            Saúde & Bem-Estar
          </Typography>
        </Box>

        {/* Escolha de Tipo de Login */}
        <AnimatePresence>
          {!formType ? (
            <motion.div
              style={styles.choiceContainer}
              initial={{ y: 250, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 250, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" sx={styles.title}>Você quer logar como?</Typography>
              <Box sx={styles.options}>
                <motion.div
                  style={styles.optionBox}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormType("cliente")}
                >
                  Cliente
                </motion.div>
                <motion.div
                  style={styles.optionBox}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormType("atendente")}
                >
                  Atendente
                </motion.div>
              </Box>
            </motion.div>
          ) : (
            renderForm()
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
              <RouterLink 
                to="#" 
                style={{ textDecoration: "none", color: "#333" }}
              >
                Consultas Online
              </RouterLink>
            </Typography>
            <Typography>
              <RouterLink 
                to="#" 
                style={{ textDecoration: "none", color: "#333" }}
              >
                Prescrições
              </RouterLink>
            </Typography>
            <Typography>
              <RouterLink 
                to="#" 
                style={{ textDecoration: "none", color: "#333" }}
              >
                Medicamentos
              </RouterLink>
            </Typography>
          </Box>

          {/* Seção de Ajuda */}
          <Box sx={{ flex: "1 1 150px" }}>
            <Typography variant="h6">Ajuda</Typography>
            <Typography>
              <RouterLink 
                to="#" 
                style={{ textDecoration: "none", color: "#333" }}
              >
                Central de Ajuda
              </RouterLink>
            </Typography>
            <Typography>
              <RouterLink 
                to="#" 
                style={{ textDecoration: "none", color: "#333" }}
              >
                Fale Conosco
              </RouterLink>
            </Typography>
            <Typography>
              <RouterLink 
                to="#" 
                style={{ textDecoration: "none", color: "#333" }}
              >
                Dúvidas Frequentes
              </RouterLink>
            </Typography>
          </Box>

          {/* Seção de Empresa */}
          <Box sx={{ flex: "1 1 150px" }}>
            <Typography variant="h6">Empresa</Typography>
            <Typography>
              <RouterLink 
                to="#" 
                style={{ textDecoration: "none", color: "#333" }}
              >
                Sobre Nós
              </RouterLink>
            </Typography>
            <Typography>
              <RouterLink 
                to="#" 
                style={{ textDecoration: "none", color: "#333" }}
              >
                Carreiras
              </RouterLink>
            </Typography>
            <Typography>
              <RouterLink 
                to="#" 
                style={{ textDecoration: "none", color: "#333" }}
              >
                Política de Privacidade
              </RouterLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  choiceContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px",
    marginTop: "30px",
  },
  title: {
    fontSize: "32px",
    color: "#333",
    fontWeight: "bold",
  },
  options: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
  },
  optionBox: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "30px 60px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
  loginBox: {
    backgroundColor: "#f2f2f2",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 19px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  formTitle: {
    fontSize: "26px",
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "6px",
    fontSize: "18px",
    cursor: "pointer",
    marginTop: "10px",
  },
  btnEntrar: {
    backgroundColor: "#4CAF50",
    color: "#fff",
  },
  btnCancelar: {
    backgroundColor: "#d81b1b",
    color: "#fff",
  },
  link: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#888",
    textDecoration: "none",
  },
  footer: {
    backgroundColor: "#f1f1f1",
    width: "100%",
    padding: "20px 0",
    textAlign: "left",
    borderTop: "1px solid #ddd",
  },
  footerLinks: {
    display: "flex",
    justifyContent: "space-between",
    gap: "50px",
  },
  footerLink: {
    margin: "5px 0",
    color: "#555",
    textDecoration: "none",
    fontSize: "14px",
  },
  socialIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },
  icon: {
    fontSize: "20px",
    color: "#555",
  },
};

export default Login;
