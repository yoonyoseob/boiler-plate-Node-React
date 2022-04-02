// 가장 기본이 되는 파일 app.js같은 느낌
const express = require('express');
const app = express();
const port = 2000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://yoseobyun:3lxntKUiGWdJ6dwY@boilerplate.o1goy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


app.get('/', (req,res) => res.send('Hello World'));

app.listen(port, () => console.log(`Example app is listening on port ${port}`));