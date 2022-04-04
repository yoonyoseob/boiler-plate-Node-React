//index.js
const express = require('express');
const app = express();
const port = 2000;
const {User} = require('./models/user.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://yoseobyun:3lxntKUiGWdJ6dwY@boilerplate.o1goy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//어플리케이션에서 urlencoded된 데이터를 분석해서 가져올 수 있도록 설정
app.use(bodyParser.urlencoded({extended: true}));
//json파일을 body-parser 라이브러리를 통해 해석할 수 있도록 함
app.use(bodyParser.json());
app.use(cookieParser());
//root 페이지
app.get('/', (req,res) => res.send('Hello World'));

//회원가입 페이지
app.post('/register', (req, res) => { //회원가입할 때 필요한 정보를 데이터베이스에 넣어주는 작업, user model 을 이용
    const user = new User(req.body); //user라는 변수에 클라이언트가 보낸 body를 담는다. (body에 사용자 정보가 담겨있음)
    user.save((err,userInfo) => { //mongodb에서 지원해주는 메소드로 유저 모델에 저장시키기 위해서 사용한다.
        if (err) return res.json({success: false, err})  //error가 발생하면, json형식으로 보내주며, err메세지도 같이 보내준다
        return res.status(200).json({success:true}) //에러가 발생하지 않고 성공하면 200을 보내준다
    }); 
});

//로그인 페이지
app.post('/login' ,(req, res) => {
    //1. 요청된 이메일이 데이터베이스에 존재하는지 확인
    User.findOne({email:req.body.email},(err,userInfo) => { //findOne: 해당 정보를 가진 하나의 문서 자체를 찾아내는 메소드
        if (!userInfo) { //존재하지 않을때 실행
            return res.json({
                LoginSuccess: false,
                message:'제공된 이메일에 해당된 유저가 존재하지 않습니다.'
            })
        }
        //2. 요청된 이메일이 데이터 베이스에 존재한다면 입력한 비밀번호와 데이터베이스에 있는 비밀번호가 일치하는지 확인
        userInfo.comparePassword(req.body.password,(err,isMatch) => { //이 함수는 user.js에 정의되어 있음
            if(!isMatch)
                return res.json({loginSuccess: false, message: "비밀번호가 맞지 않습니다."},err)
            
                //3. 다 일치한다면 토큰을 생성
            userInfo.generateToken((err, userInfo) => {
                if(err) return res.status(400).send(err);
                //토큰을 쿠키와 로컬 스토리지에 저장할 수 있는데 강의에서는 쿠키에 저장
                res.cookie("x_auth",userInfo.token)
                .status(200)
                .json({loginSuccess: true, userId: userInfo._id});
            })
    })
});
});



app.listen(port, () => console.log(`Example app is listening on port ${port}`));