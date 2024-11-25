import SQL from "sqlite3";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import db from "./lib/varDB.js";

export const InitDatabase = () => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS stock_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        closing_price TEXT,
        opening_price TEXT,
        high_price TEXT,
        low_price TEXT,
        volume TEXT,
        change_percent TEXT
      )
    `,
      (err) => {
        if (err) {
          console.error("테이블 생성 실패:", err.message);
          reject(err);
        } else {
          console.log("테이블이 준비되었습니다.");
          resolve();
        }
      }
    );
  });
};

// 데이터 삽입 함수
export const insertData = (data) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      `
      INSERT INTO stock_data 
      (date, closing_price, opening_price, high_price, low_price, volume, change_percent) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      (err) => {
        if (err) {
          console.error("Prepared Statement 오류:", err.message);
          reject(err);
        }
      }
    );

    db.serialize(() => {
      data.forEach((row) => {
        // 데이터 변환
        const date = row.date;
        const closing_price = row.closing_price;
        const opening_price = row.opening_price;
        const high_price = row.high_price;
        const low_price = row.low_price;
        const volume = row.volume;
        const change_percent = row.change_percent;
        stmt.run(
          date,
          closing_price,
          opening_price,
          high_price,
          low_price,
          volume,
          change_percent,
          (err) => {
            if (err) {
              console.error("데이터 삽입 오류:", err.message);
            }
          }
        );
      });
      stmt.finalize((err) => {
        if (err) {
          console.error("Statement Finalize 오류:", err.message);
          reject(err);
        } else {
          console.log("모든 데이터가 성공적으로 삽입되었습니다.");
          resolve();
        }
      });
    });
  });
};

// CSV 파일을 읽어 데이터베이스에 삽입
export const loadCSVData = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    const __dirname = path.resolve();
    const csvPath = path.join(
      __dirname,
      "나스닥종합지수 과거 데이터(2021_1_1~2024_05_02).csv"
    );
    console.log(__dirname);

    fs.createReadStream(csvPath)
      .pipe(
        csv([
          "date",
          "closing_price",
          "opening_price",
          "high_price",
          "low_price",
          "volume",
          "change_percent",
        ])
      )
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {
          await insertData(results);
          resolve(results);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error("CSV 읽기 에러:", error);
        reject(error);
      });
  });
};

// 데이터 조회 함수
export const getData = () => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT date, closing_price, opening_price, high_price, low_price, volume, change_percent FROM stock_data",
      [],
      (err, rows) => {
        if (err) {
          console.error("데이터 조회 오류:", err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

// 데이터베이스 초기화 및 내보내기
export const initialize = async () => {
  await InitDatabase();
};
