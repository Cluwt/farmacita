import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check'; // Ícone de confirmação

const Cadastro = () => {
  const [view, setView] = useState(""); // "cliente", "atendente" ou vazio
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    cpf: "",
    email: "",
    senha: "",
  });
  const [cnpjValid, setCnpjValid] = useState(null); // Estado para validação de CNPJ
  const [alertMessage, setAlertMessage] = useState(""); // Estado para mensagem do alerta
  const navigate = useNavigate(); // Inicializando o hook useNavigate

  // Animação dos containers
  const containerVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5 } },
  };

  const handleBack = () => {
    setView(""); // Voltar à tela inicial
    setFormData({ nome: "", cnpj: "", cpf: "", email: "", senha: "" });
    setCnpjValid(null); // Resetar o estado de validação do CNPJ
    setAlertMessage(""); // Limpar a mensagem do alerta
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validação de CNPJ no campo de CNPJ (somente para atendentes)
    if (name === "cnpj" && value.length === 14) {
      axios.get(`https://api.cnpja.com/office/${value}`, {
        headers: { Authorization: '507f5121-2175-4925-8b5b-5f4ff17b3312-3165bba4-7fe0-461b-8092-5b90c99c4088' }
      })
        .then((response) => {
          setCnpjValid(true); // CNPJ válido
          setAlertMessage("CNPJ válido!");
        })
        .catch((error) => {
          setCnpjValid(false); // CNPJ inválido
          setAlertMessage("CNPJ inválido!");
        });
    }
  };

  const handleSubmit = async (type) => {
    let formDataToSend = { ...formData };

    // Remover CPF se for atendente, e remover CNPJ se for cliente
    if (type === "Atendente") {
      delete formDataToSend.cpf; // Não envia CPF para atendente
    } else if (type === "Cliente") {
      delete formDataToSend.cnpj; // Não envia CNPJ para cliente
    }

    const url =
      type === "Atendente"
        ? "http://127.0.0.1:8000/api/atendentes/cadastrar/"
        : "http://127.0.0.1:8000/api/clientes/cadastrar/";

    console.log("FormData:", formDataToSend); // Log para verificar os dados enviados

    try {
      const response = await axios.post(url, formDataToSend);
      alert(`${type} registrado com sucesso!`);
      console.log("Response:", response.data);
      handleBack(); // Resetar o formulário
      navigate("/login");
    } catch (error) {
      console.error("Erro ao enviar:", error.response?.data || error.message);
      alert("Erro ao registrar. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <header style={styles.navbar}>
        <div style={styles.logo}>
          <h1 style={styles.logoText}>Farmacinha</h1>
        </div>
        <nav>
          <ul style={styles.navLinks}>
            <li>
              <a href="/" style={styles.navLink}>Início</a>
            </li>
            <li>
              <a href="/cadastro" style={styles.navLink}>Cadastre-se</a>
            </li>
            <li>
              <a href="/login" style={styles.navLink}>Entrar</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Conteúdo */}
      <div style={styles.content}>
        <AnimatePresence>
          {/* Título e Subtítulo */}
          <div style={styles.titleContainer}>
            <h1 style={styles.mainTitle}>Farmacinha</h1>
            <h2 style={styles.subtitle}>Formulário de Cadastro</h2>
          </div>

          {/* Tela de Escolha */}
          {view === "" && (
            <motion.div
              style={styles.choiceContainer}
              variants={containerVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h1 style={styles.title}>Você quer se registrar como?</h1>
              <div style={styles.options}>
                <motion.div
                  style={styles.optionBox}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView("atendente")}
                >
                  Atendente
                </motion.div>
                <motion.div
                  style={styles.optionBox}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView("cliente")}
                >
                  Cliente
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Formulário de Atendente */}
          {view === "atendente" && (
            <motion.div
              style={styles.formContainer}
              variants={containerVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 style={styles.formTitle}>Registro de Atendente</h2>
              <input
                type="text"
                placeholder="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="CNPJ"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                style={styles.input}
              />
              {alertMessage && (
                <Alert icon={<CheckIcon fontSize="inherit" />} severity={cnpjValid ? "success" : "error"}>
                  {alertMessage}
                </Alert>
              )}
              <input
                type="email"
                placeholder="E-mail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                style={styles.input}
              />
              <div style={styles.btnGroup}>
                <button style={styles.btnCancel} onClick={handleBack}>
                  Voltar
                </button>
                <button
                  style={styles.btnSubmit}
                  onClick={() => handleSubmit("Atendente")}
                >
                  Registrar
                </button>
              </div>
            </motion.div>
          )}

          {/* Formulário de Cliente */}
          {view === "cliente" && (
            <motion.div
              style={styles.formContainer}
              variants={containerVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 style={styles.formTitle}>Registro de Cliente</h2>
              <input
                type="text"
                placeholder="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                type="email"
                placeholder="E-mail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                style={styles.input}
              />
              <div style={styles.btnGroup}>
                <button style={styles.btnCancel} onClick={handleBack}>
                  Voltar
                </button>
                <button
                  style={styles.btnSubmit}
                  onClick={() => handleSubmit("Cliente")}
                >
                  Registrar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Estilos CSS em JS
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "10px 20px",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  logoText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
  },
  navLink: {
    color: "#333",
    textDecoration: "none",
    marginLeft: "20px",
    fontSize: "16px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "120px", // Espaço após a navbar
    width: "100%",
  },
  titleContainer: {
    textAlign: "center",
    marginBottom: "40px", // Espaço entre os títulos e os formulários
  },
  mainTitle: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: "24px",
    fontWeight: "normal",
    color: "red",
  },
  formContainer: {
    width: "80%",
    maxWidth: "500px",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  btnGroup: {
    display: "flex",
    justifyContent: "space-between",
  },
  btnCancel: {
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
  },
  btnSubmit: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
  },
  choiceContainer: {
    textAlign: "center",
    marginBottom: "40px", 
  },
  title: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  options: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  optionBox: {
    backgroundColor: "#2196F3",
    color: "#fff",
    padding: "20px 30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
};

export default Cadastro;
