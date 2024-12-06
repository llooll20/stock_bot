import db from "./lib/varDB.js";

db.run(
    "INSERT INTO user (id, password) VALUES ($id, $password)", 
    {
      $id: 'ubuntu', 
      $password: 'aa'
    },
    function(err) {
      if (err) {
        console.error("유저 정보 입력 오류:", err);
      } else {
        console.log("유저 정보가 성공적으로 입력되었습니다.");
      }
    }
  );