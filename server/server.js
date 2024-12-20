import express from "express";
import cors from "cors";
import {
  initialize,
  loadCSVData,
  getData,
  insertUserData,
  insertPortfolioData,
  getDateSector,
  getAllUserPortfolio,
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

const SetUpTable = async () => {
  try {
    await initialize();

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

// 포트폴리오 추가 API
app.post("/api/upadte_portfolio", (req, res) => {
  const { startDate, endDate, comment } = req.body;
  insertPortfolioData(1, startDate, endDate, comment);
  res.status(201).json({ message: "update portfolio success" });
});

// 구간 차트 API
app.get("/api/range_chart", (req, res) => {
  const { startDate, endDate } = req.query;
  getDateSector(startDate, endDate)
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: "fetch error" });
    });
});

//임시 사용자의 포트폴리오 받는 코드
app.get("/api/portfolio", (req, res) => {
  if (req.isAuthenticated()) {
    // 사용자가 인증된 상태인지 확인
    getAllUserPortfolio(req.user.id).then((rows) => {
      console.log("포폴: ", rows);
      res.status(200).json(rows);
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
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
      return res.status(200).json({ message: "login_success" }); // 로그인 성공 후 200 return (http status)
    });
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
