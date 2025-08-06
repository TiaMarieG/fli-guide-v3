const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models");
const recipeRouter = require("./routes/recipeRouter");
const Parser = require("rss-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5025;

// --- Steam Feed: Configuration & Cache ---
const parser = new Parser();
const STEAM_APP_ID = 2993780;
const FEED_URL = `https://store.steampowered.com/feeds/news/app/${STEAM_APP_ID}/`;
const CACHE_DURATION = 15 * 60 * 1000;
let cache = {
   data: null,
   timestamp: 0,
};

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", recipeRouter);

// --- Steam Feed: API Route ---
app.get("/api/steam-feed", async (req, res) => {
   const now = Date.now();
   // Check for fresh data in cache
   if (cache.data && now - cache.timestamp < CACHE_DURATION) {
      console.log("Serving Steam feed from cache.");
      return res.json({ items: cache.data });
   }
   // If cache is stale, fetch new data
   try {
      console.log("Fetching new data from Steam feed...");
      const feed = await parser.parseURL(FEED_URL);
      const items = feed.items || [];
      // Update cache
      cache = {
         data: items,
         timestamp: now,
      };
      console.log(
         `Successfully fetched and cached ${items.length} Steam items.`
      );
      res.json({ items });
   } catch (error) {
      console.error("Error fetching Steam RSS feed:", error);
      res.status(500).json({ error: "Failed to fetch Steam news" });
   }
});

// Root route for health check
app.get("/", (req, res) => {
   res.send("FLi Guide Backend is running!");
});

// Sync models
db.sequelize
   .sync({ alter: false })
   .then(() => {
      console.log("✅ Database synced");
      app.listen(PORT, "0.0.0.0", () => {
         console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
      });
   })
   .catch((err) => {
      console.error("❌ Failed to sync DB:", err);
   });
