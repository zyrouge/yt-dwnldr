import express from "express";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import { createRouter } from "../core/server";

const router = express.Router();

router.get("/id/:id", async (req, res) => {
    const id = req.params.id;
    if (!id || typeof id !== "string") return res.status(404).json({
        error: "No URL was provided."
    });

    try {
        const isValid = ytdl.validateID(id);
        if (!isValid) return res.json({ no: "pe" });

        const info = await ytdl.getBasicInfo(id);
        const formats = info.formats
            .filter(f => f.fps && f.width && f.height && f.qualityLabel && f.quality)
            .sort((a, b) => b.itag - a.itag);
        const related = info.related_videos;
        return res.render("YouTubeInfo.ejs", {
            logo: process.env.NAME,
            funding: process.env.FUNDING_URL,
            github: process.env.GITHUB_URL,
            title: `${info.videoDetails.title} by ${info.videoDetails.author.name} - ${process.env.NAME}`,
            details: info.videoDetails,
            formats: formats,
            related: related,
            isLive: info.videoDetails.isLiveContent,
            thumbnail: info.videoDetails.thumbnails.sort((a, b) => b.width - a.width)[0] || null
        });
    } catch (err) {
        return res.json({
            error: err.toString()
        });
    }
});

router.get("/download/", async (req, res) => {
    const id = req.query.id;
    if (!id || typeof id !== "string") return res.status(404).json({
        error: "No URL was provided."
    });

    const itag = typeof req.query.itag === "string" ? parseInt(req.query.itag) : null;
    if (typeof itag !== "number") return res.status(404).json({
        error: "No iTag was provided."
    });

    const audioOnly = typeof req.query.audioOnly === "string" && ["true", "false"].includes(req.query.audioOnly) ? req.query.audioOnly === "true" : null;
    if (typeof audioOnly !== "boolean") return res.status(404).json({
        error: "No audioOnly was provided."
    });

    const filename = typeof req.query.filename === "string" ? req.query.filename : `YouTube Video - ${id}`;

    try {
        const isValid = ytdl.validateID(id);
        if (!isValid) return res.json({ no: "pe" });

        const stream = ytdl(id, { format: itag as any });
        if (!stream) return res.json({ error: "Could not generate stream!" });

        const output = ffmpeg(stream);

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
        return res.json({
            error: err.toString()
        });
    }
});

export default createRouter("/youtube", router);