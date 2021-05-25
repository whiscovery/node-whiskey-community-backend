const express = require('express');
// const config = require("./config/db");
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const { User } = require("./models/User");
const { Whiskey } = require("./models/Whiskey");
const { Comment } = require("./models/Comment");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");
const path = require('path');

app.use(
  cors({
    origin: true,
    credentials: true, //도메인이 다른경우 서로 쿠키등을 주고받을때 허용해준다고 한다
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'vue-whiskey-community/dist')));
//Mongoose 로 DB 접속
const config = "mongodb+srv://whiscovery:wjdwlsdnr5728@cluster0.ngeoi.mongodb.net/whiskeyapp?retryWrites=true&w=majority"
var db = mongoose.connect(config, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Port 오픈
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})
// /로 get 요청
app.get('/', function(req, res) { 
    res.sendFile(path.join(__dirname, './vue-whiskey-community/dist/index.html'));
});

app.get('/whiskey', (req, res, next) => {
  Whiskey.find()
  .then( (datas) => {
    res.json(datas);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  })
})
app.get('/whiskey/:id', (req, res)=>{
  Whiskey.findOne({id: parseInt(req.params.id) }, (err, data) => {
        if(err) return res.status(500).json({error: err});
        if(!data) return res.status(404).json({error: 'Not found'});
        res.json(data);
    })
})
app.post('/writepost', (req, res) => {
    console.log("writepost 삽입 접근");
    const whiskey = new Whiskey(req.body);
    whiskey.save((err, whiskeyInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true });
    });
  });

app.post('/editpost', (req, res) =>{
    Whiskey.updateOne({id : parseInt(req.body.id) }, {$set : req.body}, () =>
    {
        console.log("수정완료");
        const url = '/whiskey/' + req.body.id
        res.redirect(url)
    })
})
app.post('/writecomment', (req, res) => {
  console.log("writepost 삽입 접근");
  const comment = new Comment(req.body);
  comment.save((err, commentInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});
app.get('/comment/:id', (req, res)=>{
    Comment.find({"위스키번호": parseInt(req.params.id) },  (err, comment) => { //find쓰기 위해서 toArray
        if(err) return res.status(500).json({error: err});
        if(!comment) return res.status(404).json({error: 'Not found'});

        res.json(comment);
    })
})
app.get('/comment/search/:email', (req, res)=>{
    Comment.find({"이메일": req.params.email }, (err, comment) => { //find쓰기 위해서 toArray
        if(err) return res.status(500).json({error: err});
        if(!comment) return res.status(404).json({error: 'Not found'});
        
        res.json(comment);
    })
})
app.post('/writepost/taisting', (req, res) => {
  Whiskey.findOne({id: parseInt(req.body.whiskeyid)}, (err, whiskeyInfo) => {
    whiskeyInfo.테이스팅점수.push(req.body.테이스팅점수);
    whiskeyInfo.save();
    if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true });
  })
  // Whiskey.updateMany({id : parseInt(req.body.whiskeyid)}, { $push: { 테이스팅점수: req.body.테이스팅점수}}, (err, success) => {
  //   if (err) return res.json({ success: false, err });
  //     return res.status(200).json({ success: true });
  // });

});

app.post("/register", (req, res) => {
    const user = new User(req.body);
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
    });
});
app.post("/login", (req, res) => {
    //로그인을할때 아이디와 비밀번호를 받는다
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err || !user) {
        return res.json({
          loginSuccess: false,
          message: "존재하지 않는 아이디입니다.",
        });
      }
      user
        .comparePassword(req.body.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.json({
              loginSuccess: false,
              message: "비밀번호가 일치하지 않습니다",
            });
          }
          //비밀번호가 일치하면 토큰을 생성한다
          //해야될것: jwt 토큰 생성하는 메소드 작성
        user
            .generateToken()
            .then((user) => {
                res.cookie('x_auth', user.token, { maxAge: 10000 })
                .status(200).json({
                  loginSuccess: true,
                  userId: user._id,
                  token: user.token
              });
            })
            .catch((err) => {
              res.status(400).send(err);
            });

        })
        .catch((err) => res.json({ loginSuccess: false, err }));
    });
  });


//user_id를 찾아서(auth를 통해 user의 정보에 들어있다) db에있는 토큰값을 비워준다
app.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
      if (err) return res.json({ success: false, err });
      res.clearCookie("x_auth");
      console.log("logout");
      return res.status(200).send({
        success: true,
      });
    });
  });

  //auth 미들웨어를 가져온다
//auth 미들웨어에서 필요한것 : Token을 찾아서 검증하기
app.get("/auth", auth, (req, res) => {
    //auth 미들웨어를 통과한 상태 이므로
    //req.user에 user값을 넣어줬으므로
    console.log("1");
    res.status(200).json({
      _id: req.user._id,
    //   isAdmin: req.user.role === 09 ? false : true,
      isAuth: true,
      email: req.user.email,
      nick: req.user.nick

    //   name: req.user.name,
    //   lastname: req.user.lastname,
    //   role: req.user.role,
    //   image: req.user.image,
    });
  });

// register로 post 요청 처리

    // app.post('/login', async (req, res) => {
    //     const {email, password} = req.body
    //     const user = await db.collection('user').findOne({"email": req.body.email, "password": req.body.password}, (err, data) => {
    //         if(err) return res.status(500).json({error: err});
    //         if(!data) return res.status(404).json({error: 'Not found'});

    //     console.log(data);
    //     if (!data || !data.email) return res.status(401).json({error: 'Login failure'})
    //     const accessToken = auth.signToken(data.email)
    //     console.log(accessToken)
    //     res.json({accessToken})
    //     })
    // })
    // app.get('/myworld', auth.ensureAuth(), async (req, res) => {
    //     const user = await db.collection('user').findOne({email: req.body.email}, (err, data) => {
    //         if(err) return res.status(500).json({error: err});
    //         if(!data) return res.status(404).json({error: 'Not found'});
    //         res.json({data})
    //   })
    // })
    // app.get('/whiskey', (req, res) =>{
    //     db.collection('whiskey').find().toArray((err, result) => {
    //         res.json(result)
    //     })
    // })
    // app.get('/whiskey/:id', (req, res)=>{
    //     db.collection('whiskey').findOne({_id: parseInt(req.params.id) }, (err, data) => {
    //         if(err) return res.status(500).json({error: err});
    //         if(!data) return res.status(404).json({error: 'Not found'});
    //         res.json(data);
    //     })
    // })
    // app.get('/comment/search/:email', (req, res)=>{
    //     db.collection('whiskeycomment').find({"이메일": req.params.email }).toArray( (err, comment) => { //find쓰기 위해서 toArray
    //         if(err) return res.status(500).json({error: err});
    //         if(!comment) return res.status(404).json({error: 'Not found'});
           
    //         res.json(comment);
    //     })
    // })
    // app.get('/comment/:id', (req, res)=>{
    //     db.collection('whiskeycomment').find({"위스키번호": parseInt(req.params.id) }).toArray( (err, comment) => { //find쓰기 위해서 toArray
    //         if(err) return res.status(500).json({error: err});
    //         if(!comment) return res.status(404).json({error: 'Not found'});

    //         res.json(comment);
    //     })
    // })
    // app.post('/editpost', (req, res) =>{
    //     db.collection('whiskey').updateOne({_id : parseInt(req.body._id) }, {$set : req.body}, () =>
    //     {
    //         console.log("수정완료");
    //         const url = '/whiskey/' + req.body._id
    //         res.redirect(url)
    //     })
    // })
    // app.post('/writepost', (req, res) => {
    //     console.log("삽입 접근")
    //     db.collection('whiskeyid').findOne({name: '위스키갯수카운터'}, (err, result) => {
    //         var totalCounter = result.totalWhiskey;
    //         db.collection('whiskey').insertOne( {
    //             _id: (totalCounter + 1),
    //             제품명: req.body.제품명,
    //             종류: req.body.종류,
    //             도수: req.body.도수,
    //             이미지: req.body.이미지,
    //             가격대: req.body.가격대,
    //             테이스팅: req.body.테이스팅,
    //             설명: req.body.설명,
    //             기타지식: req.body.기타지식,
    //             코멘트: req.body.코멘트,
    //         } , function(에러, 결과){
    //             db.collection('whiskeyid').updateOne( {name : '위스키갯수카운터' } , { $inc : { totalWhiskey
    //                 : 1 } } , function(에러, 결과){
    //                 console.log('수정완료')
    //               })
    //             console.log('저장완료'); 
    //             });
    //         res.send('전송완료')
    //     });
    // });
    // // 테이스팅 점수를 whiskey collection의 테이스팅점수에 추가($push)
    // app.post('/writepost/taisting', (req, res) => {
    //     db.collection('whiskey').updateMany({_id : parseInt(req.body.whiskeyid) }, {$push : { 테이스팅점수: req.body.테이스팅점수}}, () =>
    //     {
    //         console.log("수정완료");
    //         const url = '/whiskey/' + req.body.whiskeyid
    //         res.redirect(url)
    //     })
    // });
    // app.post('/writecomment', (req, res) => {
    //     console.log(req.body)
    //     db.collection("whiskeycommentid").findOne({name: '코멘트갯수카운터'}, (err, result) => {
    //         var commentCounter = result.totalComment;
    //         db.collection('whiskeycomment').insertOne({
    //             _id: (commentCounter + 1),
    //             이름: req.body.이름,
    //             장소: req.body.장소,
    //             일시: req.body.일시,
    //             내용: req.body.내용,
    //             위스키이름: req.body.위스키이름,
    //             이메일: req.body.이메일,

    //             위스키번호: parseInt(req.body.whiskeyid)
    //         }, function(에러, 결과){
    //             db.collection('whiskeycommentid').updateOne( {name: '코멘트갯수카운터'}, { $inc: { totalComment : 1 }}, function(에러, 결과){
    //                 console.log('코멘트 갯수 수정 완료')
    //                 console.log(에러)
    //             });
    //             console.log('코멘트 저장 완료')
    //         });
    //     });
    //     const url = '/whiskey/'+req.body.whiskeyid
    //     res.redirect(url)
    // });
  //   {
  //     "제품명": "Wild Turkey 101 Bourbon",
  //     "종류": "버번 위스키",
  //     "도수": "50.5",
  //     "이미지": "https://static.whiskybase.com/storage/whiskies/9/1/817/143317-big.jpg",
  //     "가격대": "남대문 주류상가 43,000원 (19년 기준)",
  //     "테이스팅": "- Color(색) : 나무색에 가까운 짙은 노란색- Nose(향) : 빵굽는향, 바닐라, 토피, 스파이시, 전체적으로 카라...",
  //     "설명": "● Wild Turky 101은 와일드 터키 위스키 중 가장 많이 팔리며 증류소를 대표하는 제품이며 101은 Proof으로 우...",
  //     "기타지식": "프루프(proof)는 도수를 나타내는 단위 중 하나로 1/2하면 일반 도수가 된다(도량형 통일이 안되서 글렌파클라스 105는 ",
  //     "테이스팅점수": []
  // }

//   {
//     "whiskeyid": 1,
//     "테이스팅점수": [10,20,30,40,50,60,70]
// }