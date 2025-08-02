import express from 'express';
import usuariosroutes from './routes/usuariosRoute.js';
import logger from './middlewears/logger.js';
import dotenv  from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(logger);

app.use('/api', usuariosroutes);

app.get('/', (req, res) => {
    res.send('Bem vindo a API de Usuários');
});

export default app; // Exportando a instância do app para ser usada no servidor principal