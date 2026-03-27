const { Sequelize } = require("sequelize");
const { Client } = require("pg");

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST = "localhost",
  DB_PORT = 5432,
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "postgres",
  logging: false,
});

const escapeIdentifier = (value) => `"${String(value).replace(/"/g, '""')}"`;

const ensureDatabaseExists = async () => {
  const adminClient = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: Number(DB_PORT),
    database: process.env.DB_ADMIN_NAME || "postgres",
  });

  await adminClient.connect();

  try {
    const result = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME],
    );

    if (result.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE ${escapeIdentifier(DB_NAME)}`);
      console.log(`Database "${DB_NAME}" created`);
    }
  } finally {
    await adminClient.end();
  }
};

const connectDB = async () => {
  await ensureDatabaseExists();
  await sequelize.authenticate();
  console.log("PostgreSQL Connected");
};

module.exports = { sequelize, connectDB };
