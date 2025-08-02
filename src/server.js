import app from './app.js';

// Variável de ambiente para a porta do servidor
const PORT = process.env.PORT || 3000;
// Inicia o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});