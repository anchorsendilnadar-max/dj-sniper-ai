# DJ SNIPER AI — Real AI Music Backend

This package connects the DJ SNIPER AI frontend to a real music-generation API.

## What is included

- Complete DJ SNIPER AI frontend
- `/api/generate` real AI endpoint
- Replicate integration
- ACE-Step 1.5 music generation
- Lyrics + music-style prompt
- Vocal / instrumental mode
- BPM and duration
- MP3 output URL
- 1–2 generation variations
- Health check at `/api/health`

The selected ACE-Step 1.5 model accepts a music prompt and optional lyrics, including `[Verse]`, `[Chorus]`, and `[Instrumental]` structures. Its current public Replicate schema supports up to 600 seconds, but this app intentionally caps normal requests at 180 seconds for a safer first deployment.

## Setup

1. Install Node.js 20+.
2. Run:
   `npm install`
3. Copy `.env.example` to `.env`.
4. Put your Replicate API token in `.env`:
   `REPLICATE_API_TOKEN=r8_...`
5. Start:
   `npm start`
6. Open:
   `http://localhost:3000`

Never put the Replicate token inside the HTML or Android client. Keep it on the backend.

## Production

For an Android app, point the app's API base URL to your deployed HTTPS backend. Do not ship the secret API token inside the APK.

Real generation uses the Replicate API and therefore requires a Replicate account/token and incurs provider usage charges according to the selected model/provider.
