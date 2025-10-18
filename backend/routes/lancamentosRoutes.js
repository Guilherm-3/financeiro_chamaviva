// backend/routes/lancamentosRoutes.js

const express = require('express');
const router = express.Router();

// Importamos o nosso controller
const lancamentosController = require('../controllers/lancamentosController');

// Definimos as rotas e qual função do controller cada uma vai chamar

// Rota para LER (GET) todos os lançamentos
router.get('/', lancamentosController.listarLancamentos);

router.get('/teste/', lancamentosController.teste);

// Rota para CRIAR (POST) um novo lançamento
router.post('/', lancamentosController.criarLancamento);

// Rota para ATUALIZAR (PUT) um lançamento existente pelo ID
router.put('/:id', lancamentosController.atualizarLancamento);

// Rota para ATUALIZAR (PUT) um lançamento existente pelo ID para o status deletado
router.put('/deletar/:id', lancamentosController.atualizarLancamentoDeletar);

// Rota para APAGAR (DELETE) um lançamento pelo ID
router.delete('/:id', lancamentosController.apagarLancamento);

module.exports = router;