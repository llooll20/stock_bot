import express from "express";
import cors from "cors";
import {
  initialize,
  loadCSVData,
  getData,
  insertUserData,
  insertPortfolioData,
} from "./db.js";
import db from "./lib/varDB.js";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import bodyParser from "body-parser";
import { initializePassport } from "./passport_tool.js";

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

//세션 생성
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
app.use(passport.session()); //passport 세션 연결

initializePassport(passport); //초기화 실행
//초기화 반복 방지

const SetUpTable = async () => {
  try {
    await initialize();
    console.log("데이터베이스가 초기화되었습니다.");
    insertPortfolioData(1,"2012","2013","하하하핳");

    const countResult = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM stock_data", (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });

    if (countResult.count === 0) {
      try {
        await loadCSVData();
      } catch (error) {
        console.error("CSV 데이터 로드 실패:", error);
      }
    }
  } catch (err) {
    console.error("데이터베이스 초기화 실패:", err);
    process.exit(1);
  }
};
SetUpTable();

app.get("/", async (req, res) => {
  const chartData = await getData();
  res.json(chartData);
});

// 회원가입 API
app.post("/api/signup", async (req, res) => {
  const { nickname, password } = req.body;
  // 사용자 계정 DB에 저장
  insertUserData(nickname, password);
  res.status(201).json({ message: "signup_success" });
});

//로그인 passport를 이용한 로그인
app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log("로그인 실패 후:", req.user);
      return res.status(500).json({ message: "login_fail" }); // 로그인 실패 시 500 return (http status)
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      //console.log("로그인 성공 후:", req.user);
      return res.status(200).json({ message: "login_success" }); // 로그인 성공 후 200 return (http status)
    });
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
