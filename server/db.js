import SQL from "sqlite3";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import db from "./lib/varDB.js";

//db 초기화
export const InitDatabase = () => {
  //주식 테이블 초기화
  const createStockTable = new Promise((resolve, reject) => {
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
          console.log("stock 테이블이 생성되었습니다.");
          resolve();
        }
      }    
    );
  }
);
  //유저 테이블 초기화
  const createUserTable = new Promise((resolve, reject)=> {
  db.run(
      `
      CREATE TABLE IF NOT EXISTS user(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          password TEXT NOT NULL
      )
      `,
      (err) => {
        if (err) {
          console.error("테이블 생성 실패:", err.message);
          reject(err);
        } else{
          console.log("user 테이블이 생성되었습니다.");
            resolve();
        }
      }
    )
  });

  //포폴 데이터베이스 초기화
  const createportfolioTable = new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS portfolio(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner INTEGER NOT NULL,
        start TEXT NULL,
        end TEXT NULL,
        comment TEXT NULL
      )
      `,
      (err) => {
        if(err){
          console.log("포폴 테이블 생성 실패", err.message);
          reject(err);
        } else{
          console.log("포폴 테이블 생성 성공");
          resolve();
        }
      }
    )
  });


  return Promise.all([createStockTable, createUserTable, createportfolioTable]);
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

//차트 테이블 구간 내 모든 정보 가져오기
export const getDateSector = (start, end) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM stock_data WHERE date BETWEEN ? AND ?", [start, end], (err, rows) => {
      if (err) {
        console.error(err);
        reject(err);
      } else{
        console.log("구간 정보 가져오기 성공");
        resolve(rows);
      }
    });
  });
};

/*
    유저 테이블 관련 함수
*/

//유저 정보 입력(미완성)
export const insertUserData = (nickname, password) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      `
      INSERT INTO user
      (name, password) 
      VALUES (?, ?)
    `
    );

    // sql 실행
    stmt.run(nickname, password, function (err) {
      if (err) {
        console.error("데이터 삽입 오류:", err.message);
        reject(err);
      } else {
        console.log("사용자 데이터 삽입 성공");
        resolve();
      }
    });

    stmt.finalize((err) => {
      if (err) {
        console.error("Prepared Statement 종료 오류:", err.message);
      }
    });
  });
};

/*
    포폴 데이터베이스 관련코드들들
*/

//포폴폴 데이터베이스에 값 입력
export const insertPortfolioData = (id, start, end, comment) => {
  return new Promise ((resolve, reject) => {
    const stmt = db.prepare(
      `
      INSERT INTO portfolio
      (owner, start, end, comment)
      VALUES (?,?,?,?)
      `
    );
    stmt.run(id, start, end, comment, function(err) {
      if (err) {
        console.err("포폴 데이터 삽입 오류:", err.message);
        reject(err);
      } else{
        console.log("포폴 데이터 삽입 성공");
        resolve();
      }
    })
    stmt.finalize((err) => {
      if (err) {
        console.error("Prepared Statement 종료 오류:", err.message);
      }
    });
  });
};

//포폴 데이터베이스에서 특정사용자의 시작, 끝값 모두 가져오기 (리스트 형태)
export const getAllUserPortfolio = (id) => {
  return new Promise ((resolve, reject) => {
    db.all("SELECT start, end, comment FROM portfolio WHERE owner = ?",[id],(err, rows) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(id ," 사용자의 포폴데이터 추출 성공!");
        resolve(rows);
      }
    });
  });
}

//포폴 데이터베이스에서 값 삭제하기

export const  delPortfolio = (id) => {
  return new Promise ((resolve, reject ) => {
    const stmt= db.prepare(
      `
      DELETE FROM portfolio WHERE id = ?
      `
    );
    stmt.run(id, function(err) {
      if(err) {
        console.error(err);
        reject(err);
      } else {
        console.log("포폴 삭제 성공");
        resolve();
      }
    })
  });
}