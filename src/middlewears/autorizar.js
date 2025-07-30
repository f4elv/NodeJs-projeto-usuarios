export default function autorizacao(req, res, next) {

    const { role } = req.usuario; // Obtém o papel do usuário decodificado do token
    if (role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }
    next(); // Se o usuário for admin, chama o próximo middleware ou rota
}
// Middleware para verificar se o usuário é um administrador
// Este middleware deve ser usado em rotas que requerem autorização de administrador
