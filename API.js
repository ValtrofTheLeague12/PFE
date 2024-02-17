const express = require('express');
const bodyParser = require('body-parser');
const file_system = require('fs');
const DATABASE =require('./Database');
const Emailer = require('./Mailer');
const Encryption = require('./Encryption')
const {LocalStorage} = require('node-localstorage')
const cors = require('cors')


const local = new LocalStorage("./scratch");

const app = express();
app.use(cors());

const secure = Encryption.RANDOM_STRING().substring(0,8)
local.setItem("SecretCode",secure);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


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
//INSERT AN ACCOUNT IN DATABASE
app.post('/Subscription',(req, res) => {
    DATABASE.INSERT_ACCOUNTS_NEW_RECORD(req.body,(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json(data);
               
        }
    });
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
    console.log(req.body)
    if(req.body.code == local.getItem('SecretCode')){
        res.json({Verification:true,Message:"Correct Welcome !!!"})
    }else{
        res.json({Verification:false,Message:"Oh No !!!"})
    }
})

app.post('/EMAIL/CORDS',(req,res) => {
    const output = 'Your Username : '+req.body.Username+" <br> "
    +"Your Password : "+
    req.body.Password+"<br>"+
    "Your UUID : "+req.body.UUID+" <br>"
  Emailer.SEND_EMAIL('Account Coordinates',output,req.body.Email);
})

app.post('/SMS/CORDS',(req,res) =>{
    const input = "Your Username is : "+req.body.Username+"\n"
    + " Password : "+req.body.Password+"\n"+
    " Your UUID : "+req.body.UUID
Emailer.SEND_SMS(input,req.body.Phone)
})

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