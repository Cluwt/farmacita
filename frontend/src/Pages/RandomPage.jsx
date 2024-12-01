import React, { useState } from "react";
import { Typography, Box, AppBar, Toolbar, Modal, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

const Duvidas = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState("");

  const handleOpenModal = (doubt) => {
    setSelectedDoubt(doubt);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDoubt("");
  };

  return (
    <Box sx={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9" }}>
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

      {/* Dúvidas */}
      <Box sx={{ textAlign: "center", marginTop: "50px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontSize: "32px", color: "#333", marginBottom: "30px" }}>
          Dúvidas Frequentes
        </Typography>

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

      {/* Modal com respostas das dúvidas */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" sx={{ marginBottom: "20px" }}>
            {selectedDoubt}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "20px" }}>
            {selectedDoubt === "O que devo saber antes de comprar um antibiótico?" && (
              <div>
                Antes de comprar um antibiótico, é fundamental consultar um médico. O uso inadequado pode levar à resistência bacteriana e efeitos adversos, como efeitos colaterais graves. Além disso, é importante seguir a dosagem corretamente e não interromper o uso antes do prazo estipulado pelo médico, mesmo que os sintomas desapareçam.
              </div>
            )}
            {selectedDoubt === "O que devo saber antes de comprar um psicotrópico?" && (
              <div>
                Medicamentos psicotrópicos devem ser usados com extrema cautela. Eles podem causar dependência e têm efeitos no sistema nervoso central. O acompanhamento médico é essencial para garantir o tratamento adequado, evitando os riscos de efeitos adversos. A automedicação pode ser perigosa, por isso nunca utilize psicotrópicos sem orientação.
              </div>
            )}
            {selectedDoubt === "O que é um medicamento isento de prescrição?" && (
              <div>
                Medicamentos isentos de prescrição, conhecidos como MIPs, são aqueles que não necessitam de receita médica para a compra. Exemplos incluem analgésicos simples, antigripais e outros medicamentos de uso comum. No entanto, mesmo sendo de fácil acesso, é essencial usá-los com responsabilidade para evitar efeitos colaterais ou interações com outros medicamentos.
              </div>
            )}
            {selectedDoubt === "Quais são os tempos de tratamento?" && (
              <div>
                Os tempos de tratamento variam conforme o tipo de medicamento e a condição a ser tratada. Medicamentos para doenças agudas podem ter tratamentos curtos, enquanto medicamentos para doenças crônicas exigem o uso contínuo. Sempre siga as orientações médicas sobre a duração do tratamento e nunca interrompa a medicação sem consultar o profissional de saúde.
              </div>
            )}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseModal}
            sx={{ fontWeight: "bold", padding: "10px 20px", fontSize: "16px" }}
          >
            Fechar
          </Button>
        </Box>
      </Modal>

      {/* Rodapé */}
      <Box sx={{ backgroundColor: "#333", padding: "20px", color: "#fff" }}>
        <Grid container spacing={2} alignItems="center">
          {/* Nome do site à esquerda */}
          <Grid item xs={12} sx={{ textAlign: "left" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Farmacinha
            </Typography>
          </Grid>

          {/* Ícones das redes sociais abaixo do nome, alinhados à esquerda */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-start", gap: "20px", marginTop: "10px" }}>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/svgs/brands/facebook.svg" alt="Facebook" width="30px" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/svgs/brands/instagram.svg" alt="Instagram" width="30px" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/svgs/brands/twitter.svg" alt="Twitter" width="30px" />
            </a>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Duvidas;
