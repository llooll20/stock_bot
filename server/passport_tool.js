/*
passport모듈용 파일
*/

const express = require('express');
const LocalStrategy = require('passport-local');    //local은 로컬 저장소를 사용한다는 뜻
const passport = require('passport');
const crypto = require('crypto');
const db = require('./db');

//use를 사용하여 전략 구성
/*
 cb: 검증결과를 확인하기 위한 콜백 함수. cb(에러, 데이터, 메세지)
*/
/*
passport.use(
    new LocalStrategy(function verify(username, password, cb){  //cd는 검증용 콜백함수
        db.get("SELECT * FROM users WHERE username = ? ", [username], function (err, row) {
            if (err){
                return cb(err);
            }
            if (!row){
                return cb(null, false, {message: "Incorrect username or password"});
            }
            //암호화된 password접근
            crypto.pbkdf2(password, row.salt, 310000, 32, "sha256", function(err, hashedPassword) {
                if(err) {
                    return cb(err);
                }
                if (!crypto.timingSafeEqual(row.hashed_Password,hashedPassword)) {
                    return cb(null, false, {message: "Incorrect username or password"});
                }
                return cb(null,row);
            })
        })
    })
);*/

passport.use(
    new LocalStrategy((username, password, done) => {
      // 데이터베이스에서 유저 정보 조회
      db.get("SELECT * FROM user WHERE id = ?", [username], (err, row) => {
        if (err) {
          return done(err);  // 데이터베이스 에러 처리
        }
  
        if (!row) {
          // 유저가 존재하지 않으면 로그인 실패
          return done(null, false, { message: "Incorrect username or password" });
        }
  
        // 평문 비밀번호를 직접 비교
        if (row.password !== password) {
          // 비밀번호가 일치하지 않으면 로그인 실패
          return done(null, false, { message: "Incorrect username or password" });
        }
  
        // 비밀번호가 맞으면 로그인 성공
        return done(null, row);
      });
    })
  );

