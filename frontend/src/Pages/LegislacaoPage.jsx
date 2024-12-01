import React from 'react';
import { AppBar, Toolbar, Typography, Box, Grid } from '@mui/material'; 
import { Link as RouterLink } from 'react-router-dom'; // Para usar com o react-router-dom

function LegislacaoPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Barra de navegação */}
      <AppBar position="fixed" sx={{ backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", zIndex: 1000 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: "0 20px" }}>
          <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", marginRight: "30px" }}>
            Saúde &<br />Bem-Estar
          </Typography>
          <Box sx={{ display: "flex", gap: "30px", alignItems: "center" }}>
            <RouterLink to="/duvidas" style={{ textDecoration: "underline", color: "#333", fontSize: "16px", marginBottom: "5px", textUnderlineOffset: "5px", transition: "all 0.3s ease" }}>
              Dúvidas
            </RouterLink>
            <RouterLink to="/legislacao" style={{ textDecoration: "underline", color: "#333", fontSize: "16px", marginBottom: "5px", textUnderlineOffset: "5px", transition: "all 0.3s ease" }}>
              Legislação
            </RouterLink>
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

      {/* Links de Legislação */}
      <Box sx={{ textAlign: "center", marginTop: "5px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontSize: "32px", color: "#333", marginBottom: "30px" }}>
          Legislação
        </Typography>

        <Box sx={{ textAlign: "center", marginBottom: "20px", width: '300px' }}>
          <a href="https://www.cff.org.br/userfiles/RDC%20471_21%20ANTIMICROBIANOS.pdf" 
            style={{ display: 'block', fontSize: '18px', color: '#d81b1b', textDecoration: 'none', margin: '10px 0', fontWeight: 'bold' }} target="_blank" rel="noopener noreferrer">
            Clique aqui para encontrar a RDC nº 471/2021 (Antibióticos)
          </a>
          <a href="https://bvsms.saude.gov.br/bvs/saudelegis/svs/1998/prt0344_12_05_1998_rep.html" 
            style={{ display: 'block', fontSize: '18px', color: '#d81b1b', textDecoration: 'none', margin: '10px 0', fontWeight: 'bold' }} target="_blank" rel="noopener noreferrer">
            Clique aqui para encontrar a Portaria 344/98 (Psicotrópicos)
          </a>
          <a href="https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular" 
            style={{ display: 'block', fontSize: '18px', color: '#d81b1b', textDecoration: 'none', margin: '10px 0', fontWeight: 'bold' }} target="_blank" rel="noopener noreferrer">
            Clique aqui para encontrar sobre o Programa Farmácia Popular
          </a>
        </Box>
      </Box>

      {/* Rodapé Fixo */}
      <Box sx={{
        backgroundColor: "#333", 
        padding: "20px", 
        color: "#fff", 
        position: "absolute", 
        bottom: 0, 
        width: "100%", 
        textAlign: "center"
      }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Farmacinha
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
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
    </div>
  );
}

export default LegislacaoPage;
