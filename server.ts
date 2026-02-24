import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("osint.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    query TEXT,
    results TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Phone Lookup Endpoint
  app.post("/api/lookup/phone", async (req, res) => {
    const { number } = req.body;
    if (!number) return res.status(400).json({ error: "Phone number is required" });

    try {
      const results: any = {};

      // NumLookup API
      if (process.env.NUMLOOKUP_API_KEY) {
        try {
          const resp = await axios.get(`https://api.numlookupapi.com/v1/validate/${number}?apikey=${process.env.NUMLOOKUP_API_KEY}`);
          results.numlookup = resp.data;
        } catch (e) { console.error("NumLookup error", e); }
      }

      // Abstract API
      if (process.env.ABSTRACT_API_KEY) {
        try {
          const resp = await axios.get(`https://phonevalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&phone=${number}`);
          results.abstract = resp.data;
        } catch (e) { console.error("Abstract error", e); }
      }

      // Veriphone API
      if (process.env.VERIPHONE_API_KEY) {
        try {
          const resp = await axios.get(`https://api.veriphone.io/v2/verify?key=${process.env.VERIPHONE_API_KEY}&phone=${number}`);
          results.veriphone = resp.data;
        } catch (e) { console.error("Veriphone error", e); }
      }

      // Save to DB
      db.prepare("INSERT INTO searches (type, query, results) VALUES (?, ?, ?)").run("phone", number, JSON.stringify(results));

      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to perform phone lookup" });
    }
  });

  // Email Lookup Endpoint
  app.post("/api/lookup/email", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
      const results: any = {};

      // Hunter.io
      if (process.env.HUNTERIO_API_KEY) {
        try {
          const resp = await axios.get(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.HUNTERIO_API_KEY}`);
          results.hunter = resp.data;
        } catch (e) { console.error("Hunter error", e); }
      }

      // Abstract Email Validation
      if (process.env.ABSTRACT_API_KEY) {
        try {
          const resp = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`);
          results.abstract = resp.data;
        } catch (e) { console.error("Abstract Email error", e); }
      }

      db.prepare("INSERT INTO searches (type, query, results) VALUES (?, ?, ?)").run("email", email, JSON.stringify(results));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to perform email lookup" });
    }
  });

  // IP/Geolocation Lookup
  app.post("/api/lookup/ip", async (req, res) => {
    const { ip } = req.body;
    if (!ip) return res.status(400).json({ error: "IP address is required" });

    try {
      const results: any = {};
      
      // IPGeolocation.io
      if (process.env.IPGEOLOCATION_API_KEY) {
        try {
          const resp = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEOLOCATION_API_KEY}&ip=${ip}`);
          results.geo = resp.data;
        } catch (e) { console.error("IPGeo error", e); }
      }

      db.prepare("INSERT INTO searches (type, query, results) VALUES (?, ?, ?)").run("ip", ip, JSON.stringify(results));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to perform IP lookup" });
    }
  });

  // History Endpoint
  app.get("/api/history", (req, res) => {
    const history = db.prepare("SELECT * FROM searches ORDER BY timestamp DESC LIMIT 50").all();
    res.json(history);
  });

  // MAC Lookup
  app.post("/api/lookup/mac", async (req, res) => {
    const { mac } = req.body;
    if (!mac) return res.status(400).json({ error: "MAC address is required" });

    try {
      const results: any = {};
      if (process.env.MACVENDORS_API_KEY) {
        try {
          const resp = await axios.get(`https://api.macvendors.com/v1/${mac}`, {
            headers: { Authorization: `Bearer ${process.env.MACVENDORS_API_KEY}` }
          });
          results.vendor = resp.data;
        } catch (e) { console.error("MAC error", e); }
      }
      db.prepare("INSERT INTO searches (type, query, results) VALUES (?, ?, ?)").run("mac", mac, JSON.stringify(results));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to perform MAC lookup" });
    }
  });

  // Social Recon (Placeholder for complex scraping, but can do basic username check)
  app.post("/api/lookup/social", async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username is required" });

    try {
      // In a real app, we'd use something like Sherlock or a dedicated API
      // For now, we'll simulate a scan of popular platforms
      const platforms = ["twitter", "instagram", "facebook", "github", "linkedin", "tiktok"];
      const results = platforms.map(p => ({
        platform: p,
        url: `https://${p}.com/${username}`,
        status: "potential_match"
      }));

      db.prepare("INSERT INTO searches (type, query, results) VALUES (?, ?, ?)").run("social", username, JSON.stringify(results));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to perform social recon" });
    }
  });

  // Google Dorking Generator
  app.post("/api/tools/dork", (req, res) => {
    const { query, type } = req.body;
    let dorks = [];
    
    if (type === "email") {
      dorks = [
        `site:linkedin.com "${query}"`,
        `site:facebook.com "${query}"`,
        `site:twitter.com "${query}"`,
        `site:pastebin.com "${query}"`,
        `filetype:pdf "${query}"`
      ];
    } else if (type === "phone") {
      dorks = [
        `"${query}"`,
        `site:facebook.com "${query}"`,
        `site:whatsapp.com "${query}"`,
        `site:telegram.me "${query}"`
      ];
    }

    res.json({ dorks });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
