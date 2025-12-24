require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // MongoDB connect
    await client.connect();
    console.log("✅ MongoDB Connected");

    // Collections
    const allpackgeCollection = client.db("flyBook").collection("allpackge");
    const destinationsCollection = client.db("flyBook").collection("destinations");
    const packgeCollection = client.db("flyBook").collection("packge");

    // Routes
    // Fetch all packages
    app.get("/allpackge", async (req, res) => {
      try {
        const result = await allpackgeCollection.find({}).toArray();
        if (!result.length) console.warn("⚠️ No data found in allpackge collection");
        res.json(result);
      } catch (err) {
        console.error("Error fetching allpackge:", err);
        res.status(500).json({ error: "Server error fetching allpackge" });
      }
    });

    // Fetch single package by ID
    app.get("/allpackge/:id", async (req, res) => {
      try {
        const id = parseInt(req.params.id); 
        const result = await allpackgeCollection.findOne({ id });
        if (!result) return res.status(404).json({ error: "Package not found" });
        res.json(result);
      } catch (err) {
        console.error("Error fetching package:", err);
        res.status(500).json({ error: "Server error fetching package" });
      }
    });

    // Fetch all destinations
    app.get("/destinations", async (req, res) => {
      try {
        const result = await destinationsCollection.find({}).toArray();
        if (!result.length) console.warn("⚠️ No data found in destinations collection");
        res.json(result);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        res.status(500).json({ error: "Server error fetching destinations" });
      }
    });

    // Fetch single destination by ID
    app.get("/destinations/:id", async (req, res) => {
      try {
        const id = parseInt(req.params.id); // যদি তুমি integer ID use করো
        const result = await destinationsCollection.findOne({ id });
        if (!result) return res.status(404).json({ error: "Destination not found" });
        res.json(result);
      } catch (err) {
        console.error("Error fetching destination:", err);
        res.status(500).json({ error: "Server error fetching destination" });
      }
    });
    // Fetch all destinations
    app.get("/packge", async (req, res) => {
      try {
        const result = await packgeCollection.find({}).toArray();
        if (!result.length) console.warn("⚠️ No data found in packge collection");
        res.json(result);
      } catch (err) {
        console.error("Error fetching packge:", err);
        res.status(500).json({ error: "Server error fetching packge" });
      }
    });

    // Fetch single destination by ID
    app.get("/packge/:id", async (req, res) => {
      try {
        const id = parseInt(req.params.id); // যদি তুমি integer ID use করো
        const result = await packgeCollection.findOne({ id });
        if (!result) return res.status(404).json({ error: "packge not found" });
        res.json(result);
      } catch (err) {
        console.error("Error fetching packge:", err);
        res.status(500).json({ error: "Server error fetching packge" });
      }
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Run the server
run();

app.get("/", (req, res) => {
  res.send("🚀 Server running");
});

app.listen(port, () => {
  console.log(`🔥 Server running on port ${port}`);
});
