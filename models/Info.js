const mongoose = require("mongoose");
const autoIdSetter = require('../middleware/auto-id-setter');

const infoSchema = mongoose.Schema({
  내용: {
    type: String,
  },
  제목: {
    type: String,
  },
  패스워드: {
    type: String,
    minLength: 4
  }
});
autoIdSetter(infoSchema, mongoose, 'info', 'id');

// 모델 생성
// 여기서 User가 MongoDB에서는 복수, 구분자 삭제등을 통해 users로 저장됨
const Info = mongoose.model("Info", infoSchema);

module.exports = { Info };
