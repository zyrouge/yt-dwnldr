import express from "express";
import Logger from "../utils/Logger";

const ExpressLogger: express.RequestHandler = async (req, res, next) => {
    const xForwardedFor = req.headers["x-forwarded-for"];
    const ip = typeof xForwardedFor === "string"
        ? xForwardedFor.replace(/:\d+$/, "")
        : req.connection.remoteAddress;
    
    Logger.custom(Logger.chalk.whiteBright("REQ!"), `Request: ${req.method} ${req.url} from ${ip}`);
    next();
}

export default ExpressLogger;