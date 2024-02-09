const express = require('express');
const bodyParser = require('body-parser');
const file_system = require('fs');
const DATABASE =require('./Database');
const Emailer = require('./Mailer');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post("/EMAIL",(req,res) =>{
     DATABASE.SELECT_DATA_FROM_UUID(req.body.UUID,(err,data) =>{
        if(err){
            res.json(err);
            console.log(err);
        }else if(data.rows.length <= 0){
            res.json({"Rows":data.rows.length,"Message":"User not Found !!!"});
        }else{
            Emailer.SEND_EMAIL(data.rows[0].Email);
            res.json({"Message":"Sucess !!!"});
        }
     })
})
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

app.post('/MDB',(req,res) => {
  DATABASE.MODIFY_DATABASE_CREDENTIALS(req.body,(err,data) =>{
    if(err){
        console.log(err);
        res.json(err);
    }else{
        console.log(data)
        res.json(data);
    }
  })
})
app.post('/API1',(req,res) =>{
    DATABASE.SEARCH_CITIZEN_API1(req.body.cin,(err,results) =>{
        if(err){
            res.json(err);
            console.log(err);
        }else if(results.rows.length != 0){
                let gender = results.rows[0].genre == "Male" ? 1:0;
                let date = new Date(results.rows[0].date_naissance);
                 const to_be_sended = {
                 "CodeR":1,
                 "Message":"Sucess !!!",
                 "idSocial":results.rows[0].idsocial,
                 "prenom":results.rows[0].prenom,
                 "nom":results.rows[0].nom,
                 "genre":gender,
                 "jourNaissance":date.getDay(),
                 "moisNaissance":date.getMonth(),
                 "YearNaissance":date.getFullYear(),
                 "communeCode": results.rows[0].communeCode, 
                 "communeLib":  results.rows[0].communeLib,
                 "consulatCode": results.rows[0].consulatCode,
                 "consulatLib": results.rows[0].consulatLib,
                 "chainePere": results.rows[0].nomPere,
                 "chaineMere": results.rows[0].nomMere,
                 "nationalitePereCode":results.rows[0].nationalitePereCode ,
                 "nationalitePereLib":results.rows[0].nationalitePereLib ,
                 "nationaliteMereCode": results.rows[0].nationaliteMereCode,
                 "nationaliteMereLib": results.rows[0].nationaliteMereLib,
                 "dateDecesAct": results.rows[0].dateDecesAct, 
                 "dateDecesMention": results.rows[0].dateDecesMention 
            }
            res.json(to_be_sended);
        }else{
                 const to_be_sended = {
                 "CodeR":0,
                 "Message":"No Citizen Was Found With this ID...",
                 "idSocial":null,
                 "prenom":null,
                 "nom":null,
                 "genre":null,
                 "jourNaissance":null,
                 "moisNaissance":null,
                 "YearNaissance":null,
                 "communeCode": null, 
                 "communeLib":  null,
                 "consulatCode": null,
                 "consulatLib": null,
                 "chainePere": null,
                 "chaineMere": null,
                 "nationalitePereCode":null,
                 "nationalitePereLib":null,
                 "nationaliteMereCode":null,
                 "nationaliteMereLib": null,
                 "dateDecesAct": null, 
                 "dateDecesMention": null
            }
            res.json(to_be_sended);
        }
    })
})
// Same Type of Return But Not The Same Params
app.post('/API2',(req,res) =>{
  DATABASE.SEARCH_CITIZEN_API2(req.body,(err,results) =>{
    if(err){
        res.json(err);
        console.log(err);
    }else if(results.rows.length != 0){  
              let gender = results.rows[0].genre == "Male" ? 1:0;
              let date = new Date(results.rows[0].date_naissance);
              const to_be_sended = {
                 "CodeR":1,
                 "Message":"Sucess !!!",
                 "idSocial":results.rows[0].idsocial,
                 "prenom":results.rows[0].prenom,
                 "nom":results.rows[0].nom,
                 "genre":gender,
                 "jourNaissance":date.getDay(),
                 "moisNaissance":date.getMonth(),
                 "YearNaissance":date.getFullYear(),
                 "communeCode": results.rows[0].communeCode, 
                 "communeLib":  results.rows[0].communeLib,
                 "consulatCode": results.rows[0].consulatCode,
                 "consulatLib": results.rows[0].consulatLib,
                 "chainePere": results.rows[0].nomPere,
                 "chaineMere": results.rows[0].nomMere,
                 "nationalitePereCode":results.rows[0].nationalitePereCode ,
                 "nationalitePereLib":results.rows[0].nationalitePereLib ,
                 "nationaliteMereCode": results.rows[0].nationaliteMereCode,
                 "nationaliteMereLib": results.rows[0].nationaliteMereLib,
                 "dateDecesAct": results.rows[0].dateDecesAct, 
                 "dateDecesMention": results.rows[0].dateDecesMention 
            }
        res.json(to_be_sended);
    }else{
            const to_be_sended = {
            "CodeR":0,
            "Message":"No Citizen Was Found With this Cordinates...",
            "idSocial":null,
            "prenom":null,
            "nom":null,
            "genre":null,
            "jourNaissance":null,
            "moisNaissance":null,
            "YearNaissance":null,
            "communeCode": null, 
            "communeLib":  null,
            "consulatCode": null,
            "consulatLib": null,
            "chainePere": null,
            "chaineMere": null,
            "nationalitePereCode":null,
            "nationalitePereLib":null,
            "nationaliteMereCode":null,
            "nationaliteMereLib": null,
            "dateDecesAct": null, 
            "dateDecesMention": null
       }
        res.json(to_be_sended);
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