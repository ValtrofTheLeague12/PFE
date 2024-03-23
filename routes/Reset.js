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

app.post('/MDBReset',(req,res) => {
    console.log(req.body.SERVICE)
    console.log(local.getItem('SecretCode'))
   if(req.body.SecretCode == local.getItem('SecretCode')){
   DATABASE.MODIFY_DATABASE_CREDENTIALS(req.body,(err,message,data) =>{
    if(err){
        res.json(err)
    }else{
        if(req.body.SERVICE == "EMAIL"){
           Emailer.SEND_EMAIL("Reset Update Sucess !!!","Your new Password is : "+data.rows[0].Password,data.rows[0].Email);
        }else{
          Emailer.SEND_SMS("Your New Password is : "+data.rows[0].Password,data.rows[0].Phone);
        }
        res.json(message);
    }
   });
}else{
  res.json({Message:"Error Please Verify Your Secret Code..."})

}})

app.post("/EMAIL",(req,res) =>{ 
    DATABASE.SELECT_DATA_FROM_UUID(req.body.UUID,(err,data) =>{
       if(err){
           res.json(err);
       }else if(data.rows.length <= 0){
           res.json({"Rows":data.rows.length,"Message":"User not Found !!!"});
       }else if(req.body.SEND == "EMAIL"){
           const Output = `
           Secret Code : ${local.getItem("SecretCode")}
           <h1>Note : </h1>
           <p>Use this Code To Reset Your Password</p>
           <p>Link : http://localhost:3000/ResetPasswordEtape2</p>
    `
           Emailer.SEND_EMAIL("Reseting Password",Output,data.rows[0].Email);
           res.json({"Rows":data.rows.length,"Message":"Sucess !!!"});
      }else{
          const Output = 'Secret Code is : '+local.getItem('SecretCode');
          Emailer.SEND_SMS(Output,data.rows[0].Phone);
      }
    })
    
})
module.exports = {Reset:app}