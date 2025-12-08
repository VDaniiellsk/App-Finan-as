const jwt = require('jsonwebtoken');
require('dotenv').config();

// ----------------------------------------------------------------------
// FUNÇÃO: Protege as rotas, verificando a presença e validade do JWT
// ----------------------------------------------------------------------
module.exports = (req, res, next) => {
    // 1. Busca o Token no Cabeçalho
    // Esperamos que o app React Native envie: Authorization: Bearer <token>
    console.log('Chave JWT usada para VERIFICAR:', process.env.JWT_SECRET);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // Se o cabeçalho de autorização não existir, nega o acesso
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    // 2. Extrai o Token (remove 'Bearer ')
    const parts = authHeader.split(' ');
    
    // Verifica se o formato é 'Bearer <token>'
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
        return res.status(401).json({ message: 'Formato do token inválido.' });
    }
    
    const token = parts[1];

    try {
        // 3. Verifica e Decodifica o Token
        // Usa a mesma chave secreta definida no seu .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Anexa o ID do Usuário à Requisição
        // O ID vem do payload que você definiu no login (id: user.id_user)
        req.userId = decoded.id; 
        
        // 5. Continua para a próxima função (o Controller de Transações)
        return next();

    } catch (err) {
        // Erro: token inválido, expirado ou alterado
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};