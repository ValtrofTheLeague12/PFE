const express = require('express');
const app = express.Router();
const DATABASE =require('../Database');
require('dotenv').config({path:"../.config/Pointer.env"})

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

   app.post("/Admin/VerifyUser",(req, res) => {
    DATABASE.LOGIN_ADMIN(req.body,(err,results) =>{
       if(err){
           res.json(err);
       }else{
           res.json(results);
       }
    });
   })
   module.exports = {Login:app}