const Express = require('express')
const db = require('../Database')
const app = Express.Router();
const Logs  = require('../Loggers')


app.post('/Insert',(req,res) =>{
  db.INSERT_DEMANDE(req.body,(err,data) =>{
    if(err){
        console.log(err)
        res.json({error:err})
    }else{
       const ID = data.cin.substring(0,3)+'*****'
        Logs.logs.info('new Demande Has Been Requested in '+new Date() + 'for User with ID : '+ID)
        res.json({"Results":"Inserted..."})
    }
  })
})

app.get('/Info/getAdmins',(req,res) => {
  db.GET_ADMINS((err,data) => {
    if(err){
      res.json({error:err})
    }else{
      res.json({response:data})
    }
  })
})
app.post('/Info/getSpouseInfo',(req,res) =>{
  db.GET_SPOUSE_DATA(req.body,(err,data)  => {
    if(err){
        console.log(err)
        res.json({error:err})
    }else{
        res.json({data:data})
    }
 })
})

app.get('/Info/getAllDemands',(req,res) =>{
  db.GENERATE_HTML_RECORDS(0,0,(err,data) =>{
    if(err){
      res.json({error:err})
    }else{
      res.json({data:data})
    }
  })
})


app.get('/Info/Recours/getAllDemands',(req,res) =>{
  db.GET_ALL_RECOURS_DEMANDS_FOR_ADMIN((err,data) =>{
    if(err){
      res.json({error:err})
    }else{
      res.json({html:data})
    }
  })
})

app.post('/Modify/Results/Failure',(req,res) =>{
  console.log(req.body)
   db.REFUSE_DEMANDE_DB(req.body,(err,data) =>{
    if(err){
      res.json({error:err})
    }else{
      res.json({"Modified":"true"})
    }
   })
})
app.post('/Modify/Results/Accept',(req,res) =>{ 
  console.log(req.body)
  db.ACCEPT_DEMANDE(req.body,(err,data) =>{
    if(err){
      res.json({erreur:err})
    }else{
      res.json({results:data})
    }
  })
})

app.post('/Info/GetAllDemandsForOneUser',(req,res) =>{
db.GET_ALL_USER_DEMANDS_FROM_DB_WITH_ID(req.body,(err,data) =>{
  console.log(req.body)
  if(err){
    res.json({error:err})
  }else{
    console.log(data)
    res.json({results:data})
  }
})
})

app.post('/Insert/Recours',(req,res) =>{
  console.log(req.body)
db.INSERT_NEW_RECOURS(req.body,(err,data) =>{
  console.log(err)
  if(err){
    res.json({error:err})
  }else{
    res.json({data:'inserted...'})
  }
})
})
app.post('/Modify/Recours/Results/Accept',(req,res) =>{
  console.log(req.body)
  db.ACCEPT_RECOURS(req.body,(err,data) =>{
    if(err){
      res.json({error:err})
    }else{
      res.json({
        results:data
      })
    }
  })
})
app.post('/Modify/Recours/Results/Failure',(req,res) =>{
console.log(req.body)
  db.REFUSE_RECOURS(req.body,(err,data) =>{
    if(err){
      console.log(err)
      res.json({error:err})
    }else{
      res.json({results:data})
    }
  })
})
app.post('/Info/getDemandByID',(req,res) =>{
  db.GET_DEMANDE_BY_ID(req.body,(err,data) =>{
    if(err){
      res.json({error:err})
    }else{
      var results = {
        results:data
      }
      res.json({data:results})
    }
   })
})
app.get('/Info/Statistics',(req,res) =>{
  db.STATISTICS((err,data) => {
      if(err){
        res.json({error:err})
      }else{
        res.json({results:data})
      }
  })
})


app.get('/Info/Statistics/Category',(req,res) => {
  const Statistics = [{Demande:null},{Recours:null}]
db.STATISTICS_PER_REQUEST_TYPE((err,data) =>{
  if(err){
    res.json({error:err})
  }else{
    Statistics[0].Demande = data;
     db.STATISTICS_PER_RECOURS_TYPE((err ,data) =>{
      if(err){
        res.json({error:err})
      }else{
        Statistics[1].Recours = data
        res.json({data:Statistics})
      }
     })
  }
})  
})

app.post('/Info/Father',(req,res) =>{
  db.GET_PARENTS_CIN(req.body,(err,data) => {
   if(err){
    console.log(err)
     res.json({error:err})
   }else{
     res.json({results:data})
   }
  })
 })
 
 app.post('/Info/Mother', (req,res) =>{
   db.GET_PARENTS_CIN(req.body,(err,data) => {
     if(err){
      console.log(err)
       res.json({error:err})
     }else{
       res.json({results:data})
     }
    })
 })

app.post('/Info/GetAcceptedServicesWithID',(req,res) =>{
  console.log(req.body)
  db.GET_ACCEPTED_REQUESTS_WITH_ID(req.body,(err,data) =>{
    if(err){
      res.json({error:err})
    }else{
      res.json({results:data})
    }
  })
})

module.exports = {Demand:app}