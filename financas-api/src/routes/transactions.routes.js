// src/routes/transactions.routes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const transactionsController = require('../controllers/transactions.controller');

// Todas as rotas abaixo usarão o authMiddleware antes de executar o controller!

// Rota para listar todas as transações do usuário (PROTEGIDA)
router.get('/', authMiddleware, transactionsController.getTransactions);

// Rota para criar uma nova transação (PROTEGIDA)
router.post('/', authMiddleware, transactionsController.createTransaction);

module.exports = router;