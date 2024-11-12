import Database from "better-sqlite3";

let sqlite = new Database(
  process.env.ENVIRONMENT === "TEST" ? ":memory:" : "sqlite.db"
);

function resetInMemoryDb() {
  sqlite.close();

  if (process.env.ENVIRONMENT === "TEST") {
    sqlite = new Database(
      process.env.ENVIRONMENT === "TEST" ? ":memory:" : "sqlite.db"
    );
  }
}

export { sqlite, resetInMemoryDb };
