import express from "express";
import App from "./App";

type Plugin = express.RequestHandler;
const createPlugin = (path: string, plugin: Plugin) => ({ path, plugin });
const createRouter = (path: string, router: express.Router) => ({ path, router });
const createSetter = (key: string, val: any) => ({ key, val });

export { App, createPlugin, createRouter, createSetter };