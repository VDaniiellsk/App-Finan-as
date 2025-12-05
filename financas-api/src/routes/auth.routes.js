// src/routes/auth.routes.js

const express = require('express');
const router = express.Router(); // <--- CRÍTICO: router deve ser inicializado

const authController = require('../controllers/auth.controller');
// ... rotas (router.post(...))

router.post('/register', authController.register); // <--- ESTÁ EXATAMENTE ASSIM?
router.post('/login', authController.login); // <--- ESTA LINHA É CRÍTICA!

module.exports = router;