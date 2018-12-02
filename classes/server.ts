import express from 'express';
import { SERVER_POST } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/socket';

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;

    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_POST;
        
        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.escucharSockets();
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() )
    }

    private escucharSockets() {

        this.io.on('connect', cliente => {

            // console.log(cliente.id);

            // Conectar Cliente
            socket.conectarCliente( cliente, this.io );

            // Configurar Usuario
            socket.configuracion( cliente, this.io );

            // Obtener Usuarios Activos
            socket.obtenerUsuarios( cliente, this.io );

            // Mensajes
            socket.mensaje( cliente, this.io );

            // Desconectar
            socket.desconectar( cliente, this.io );

        });
    }

    start( callback: Function) {
        this.httpServer.listen( this.port, callback );
    }

}