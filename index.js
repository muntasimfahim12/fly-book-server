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

// -------- ALL PACKGE --------
app.get("/allpackge", async (req, res) => {
  const database = await connectDB();
  const data = await database.collection("allpackge").find({}).toArray();
  res.json(data);
});

app.get("/allpackge/:id", async (req, res) => {
  const database = await connectDB();
  const id = Number(req.params.id);
  const data = await database.collection("allpackge").findOne({ id });
  if (!data) return res.status(404).json({ message: "Not Found" });
  res.json(data);
});

// -------- DESTINATIONS --------
app.get("/destinations", async (req, res) => {
  const database = await connectDB();
  const data = await database.collection("destinations").find({}).toArray();
  res.json(data);
});

app.get("/destinations/:id", async (req, res) => {
  const database = await connectDB();
  const id = Number(req.params.id);
  const data = await database.collection("destinations").findOne({ id });
  if (!data) return res.status(404).json({ message: "Not Found" });
  res.json(data);
});

// -------- PACKGE --------
app.get("/packge", async (req, res) => {
  const database = await connectDB();
  const data = await database.collection("packge").find({}).toArray();
  res.json(data);
});

app.get("/packge/:id", async (req, res) => {
  const database = await connectDB();
  const id = Number(req.params.id);
  const data = await database.collection("packge").findOne({ id });
  if (!data) return res.status(404).json({ message: "Not Found" });
  res.json(data);
});

// ❗ VERCEL EXPORT
module.exports = app;
