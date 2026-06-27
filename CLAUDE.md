# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

```bash
# Frontend dev server only
npm run dev

# Tauri dev mode (frontend + Rust backend)
npm run tauri dev

# TypeScript type check
npx tsc --noEmit

# Rust type check
cd src-tauri && cargo check

# Production build
npm run tauri build
```

## Architecture

**Stack**: Tauri v2 + React 19 + TypeScript + Vite + Tailwind CSS v4 + Zustand v5 + shadcn/ui

**Data flow**: React (UI) → `invoke()` IPC → Rust `#[tauri::command]` → spawns `java -jar sfinder.jar <command> <args>` → captures stdout/stderr + output files → returns `SfinderOutput` to frontend

### Key directories

| Dir | Purpose |
|-----|---------|
| `src/stores/` | Zustand stores — `fumenStore` (field editor state, patterns, undo/redo), `appStore` (settings, Java/JAR status, persist), `commandStore` (execution state + history) |
| `src/components/fumen/` | Visual fumen editor — `FieldGrid` (10×N interactive grid with drag paint, right-click erase, Ctrl+Click row fill), `PiecePalette`, `FumenToolbar`, `PageNavigator` |
| `src/components/forms/` | Shared form components — `PatternInput` (presets + raw text), `CommandOptions` (hold/drop/kicks/split), `CommandRunner` (execute/cancel) |
| `src/components/output/` | Result rendering — `OutputViewer` (tabbed: Summary/Solutions/Stdout/Stderr), `PercentDisplay` (SVG ring), `SolutionTable` (parsed fumen links + View buttons) |
| `src/routes/` | Route pages. Only **Percent** and **Path** are fully functional. Setup/Ren/Spin/Cover are WIP placeholders |
| `src/i18n/` | `translations.ts` (en + zh dictionaries), `useTranslation.ts` (useT hook via appStore language) |
| `src-tauri/src/` | Rust backend — `commands.rs` (IPC commands), `sfinder.rs` (JAR spawn engine, arg builder, output capture) |

### Fumen editor

- `tetris-fumen` npm package — `Field.create()`, `field.at(x,y)` returns `PieceType` (`'I'|'L'|'O'|'Z'|'T'|'J'|'S'|'X'|'_'`), `field.set(x,y,type)`, `encoder.encode(pages)`, `decoder.decode(str)`
- Field dimensions: 10 cols × 23 rows (y=0..22), garbage row y=-1
- `fumenStore` uses `field.copy()` for state mutations — **never** use `structuredClone()` on Field instances (private fields get corrupted)
- Column/row labels are **1-indexed** in display, 0-indexed in `field.at()`
- `visibleRows` prop on FieldGrid controls how many rows from bottom to show

### sfinder CLI integration

- Only 2 commands fully wired: `percent` and `path`
- `path` uses `--format html` (parse fumen from `<a href>` tags)
- `percent` uses no format flag (default output)
- `build_cli_args()` in Rust builds the argument vector — command name first, then flags
- Output files go to `output/` relative to CWD (which is `src-tauri/` in dev mode)
- `find_output_files()` searches for `.html`, `_unique.html`, `_minimal.html`, `.csv`, `.txt`

### Output parsing

- `parseSolutions(html)` — finds `<a href="...v115@CODE">TEXT</a>` links, splits by `<h2>` sections (falls back to "All solutions" markers)
- `parsePercent(stdout)` — regex for `XX.X% [(N/M)]` patterns
- "All solutions" fumen links (combined multi-page fumens) captured separately for View buttons

### State sharing

- `fumenStore` shared across all command pages — field grid + patterns + clearLine persist when navigating between commands
- `appStore` uses Zustand `persist` middleware (localStorage key: `sfinder-gui-settings`)
- `useSfinderCommand()` hook merges settings paths (javaPath, jarPath) into command config before invoking

### Known command constraints

| Command | Supported flags | Unsupported |
|---------|----------------|-------------|
| percent | hold, drop, kicks, clearLine, page | format |
| path | hold, drop, kicks, clearLine, page, split, format | — |
| setup | (WIP — untested) | — |
| spin | (WIP — no hold, no drop, no kicks) | — |

### Tauri v2 specifics

- Capability permissions: `core:webview:allow-create-webview-window` needed for popup viewer
- Shell plugin scope: `java` command with `args: true` in capabilities
- `app.shell()` requires `use tauri_plugin_shell::ShellExt`
- **No `MutexGuard` across `.await`** — extract values before async loops
- Theme: `html.light` / `html.dark` class toggled in App.tsx `useEffect`
