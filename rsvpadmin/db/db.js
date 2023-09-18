const mongoose = require('mongoose');
require("dotenv").config();
var express = require('express');
const bodyParser =  require('body-parser')


var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


mongoose.connect(process.env.DATABASEURL).then(
    ()=> {
        console.log("i am connected");
    }
).catch(()=>{
    console.log("not connected");
});