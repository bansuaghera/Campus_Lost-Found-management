require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB, sequelize } = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/itemRoutes"));
app.use("/api", require("./routes/responseRoutes"));

sequelize.sync().then(() => console.log("DB Synced"));

app.listen(process.env.PORT, () => console.log("Server running on port 5000"));
