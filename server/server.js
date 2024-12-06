import express from "express";
import cors from "cors";
import { initialize, loadCSVData, getData } from "./db.js";
import db from "./lib/varDB.js";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import bodyParser from "body-parser";

const LocalStrategy = Strategy;

const app = express();
const PORT = 5000;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secure: false,
    secret: "wegdf456@!!!@", // 무작위 암호화 키
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // HTTPS를 사용할 경우 true로 설정
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1시간
    },
  })
);
app.use(passport.initialize()); //passport초기화
app.use(passport.session());

//초기화 반복 방지
let isInitialized = false;

app.get("/", async (req, res) => {
  //초기화 확인
  if (isInitialized === false) {
    isInitialized = true;
    initialize()
      .then(() => {
        console.log("데이터베이스가 초기화되었습니다.");
      })
      .catch((err) => {
        console.error("데이터베이스 초기화 실패:", err);
        process.exit(1);
      });
  }

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

app.post("/api/signup", (req, res) => {
  console.log(`회원가입 페이지`, req.body);
  res.send("GET signUP Page");
});

// 로그인 API
app.post("/api/login", (req, res) => {
  console.log(req.body);

  res.send("GET");
});

app.get("/login", (req, res) => {
  res.send("HOME");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
