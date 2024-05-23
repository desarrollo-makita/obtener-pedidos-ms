const express = require('express');
const router = express.Router();
const { obtenerPedidos } = require('../controllers/obtenerPedidosControllers');

router.get('/obtener-pedidos', obtenerPedidos);

module.exports = router;
