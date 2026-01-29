# Koko TTS Streamer Voice Page

Small Vue 3 + Vite site that acts as a **voice list + TTS message builder** for streamers using our TTS app.

It’s meant to be deployed as a static site (Netlify / GitHub Pages / any static host) and shared with viewers so they can:
- Browse available voices (with costs)
- Preview voice audio samples
- Build the exact chat/redeem message format your TTS bot expects

Requires Node.js 20+ (see `package.json` → `engines`).

This repo is **not** the TTS engine/bot itself — it’s the streamer-facing “how to use TTS” page.

## Forking this for any streamer (small guide)

### 1) Fork + run locally

1. Fork the repo on GitHub.
2. Clone your fork and install deps:

```sh
npm install
npm run dev
```

### 2) Customize the streamer branding

Common touch points:
- Page title / headline: `src/components/AppHeader.vue`
- “How to use TTS” copy (bits/points/sub messaging): `src/components/InfoBox.vue`
- Background icon theme: `src/App.vue` (see `backgroundConfig`) + `src/utils/iconRegistry.ts`
- Favicon / public assets: `public/`

### 3) Add/update voices (the important part)

Voices are 100% static data + assets in this repo:
- Metadata: `public/voices.json`
- Preview audio: `public/audio/<voice>.mp3`
- Voice avatars: `public/icons/<voice>.webp`

The UI looks up audio/icons by **lowercasing** the voice name:
- Audio preview loads `/audio/${voiceName.toLowerCase()}.mp3`
- Avatars load `/icons/${voiceName.toLowerCase()}.webp`

So your filenames must match the lowercased voice name *exactly* (including spaces/punctuation).

`public/voices.json` shape:

```json
{
  "gandalf": {
    "text": "You shall not pass!",
    "cost": 300,
    "limited": true
  }
}
```

Notes:
- The JSON key (e.g. `"gandalf"`) becomes the displayed voice name and the token used in the builder.
- `text` is the default sample message used when the viewer hasn’t typed one yet.
- `cost` controls sorting and which voices are “eligible” at a given bit amount.
- `limited: true` adds a “Limited” badge and sorts limited voices first.
- Make sure you add the matching `.mp3` + `.webp` files for every voice to avoid broken previews/avatars.

### 4) Make sure the command format matches your TTS app

The builder currently generates:
- **Cheer**: `Cheer<amount> [voice:model:effect] message`
- **Points / Resub**: `[voice:model:effect] message`

If your TTS app uses different syntax (different brackets, separators, models/effects, length limits, etc.), update:
- Command generation + options: `src/components/VoiceBuilder.vue` (`generatedCommand`, `modelOptions`, `textEffectOptions`)
- Eligibility cutoffs (bits/points/resub tiers): `src/components/VoiceBuilder.vue` (`bitAmountForGrid`, `tierOptions`)
- Any explanatory copy: `src/components/InfoBox.vue`

### 5) Deploy it (Netlify recommended)

This repo is set up as a SPA with Netlify out of the box:
- Build command: `npm run build`
- Publish dir: `dist`
- SPA routing: `netlify.toml` redirects all routes to `index.html`

If you deploy somewhere else, the only thing you may need to adjust is Vite’s base path:
- `vite.config.ts` uses `/` on Netlify, and a GitHub Pages-style subpath in production otherwise.
- For GitHub Pages forks, update the production base path to `/<YOUR_REPO_NAME>/`.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Format

```sh
npm run format
```
