const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //white space를 자동으로 없애준다
        unique: 1 //똑같은 것이 존재하면 안되는 것
    },
    password: {
        type: String,
        minlegth: 5
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: { //access control을 구분
        type: Number,
        default: 0
    },
    image: {
        type: String
    },
    token: { //유효성 검사
        type: String
    },
    tokenExp: { //token의 유효기간
        type: Number
    }
});

userSchema.pre('save', function(next){// index.js에서 입력한 비밀번호를 save하기 전 비밀번호 암호화
    var user = this; // 이 모델 자체를 가리킴

    if(user.isModified('password')){ //이 조건문이 존재하지 않으면
        bcrypt.genSalt(saltRounds, function(err,salt){
        if (err) return next(err) //에러가 발생하면 그 전 상황 즉, 비밀번호를 save하던 상황으로 돌아간다

        bcrypt.hash(user.password, salt, function (err, hash){
            if (err) return next(err) //에러가 발생하면 그 전 상황 즉, 비밀번호를 save하던 상황으로 돌아간다
            user.password = hash; //기존의 비밀번호를 hash값으로 바꿈
            next();
            })
        })
    } else {
        next(); //비밀번호를 바꾸는 경우에만 해당 함수가 실행이 되어야 하기 때문에, 그렇지 않을 경우에는 next를 이용해서 그냥 넘어가게 해야함 
    }

    
    
}); //user모델에 저장하기 전(pre)에 어떠한 조작을 수행하겠다는 의미 

userSchema.methods.comparePassword = function(plainPassword, callback) { //사용자가 입력한 비밀번호 값(plainpassword | 암호화되어있지 않음)과 기존의 데이터베이스에서의 비밀번호(cipher password|암호화 되어있음)를 비교하는 메소드 제작 -> plainpassword도 암호화해야함
    bcrypt.compare(plainPassword,this.password, function(err, isMatch){
        if (err) return callback(err) //에러가 있다면, callback함수에 담아낸후 리턴
        callback(null,isMatch) //에러가 없다면 에러자리가 null이여야하고 isMatch가 true로 담길것
    })
};

userSchema.methods.generateToken = function(cb) {
    var user = this;
    //jsonwebtoken을 이용해서 token 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secrettoken'); //jwt.sign: 토큰 발급 -> 데이터베이스에 있는 정보의 id를 토큰화 함 sign 메소드에서는 plainobject를, 즉 text를 기다리므로 기존 값을 string형식으로 바꿔주어야한다.
    user.token = token;
    user.save(function(err,user){
        if (err) return cb(err)
        cb(null,user);
    });

};
const User = mongoose.model('User', userSchema);

module.exports = {User};
//다른 곳에서 이 모델을 쓸 수 있도록 !