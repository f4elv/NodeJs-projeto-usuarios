//importando as dependências necessárias
import express from 'express';
import { criarUsuario, listarUsuarios, login, deletarUsuario, refreshToken } from '../controllers/usuariosControllers.js';
import { autenticatToken } from '../middlewears/auth.js';
import autorizacao from '../middlewears/autorizar.js';

const router = express.Router(); // Criando um router para gerenciar as rotas de usuários

router.post('/usuarios', criarUsuario);// Adicionando rota para criar usuário
router.post('/usuarios/login', login); // Adicionando rota de login
router.get('/usuarios', autenticatToken, autorizacao, listarUsuarios);// Adicionando rota para listar usuários
router.post('/usuarios/deletar', autenticatToken, autorizacao, deletarUsuario); // Adicionando rota para deletar usuário
router.post('/usuarios/refresh-token', refreshToken); // Adicionando rota para refresh-token

export default router; // Exportando o router para ser usado no servidor principal
