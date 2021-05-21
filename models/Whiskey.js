const mongoose = require("mongoose");

const whiskeySchema = mongoose.Schema({
  제품명: {
    type: String,
    maxlength: 50,
  },
  종류: {
    type: String,
  },
  도수: {
    type: String,
  },
  이미지: {
    type: String,
  },
  가격대: {
    type: String,
  },
  테이스팅: {
    type: String,
  },
  설명: {
    type: String,
  },
  기타지식: {
    type: String,
  },
  테이스팅점수: {
    type: Array,
  },
});


// 모델 생성
// 여기서 User가 MongoDB에서는 복수, 구분자 삭제등을 통해 users로 저장됨
const Whiskey = mongoose.model("Whiskey", whiskeySchema);

module.exports = { Whiskey };
