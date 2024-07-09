const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose.connect(
  "mongodb+srv://vedantvatsa:0123456789@cluster0.qkoan.mongodb.net/CRUD_Project",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define Post schema and model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  file: String,
  likes: { type: Number, default: 0 },
  comments: [{ text: String }],
});

// Check if the model is already defined to avoid OverwriteModelError
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

// User schema and model for authentication
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Check if the model is already defined to avoid OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Register route - storing passwords in plain text (not recommended for production)
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login route - plain text password verification
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a token (in a real application, use JWT or another method)
    const token = "your-placeholder-token"; // Replace with actual token generation

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Post-related routes (already defined in your code)

// Get all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new post
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.post("/api/posts", upload.single("file"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const file = req.file ? req.file.filename : undefined;

    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Title and content are required fields" });
    }

    const post = new Post({ title, content, file });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Like a post
app.post("/api/posts/like/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.likes += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Comment on a post
app.post("/api/posts/comment/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { text } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({ text });
    await post.save();

    res.json(post);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a post
// Delete a post
app.delete("/api/posts/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await post.deleteOne(); // This should work if `post` is a valid document
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
