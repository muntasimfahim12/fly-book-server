require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔑 Mongo client (GLOBAL CACHE)
let cachedClient = null;

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  if (cachedClient) {
    return cachedClient;
  }
  await client.connect();
  console.log("✅ MongoDB Connected");
  cachedClient = client;
  return client;
}

async function run() {
  try {
    const dbClient = await connectDB();

    const db = dbClient.db("flyBook");
    const allpackgeCollection = db.collection("allpackge");
    const destinationsCollection = db.collection("destinations");
    const packgeCollection = db.collection("packge");

    // 🔹 allpackge
    app.get("/allpackge", async (req, res) => {
      try {
        const result = await allpackgeCollection.find({}).toArray();
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: "Server error fetching allpackge" });
      }
    });

    app.get("/allpackge/:id", async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const result = await allpackgeCollection.findOne({ id });
        if (!result) return res.status(404).json({ error: "Not found" });
        res.json(result);
      } catch {
        res.status(500).json({ error: "Server error" });
      }
    });

    // 🔹 destinations
    app.get("/destinations", async (req, res) => {
      try {
        const result = await destinationsCollection.find({}).toArray();
        res.json(result);
      } catch {
        res.status(500).json({ error: "Server error fetching destinations" });
      }
    });

    app.get("/destinations/:id", async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const result = await destinationsCollection.findOne({ id });
        if (!result) return res.status(404).json({ error: "Not found" });
        res.json(result);
      } catch {
        res.status(500).json({ error: "Server error" });
      }
    });

    // 🔹 packge
    app.get("/packge", async (req, res) => {
      try {
        const result = await packgeCollection.find({}).toArray();
        res.json(result);
      } catch {
        res.status(500).json({ error: "Server error fetching packge" });
      }
    });

    app.get("/packge/:id", async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const result = await packgeCollection.findOne({ id });
        if (!result) return res.status(404).json({ error: "Not found" });
        res.json(result);
      } catch {
        res.status(500).json({ error: "Server error" });
      }
    });

  } catch (err) {
    console.error("❌ DB Error:", err);
  }
}

run();

// Root test
app.get("/", (req, res) => {
  res.send("🚀 Server running");
});

// ✅ Localhost only
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`🔥 Server running on port ${port}`);
  });
}

// ✅ Vercel export
module.exports = app;
