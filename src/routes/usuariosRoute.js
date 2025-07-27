import express from 'express';
import { criarUsuario, listarUsuarios, login } from '../controllers/usuariosControllers.js';

const router = express.Router();

router.post('/usuarios', criarUsuario);// Adicionando rota para criar usuário
router.post('/usuarios/login', login); // Adicionando rota de login
router.get('/usuarios', listarUsuarios);// Adicionando rota para listar usuários


export default router;
