const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Function to get a random image URL from JSON
const getRandomImage = (category) => {
    const jsonPath = path.join(__dirname, "anime", `${category}.json`);
    
    if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        return data[Math.floor(Math.random() * data.length)];
    }
    
    return null;
};

// API Route to stream the image
app.get("/api/:category", async (req, res) => {
    const category = req.params.category;
    const imageUrl = getRandomImage(category);

    if (!imageUrl) {
        return res.status(404).json({ error: "Category not found" });
    }

    try {
        // Fetch image from URL
        const response = await axios.get(imageUrl, { responseType: "stream" });

        // Set correct content type
        res.setHeader("Content-Type", response.headers["content-type"]);

        // Pipe image to response
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
