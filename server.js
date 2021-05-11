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
        res.send('Whiskey')
    })
    app.post('/input', (req, res) => {
        console.log("접근")
        db.collection('whiskey').insertOne( req.body , function(에러, 결과){
            console.log('저장완료'); 
            });
        res.send('전송완료')
    });
});