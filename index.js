require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

// MongoDB connect (once)
async function connectDB() {
  if (!db) {
    await client.connect();
    console.log("✅ MongoDB Connected");
    db = client.db("flyBook");
  }
  return db;
}

// ================= ROUTES =================

// Home test
app.get("/", (req, res) => {
  res.send("🚀 FlyBook API is running");
});

// ALL packages
app.get("/allpackge", async (req, res) => {
  const database = await connectDB();
  const collection = database.collection("allpackge");
  const data = await collection.find({}).toArray();
  res.send(data);
});

// SINGLE package by _id
app.get("/allpackge/:id", async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("allpackge");

    const result = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!result) {
      return res.status(404).send(null); // ❌ error throw না
    }

    res.send(result);
  } catch {
    res.status(400).send(null);
  }
});


// -------- DESTINATIONS --------
app.get("/destinations", async (req, res) => {
  const database = await connectDB();
  const data = await database.collection("destinations").find({}).toArray();
  res.json(data);
});

// Single destination fetch - returns all destinations
app.get("/destinations/:id", async (req, res) => {
  const database = await connectDB();
  const data = await database.collection("destinations").find({}).toArray();
  res.json(data);
});

// -------- PACKGE --------
app.get("/packge", async (req, res) => {
  const database = await connectDB();
  const data = await database.collection("packge").find({}).toArray();
  res.json(data);
});

// Single packge fetch - returns all packge
app.get("/packge/:id", async (req, res) => {
  const database = await connectDB();
  const data = await database.collection("packge").find({}).toArray();
  res.json(data);
});

// ❗ VERCEL EXPORT
module.exports = app;
