const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Function to get a random image from JSON
const getRandomImage = (folder, category) => {
    const jsonPath = path.join(__dirname, folder, `${category}.json`);
    
    if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        return data[Math.floor(Math.random() * data.length)];
    }
    
    return null;
};

// Anime Endpoint: `/api/anime/:category`
app.get("/api/anime/:category", async (req, res) => {
    const category = req.params.category;
    const imageUrl = getRandomImage("anime", category);

    if (!imageUrl) {
        return res.status(404).json({ error: "Category not found" });
    }

    try {
        const response = await axios.get(imageUrl, { responseType: "stream" });

        res.setHeader("Content-Type", response.headers["content-type"]);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch image" });
    }
});

// NSFW Endpoint: `/api/nsfw/:category`
app.get("/api/nsfw/:category", async (req, res) => {
    const category = req.params.category;
    const imageUrl = getRandomImage("nsfw", category);

    if (!imageUrl) {
        return res.status(404).json({ error: "Category not found" });
    }

    try {
        const response = await axios.get(imageUrl, { responseType: "stream" });

        res.setHeader("Content-Type", response.headers["content-type"]);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch image" });
    }
});

// Start server (for local testing)
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
