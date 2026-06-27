# sfinder-gui

Desktop GUI wrapper for [solution-finder](https://github.com/knewjade/solution-finder) — a Tetris solution searcher. Built with Tauri v2 + React.

![Stack](https://img.shields.io/badge/Tauri-2.0-FFC131?logo=tauri) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript)

## Features

- **Visual fumen editor** — draw Tetris fields on a 10×N grid with drag paint, right-click erase, Ctrl+Click row fill
- **Percent** — calculate Perfect Clear probability with SVG ring display
- **Path** — find all PC solutions, parse fumen codes, view solutions in popup window
- **i18n** — English / 中文
- **Dark / Light / System theme**

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/) 1.94+
- [Java](https://adoptium.net/) 17+ (JDK with `java` on PATH)
- [solution-finder](https://github.com/knewjade/solution-finder) JAR

## Setup

```bash
# Clone
git clone https://github.com/Richard969/sfinder-gui.git
cd sfinder-gui

# Install frontend dependencies
npm install

# Copy sfinder.jar into the project
mkdir -p src-tauri/binaries
cp /path/to/sfinder.jar src-tauri/binaries/
```

## Development

```bash
# Start Tauri dev mode (frontend + Rust backend + hot reload)
npm run tauri dev
```

On first launch, the app auto-detects the bundled `sfinder.jar` in `src-tauri/binaries/`. Java is detected from system PATH. Configure custom paths in **Settings**.

## Build

```bash
# Production build
npm run tauri build
```

Outputs to `src-tauri/target/release/bundle/`.

## Commands

| Command | Status | Description |
|---------|--------|-------------|
| Percent | ✅ | PC probability calculator |
| Path | ✅ | PC solution finder |
| Setup | 🚧 WIP | Target form filler |
| Ren | 🚧 WIP | REN combo continuer |
| Spin | 🚧 WIP | T-spin finder |
| Cover | 🚧 WIP | Coverage analyzer |
