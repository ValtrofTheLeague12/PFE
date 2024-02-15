const express = require('express');
const bodyParser = require('body-parser');
const file_system = require('fs');
const DATABASE =require('./Database');
const Emailer = require('./Mailer');
const Encryption = require('./Encryption')
const {LocalStorage} = require('node-localstorage')
const cors = require('cors')


var local = new LocalStorage("./scratch");

const app = express();
app.use(cors())
var secure = Encryption.RANDOM_STRING().substring(0,8)
local.setItem("SecretCode",secure)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.post("/EMAIL",(req,res) =>{ 
     DATABASE.SELECT_DATA_FROM_UUID(req.body.UUID,(err,data) =>{
        if(err){
            res.json(err);
        }else if(data.rows.length <= 0){
            res.json({"Rows":data.rows.length,"Message":"User not Found !!!"});
        }else{
            Emailer.SEND_RESET_EMAIL(data.rows[0].Email,(key) =>{
            local.setItem('emailkey',key);
            });
            res.json({"Rows":data.rows.length,"Message":"Sucess !!!"});
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



app.post('/SMS',(req,res) =>{
    Emailer.SEND_SECRET_OTP_SMS(req.body.Phone,local.getItem('SecretCode'),(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json(data)
        }
    })

})

app.post('/VerifySMS',(req,res) => {
    console.log(local.getItem('SecretCode'))
    if(req.body.code == local.getItem('SecretCode')){
        res.json({Verification:true,Message:"Correcto Welcome !!!"})
    }else{
        res.json({Verification:false,Message:"Oh No !!!"})
    }
})

app.post('/MDBReset',(req,res) => {
    console.log(req.body)
    console.log(local.getItem('emailkey'))
   if(req.body.SecretCode == local.getItem('emailkey')){
   DATABASE.MODIFY_DATABASE_CREDENTIALS(req.body,(err,data) =>{
    if(err){
        res.json(err)
    }else{
        console.log(data)
        res.json(data)
    }
   });
}else{
  res.json({Message:"Error Please Verify Your Secret Code..."})
}
})

app.post('/API1',(req,res) =>{
    DATABASE.SEARCH_CITIZEN_API1(req.body,(err,results) =>{
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
    console.log(req.body)
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