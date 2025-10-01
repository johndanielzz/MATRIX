const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/User");
const Message = require("./models/Message");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error(err));

// REGISTER
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({ username, email, password: hashedPassword });
    res.json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ message: "Login successful", token, user });
});

// FRIENDS LIST
app.get("/api/users", async (req, res) => {
  const users = await User.find({}, "-password");
  res.json(users);
});

// MESSAGES
app.post("/api/messages", async (req, res) => {
  const { sender, receiver, text } = req.body;
  const msg = await Message.create({ sender, receiver, text });
  res.json(msg);
});

app.get("/api/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 }
    ]
  }).sort({ createdAt: 1 });
  res.json(messages);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
