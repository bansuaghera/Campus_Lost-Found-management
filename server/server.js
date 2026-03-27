require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

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
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("DB Synced");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
