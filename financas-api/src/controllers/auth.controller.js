const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db'); // Importa o pool de conexão que você exportou do index.js

const saltRounds = 10; // Custo de processamento para o hash do bcrypt

// ----------------------------------------------------------------------
// FUNÇÃO 1: REGISTRO DE NOVO USUÁRIO
// Endpoint: POST /api/auth/register
// ----------------------------------------------------------------------
exports.register = async (req, res) => {
    const { email, password, cpf } = req.body; 

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    let connection;
    try {
        // 1. Criptografa a Senha (Segurança Inegociável)
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // 2. Tenta obter uma conexão do pool
        connection = await pool.getConnection();

        // 3. Insere o novo usuário no banco de dados
        const query = `
            INSERT INTO users (email, password_hash, cpf)
            VALUES (?, ?, ?);
        `;
        // ATENÇÃO: Verifique se o nome da coluna no seu BD é 'emai' ou 'email'
        // Seu diagrama mostra 'emai', use o que estiver no seu banco.
        
        await connection.query(query, [email, passwordHash, cpf]);

        res.status(201).json({ 
            message: 'Usuário registrado com sucesso.',
            user: { email, cpf }
        });

    } catch (error) {
        // Erro 1062 é o código do MySQL para entrada duplicada (ex: email já existe)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Este email já está em uso.' });
        }
        console.error('Erro no registro de usuário:', error);
        res.status(500).json({ message: 'Erro interno no servidor ao registrar usuário.' });

    } finally {
        if (connection) connection.release(); // Sempre libera a conexão
    }
};


// ----------------------------------------------------------------------
// FUNÇÃO 2: LOGIN E GERAÇÃO DE TOKEN JWT
// Endpoint: POST /api/auth/login
// ----------------------------------------------------------------------
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        // 1. Busca o usuário pelo email
        const [rows] = await connection.query(
            `SELECT id_user, password_hash FROM users WHERE email = ?`, // Novamente, confira se é 'emai' ou 'email'
            [email]
        );

        const user = rows[0];
        
        // Se o usuário não for encontrado
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 2. Compara a senha fornecida com o hash no banco (bcrypt.compare)
        const isMatch = await bcrypt.compare(password, user.password_hash);

        // Se a senha não coincidir
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 3. Gera o JSON Web Token (JWT)
        const token = jwt.sign(
            { id: user.id_user, email: email }, // Payload (informações básicas do usuário)
            process.env.JWT_SECRET,             // Sua chave secreta (do arquivo .env)
            { expiresIn: '1d' }                 // Expira em 1 dia
        );

        // 4. Retorna o token para o React Native
        res.status(200).json({ 
            message: 'Login bem-sucedido.',
            token: token
        });

    } catch (error) {
        console.error('Erro no login de usuário:', error);
        res.status(500).json({ message: 'Erro interno no servidor ao fazer login.' });

    } finally {
        if (connection) connection.release(); // Sempre libera a conexão
    }
};