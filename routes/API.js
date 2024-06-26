const express = require('express');
const app = express.Router();
const DATABASE =require('../Database');

app.post('/API1',(req,res) =>{
    DATABASE.SEARCH_CITIZEN_API1(req.body,(err,results) =>{
        if(err){
            res.json(err);
            console.log(err);
        }else if(results.rows.length != 0){
                let gender = results.rows[0].genre == "Male" ? 1:0;
                let date = new Date(results.rows[0].date_naissance);
                 const to_be_sended = {
                  CodeR:1,
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

  module.exports = {API:app}