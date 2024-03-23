const express = require('express');
const DATABASE =require('../Database');
const app = express.Router()
const cors = require('cors')
require('dotenv').config({path:"../.config/Pointer.env"})
const Encryption = require('../Encryption')
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/Subscription/API1',(req,res) =>{
    SearchAPI1({cin:req.body.cin,date_naiss:req.body.date_naiss}).then((citoyen) =>{
      const Account = citoyen.nom + '.' + citoyen.prenom;
      const input = {
        name: citoyen.nom,
        lastname: citoyen.prenom,
        username: Account,
        Password: randomUUID().substring(0,6),
        Email: Account.concat('@idara.tn'),
        Phone: req.body.Phone,
      }
      if(citoyen.CodeR == 1){
        DATABASE.INSERT_ACCOUNTS_NEW_RECORD(input,(err,data) =>{
        if(err){
          res.status(500).json({error:"Insertion Failed !!!"})
        }else{
         input['UUID'] = data.UUID
         sendEmailAndSMS(input).
         then(results =>{res.send(results)}).
         catch(error =>{res.status(500).send({err:`Something Went Wrong !!! ${error}`})})
         res.json({"Results":"Sucess !!!"})
        }
      })
    }else{
      res.status(500).json({error:"User not found !!!"})
    }
    })
   })
     

   app.post('/Subscription/API2',(req,res) =>{
    console.log(req.body.data)
    SearchAPI2(req.body.data).then((citoyen) =>{
      console.log(citoyen)     
        const Account = citoyen.nom + '.' + citoyen.prenom
        const input = {
        name: citoyen.nom,
        lastname: citoyen.prenom,
        username: Account,
        Password: randomUUID().substring(0,8),
        Email: Account.concat('@idara.tn'),
        Phone: req.body.phone,
      }
      if(citoyen.CodeR == 1){
        DATABASE.INSERT_ACCOUNTS_NEW_RECORD(input,(err,data) =>{
        if(err){
          res.status(500).json({error:"Insertion Failed !!!"})
        }else{
         input['UUID'] = data.UUID
         sendEmailAndSMS(input).
         then(results =>{res.send(results)}).
         catch(error =>{res.status(500).send({err:`Something Went Wrong !!! ${error}`})})
         res.json({"Results":"Sucess !!!"})
        }
      })
    }else{
      res.status(500).json({error:"User not found !!!"})
    }
    })
   })

async function sendEmailAndSMS(input) {
  const requestBody = {
    Username: input.username,
    Password: input.Password,
    UUID: input.UUID,
    Email: input.Email,
    Phone: input.Phone
  };

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  };

  const emailSMSResponse = await fetch('http://localhost:2020/Emailing/SMS/CORDS', requestOptions);
  if (!emailSMSResponse.ok) {
    throw new Error(`Failed to send email or SMS: ${emailSMSResponse.status} - ${emailSMSResponse.statusText}`);
  }
}


  async function SearchAPI1(input){
    let data = await fetch('http://localhost:2020/API/API1',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(input)
   })
   return await data.json()
  }

  async function SearchAPI2(input){
    let data = await fetch('http://localhost:2020/API/API2',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(input)
   })
   return await data.json()
  }

   module.exports = {Inscription:app}