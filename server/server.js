require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/db");
const setupAssociations = require("./models/associations");

const app = express();
const PORT = process.env.PORT || 5000;
let serverStarted = false;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/itemRoutes"));
app.use("/api", require("./routes/responseRoutes"));

const startServer = async () => {
  if (serverStarted) {
    return;
  }

  try {
    await connectDB();
    setupAssociations();
    await sequelize.sync({ alter: true });
    console.log("DB Synced");

    serverStarted = true;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

startServer();

module.exports = { app, startServer };
