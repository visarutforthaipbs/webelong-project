const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const NOTION_TOKEN = "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";
const DATABASE_ID = "21bba403f3d280b386b3dd2cf4780241";
const NOTION_VERSION = "2022-06-28";

// Fetch content from Notion database filtered by province
router.post("/notion-content", async (req, res) => {
  try {
    const { province } = req.body;
    console.log("Received request for province:", province);

    if (!province || typeof province !== 'string' || province.trim() === '') {
      return res.status(400).json({ 
        error: "Province is required", 
        message: "Please provide a valid province name in the request body" 
      });
    }

    // Build the query filter for Notion API
    const filter = {
      and: [
        {
          property: "Status",
          status: {
            equals: "Published",
          },
        },
        {
          property: "Province",
          select: {
            equals: province,
          },
        },
      ],
    };

    const requestBody = {
      filter,
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
      page_size: 20,
    };

    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Notion API error:", response.status, errorText);
      return res.status(response.status).json({
        error: "Failed to fetch from Notion API",
        details: errorText,
      });
    }

    const data = await response.json();

    // Transform the data to make it easier to work with on the frontend
    const transformedResults = data.results.map((page) => ({
      id: page.id,
      properties: {
        "Title/ชื่อเรื่อง/ชื่องาน": page.properties["Title/ชื่อเรื่อง/ชื่องาน"],
        "Brief/โปรย": page.properties["Brief/โปรย"],
        Province: page.properties["Province"],
        Tags: page.properties["Tags"],
        Type: page.properties["Type"],
        "Link/บทความ/YouTube": page.properties["Link/บทความ/YouTube"],
        Status: page.properties["Status"],
        Region: page.properties["Region"],
        "City/เมือง/ตำบล": page.properties["City/เมือง/ตำบล"],
      },
      created_time: page.created_time,
      last_edited_time: page.last_edited_time,
      url: page.url,
    }));

    res.json({
      results: transformedResults,
      has_more: data.has_more,
      next_cursor: data.next_cursor,
      total_count: transformedResults.length,
    });
  } catch (error) {
    console.error("Error fetching Notion content:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Get all available provinces from the database
router.get("/notion-provinces", async (req, res) => {
  try {
    const requestBody = {
      filter: {
        property: "Status",
        status: {
          equals: "Published",
        },
      },
      page_size: 100,
    };

    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Notion API error:", response.status, errorText);
      return res.status(response.status).json({
        error: "Failed to fetch from Notion API",
        details: errorText,
      });
    }

    const data = await response.json();

    // Extract unique provinces
    const provinces = new Set();
    data.results.forEach((page) => {
      if (page.properties.Province?.select?.name) {
        provinces.add(page.properties.Province.select.name);
      }
    });

    res.json({
      provinces: Array.from(provinces).sort(),
      total_content: data.results.length,
    });
  } catch (error) {
    console.error("Error fetching provinces:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

module.exports = router;
