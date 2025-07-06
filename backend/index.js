// server.js
const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const socketIo = require("socket.io");
const cors = require("cors");
const Message = require("./models/messageModel.js");
const connectDB = require("./config/db");
const loginRoute = require("./routes/LoginRoute.js");
const solutionsRoute = require("./routes/Solutions.js");
const profileRoute = require("./routes/Profile.js");
const socketHandler = require("./socketHandler");
const User = require("./models/UserModel.js");
const discussionsRoute = require("./routes/Discussions.js");
const contestsRoute = require("./routes/Contests.js");
require("dotenv").config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    origin: "*",
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  next();
});
app.use(express.json());

// routes
app.use("/", loginRoute);
app.use("/api/solutions", solutionsRoute);
app.use("/user", profileRoute);
app.use("/discussions", discussionsRoute);
app.use("/api/contests", contestsRoute);
app.get("/users/:username", async (req, res) => {
  const { username } = req.params;
  if (!username || username.trim() === "") {
    return res.status(400).send([]);
  }
  try {
    const usersList = await User.find({
      Username: { $regex: `^${username}`, $options: "i" },
    }).select("_id Username"); // Only select _id and Username fields

    if (usersList && usersList.length > 0) {
      // Map to return array of objects with id and username
      const result = usersList.map((user) => ({
        id: user._id,
        username: user.Username,
      }));
      res.status(200).send(result);
    } else {
      res.status(404).send("No users found!");
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});
app.get("/ping", (req, res) => {
  res.json({ msg: "API is working !" });
});

socketHandler(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
