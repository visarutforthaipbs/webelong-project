const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const reportSchema = new mongoose.Schema({
  industry: String,
  employerType: String,
  province: String,
  reportText: String,
  contact: String,
  createdAt: { type: Date, default: Date.now },
});
const Report = mongoose.model("Report", reportSchema);

router.post("/", async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
