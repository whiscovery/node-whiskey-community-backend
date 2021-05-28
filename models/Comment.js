const mongoose = require("mongoose");
const autoIdSetter = require('../middleware/auto-id-setter');

const commentSchema = mongoose.Schema({
  이름: {
    type: String,
    maxlength: 50,
  },
  장소: {
    type: String,
  },
  일시: {
    type: String,
  },
  내용: {
    type: String,
  },
  위스키이름: {
    type: String,
  },
  이메일: {
    type: String,
  },
  위스키번호: {
    type: String,
    default: 0
  }
});
autoIdSetter(commentSchema, mongoose, 'comment', 'id');

// 모델 생성
// 여기서 User가 MongoDB에서는 복수, 구분자 삭제등을 통해 users로 저장됨
const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment };
