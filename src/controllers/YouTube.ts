import express from "express";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import { createRouter } from "../core/server";
import Logger from "../utils/Logger";
import StatusCodes from "../utils/StatusCodes";

const ffstatic: string = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffstatic);
const router = express.Router();

router.get("/id/:id", async (req, res) => {
    const id = req.params.id;
    if (!id || typeof id !== "string") return res
        .status(StatusCodes.BAD_REQUEST)
        .render("Error.ejs", {
            logo: process.env.NAME,
            funding: process.env.FUNDING_URL,
            github: process.env.GITHUB_URL,
            title: StatusCodes.BAD_REQUEST,
            description: "Invalid parameter: id",
            error_code: StatusCodes.BAD_REQUEST
        });

    try {
        const isValid = ytdl.validateID(id);
        if (!isValid) return res
            .status(StatusCodes.BAD_REQUEST)
            .render("Error.ejs", {
                logo: process.env.NAME,
                funding: process.env.FUNDING_URL,
                github: process.env.GITHUB_URL,
                title: StatusCodes.BAD_REQUEST,
                description: "Invalid parameter: id",
                error_code: StatusCodes.BAD_REQUEST
            });

        const info = await ytdl.getBasicInfo(id);
        const formats = info.formats
            .filter(f => f.fps && f.width && f.height && f.qualityLabel && f.quality)
            .sort((a, b) => b.itag - a.itag);
        const related = info.related_videos;

        return res
            .status(StatusCodes.SUCCESS)
            .render("YouTubeInfo.ejs", {
                logo: process.env.NAME,
                funding: process.env.FUNDING_URL,
                github: process.env.GITHUB_URL,
                title: `${info.videoDetails.title} by ${info.videoDetails.author.name}`,
                details: info.videoDetails,
                formats: formats,
                related: related,
                isLive: info.videoDetails.isLiveContent,
                thumbnail: info.videoDetails.thumbnails.sort((a, b) => b.width - a.width)[0] || null
            });
    } catch (err) {
        return res
            .status(StatusCodes.SERVER_ERROR)
            .render("Error.ejs", {
                logo: process.env.NAME,
                funding: process.env.FUNDING_URL,
                github: process.env.GITHUB_URL,
                title: StatusCodes.SERVER_ERROR,
                description: err.toString(),
                error_code: StatusCodes.SERVER_ERROR
            });
    }
});

router.get("/download/", async (req, res) => {
    const id = req.query.id;
    if (!id || typeof id !== "string") return res
        .status(StatusCodes.BAD_REQUEST)
        .render("Error.ejs", {
            logo: process.env.NAME,
            funding: process.env.FUNDING_URL,
            github: process.env.GITHUB_URL,
            title: StatusCodes.BAD_REQUEST,
            description: "Invalid parameter: id",
            error_code: StatusCodes.BAD_REQUEST
        });

    const itag = typeof req.query.itag === "string" ? parseInt(req.query.itag) : null;
    if (typeof itag !== "number") return res
        .status(StatusCodes.BAD_REQUEST)
        .render("Error.ejs", {
            logo: process.env.NAME,
            funding: process.env.FUNDING_URL,
            github: process.env.GITHUB_URL,
            title: StatusCodes.BAD_REQUEST,
            description: "Invalid parameter: itag",
            error_code: StatusCodes.BAD_REQUEST
        });

    const audioOnly = typeof req.query.audioOnly === "string" && ["true", "false"].includes(req.query.audioOnly) ? req.query.audioOnly === "true" : null;
    if (typeof audioOnly !== "boolean") return res
        .status(StatusCodes.BAD_REQUEST)
        .render("Error.ejs", {
            logo: process.env.NAME,
            funding: process.env.FUNDING_URL,
            github: process.env.GITHUB_URL,
            title: StatusCodes.BAD_REQUEST,
            description: "Invalid parameter: audioOnly",
            error_code: StatusCodes.BAD_REQUEST
        });

    const filename = typeof req.query.filename === "string" ? req.query.filename : `YouTube Video - ${id}`;

    try {
        const isValid = ytdl.validateID(id);
        if (!isValid) return res
            .status(StatusCodes.BAD_REQUEST)
            .render("Error.ejs", {
                logo: process.env.NAME,
                funding: process.env.FUNDING_URL,
                github: process.env.GITHUB_URL,
                title: StatusCodes.BAD_REQUEST,
                description: "Invalid parameter: id",
                error_code: StatusCodes.BAD_REQUEST
            });

        const stream = ytdl(id, { format: itag as any });
        stream.on("error", (err) => { Logger.error(err); });
        if (!stream) return res
            .status(StatusCodes.BAD_REQUEST)
            .render("Error.ejs", {
                logo: process.env.NAME,
                funding: process.env.FUNDING_URL,
                github: process.env.GITHUB_URL,
                title: StatusCodes.BAD_REQUEST,
                description: "Failed to generate stream",
                error_code: StatusCodes.BAD_REQUEST
            });

        const output = ffmpeg(stream);
        output.on("error", (err) => { Logger.error(err); });

        if (audioOnly) {
            res.setHeader("Content-disposition", `attachment; filename=${filename}.mp3`);
            res.set("Content-Type", "audio/mp3");
            output.noVideo().format("mp3");
        } else {
            res.setHeader("Content-disposition", `attachment; filename=${filename}.mp4`);
            res.set("Content-Type", "video/mp4");
            output.format("mp4");
        }

        output.pipe(res);
    } catch (err) {
        return res
            .status(StatusCodes.SERVER_ERROR)
            .render("Error.ejs", {
                logo: process.env.NAME,
                funding: process.env.FUNDING_URL,
                github: process.env.GITHUB_URL,
                title: StatusCodes.SERVER_ERROR,
                description: err.toString(),
                error_code: StatusCodes.SERVER_ERROR
            });
    }
});

export default createRouter("/youtube", router);
