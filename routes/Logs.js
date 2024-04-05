const express = require('express');
const app = express.Router();
const file_system = require('fs');

require('dotenv').config({path:"../.config/Pointer.env"})
app.get("/Log",(req,res) => {
    let results = "Failed Logs : \n";
    file_system.readFile("./Logs/Failed.logs",(err,data) => {
        if(err){
           res.json({error:err})
        }else{
             results += data;
             file_system.readFile('./Logs/Success.logs',(err,data) =>{
                if(err){
                    res.json({error:err})
                }else{
                    results += `\n Success Logs : ${data} `
                    res.json({logs:results})
                }
                file_system.close(1)
         })
     }
    });
})

module.exports = {Logs:app}
