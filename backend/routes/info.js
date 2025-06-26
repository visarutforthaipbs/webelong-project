const express = require("express");
const router = express.Router();
const data = require("../services/dataLoader");
const path = require("path");
const fs = require("fs");

const MEDIA_LIBRARY_FILE = path.join(__dirname, "../data/media_library.json");
const CENTERS_FILE = path.join(__dirname, "../data/centers.json");

// Specific routes must come first
router.get("/media-library", (req, res) => {
  res.json(JSON.parse(fs.readFileSync(MEDIA_LIBRARY_FILE, "utf-8")));
});

router.get("/centers", (req, res) => {
  res.json(JSON.parse(fs.readFileSync(CENTERS_FILE, "utf-8")));
});

// Generic route comes last
router.get("/:type", (req, res) => {
  const { type } = req.params;
  if (type === "minimumWages" && Array.isArray(data.minimumWages)) {
    // Map min_daily_wage to wage for frontend compatibility
    return res.json(
      data.minimumWages.map((row) => ({
        ...row,
        wage: row.min_daily_wage,
      }))
    );
  }
  if (
    type === "leaveEntitlements" &&
    data.leaveEntitlements &&
    typeof data.leaveEntitlements === "object" &&
    !Array.isArray(data.leaveEntitlements)
  ) {
    // Convert leaveEntitlements object to array of {type, days}
    return res.json(
      Object.entries(data.leaveEntitlements).map(([type, days]) => ({
        type,
        days,
      }))
    );
  }
  if (data[type]) {
    res.json(data[type]);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

module.exports = router;
