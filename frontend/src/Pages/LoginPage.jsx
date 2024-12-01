import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';  // Importar Link do React Router

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
      <h3 style={styles.formTitle}>
        Login como {formType === "cliente" ? "Cliente" : "Atendente"}
      </h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder={formType === "cliente" ? "CPF" : "Email"}
        value={formType === "cliente" ? cpf : email}
        onChange={(e) => formType === "cliente" ? setCpf(e.target.value) : setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button
        style={{ ...styles.button, ...styles.btnEntrar }}
        onClick={handleLogin}
      >
        ENTRAR
      </button>
      <button
        style={{ ...styles.button, ...styles.btnCancelar }}
        onClick={() => setFormType(null)}
      >
        VOLTAR
      </button>
      <Link to="/redefinir" style={styles.link}>
        Redefinir senha
    </Link>
    </motion.div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Farmacinha</h1>
        <h2 style={styles.subtitle}>Saúde & Bem-Estar</h2>
      </header>

      <AnimatePresence>
        {!formType ? (
          <motion.div
            style={styles.choiceContainer}
            initial={{ y: 250, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 250, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 style={styles.title}>Você quer logar como?</h1>
            <div style={styles.options}>
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
            </div>
          </motion.div>
        ) : (
          renderForm()
        )}
      </AnimatePresence>

      {/* Footer com links e ícones */}
      <footer style={styles.footer}>
        <div style={styles.footerLinks}>
          <div>
            <a href="#" style={styles.footerLink}>
              Site Name
            </a>
          </div>
          <div>
            <a href="#" style={styles.footerLink}>
              Topic
            </a>
            <a href="#" style={styles.footerLink}>
              Page
            </a>
            <a href="#" style={styles.footerLink}>
              Page
            </a>
          </div>
        </div>
        <div style={styles.socialIcons}>
          <i className="fab fa-facebook" style={styles.icon}></i>
          <i className="fab fa-linkedin" style={styles.icon}></i>
          <i className="fab fa-youtube" style={styles.icon}></i>
          <i className="fab fa-instagram" style={styles.icon}></i>
        </div>
      </footer>
    </div>
  );
};
const styles = {
  container: {
    margin: 0,
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "100vh",
    backgroundColor: "#fff",
  },
  header: {
    textAlign: "center",
    marginTop: "50px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: "22px",
    color: "#d81b1b",
    textDecoration: "underline",
  },
  choiceContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px",
    marginTop: "30px",
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
    width: "450px",
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
    backgroundColor: "#f9f9f9",
    width: "100%",
    padding: "20px 0",
    textAlign: "center",
    borderTop: "1px solid #ddd",
  },
  footerLinks: {
    display: "flex",
    justifyContent: "center",
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
