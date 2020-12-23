import express from "express";
import path from "path";
import { createRouter } from "../core/server";

const animate = require.resolve("animate.css");
const bulma = require.resolve("bulma");
const router = express.Router();

router.get("/animate.css", (req, res) => {
    res.sendFile(animate);
});

router.get("/bulma.css", (req, res) => {
    res.sendFile(path.resolve(`${bulma}/../css/bulma.min.css`));
});

export default createRouter("/static", router);