
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const passport = require('passport');

// const { User } = require("./models/User");
const { Whiskey } = require("./models/Whiskey");
const { Comment } = require("./models/Comment");

// Initialize the app
const app = express();
// Middlewares
// Form Data Middleware


// Json Body Middleware
app.use(express.json());

// Cors Middleware
app.use(cors());

// Seting up the static directory
app.use(express.static(path.join(__dirname, 'vue-whiskey-community/dist')));

// Use the passport Middleware
app.use(passport.initialize());
// Bring in the Passport Strategy
require('./config/Passport')(passport);


//Mongoose 로 DB 접속
const config = "mongodb+srv://whiscovery:wjdwlsdnr5728@cluster0.ngeoi.mongodb.net/whiskeyapp?retryWrites=true&w=majority"
var db = mongoose.connect(config, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database connected successfully')
  })
  .catch(err => {
      console.log(`Unable to connect with the database ${err}`)
  });



// Port 오픈
const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})

// app.get('/', (req, res) => {
//     return res.send("<h1>Hello World</h1>");
// });
// Bring in the Users route
const users = require('./routes/api/users');
app.use('/api/users', users);




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
// /로 get 요청
app.get('/', function(req, res) { 
  res.sendFile(path.join(__dirname, './vue-whiskey-community/dist/index.html'));
});
app.get('*', (req, res) => { 
  res.sendFile(path.join(__dirname, './vue-whiskey-community/dist/index.html'));
});