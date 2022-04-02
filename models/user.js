const mongoose = require('mongoose');
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

const User = mongoose.model('User', userSchema);

module.exports = {User};
//다른 곳에서 이 모델을 쓸 수 있도록 !