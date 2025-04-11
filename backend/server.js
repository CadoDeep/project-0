import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "connect.env" }); // Load the env file named "connect.env"

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Ensure MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in connect.env!");
  process.exit(1);
}

// ✅ Connect to MongoDB (database: CadoDeep)
mongoose
  .connect(process.env.MONGO_URI, { dbName: "CadoDeep" })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Cadet Schema (fields as stored in your collection)
// Update the schema to match the nested structure
const CadetDataSchema = new mongoose.Schema({
  regimentalNo: String,
  rank: String,
  name: String,
  platoon: String,
  credit: Number,
  bio: String,
});

const CadetSchema = new mongoose.Schema({
  cadets: [CadetDataSchema],
});

// Update the model
const Cadet = mongoose.model("Cadets", CadetSchema, "Cadets");

// ✅ Login Route – Uses `name` as username and `regimentalNo` as password
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login Attempt for:", username);

  try {
    // Find document containing cadets array
    const document = await Cadet.findOne();
    if (!document) {
      console.log("❌ No cadet document found in DB.");
      return res.status(400).json({ message: "Database error" });
    }

    // Find cadet in the cadets array
    const cadet = document.cadets.find((c) => c.name === username);

    if (!cadet) {
      console.log("❌ Cadet not found in DB.");
      return res.status(400).json({ message: "Cadet not found" });
    }

    // Check password (regimental number)
    if (password !== cadet.regimentalNo) {
      console.log("❌ Invalid password attempt.");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { regimentalNo: cadet.regimentalNo },
      "yourSecretKey",
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful for:", username);
    res.json({ message: "Login successful", token, cadet });
  } catch (error) {
    console.error("❌ Error in login route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Fetch Cadets Route
// Add this helper function after your schemas
// Helper function for regimental number interpretation
const interpretRegimentalNo = (regNo) => {
  const parts = {
    year: `20${regNo.substring(2, 4)}`,
    gender: regNo.substring(4, 7) === 'SDA' ? 'Male' : 'Female'
  };
  return parts;
};

// Modify the cadets route to include interpretation
app.get("/cadets", async (req, res) => {
  try {
    console.log("🔍 Attempting to fetch cadets...");
    const result = await Cadet.find();
    const cadets = result[0]?.cadets || [];

    // Add interpretation to each cadet
    const cadetsWithDetails = cadets.map(cadet => {
      const interpretation = interpretRegimentalNo(cadet.regimentalNo);
      return {
        ...cadet.toObject(),
        enrollmentYear: interpretation.year,
        gender: interpretation.gender
      };
    });

    // Console logging with simplified details
    console.log("\n📋 CADET DATABASE RECORDS 📋");
    console.log("================================");
    cadetsWithDetails.forEach((cadet, index) => {
      console.log(`\nCADET #${index + 1}`);
      console.log("----------------");
      console.log(`Name: ${cadet.name}`);
      console.log(`Rank: ${cadet.rank}`);
      console.log(`Regimental No: ${cadet.regimentalNo}`);
      console.log(`Enrollment Year: ${cadet.enrollmentYear}`);
      console.log(`Gender: ${cadet.gender}`);
      console.log(`Platoon: ${cadet.platoon}`);
      console.log(`Credit Points: ${cadet.credit}`);
      console.log(`Bio: ${cadet.bio}`);
    });
    console.log("\n================================\n");

    res.json(cadetsWithDetails);

  } catch (err) {
    console.error("❌ ERROR Fetching Cadets:", err);
    res.status(500).json({ error: "Failed to fetch cadets" });
  }
});

// ✅ Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
