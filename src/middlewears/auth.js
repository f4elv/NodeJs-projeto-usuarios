import jwt from 'jsonwebtoken';

export const autenticatToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    //verifica se o header existe e tem o formato correto
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const secret = process.env.JWT_SECRET;
        const usuarioDecodificado = jwt.verify(token, secret);

        req.usuario = usuarioDecodificado; // Adiciona o usuário decodificado ao request
    
        // Chama o próximo middleware ou rota
        next();
        
    } catch (error) {
        console.error('Erro ao autenticar token:', error); 
        return res.status(401).json({ error: 'Token inválido' });
    }
};