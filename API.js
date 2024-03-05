const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const file_system = require('fs');
const DATABASE =require('./Database');
const Emailer = require('./Mailer');
const Encryption = require('./Encryption')
const {LocalStorage} = require('node-localstorage')
const excel = require('./ExceLIO')
const cors = require('cors')
const local = new LocalStorage("./scratch");
require('dotenv').config({path:"./.config/Pointer.env"})
const file_manager = require("./FileManager")
local.setItem("SecretCode",Encryption.RANDOM_STRING().substring(0,8));
app.use(cors());
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

app.post('/db/socials/getSocialCredentials',(req,res) =>{
    DATABASE.SEARCH_DATA_FROM_SOCIAL(req.body.cin,(err,data) =>{
        if(err){
            res.json(err)
        }else{
            res.json(data)
        }
    })
})

app.post('/file/utils/upload_file',file_manager.file_manager.array('pdfFiles'),(req,res) => {
    console.log(req.file)
    res.json({"Message":"Uploaded !!!"})
})
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


app.post("/Applications/Insert",(req,res) =>{
    
        excel.WRITE_TO_USER_SHEET({cin:req.body.CIN},{
        CIN:Encryption.ENCRYPT_DATA(req.body.CIN),
        Name:Encryption.ENCRYPT_DATA(req.body.Name),
        "Last Name":Encryption.ENCRYPT_DATA(req.body["Last Name"]),
        Demande:Encryption.ENCRYPT_DATA(req.body.Demande),
        Description:Encryption.ENCRYPT_DATA(req.body.Description),
        Status:Encryption.ENCRYPT_DATA(req.body.Status),
        Date:Encryption.ENCRYPT_DATA(req.body.Date),
        "Starting Date":Encryption.ENCRYPT_DATA(req.body["Starting Date"]),
        "Ending Date ":Encryption.ENCRYPT_DATA(req.body["Ending Date "]),
        Hash:Encryption.RANDOM_STRING()
    })  
    res.send({message:"inserted !!!"})
})


app.get("/Applications/GetAllRequests",(req,res) =>{
excel.READ_ALL_APPLICATION_IN_EXCEL_FILE(results =>{
    res.send({"results":results})
})
})
app.post("/Applications/GetDetails",(req,res) =>{
     excel.GET_DEMAND_DESCRIPTION(req.body.hash,req.body.cin,(results) =>{
        if(results == undefined){
             res.send({message:'not found'})
        }else{
            res.send(results)
        }
     })
})
app.post("/Applications/GetDecryptedUserRequests",(req,res) =>{
excel.GET_DECRYPTED_USER_DATA(req.body.cin,(results) =>{
    console.log(results)
    res.send(results)
});
})

app.post("/Applications/GetUserRequests",(req,res) =>{
  excel.READ_USER_APPLICATIONS({cin:req.body.cin},(data) =>
  {
    res.send(data);
  })
})
app.get("/Applications/getHTMLApplication",(req,res) =>{
    excel.GET_APPLICATION_HTML((response) =>{
        res.send(response)
    })
})
app.post('/Applications/ReadDescription',(req,res) =>{
 var results_to_send = ""
    excel.GET_DEMAND_DESCRIPTION(req.body.hash,req.body.cin,(results) =>{
           results_to_send = results
    })
    res.json({"results":results_to_send})
})
app.post("/Applications/getUserHTMLApplication",(req,res) =>{
    res.send(excel.GET_USER_APPLICATIONS_HTML(req.body.cin,(results =>{
        res.send(results)
    })))
})

app.post('/Subscription',(req, res) => {
    DATABASE.INSERT_ACCOUNTS_NEW_RECORD(req.body,(err,data) =>{
        if(err){
            res.json(err);
        }else{
            console.log(req.body)
            excel.CREATE_NEW_USER_SHEET({cin:req.body.cin,Name:input.name,Last_name:input.lastname,Username:input.Username})
           /res.json(data);           
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

}})

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