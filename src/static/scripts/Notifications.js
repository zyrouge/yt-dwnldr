const notificationsDiv = document.getElementById("notifications");
const icons = {
    "is-danger": "<i class=\"far fa-times-circle\"></i>",
    "default": "<i class=\"fas fa-info-circle\"></i>",
    get "is-warning"() {
        return this["is-danger"];
    } 
}

function notify(type, message) {
    const noti = document.createElement("div");
    noti.classList.add("notification", type, "animate__animated", "animate__fast", "animate__backInRight");
    noti.innerHTML += `${icons[type] || icons.default} ${message}`;
    notificationsDiv.appendChild(noti);
    setTimeout(() => {
        noti.classList.add("animate__fadeOut");
        setTimeout(() => {
            noti.parentNode.removeChild(noti);
        }, 1000);
    }, 5000);
}