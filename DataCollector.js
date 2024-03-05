//Promethus
const express = require('express')
const app = express()
const router =  express.Router()
const prom_scraper = require('prom-client')

prom_scraper.collectDefaultMetrics();

app.get('/', async (req,res) =>{
    try{
    res.set('Content-Type',prom_scraper.register.contentType)
    res.end(await prom_scraper.register.metrics())
     }catch(err){
    res.send(err)
    }
})

module.exports = {router}