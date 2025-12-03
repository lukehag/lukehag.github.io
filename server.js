const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// TEMP storage
let comments = [];

// Routes

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "guestbook.html"));
});

// Get all comments
app.get("/api/comments", (req, res) => {
    res.json(comments);
});

// Post a new comment
app.post("/api/comments", (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === "") {
        return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const newComment = {
        id: Date.now(),
        content,
        createdAt: new Date()
    };

    comments.push(newComment);

    res.json({ message: "Comment added", comment: newComment });
});

const fs = require("fs");
const FAVORITES_FILE = "favorites.json";

if (!fs.existsSync(FAVORITES_FILE)) {
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify({}));
}

const cookieParser=require("cookie-parser");
app.use(cookieParser());

app.get("/api/favorites/:postId", (req, res) => {
    const postId = req.params.postId;
    const data = JSON.parse(fs.readFileSync("favorites.json", "utf8"));

    const count = data[postId]?.count || 0;

    res.json({ favorites: count });
});

// Add a favorite
app.post("/api/favorites/:postId", (req, res) => {
    const postId = req.params.postId;
    const FAVORITES_FILE = "favorites.json";

    const data = JSON.parse(fs.readFileSync(FAVORITES_FILE, "utf8"));

    // If file doesn't track this post yet
    if (!data[postId]) data[postId] = { count: 0, users: [] };

    // Use cookie as user ID
    const userId = req.cookies.userId;

    // If user doesn't have a cookie yet, generate one
    if (!userId) {
        const newUserId = "user-" + Date.now() + "-" + Math.random();
        res.cookie("userId", newUserId, { httpOnly: true });
        data[postId].users.push(newUserId);
        data[postId].count++;
    } else {
        // User already exists — check if they favorited
        if (data[postId].users.includes(userId)) {
            return res.json({
                message: "Already favorited",
                favorites: data[postId].count
            });
        }

        // They haven’t favorited yet → count it
        data[postId].users.push(userId);
        data[postId].count++;
    }

    fs.writeFileSync(FAVORITES_FILE, JSON.stringify(data, null, 2));

    res.json({
        favorites: data[postId].count
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});