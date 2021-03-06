import express from "express";
import { createRouter } from "../core/server";
import StatusCodes from "../utils/StatusCodes";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(StatusCodes.SUCCESS).render("Home.ejs", {
        logo: process.env.NAME,
        funding: process.env.FUNDING_URL,
        github: process.env.GITHUB_URL,
        title: "YouTube Downloader"
    });
});

export default createRouter("/", router);