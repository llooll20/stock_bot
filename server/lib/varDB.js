import SQL from "sqlite3";

const sqlite3 = SQL.verbose();
const db = new sqlite3.Database("./chartDB.db");

export default db;
