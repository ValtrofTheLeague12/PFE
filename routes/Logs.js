const express = require('express');
const app = express.Router();
const file_system = require('fs');
require('dotenv').config({path:"../.config/Pointer.env"})

app.get("/FailedLogs",(req,res) =>{
    file_system.readFile("./Logs/Failed.logs",(err,data) => {
        if(err){throw (err);}
         res.send("<h1> Logs : <br>"+data+"</h1>");
    });
    })
    module.exports = {Logs:app}