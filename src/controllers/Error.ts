import express from "express";
import { createRouter } from "../core/server";
import StatusCodes from "../utils/StatusCodes";

const router = express.Router();

router.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND).render("Error.ejs", {
        logo: process.env.NAME,
        funding: process.env.FUNDING_URL,
        github: process.env.GITHUB_URL,
        title: `${StatusCodes.NOT_FOUND} - ${process.env.NAME}`,
        description: "Seems like this does not exist.",
        error_code: StatusCodes.NOT_FOUND
    });
});

export default createRouter("/", router);