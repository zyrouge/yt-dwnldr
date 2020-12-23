import express from "express";
import { createRouter } from "../core/server";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("Home.ejs", {
        logo: process.env.NAME,
        funding: process.env.FUNDING_URL,
        github: process.env.GITHUB_URL,
        title: "Download"
    });
});

export default createRouter("/", router);