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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});