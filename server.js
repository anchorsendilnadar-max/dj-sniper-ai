import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Replicate from "replicate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT || 3000);
const MODEL = process.env.REPLICATE_MODEL || "fishaudio/ace-step-1.5";

if (!process.env.REPLICATE_API_TOKEN) {
  console.warn("WARNING: REPLICATE_API_TOKEN is not set. /api/generate will return an error until it is configured.");
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    app: "DJ SNIPER AI",
    realAI: Boolean(process.env.REPLICATE_API_TOKEN),
    model: MODEL
  });
});

app.post("/api/generate", async (req, res) => {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(503).json({
        error: "Real AI is not configured. Add REPLICATE_API_TOKEN to .env and restart the server."
      });
    }

    const {
      title = "DJ SNIPER Song",
      lyrics = "",
      style = "modern electronic music",
      language = "English",
      vocal = "Male",
      mode = "vocals",
      bpm = 128,
      duration = 60,
      versions = 1
    } = req.body || {};

    const isInstrumental =
      mode === "instrumental" || vocal === "Instrumental";

    const safeDuration = Math.max(10, Math.min(Number(duration) || 60, 180));
    const safeBpm = Math.max(30, Math.min(Number(bpm) || 128, 300));

    const prompt = [
      style,
      `${language} music`,
      `${safeBpm} BPM`,
      isInstrumental ? "instrumental" : `${vocal} vocals`,
      "original composition",
      "clear professional mix"
    ].join(", ");

    const finalLyrics = isInstrumental
      ? "[Instrumental]"
      : (String(lyrics).trim() || `[Verse]\n${title}\n\n[Chorus]\nDJ SNIPER AI`);

    const batchSize = Math.max(1, Math.min(Number(versions) || 1, 2));

    const output = await replicate.run(MODEL, {
      input: {
        prompt,
        lyrics: finalLyrics,
        duration: safeDuration,
        bpm: safeBpm,
        batch_size: batchSize,
        audio_format: "mp3"
      }
    });

    const urls = Array.isArray(output)
      ? output.map(x => typeof x === "string" ? x : (x?.url ? x.url() : String(x)))
      : [typeof output === "string" ? output : (output?.url ? output.url() : String(output))];

    res.json({
      mode: "real-ai",
      provider: "Replicate",
      model: MODEL,
      title,
      audioUrl: urls[0],
      audioUrls: urls,
      message: "Real AI music generated successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error?.message || "AI music generation failed."
    });
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`DJ SNIPER AI running at http://localhost:${PORT}`);
});
