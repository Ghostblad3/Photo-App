import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const sqlite = new Database(
  process.env.NODE_ENVIRONMENT === "TEST" ? ":memory:" : "sqlite.db"
);

export default sqlite;
