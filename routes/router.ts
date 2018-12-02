import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { Socket } from 'socket.io';
import { usuariosConectados } from '../sockets/socket';

const router = Router();

router.get('/mensajes', ( req: Request, resp: Response ) => {
    resp.json({
        ok: true,
        mensaje: 'Todo está bien.'
    });
});

// Enviar mensaje de forma global
router.post('/mensajes', ( req: Request, resp: Response ) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;

    server.io.emit('mensaje-nuevo', payload);

    resp.json({
        ok: true,
        cuerpo,
        de
    });
});

// Enviar mensaje de forma privada
router.post('/mensajes/:id', ( req: Request, resp: Response ) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;

    server.io.in( id ).emit('mensaje-privado', payload);

    resp.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});

// Servicio para obtener todos los id's de los usuarios
router.get('/usuarios', ( req: Request, res: Response ) => {
    const server = Server.instance;

    server.io.clients( (err: any, clientes: string[]) => {
        if (err) {
            return res.json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            clientes: clientes
        });
    });
});

// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', (req: Request, res: Response) => {
    
    res.json({
        ok:true,
        clientes: usuariosConectados.getLista()
    });
    
});

export default router;