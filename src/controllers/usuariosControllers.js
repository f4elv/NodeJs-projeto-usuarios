import prisma from '../prisma/client.js';

export const criarUsuario = async (req, res) => {
    const { nome, email, idade } = req.body;
    
    try {
        const usuario = await prisma.usuario.create({
        data: {
            nome,
            email,
            idade,
        },
        });
        res.status(201).json(usuario);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ erro: 'Erro ao criar usuário' }); 
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