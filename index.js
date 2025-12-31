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

// ================= PACKAGES =================

// Get all packages
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

// Get single package by ID
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
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= HOTELS =================

// Get all hotels
app.get("/hotels", async (req, res) => {
  try {
    const database = await connectDB();
    const data = await database.collection("hotels").find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Hotels error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get single hotel by ID
app.get("/hotels/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const database = await connectDB();
    const data = await database
      .collection("hotels")
      .findOne({ _id: new ObjectId(id) });

    if (!data) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Single hotel error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= FLIGHTS =================

// Get all flights (with filters)
app.get("/flights", async (req, res) => {
  try {
    const database = await connectDB();

    const { search, stops, cabin } = req.query;

    let query = {};

    // Search by from / to
    if (search) {
      query.$or = [
        { from: { $regex: search, $options: "i" } },
        { to: { $regex: search, $options: "i" } },
      ];
    }

    // Stops filter
    if (stops) {
      query.stops = { $in: stops.split(",") };
    }

    // Cabin class filter
    if (cabin) {
      query.class = cabin;
    }

    const flights = await database
      .collection("flights")
      .find(query)
      .sort({ price: 1 }) // cheapest first
      .toArray();

    res.status(200).json(flights);
  } catch (error) {
    console.error("Flights error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
// Get single flight
app.get("/flights/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid flight ID" });
    }

    const database = await connectDB();
    const flight = await database
      .collection("flights")
      .findOne({ _id: new ObjectId(id) });

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    res.status(200).json(flight);
  } catch (error) {
    console.error("Single flight error:", error);
    res.status(500).json({ message: "Server Error" });
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
