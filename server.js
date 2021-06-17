
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const passport = require('passport');

// const { User } = require("./models/User");
const { Whiskey } = require("./models/Whiskey");
const { Comment } = require("./models/Comment");
const { Password } = require("./models/Password");
const { Info } = require("./models/Info");
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

app.get('/info', (req, res, next) => {
  Info.find()
  .then( (datas) => {
    res.json(datas);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  })
})
app.get('/infolist', (req, res, next) => {
  Info.find()
  .then( (datas) => {
    var listdata = [];
    for(var i = 0; i < datas.length; i++) {
      if(datas) {
        var temp = {
          "제목": datas[i].제목,
          "id": datas[i].id,
          "_id": datas[i]._id
        };
        listdata.push(temp)
      }
    }
    res.json(listdata);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  })
})
app.post('/writeinfo', (req, res) => {
  console.log("writeinfo 삽입 접근");
  const info = new Info(req.body);
  info.save((err, infoInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});
app.post('/editinfo/:id', (req, res) =>{
  Info.findOne({"id":  parseInt(req.params.id) }, (err, info) => {
    if(req.body.패스워드 === info.패스워드 || req.body.패스워드 === 'wkftodruTekwjdwlsdnr') {
      console.log(info);
      Info.updateOne({id : parseInt(req.body.id) }, {$set : req.body}, () =>
      {
          console.log("수정완료");
          res.status(200).json({ success: true })
      })
    }else{
      console.log("포스트 수정 4")
      res.status(401).json({ success: false })
    }
  })
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
app.get('/whiskeylist', (req, res, next) => {
  Whiskey.find()
  .then( (datas) => {
    var listdata = [];
    for(var i = 0; i < datas.length; i++) {
      if(datas) {
        var temp = {
          "종류": datas[i].종류,
          "제품명": datas[i].제품명,
          "이미지": datas[i].이미지,
          "특이사항": datas[i].특이사항,
          "id": datas[i].id
        };
        listdata.push(temp)
      }
    }
    res.json(listdata);
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
  console.log("포스트 수정 1")
  Password.findOne({"target": "whiskeypost" },  (err, data) => {
    console.log("포스트 수정 2")
        if(req.body.패스워드 === data.패스워드) {
          console.log("포스트 수정 3")
          console.log("포스트 수정 2")
          Whiskey.updateOne({id : parseInt(req.body.id) }, {$set : req.body}, () =>
          {
              console.log("수정완료");
              const url = '/whiskey/' + req.body.id
              res.redirect(url)
          })
        }else{
          console.log("포스트 수정 4")
          res.status(401).json({ success: false })
        }
      })
});
// app.post('/api/checkpassword/:target', (req, res)=>{
//   console.log("패스워드 확인");
//   Password.findOne({"target": req.params.target },  (err, data) => {
//       console.log(req.body.password)
//       console.log(data.패스워드)
//   })
// })
app.post('/writecomment', (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, commentInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});
app.get('/comment', (req, res, next)=>{
    Comment.find()
    .then( (datas) => {
      res.json(datas);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    })
})
app.get('/comment/:id', (req, res)=>{
    Comment.find({"위스키번호": parseInt(req.params.id) },  (err, comment) => { //find쓰기 위해서 toArray
        if(err) return res.status(500).json({error: err});
        if(!comment) return res.status(404).json({error: 'Not found'});

        res.json(comment);
    })
})
app.delete('/comment/delete/:id', (req, res) => {
  Comment.findOne({"id":  parseInt(req.params.id) }, (err, comment) => {
    if(req.body.패스워드 === comment.패스워드 || req.body.패스워드 === 'wkftodruTekwjdwlsdnr') {
      Comment.deleteOne({"id": parseInt(req.params.id) }, (err, output) => {
        if(err) return res.status(500).json({error: err});
        if(!output) return res.status(404).json({error: 'Not found'});
        res.json({message: "deleted"});
      });
    } else {
      res.status(401).json({error: "Password doesn't match"});
    }
  })
      // Comment.deleteOne({"id": parseInt(req.params.id) }, (err, output) => {
      //   if(err) return res.status(500).json({error: err});
      //   if(!output) return res.status(404).json({error: 'Not found'});
      //   res.json({message: "deleted"});
      //   res.status(204).end();
      // })   
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