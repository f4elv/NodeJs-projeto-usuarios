import express from 'express';
import { criarUsuario, listarUsuarios } from '../controllers/usuariosControllers.js';

const router = express.Router();

router.post('/usuarios', criarUsuario);
router.get('/usuarios', listarUsuarios);

export default router;
