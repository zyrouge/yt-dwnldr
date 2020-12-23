import http from "http";
import express from "express";

interface Setter {
    key: string;
    val: any;
};

interface Plugins {
    path: string;
    plugin: express.RequestHandler;
};

interface Controller {
    path: string;
    router: express.Router;
};

interface AppOptions {
    middlewares: express.RequestHandler[];
    controllers: Controller[];
    plugins: Plugins[];
    setters: Setter[];
    host: string;
    port: number;
};

export default class App {
    http: http.Server;
    app: express.Application;
    host: string;
    port: number;

    constructor(config: AppOptions) {
        this.app = express();
        this.http = http.createServer(this.app);
        this.host = config.host;
        this.port = config.port;

        this.middlewares(config.middlewares);
        this.controllers(config.controllers);
        this.plugins(config.plugins);
        this.setters(config.setters);
    }

    private middlewares(middlewares: express.RequestHandler[]) {
        middlewares.forEach(mid => this.app.use(mid));
    }

    private controllers(controllers: Controller[]) {
        controllers.forEach(({ path, router }) => this.app.use(path, router));
    }

    private plugins(plugins: Plugins[]) {
        plugins.forEach(({ path, plugin }) => this.app.use(path, plugin));
    }

    private setters(setters: Setter[]) {
        setters.forEach(({ key, val }) => this.app.set(key, val));
    }

    listen() {
        return this.http.listen(this.port, this.host);
    }
}