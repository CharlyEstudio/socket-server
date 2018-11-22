import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuario-lista';
import { Usuario } from '../classes/usuario';

export const conectarCliente = ( cliente: Socket ) => {
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar(usuario);
}

export const usuariosConectados = new UsuarioLista();

export const desconectar = (cliente: Socket) => {
    cliente.on('disconnect', () => {
        usuariosConectados.borrarUsuario(cliente.id);
    });
}

// Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', ( payload: { de: string, cuerpo: string } ) => {
        console.log('Mensaje recibido', payload);
        io.emit('mensaje-nuevo', payload);
    });
}

// Escuchar Configurar Usuario
export const configuracion = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('configurar-usuario', ( payload: {nombre: string}, callback: Function ) => {

        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );

        callback({
            ok: true,
            usuario: `Usuario ${ payload.nombre }, configurado`

        });

    });
}