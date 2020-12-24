import express from "express";
import path from "path";
import { createRouter } from "../core/server";
import StatusCodes from "../utils/StatusCodes";

const animate = require.resolve("animate.css");
const bulma = require.resolve("bulma");
const router = express.Router();

router.get("/animate.css", (req, res) => {
    res.status(StatusCodes.SUCCESS).sendFile(animate);
});

router.get("/bulma.css", (req, res) => {
    res.status(StatusCodes.SUCCESS).sendFile(path.resolve(`${bulma}/../css/bulma.min.css`));
});

export default createRouter("/static", router);