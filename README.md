# Spotify Clone - Web Music Player

A responsive web-based music player inspired by the Spotify interface. This project dynamically loads albums and songs, providing a seamless playback experience.

## Live Demo

https://henry-150.github.io/music-player-spotify/

---

## About The Project

This project is a front-end implementation of a music player that mimics the core functionalities of Spotify's web player. It's built with vanilla HTML, CSS, and JavaScript, focusing on dynamic content loading and interactive user controls. The application fetches album and song data from local JSON files, populates the UI, and provides a complete set of controls for audio playback.

---

## Features

- **Dynamic Album Loading**: Automatically fetches album data from `info.json` files and displays them as interactive cards.
- **Playlist Management**: Clicking an album card loads the corresponding songs into the playlist view.
- **Full Playback Controls**:
    - Play, Pause, Next, and Previous song functionality.
    - An interactive seek bar to jump to any part of the song.
    - A volume slider and mute button.
- **Real-time UI Updates**:
    - The currently playing song's name is displayed.
    - Play/Pause icons are updated across the app (in the playlist and the main controls).
    - A live timer shows the current playback time and total duration.
- **Modern UI/UX**:
    - A clean, dark-themed design inspired by Spotify.
    - Hover animations and a responsive layout that adapts to different screen sizes.
    - Custom-styled scrollbars for a consistent look.

---

## Built With

- **HTML5**: For the structure and layout of the application.
- **CSS3**: For all styling, animations, and responsive design.
- **JavaScript (ES6+)**: For all logic, including fetching data, DOM manipulation, and audio control.

---

## Project Structure

The project is organized to be easily extendable. New music can be added without changing the core code.

```
.
├── asssets/              # Contains all UI icons (SVG)
├── songs/
│   ├── [artist_name]/    # Folder for each artist/album
│   │   ├── cover.jpg     # Album cover image
│   │   ├── info.json     # Album metadata (title, description, song list)
│   │   └── song1.mp3     # Audio files
│   └── ...
├── index.html            # Main HTML file
├── script.js             # Core application logic
├── style.css             # Main styling
└── utility.css           # Utility classes and custom styles
```

To add a new album, simply create a new folder inside `/songs`, add your `cover.jpg`, audio files, and a corresponding `info.json` with the song filenames. The app will automatically detect and display it.

---

## Author

- **henrybhai**

