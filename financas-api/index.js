require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

//middlewares globais

app.use(express.json());//habilitar o express para ler json no corpo da requisição POST/PUT
app.use(cors({
     origin: [
        'http://localhost:8081',
        'http://localhost:5173',
        'exp://192.168.1.106:19000',
        '*'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


// ----------------------------------------------------
// 1. CONFIGURAÇÃO DO BANCO DE DADOS (POOL)
// ----------------------------------------------------
const { pool } = require('./src/config/db');

//const pool = mysql.createPool({
//    host: process.env.DB_HOST,
//    user: process.env.DB_USER,
//    password: process.env.DB_PASSWORD,
//    database: process.env.DB_DATABASE,
//    waitForConnections: true,
//    connectionLimit: 10,
//    queueLimit: 0
///}); 


// ----------------------------------------------------
// 2. ROTA DE TESTE DE CONEXÃO (Sanity Check)
// ----------------------------------------------------

app.get('/api/status', async (req, res) => {
    try {
        await pool.getConnection(); // Tenta obter uma conexão
        res.status(200).json({ status: 'API Online', db: 'Conectado ao MySQL com sucesso!' });
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message);
        res.status(500).json({ status: 'API Online', db: 'Erro de Conexão', error: error.message });
    }
});




// ----------------------------------------------------
// 4. IMPORTAÇÃO E USO DAS ROTAS
// ----------------------------------------------------
const authRoutes = require('./src/routes/auth.routes.js');
const transactionsRoutes = require('./src/routes/transactions.routes'); // <--- NOVA LINHA

app.use('/api/auth', authRoutes); 
app.use('/api/transacoes', transactionsRoutes); // <--- NOVA LINHA

// ...
// 

// ----------------------------------------------------
// 3. INICIALIZAÇÃO DO SERVIDOR
// ----------------------------------------------------

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor Express rodando em http://localhost:${PORT}`);
    console.log(`Verifique a conexão em http://localhost:${PORT}/api/status`);
});
