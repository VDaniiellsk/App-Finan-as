// src/controllers/transactions.controller.js

const { pool } = require('../config/db');

// ----------------------------------------------------------------------
// FUNÇÃO: Listar Transações do Usuário Autenticado
// ----------------------------------------------------------------------
exports.getTransactions = async (req, res) => {
    // O ID do usuário vem do Middleware, o que garante a segurança!
    const userId = req.userId;

    let connection;
    try {
        connection = await pool.getConnection();
        
        // IMPORTANTE: Busca apenas os lançamentos que pertencem a este usuário (userId)
        const [rows] = await connection.query(
            'SELECT * FROM lancamentos WHERE users_id_user = ? ORDER BY data DESC',
            [userId]
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        res.status(500).json({ message: 'Erro interno ao buscar dados financeiros.' });

    } finally {
        if (connection) connection.release();
    }
};

// ----------------------------------------------------------------------
// FUNÇÃO: Criar Nova Transação
// ----------------------------------------------------------------------
exports.createTransaction = async (req, res) => {
    const userId = req.userId; // ID fornecido pelo middleware
    const { valor, categoria, detalhes, banco_id } = req.body;
    
    // Simplesmente para ilustrar a proteção da rota
    // O código de inserção seria mais complexo aqui.

    res.status(201).json({ 
        message: 'Transação criada com sucesso (Requisição protegida).', 
        user: userId,
        data: { valor, categoria, detalhes, banco_id }
    });
};