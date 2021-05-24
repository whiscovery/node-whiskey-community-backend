const express = require('express');
const app = express();
const cors = require('cors')
// const MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 4000;
// const auth = require('./auth')
const mongoose = require('mongoose');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const session = require('express-session')
const logger = require('morgan')

app.use(cors());
app.use(express.json())
// app.use(logger('dev'))
// app.use(session({secret : 'WhiscoverySecret', resave : true, saveUninitialized: false}));
// app.use(passport.initialize());
// app.use(passport.session());


// var db;
// MongoClient.connect('mongodb+srv://whiscovery:wjdwlsdnr5728@cluster0.ngeoi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (에러, client) {
// if (에러) return console.log(에러)
// db = client.db('whiskeyapp');
// });

const dbAddress = "mongodb+srv://whiscovery:wjdwlsdnr5728@cluster0.ngeoi.mongodb.net/whiskeyapp?retryWrites=true&w=majority"
mongoose.connect(dbAddress, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`)
    })
    app.get('/', function(req, res) { 
        res.send("Hello Whisckey guys!!!")
    });
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