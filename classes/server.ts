import express from 'express';
import { SERVER_POST } from '../global/environment';

export default class Server {
    public app: express.Application;
    public port: number;

    constructor() {
        this.app = express();
        this.port = SERVER_POST;
    }

    start( callback: Function) {
        this.app.listen( this.port, callback );
    }
}