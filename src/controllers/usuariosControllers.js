import prisma from '../prisma/client.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';


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

        // variável de ambiente para o segredo do JWT
        const secret = process.env.JWT_SECRET;

        // Gera o token de acesso e o refresh token
        // O token de acesso é usado para autenticação em rotas protegidas
        const accessToken = jwt.sign(
            { id: usuario.id, role: usuario.role },
            secret,
            { expiresIn: '15m' } // Token expira em 15 minutos
        );

        const refreshToken = uuidv4(); // Gera um novo refresh token
        const agora = new Date(); // Define a data e hora atual
        const expiraEm = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000); // Expira em 7 dias

        // Armazena o refresh token no banco de dados
        // Isso é necessário para validar o refresh token posteriormente
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                usuarioId: usuario.id,
                expiraEm
            },
        });

        // Retorna o token de acesso e o refresh token para o cliente
        res.status(200).json({ message: 'Login bem-sucedido', accessToken, refreshToken,});

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

export const deletarUsuario = async (req, res) => {
    const { id } = req.body;

    try {
        const usuario = await prisma.usuario.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: 'Usuário deletado com sucesso', usuario });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
}

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ mensagem: 'Refresh token não enviado' })
    }

    try {
        // Verifica se o refresh token existe no banco de dados
        const token = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { usuario: true }, // Inclui os dados do usuário associado ao token
        });

        if (!token) {
            return res.status(401).json({ error: 'Refresh token inválido' });
        }

        // Verifica se o refresh token expirou
        if (new Date() > new Date(token.expiraEm)) {
            return res.status(401).json({ error: 'Refresh token expirado' });
        }

        // Gera um novo token de acesso
        const accessToken = jwt.sign(
            { id: token.usuarioId, role: 'user' }, 
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Erro ao gerar novo token:', error);
        res.status(500).json({ error: 'Erro ao gerar novo token' });
    }
}