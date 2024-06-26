const axios = require('axios');
const logger = require('../config/logger.js');
require('dotenv').config();




/**
 * Obtenemos Pedidos en estado de exportacion false
 * @returns 
 */
async function obtenerPedidos(req , res){
    try{
       
        logger.info(`Iniciamos la funcion obtenerPedidos`);
        let data;
      
        const url = `http://api2.telecontrol.com.br/posvenda-pedido/pedidos/exportado/false`;

        logger.info(`URL :  ${url}`);
        
        const response = await axios.get( url, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Application-Key': process.env.DESARROLLO,
                'Access-Env': process.env.DEV_ACCES,
                'X-Custom-Header': 'value'
            }
        });

       
        if(response != undefined && response.data ){
            let pedidosList  = response.data;
            
            if(pedidosList.length >  0 ){
                // Se separan datos para una mejor manipulacion pedidos , os(ordenServicio)
                const pedidosSet = new Set();
                const osSet = new Set();
                
                //Generamos un arreglo con los pedidos que tienen Orden de Servicio relacionado a un pedido.Los pedidos que no tienen orden de servicio no se agregan a este nuevo arreglo. 
                pedidosList.forEach(obj => {
                    if (obj.itens && obj.itens.length > 0) {
                        obj.itens.forEach(item => {
                            if (item.os) {
                                osSet.add(item);
                                pedidosSet.add(obj);
                            }
                        });
                    }
                });
        
                let osList = [...osSet];
                
                let listaPedidos =[...pedidosSet];
    
                listaPedidos.forEach(pedido => {
                    pedido.tipoDocumento = pedido.codigo === 'VEN' ? 'NOTA DE VENTA' : 'NOTA DE VTA INTERNA';
                });
                
                data = {itemList : osList , pedidos : listaPedidos };

                logger.info(`Fin de la funcion obtenerPedidos :  ${JSON.stringify(data)}`);
        
                res.status(response.status).json(data);
                
            }
        }else{
            data = {mensaje : 'No se encontraron pedidos pendientes para procesar'};
            logger.info(`Fin de la funcion obtenerPedidos[1] :  ${JSON.stringify(data)}`);
            res.status(404).json(data);

        }
        
       

    }catch (error) {
        // Manejamos cualquier error ocurrido durante el proceso
        logger.error(`Error en obtenerOrdenServicio: ${error.message}`);
        res.status(500).json({ error: `Error en el servidor [obtener-pedidos-ms] :  ${error.message}`  });
    }
}


module.exports = {
    obtenerPedidos
};
