const axios = require("axios");
const logger = require("../config/logger.js");
require("dotenv").config();





/**
 * Obtenemos Pedidos en estado de exportacion false
 * @returns 
 */
async function obtenerPedidos(req, res) {
  try {
    logger.info("Iniciamos la función obtenerPedidos");
    let data;

    // Obtener la fecha actual y calcular la fecha 60 días antes
    const fechaActual = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaActual.getDate() - 8);

    // Formatear las fechas a "YYYY-MM-DD"
    const formatoFecha = (fecha) =>
      fecha.toISOString().split('T')[0];

    const fechaInicioStr = formatoFecha(fechaInicio);
    const fechaFinStr = formatoFecha(fechaActual);

    // Construir la URL
    const url = `http://api2.telecontrol.com.br/posvenda-pedido/pedidos/dataInicial/${fechaInicioStr}/dataFinal/${fechaFinStr}/exportado/false`;

    logger.info(`URL : ${url}`);

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Application-Key": process.env.PRODUCCION,
        "Access-Env": process.env.PROD_ACCES,
        "X-Custom-Header": "value",
      },
    });

    if (response && response.data) {
      const pedidosList = response.data;

      if (pedidosList.length > 0) {
        const pedidosSet = new Set();
        const osSet = new Set();

        pedidosList.forEach((obj) => {
          if (obj.itens && obj.itens.length > 0) {
            obj.itens.forEach((item) => {
              if (item.os) {
                osSet.add(item);
                pedidosSet.add(obj);
              }
            });
          }
        });

        const osList = [...osSet];
        const listaPedidos = [...pedidosSet];

        listaPedidos.forEach((pedido) => {
          pedido.tipoDocumento =
            pedido.codigo === "VEN" ? "NOTA DE VENTA" : "NOTA DE VTA INTERNA";
        });

        data = { itemList: osList, pedidos: listaPedidos };

        logger.info(
          `Fin de la función obtenerPedidos: ${JSON.stringify(data)}`
        );

        res.status(response.status).json(data);
      } else {
        data = { mensaje: "No se encontraron pedidos pendientes para procesar" };
        logger.info(
          `Fin de la función obtenerPedidos[1]: ${JSON.stringify(data)}`
        );
        res.status(404).json(data);
      }
    } else {
      data = { mensaje: "No se encontraron pedidos pendientes para procesar" };
      logger.info(
        `Fin de la función obtenerPedidos[1]: ${JSON.stringify(data)}`
      );
      res.status(404).json(data);
    }
  } catch (error) {
    logger.error(`Error en obtenerPedidos: ${error.message}`);
    res.status(500).json({
      error: `Error en el servidor [obtener-pedidos-ms]: ${error.message}`,
    });
  }
}

module.exports = {
  obtenerPedidos
};
