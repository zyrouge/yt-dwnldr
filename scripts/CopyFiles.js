const fs = require("fs-extra");
const path = require("path");

const IGNORED = /.*\.ts$/g;
const INPUT = path.resolve(__dirname, "..", "src");
const OUTPUT = path.resolve(__dirname, "..", "dist");

const start = async () => {
    handleFolder(INPUT);
}

async function handleFolder(dir) {
    const contents = await fs.readdir(dir);
    for (const content of contents) {
        const ndir = path.join(dir, content);
        const info = await fs.lstat(ndir);
        if (info.isDirectory()) await handleFolder(ndir);
        else await handleFile(ndir);
    }
}

async function handleFile(dir) {
    if (IGNORED.test(dir)) return;
    const odir = dir.replace(INPUT, OUTPUT);
    await fs.ensureFile(odir);
    await fs.copyFile(dir, odir);
}

start();