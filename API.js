const express = require('express');
const bodyParser = require('body-parser');
const file_system = require('fs');
const DATABASE =require('./Database');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//INSERT AN ACCOUNT IN DATABASE
app.post('/Subscription',(req, res) => {
    DATABASE.INSERT_ACCOUNTS_NEW_RECORD(req.body);
});

//CHECK IF USER EXISTS...
app.post("/Login",(req, res) => {
 DATABASE.FIND_USER_CREDENTIALS(req.body.login,req.body.pass,(err,results) =>{
    if(err){
        res.json(err);
    }else{
        res.json(results);
    }
 });

})

app.post('/API1',(req,res) =>{
    DATABASE.SEARCH_CITIZEN_API1(req.body.cin,(err,results) =>{
        if(err){
            res.json(err);
            console.log(err);
        }else{
            res.json(results);
        }
    })
})
app.post('/API2',(req,res) =>{
  DATABASE.SEARCH_CITIZEN_API2(req.body,(err,data) =>{
    if(err){
        res.json(err);
        console.log(err);
    }else { 
        res.json(data);
    }
  })})
//ALL API ERROR LOGS
app.get("/Logs",(req,res) =>{
file_system.readFile("./Logs/Failed.logs",(err,data) => {
    if(err){throw (err);}
     res.send("<h1> Logs : <br>"+data+"</h1>");
});
})

app.listen(2020, () => {
    console.log("Connected to Port 2020");
});