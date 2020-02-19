import express from 'express'
const cors = require('cors')

import UsuarioRoutes from './controller/Usuario'
import ProdutoRoutes from './controller/Produto'
import PedidoRoutes from './controller/Pedido'

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json())
        this.server.use(cors())
    }

    routes() {
        this.server.use(PedidoRoutes);
        this.server.use(UsuarioRoutes);
        this.server.use(ProdutoRoutes);
    }
}

export default new App();