const axios = require('axios');
const logger = require('../config/logger.js');




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
                'Access-Application-Key': '3d137dea1d13220aa9a10ee57d69f6b30d247f28',
                'Access-Env': 'HOMOLOGATION',
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

        logger.error(`Error al obtener pedidos funcion obtenerPedidos[1] ${JSON.stringify(error.message)}`);
        
        throw error;
    }
}


module.exports = {
    obtenerPedidos
};
