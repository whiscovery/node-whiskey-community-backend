const mongoose = require("mongoose");

const passSchema = mongoose.Schema({
  target: {
      type: String
  },
  패스워드: {
    type: String,
    minLength: 4
  }
});

// 모델 생성
// 여기서 User가 MongoDB에서는 복수, 구분자 삭제등을 통해 users로 저장됨
const Password = mongoose.model("Password", passSchema);

module.exports = { Password };
