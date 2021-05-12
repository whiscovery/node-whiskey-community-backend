const express = require('express');
const app = express();
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;

app.use(cors());
app.use(express.json())



var db;
MongoClient.connect('mongodb+srv://whiscovery:wjdwlsdnr5728@cluster0.ngeoi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (에러, client) {
    if (에러) return console.log(에러)
    db = client.db('whiskeyapp');
    app.listen(4000, () => {
        console.log('Listening on 4000')
    })
    app.get('/', function(요청, 응답) { 
        응답.sendFile(__dirname +'/index.html')
    });

    app.get('/whiskey', (req, res) =>{
        db.collection('whiskey').find().toArray((err, result) => {
            res.json(result)
        })
    })
    app.get('/whiskey/:id', (req, res)=>{
        db.collection('whiskey').findOne({_id: parseInt(req.params.id) }, (err, data) => {
            if(err) return res.status(500).json({error: err});
            if(!data) return res.status(404).json({error: 'Not found'});
            res.json(data);
        })
    })
    app.post('/editpost', (req, res) =>{
        db.collection('whiskey').updateOne({_id : parseInt(req.body._id) }, {$set : req.body}, () =>
        {
            console.log("수정완료");
            const url = '/whiskey/' + req.body._id
            res.redirect(url)
        })
    })
    app.post('/input', (req, res) => {
        console.log("삽입 접근")
        db.collection('whiskeyid').findOne({name: '위스키갯수카운터'}, (err, result) => {
            var totalCounter = result.totalWhiskey;
            db.collection('whiskey').insertOne( {
                _id: (totalCounter + 1),
                제품명: req.body.제품명,
                종류: req.body.종류,
                도수: req.body.도수,
                이미지: req.body.이미지,
                가격대: req.body.가격대,
                테이스팅: req.body.테이스팅,
                설명: req.body.설명,
                기타지식: req.body.기타지식,
                코멘트: req.body.코멘트,
            } , function(에러, 결과){
                db.collection('whiskeyid').updateOne( {name : '위스키갯수카운터' } , { $inc : { totalWhiskey
                    : 1 } } , function(에러, 결과){
                    console.log('수정완료')
                  })
                console.log('저장완료'); 
                });
            res.send('전송완료')
        });
    });
    app.post('/comment', (req, res) => {
        console.log(req.body)
        const url = '/whiskey/'+req.body.postid
        res.redirect(url)
    })
});