const express = require('express');
const app = express.Router();
const file_system = require('fs');
const DATABASE =require('../Database');
const Emailer = require('../Mailer');
const Encryption = require('../Encryption')
const {LocalStorage} = require('node-localstorage')
const cors = require('cors')
const local = new LocalStorage("./scratch");
require('dotenv').config({path:"../.config/Pointer.env"})
const file_manager = require("../../Users/medhe/OneDrive/Bureau/PFE/routes/FileManager")
local.setItem("SecretCode",Encryption.RANDOM_STRING().substring(0,8));

app.post('/AfterLogin/getCredentialsFromLogin',(req,res) =>{
    DATABASE.GET_CREDENTIALS_AFTER_LOGIN({name:req.body.name,Last_name:req.body.ln},(err,results) =>{
        if(err){
            console.log(err)
            res.send(err)
        }else{
            res.send({data:results})
        }
    })
})

app.post("/VerifyUser",(req, res) => {
    DATABASE.FIND_USER_CREDENTIALS(req.body.login,req.body.pass,(err,results) =>{
       if(err){
           res.json(err);
       }else{
           res.json(results);
       
       }
    });
   })
   module.exports = {Login:app}