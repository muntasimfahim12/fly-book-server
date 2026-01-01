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

// ================= HEALTH CHECK =================
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

// Get single package
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

// Get single hotel
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

    if (search) {
      query.$or = [
        { from: { $regex: search, $options: "i" } },
        { to: { $regex: search, $options: "i" } },
      ];
    }

    if (stops) {
      query.stops = { $in: stops.split(",") };
    }

    if (cabin) {
      query.class = cabin;
    }

    const flights = await database
      .collection("flights")
      .find(query)
      .sort({ price: 1 })
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
// Create new flight
app.post("/flights", async (req, res) => {
  try {
    const database = await connectDB();
    const flight = req.body;

    flight.status = flight.status || "Active";
    flight.createdAt = new Date();

    const result = await database.collection("flights").insertOne(flight);
    res.status(201).json(result);
  } catch (error) {
    console.error("Create flight error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update flight
app.put("/flights/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid flight ID" });
    }

    const database = await connectDB();
    const updatedFlight = req.body;

    const result = await database.collection("flights").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFlight }
    );

    res.status(200).json({ message: "Flight updated", result });
  } catch (error) {
    console.error("Update flight error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});



app.delete("/flights/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid flight ID" });
    }

    const database = await connectDB();
    const result = await database
      .collection("flights")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Flight not found" });
    }

    res.status(200).json({ message: "Flight deleted successfully" });
  } catch (error) {
    console.error("Delete flight error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});




// ================= LOCAL SERVER =================
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// ================= VERCEL EXPORT =================
module.exports = app;
