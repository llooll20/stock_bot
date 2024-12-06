// config/passport.js
import { Strategy } from "passport-local";
import db from "../server/lib/varDB.js";

const LocalStrategy = Strategy;

export const initializePassport = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "nickname", passwordField: "password" },
      (username, password, done) => {
        console.log("LocalStrategy 등록 완료");

        db.get("SELECT * FROM user WHERE id = ?", [username], (err, row) => {
          if (err) {
            return done(err);
          }

          if (!row) {
            return done(null, false, { message: "Incorrect username or password" });
          }

          if (row.password !== password) {
            return done(null, false, { message: "Incorrect username or password" });
          }

          console.log("로그인 성공");
          return done(null, row);
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    db.get("SELECT * FROM user WHERE id = ?", [id], (err, row) => {
      if (err) {
        return done(err);
      }
      done(null, row);
    });
  });
};
