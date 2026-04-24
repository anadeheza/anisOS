# anisOS

# 🖥️ AniOS — A Personal WebOS
A browser-based desktop built from scratch with HTML, CSS, and JavaScript. AniOS is kind of a personal portfolio reimagined as an operating system, with draggable windows, a live taskbar and interactive apps with and a pixel-art aesthetic.

## ✨ Features

### 🗂️ Window Manager
Every section of the site opens as a draggable, closeable window — just like a real OS. Windows are managed through a custom system built with JavaScript and each one can be opened from the bottom dock or by clicking stickers on the desktop.

### 🧩 Desktop & Stickers
The desktop background is a reactive mosaic grid that highlights on hover. Draggable sticker icons sit on top of it, each one opening a different window with personal content: music, sunset photos, my own arcade, and some things about me.

### 📌 Top Bar
- **Live clock and date** — updates every second
- **Weather widget** — fetches real-time weather based on your geolocation using the OpenWeatherMap API
- **System Info button** — displays system/browser information

### 🚀 Bottom Dock
A macOS-style dock at the bottom of the screen gives quick access to all built-in apps:
- 🎧 **Spotify** — embedded playlists
- 🎨 **Pixel Art** — a 30×24 grid pixel editor with color picker and clear button
- 👾 **Space Jump** — a Doodle Jump-style game (see below)
- 🧮 **Calculator**
- 🗒️ **Notes**

### 👾 Space Jump (Mini Game)
A canvas-based platformer game where you jump between platforms trying to reach the highest score. Features include:
- Normal and breaking platforms
- Rocket boosters for extra height
- Camera that follows the player upward
- Screen shake effects on landing
- Wrap-around movement (left/right edges)
- Keyboard (`←` `→` / `A` `D`) and touch controls
- Game over screen with restart on any key press

No frameworks. No build tools. Just vanilla web.

## 📁 Project Structure

```
├── index.html          # Main shell — login screen, desktop, all windows
├── style.css           # All styles for the OS UI
├── scripts.js          # Window manager, mosaic, dock, stickers, weather
└── componentes/
    ├── jump-game.html  # Space Jump standalone page
    ├── jump-game.js    # Game logic (canvas, physics, platforms)
    ├── jump-game.css   # Game styles
    └── assets/
        ├── background.jpg
        ├── platform.png
        └── platBroken.png
```

## 🚀 Getting Started

> ⚠️ The weather widget requires geolocation permission and an internet connection to fetch data from OpenWeatherMap.

If you want to run it locally with full iframe support, use a local server (e.g. VS Code Live Server or `python -m http.server`) to avoid cross-origin restrictions.

---

## 🎮 Space Jump Controls

| Input            | Action                  |
| `←` / `A`        | Move left               |
| `→` / `D`        | Move right              |
| Any key          | Restart after game over |
| Touch left half  | Move left               |
| Touch right half | Move right              |

## 📸 Preview

> <img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/0d05e5c4-b92b-4d4d-b6bb-7dd888a85605" />

Made with 💜 by **Ana**
