const Blockchain = require('../BlockChain')
const express = require('express')
const app = express.Router();
const bodyParser = require('body-parser')
const db = require('../Database')
const fs = require('fs');
const axios = require('axios');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/crypto/ContractAndAccount',async (req,res) => {
    const data = await fs.readFileSync('truffle.txt','utf-8');
    const s = data.split('\n');
    const second_array = [];
    var third_array = [];
    var forth_array = [];
    console.log(s)

    for(let i = 0 ;i<s.length;i++){
        if(s[i].includes('account') || s[i].includes('contract address')){
        second_array.push(s[i]);
        }
    }
    console.log(second_array)
    third_array = second_array[0].split(" ")
    forth_array = second_array[1].split(" ")

    res.json({contract:third_array[third_array.length -1],
              Account:forth_array[forth_array.length - 1]})
})

app.post('/crypto/SaveHash',async (req,res) =>{
      const response = await axios.get('http://localhost:2020/Blockchain/crypto/ContractAndAccount',{headers:{
      'Accept':'application/json'
    }})

    Blockchain.SET_CHANGES_INTO_BLOCKCHAIN(response.data.Account,response.data.contract,Blockchain.CONTRACT_ABI,req.body.data,(err,hashResults) =>{
        if(err){
            console.log(err)
            res.json({error:err})
        }else{
            const ob = {
                id_cit:req.body.data.cin,
                hash:hashResults 
            }
            db.SAVE_HASH_IN_DATABASE(ob,(err,rowCount) =>{
                if(err){
                    console.log(err)
                   res.json({error:err})
                }else{
                   res.json({data:rowCount})
                }
            })
        }
    })
    
})
app.post('/crypto/getTransaction',(req,res) => {
    Blockchain.GET_DATA_BY_TRANSACTION(req.body.hash,(err,data) => {
        if(err){
              res.json({error:err})
        }else{
            res.json({results:data})
        }
        
    })
})
app.post('/crypto/VerifyConnection',(req,res) =>{
    Blockchain.VERIFY_CONNECTION(req.body.account,(data =>{
        console.log(data)
        res.json({Results:data})
    }))
})


app.get('/crypto/StartServer',(req,res) =>{
    Blockchain.START_BLOCKCHAIN((err,results) =>{
        if(err){
            console.log(err);
            res.json({error:err})
        }else{
            res.json({data:results})
        }
    });    
})


module.exports = {
    Blockchain:app
}