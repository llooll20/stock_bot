import express from "express";
import cors from "cors";
import SQL from "sqlite3";
import { ImportCSV } from "./db.js";
import db from "./lib/varDB.js";

const app = express();
const PORT = 5000;
app.use(cors());

app.get("/", (req, res) => {
  ImportCSV();
  try {
    db.serialize();
    const result = `SELECT * FROM stocks ORDER BY date DESC`;
    db.run(result);
    db.close();
    db.all(result, [], (e, rows) => {
      if (e) {
        console.log(`데이터 베이스 쿼리 오류`, e.message);
        res.status(500).json({ error: "Database query Error" });
      } else {
        //console.log(rows);
        return res.json(rows);
      }
    });
  } catch (error) {
    console.error("CSV Import Error:", error.message);
    res.status(500).json({ error: "CSV Import Error" });
  }
  //res.send("Hello");
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
