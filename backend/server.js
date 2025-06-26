const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// MongoDB connection with environment variable fallback
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://visarut298:Popartpop01@migrant-report-2025.ushp3es.mongodb.net/?retryWrites=true&w=majority&appName=migrant-report-2025";

mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
db.on("error", (err) => console.error("MongoDB connection error:", err));
db.once("open", () => console.log("Connected to MongoDB"));

app.use(cors());
app.use(express.json());

app.use("/api/calculate-wage", require("./routes/calculateWage"));
app.use("/api/report", require("./routes/report"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/info", require("./routes/info"));
app.use("/api", require("./routes/notionContent"));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "WeBelong API is running!", status: "healthy" });
});

// Use Railway's PORT environment variable or fallback to 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on port ${PORT}`);
});
