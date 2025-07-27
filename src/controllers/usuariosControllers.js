import prisma from '../prisma/client.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const criarUsuario = async (req, res) => {
    const { nome, email, idade, senha } = req.body;
    
    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await prisma.usuario.create({
        data: {
            nome,
            email,
            idade,
            senha: senhaHash, // Armazenando a senha criptografada
        },
        });
        res.status(201).json(usuario);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ erro: 'Erro ao criar usuário' }); 
    }
}

export const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
            expiresIn: '2h', // Expira em 2 horas
        });

        res.status(200).json({ message: 'Login bem-sucedido', token });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
}

export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
}