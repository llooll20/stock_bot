import express from "express";
import cors from "cors";
import SQL from "sqlite3";
import { initialize, loadCSVData, getData } from "./db.js";
import db from "./lib/varDB.js";

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  initialize()
    .then(() => {
      console.log("데이터베이스가 초기화되었습니다.");
    })
    .catch((err) => {
      console.error("데이터베이스 초기화 실패:", err);
      process.exit(1);
    });
  try {
    const countResult = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM stock_data", (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    if (countResult.count === 0) {
      // CSV 파일 읽기 및 DB에 저장
      try {
        const data = await loadCSVData();
        res.json(data);
      } catch (error) {
        console.error("CSV 데이터 로드 실패:", error);
        res.status(500).send("CSV 파일 읽기 에러");
      }
    } else {
      // DB에서 데이터 조회
      const data = await getData();
      res.json(data);
    }
  } catch (e) {
    console.log(`데이터 없음`);
  }
});

app.get("/login", (req, res) => {
  res.send("HOME");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
