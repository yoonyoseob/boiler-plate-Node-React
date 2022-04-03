// 가장 기본이 되는 파일 app.js같은 느낌
const express = require('express');
const app = express();
const port = 2000;
const {User} = require('./models/user.js');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://yoseobyun:3lxntKUiGWdJ6dwY@boilerplate.o1goy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

    //어플리케이션에서 urlencoded된 데이터를 분석해서 가져올 수 있도록 설정
    app.use(bodyParser.urlencoded({extended: true}));

    //json파일을 가질 수 있도록 함
    app.use(bodyParser.json());
app.get('/', (req,res) => res.send('Hello World'));

app.post('/register', (req, res) => {
    //회원가입할 때 필요한 정보를 데이터베이스에 넣어주는 작업, user model 을 이용

    const user = new User(req.body);

    //save를 하기 전에 암호화를 해야한다 -> Mongoose 기능이용
    user.save((err,userInfo) => { //mongodb에서 오는 메소드로 유저 모델에 저장시키기 위해서 사용한다.
        if (err) return res.json({success: false, err});  //error가 발생하면, json형식으로 보내주며, err메세지도 같이 보내준다
        return res.status(200).json({ //성공을 하면 코드 번호 200을 보내주며, 마찬가지로 json파일로 success 를 보낸다
            success:true
        })
    }); 
});

app.listen(port, () => console.log(`Example app is listening on port ${port}`));