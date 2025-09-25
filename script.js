console.log("java script");

let currentFolder;
let audio = new Audio();
let currentBtn = null;
let songs = [];

// Extract song names (remove extensions, decode URI)
function extractSongName(url) {
    return decodeURIComponent(url.split("/").pop())
        .replace(/\.(mp3|webm)$/i, "")
        .trim();
}

// Fetch songs from a given folder
async function getSongs(folder) {
    currentFolder = folder;

    let a = await fetch(`/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let aTags = div.getElementsByTagName("a");
    songs = [];

    for (let element of aTags) {
        if (["webm", "mp3"].some(ext => element.href.endsWith(ext))) {
            songs.push({
                url: element.href, // full URL
                name: extractSongName(element.href)
            });
        }
    }

    let songList = document.querySelector(".song-pl");
    songList.innerHTML = "";

    for (const [index, song] of songs.entries()) {
        let div = document.createElement("div");
        div.className = "song";
        div.innerHTML = `
            <img width="30" height="30" class="invert" src="asssets/music-note-circle-svgrepo-com.svg">
            <div class="song-pl-info"><span>${song.name}</span></div>
            <div class="play-btn-pl">
                <img width="30" height="30" class="invert pl-btn" src="asssets/play-button-svgrepo-com.svg">
            </div>
        `;

        let playBtn = div.querySelector(".play-btn-pl");
        let playIcon = playBtn.querySelector("img");

        playBtn.addEventListener("click", () => {
            let songInfo = document.querySelector(".info-text");

            if (audio.src === song.url && !audio.paused) {
                audio.pause();
                playIcon.src = "asssets/play-button-svgrepo-com.svg";
                seekplay.src = "asssets/play-button-svgrepo-com.svg";
                currentBtn = null;
            } else {
                if (currentBtn) {
                    currentBtn.querySelector("img").src = "asssets/play-button-svgrepo-com.svg";
                }
                audio.src = song.url;
                audio.play();

                playIcon.src = "asssets/pause-button-svgrepo-com.svg";
                seekplay.src = "asssets/pause-button-svgrepo-com.svg";

                songInfo.textContent = "Playing : " + song.name;
                currentBtn = playBtn;
            }
        });

        songList.appendChild(div);
    }
    return songs;
}

// Format seconds -> mm:ss
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// Fetch all albums (folders in /songs)
async function getAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);

    let cardContainer = document.querySelector(".card-container");

    for (let element of array) {
        if (element.href.includes("/songs/") && !element.href.endsWith("../")) {
            let folder = element.href.split("/songs/").pop().replace(/\/$/, ""); // clean

            try {
                let info = await fetch(`songs/${folder}/info.json`);
                let response = await info.json();

                cardContainer.insertAdjacentHTML("beforeend", `
                    <div class="card" data-folder="songs/${folder}">
                        <img width="180" height="170" src="asssets/card-img.jpg" alt="" class="card-img">
                        <div class="card-play-btn">
                            <img width="20" height="20" src="asssets/play-1001-svgrepo-com.svg" alt="play">
                        </div>
                        <div class="card-text">
                            <h3 class="album-name">${response.title}</h3>
                            <p>${response.description}</p>
                        </div>
                    </div>
                `);
            } catch (err) {
                console.warn("Missing info.json for", folder);
            }
        }
    }

    let cards = Array.from(document.getElementsByClassName("card"));
    for (const element of cards) {
        element.addEventListener("click", async (item) => {
            let folder = item.currentTarget.dataset.folder;
            songs = await getSongs(folder);
        });
    }
}

// Main app logic
async function main() {
    await getAlbums();

    // Audio ended
    audio.addEventListener("ended", () => {
        if (currentBtn) {
            currentBtn.querySelector("img").src = "asssets/play-button-svgrepo-com.svg";
            currentBtn = null;
        }
    });

    // Timer + progress bar
    audio.addEventListener("timeupdate", () => {
        document.querySelector(".timer").textContent =
            `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;

        document.querySelector(".dot").style.left =
            (audio.currentTime / audio.duration) * 100 + "%";
    });

    document.querySelector(".time-bar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width);
        document.querySelector(".dot").style.left = (percent * 100) + "%";
        audio.currentTime = audio.duration * percent;
    });

    // Volume controls
    const volumeSlider = document.getElementById("volume-range");
    let volumeSVG = document.getElementById("volume-svg");
    let lastVolume = volumeSlider.value;

    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value;
        volumeSVG.src = audio.volume == 0
            ? "asssets/volume-xmark-svgrepo-com.svg"
            : "asssets/volume-max-svgrepo-com.svg";
    });

    volumeSVG.addEventListener("click", () => {
        if (audio.volume > 0) {
            lastVolume = audio.volume;
            audio.volume = 0;
            volumeSlider.value = 0;
            volumeSVG.src = "asssets/volume-xmark-svgrepo-com.svg";
        } else {
            audio.volume = lastVolume || 1;
            volumeSlider.value = audio.volume;
            volumeSVG.src = "asssets/volume-max-svgrepo-com.svg";
        }
    });

    // Controls
    let seeknext = document.getElementById("next-btn");
    let seekprev = document.getElementById("previous-btn");
    seekplay = document.getElementById("play-btn");

    seekplay.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            seekplay.src = "asssets/pause-button-svgrepo-com.svg";
        } else {
            audio.pause();
            seekplay.src = "asssets/play-button-svgrepo-com.svg";
        }
    });

    // Previous
    seekprev.addEventListener("click", () => {
        if (!songs.length) return;

        let currentIndex = songs.findIndex(s => s.url === audio.src);
        if (currentIndex === -1) currentIndex = 0;

        let prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        let prevSong = songs[prevIndex];

        if (currentBtn) {
            currentBtn.querySelector("img").src = "asssets/play-button-svgrepo-com.svg";
        }

        audio.src = prevSong.url;
        audio.play();

        let allSongs = document.querySelectorAll(".song");
        let targetBtn = allSongs[prevIndex].querySelector(".play-btn-pl");
        let playIcon = targetBtn.querySelector("img");

        playIcon.src = "asssets/pause-button-svgrepo-com.svg";
        seekplay.src = "asssets/pause-button-svgrepo-com.svg";

        document.querySelector(".info-text").textContent =
            "Playing : " + prevSong.name;

        currentBtn = targetBtn;
    });

    // Next
    seeknext.addEventListener("click", () => {
        if (!songs.length) return;

        let currentIndex = songs.findIndex(s => s.url === audio.src);
        if (currentIndex === -1) currentIndex = 0;

        let nextIndex = (currentIndex + 1) % songs.length;
        let nextSong = songs[nextIndex];

        if (currentBtn) {
            currentBtn.querySelector("img").src = "asssets/play-button-svgrepo-com.svg";
        }

        audio.src = nextSong.url;
        audio.play();

        let allSongs = document.querySelectorAll(".song");
        let targetBtn = allSongs[nextIndex].querySelector(".play-btn-pl");
        let playIcon = targetBtn.querySelector("img");

        playIcon.src = "asssets/pause-button-svgrepo-com.svg";
        seekplay.src = "asssets/pause-button-svgrepo-com.svg";

        document.querySelector(".info-text").textContent =
            "Playing : " + nextSong.name;

        currentBtn = targetBtn;
    });
}

main();
