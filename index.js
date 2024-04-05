const { urlencoded } = require('body-parser');
const express=require('express');
const app=express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());
const path = require('path');

require('dotenv').config();
// this var for get acces to the post routes
const postRouter=require('./routes/posts.router');

// this var for get acces to the post routes
const getsRouter=require('./routes/gets.router');

app.use('/api/v1/', getsRouter);
app.use('/api/v1/posts', postRouter);

app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT=process.env.PORT || 8000 ;

app.listen(PORT,()=>{
    console.log('server is runing ......');
})