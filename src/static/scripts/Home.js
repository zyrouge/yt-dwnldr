const YOUTUBE_REGEX = /^https?:\/\/(?:(?:www|m)\.)?(?:youtube\.com\/watch(?:\?v=|\?.+?&v=)|youtu\.be\/)([a-z0-9_-]+)$/i;
const YOUTUBE_ID_REP = /^https?:\/\/(?:(?:www|m)\.)?(?:youtube\.com\/watch(?:\?v=|\?.+?&v=)|youtu\.be\/)/i;
const WARNING_CLASS = "is-warning";
const INFO_URL = "/youtube/id/";

const urlInput = document.getElementById("url-box");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", search);

async function search() {
    const url = urlInput.value;
    if (!YOUTUBE_REGEX.test(url)) {
        notify(WARNING_CLASS, "Invalid YouTube video URL");
        urlInput.classList.add(WARNING_CLASS);
        return;
    }
    if (urlInput.classList.contains(WARNING_CLASS)) urlInput.classList.remove(WARNING_CLASS);
    const id = url.replace(YOUTUBE_ID_REP, "");
    location.href = INFO_URL + id;
}