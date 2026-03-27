const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    logging: false,
  },
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Connected");
  } catch (error) {
    throw new Error(`Unable to connect to PostgreSQL: ${error.message}`);
  }
};

module.exports = { sequelize, connectDB };
