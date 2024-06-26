const express = require('express');
const app = express.Router();
const Emailer = require('../Mailer');
const {LocalStorage} = require('node-localstorage')
const local = new LocalStorage("./scratch");
require('dotenv').config({path:"../.config/Pointer.env"})
const { randomUUID } = require('crypto');
let array = []

for(let i = 0 ;i<=100;i++){
    array.push(randomUUID().substring(0,6))
}
console.log(array)

app.post('/SMS',(req,res) =>{
    let Key = array[Math.floor(Math.random() * array.length - 1)]
    console.log(Key)
    local.setItem('SecretKey',Key)
    Emailer.SEND_SECRET_OTP_SMS(req.body.Phone,Key,(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json(data)
        }
    })

})

app.post('/VerifySMS',(req,res) => {
    console.log(req.body)
    if(req.body.code == local.getItem('SecretKey')){
        res.json({Verification:true,Message:"Correct Welcome !!!"})
    }else{
        res.json({Verification:false,Message:"Oh No !!!"})
    }
})

module.exports = {OTP:app}

