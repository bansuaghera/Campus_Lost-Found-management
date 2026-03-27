require("dotenv").config(); // MUST be at top

const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./routes/itemRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();
    console.log("Tables synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);

    if (error.original?.code === "3D000") {
      console.error(
        `Create the PostgreSQL database named "${process.env.DB_NAME}" and restart the server.`,
      );
    }

    process.exit(1);
  }
};

startServer();
