import SQL from "sqlite3";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import db from "./lib/varDB.js";

export function ImportCSV() {
  const csvFilePath = path.join(
    path.resolve(),
    "나스닥종합지수 과거 데이터(2021_1_1~2024_05_02).csv"
  );
  const dataArray = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      dataArray.push(row);
    })
    .on("end", () => {
      db.serialize(() => {
        const insertTable = db.prepare(`
            INSERT INTO stocks (
            date,
            closing_price,
            opening_price,
            high_price,
            low_price,
            volume,
            change_percent
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
        dataArray.forEach((data) => {
          insertTable.run(
            [
              data.date,
              data.closing_price,
              data.opening_price,
              data.high_price,
              data.low_price,
              data.volume,
              data.change_percent,
            ],
            (e) => {
              if (e) {
                console.log(`데이터 삽입 오류`, e.message);
              }
            }
          );
        });
        insertTable.finalize((e) => {
          if (e) {
            console.log(`Insert Table 종료 오류`, e.message);
          } else {
            console.log(`모든 데이터 삽입 완료`);
          }

          db.close((e) => {
            if (e) {
              console.log(`데이터 베이스 종료 오류`, e.message);
            } else {
              console.log(dataArray);
              console.log(`데이터 베이스 종료 완료`);
            }
          });
        });
      });
    });
}
