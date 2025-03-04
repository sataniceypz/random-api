const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Function to get a random image URL from JSON
const getImage = (category, type) => {
    const jsonPath = path.join(__dirname, type, `${category}.json`);

    if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        return data.length > 0 ? data[Math.floor(Math.random() * data.length)] : null;
    }
    return null;
};

// API Route for Anime images
app.get("/api/anime/:category", async (req, res) => {
    const category = req.params.category;
    const imageUrl = getImage(category, "anime");

    if (!imageUrl) {
        return res.status(404).json({ error: "Category not found or no images available" });
    }

    try {
        const response = await axios.get(imageUrl, { responseType: "stream" });

        res.setHeader("Content-Type", response.headers["content-type"]);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch image" });
    }
});

// API Route for NSFW images
app.get("/api/nsfw/:nsf", async (req, res) => {
    const nsf = req.params.nsf;
    const imageUrl = getImage(nsf, "nsfw");

    if (!imageUrl) {
        return res.status(404).json({ error: "Category not found or no images available" });
    }

    try {
        const response = await axios.get(imageUrl, { responseType: "stream" });

        res.setHeader("Content-Type", response.headers["content-type"]);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch image" });
    }
});

// Start server
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
