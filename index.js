require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= MONGODB =================
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    console.log("✅ MongoDB Connected");
    db = client.db("flyBook");
  }
  return db;
}

// ================= ROUTES =================

// Health check
app.get("/", (req, res) => {
  res.send("🚀 FlyBook API is running");
});

// ---------- ALL PACKAGES ----------
app.get("/allpackge", async (req, res) => {
  try {
    const database = await connectDB();
    const data = await database.collection("allpackge").find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("All packages error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/allpackge/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid package ID" });
    }

    const database = await connectDB();
    const data = await database
      .collection("allpackge")
      .findOne({ _id: new ObjectId(id) });

    if (!data) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Single package error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- GENERAL PACKAGE ----------
app.get("/packge", async (req, res) => {
  try {
    const database = await connectDB();
    const data = await database.collection("packge").find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Packge error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/packge/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid package ID" });
    }

    const database = await connectDB();
    const data = await database
      .collection("packge")
      .findOne({ _id: new ObjectId(id) });

    if (!data) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Single packge error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- DESTINATIONS ----------
app.get("/destinations", async (req, res) => {
  try {
    const database = await connectDB();
    const data = await database.collection("destinations").find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Destinations error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/destinations/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid destination ID" });
    }

    const database = await connectDB();
    const data = await database
      .collection("destinations")
      .findOne({ _id: new ObjectId(id) });

    if (!data) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Single destination error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOCALHOST =================
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// ================= VERCEL =================
module.exports = app;
