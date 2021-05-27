const mongoose = require("mongoose");
const autoIdSetter = require('../middleware/auto-id-setter');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nick: {
    type: String,
    maxlength: 50,
    unique: 1,
    required: true
  },
  email: {
    type: String,
    trim: true, //dhsdb 1541 @naver.com 을 dhsdb1541@naver.com로 trim
    unique: 1,
    required: true
  },
  password: {
    type: String,
    minLength: 4,
    required: true
  }
  // token: {
  //   type: String,
  // },
  // tokenExp: {
  //   type: Number,
  // },
  // role: {
  //   type: Number,
  //   default: 0,
  // },  
});
// id값 자동 증가
autoIdSetter(userSchema, mongoose, 'user', 'id');

// 모델 생성
// 여기서 User가 MongoDB에서는 복수, 구분자 삭제등을 통해 users로 저장됨

module.exports = User = mongoose.model("users", userSchema);;
