# Koko TTS Streamer Voice Page

A static Vue 3 + Vite site that acts as a **voice list + TTS message builder** for streamers using the VoicePuppet app.

Share it with viewers so they can:

- Browse available voices (and their costs)
- Preview voice audio samples
- Build the exact chat / redeem message format your VoicePuppet bot expects

This repo is not the VoicePuppet app itself; it's the companion "voice menu + builder" page.

## Requirements

- Node.js `>=20.19.0` (or `>=22.12.0`), see `package.json` → `engines`

## Quick start (local dev)

```sh
npm install
npm run dev
```

## Forking this for a streamer (guide)

### 1) Customize streamer branding

Common touch points:

- Page title / headline: `src/components/AppHeader.vue`
- "How to use TTS" instructions (bits/points/sub messaging): `src/components/InfoBox.vue`
- Background icon theme: `src/App.vue` (see `backgroundConfig`) + `src/utils/iconRegistry.ts`
- Favicons / public assets: `public/`

### 2) Add or update voices (the important part)

Voices are static data + assets in this repo:

- Metadata: `public/voices.json`
- Preview audio: `public/audio/<voice>.mp3`
- Voice avatars: `public/icons/<voice>.webp`

The UI resolves audio/icons by lowercasing the voice name:

- Audio preview loads `/audio/${voiceName.toLowerCase()}.mp3`
- Avatars load `/icons/${voice.name.toLowerCase()}.webp`

So your filenames must match the **lowercased** voice name exactly (including spaces/punctuation).

`public/voices.json` shape:

```json
{
  "gandalf": {
    "text": "You shall not pass!",
    "cost": 300,
    "priority": true
  }
}
```

Notes:

- The JSON key (e.g. `"gandalf"`) is the voice name shown in the UI and the token used in the builder.
- `text` is the default sample message when the viewer hasn't typed one yet.
- `cost` controls sorting and which voices are eligible at a given bit amount.
- `priority: true` adds a "Priority" badge (these voices get a higher spot in the redeem queue).
- Add the matching `.mp3` + `.webp` for every voice to avoid broken previews/avatars.

### 3) Drop in your exported `config.json` (the source of truth)

Models, effects (and their lane policy), size tokens, bit/redeem/resub values, the
multi-voice cap, stage thresholds, and which chat-command families are enabled all
come from `public/config.json`. Export it from the VoicePuppet app (it ships next to
`voices.json`) and drop it in `public/`; the site reads it via `configStore` and
falls back to a built-in snapshot if it's missing, so nothing breaks without it.

You should not need to hand-edit component code for those values anymore. The builder
outputs the app's real grammar:

- **Cheer**: `Cheer<amount> [voice:model:effect:size] message [voice...] message`
- **Points / Resub**: `[voice:model:effect:size] message [voice...] message`

Only touch code if your bot's tag grammar itself differs (different brackets or
separators), see `src/domain/ttsCommand.ts` (tag/command building) and
`src/components/InfoBox.vue` (explanatory copy).

## Deploying

### Netlify (recommended)

This repo is set up as a SPA with Netlify out of the box:

- Build command: `npm run build`
- Publish dir: `dist`
- SPA routing: `netlify.toml` redirects all routes to `index.html`

### GitHub Pages / other static hosts

If you deploy somewhere else, you may need to adjust Vite's base path:

- `vite.config.ts` uses `/` on Netlify, and defaults to a GitHub Pages-style subpath for production builds.
- For GitHub Pages forks, set the production base path to `/<YOUR_REPO_NAME>/`.

## Useful scripts

```sh
npm run build
npm run preview
npm run type-check
npm run format
npm run test:e2e
```

## IDE

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).
