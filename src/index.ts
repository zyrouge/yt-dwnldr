import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { App, createPlugin, createSetter } from "./core/server";
import Logger from "./utils/Logger";

import MainController from "./controllers/Main";
import YouTubeController from "./controllers/YouTube";
import StaticController from "./controllers/Static";
import ErrorController from "./controllers/Error";

dotenv.config({ path: `${__dirname}/../.env.${process.env.NODE_ENV}` });
process.env.BASE_URL = `${process.env.NODE_ENV === "production" ? "https" : "http"}://${process.env.HOST}:${process.env.PORT}`;

const pkg = require("../package.json");
process.env.GITHUB_URL = pkg.repository.url.replace("git+", "");
process.env.FUNDING_URL = pkg.funding[0].url;

const init = async () => {
    checkEnvs("HOST", "PORT");
    const server = new App({
        host: process.env.HOST!,
        port: parseInt(process.env.PORT!),
        middlewares: [
            express.json(),
            express.urlencoded({ extended: true }),
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                        "img-src": ["'self'", "i.ytimg.com"]
                    }
                }
            })
        ],
        controllers: [
            MainController,
            YouTubeController,
            StaticController,
            ErrorController
        ],
        plugins: [
            createPlugin("/static", express.static(__dirname + "/static"))
        ],
        setters: [
            createSetter("view engine", "ejs"),
            createSetter("views", __dirname + "/views")
        ]
    });

    server.listen();
    Logger.log(`Serving at ${process.env.BASE_URL}`);
}

init();

function checkEnvs(...keys: string[]) {
    keys.forEach(key => {
        if (!process.env[key]) {
            Logger.error(`process.env.${key} is missing`);
            process.exit(0);
        }
    })
}