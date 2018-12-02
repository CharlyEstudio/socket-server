import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuario-lista';
import { Usuario } from '../classes/usuario';

export const conectarCliente = ( cliente: Socket, io: SocketIO.Server ) => {
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar(usuario);
    io.emit('usuarios-activos', usuariosConectados.getLista());
}

export const usuariosConectados = new UsuarioLista();

export const desconectar = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('disconnect', () => {
        console.log('Clientes Desconectado');
        usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getLista());
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

        io.emit('usuarios-activos', usuariosConectados.getLista());

        callback({
            ok: true,
            usuario: `Usuario ${ payload.nombre }, configurado`

        });

    });
}

// Obtener Usuarios
export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('obtener-usuarios', () => {

        io.emit('usuarios-activos', usuariosConectados.getLista());

    });
};