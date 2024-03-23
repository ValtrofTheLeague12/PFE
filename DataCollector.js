//Promethus
const express = require('express')
const router =  express.Router()
const prom_scraper = require('prom-client')
prom_scraper.collectDefaultMetrics();

router.get('/Metrics', async (req,res) =>{
    try{
    res.set('Content-Type',prom_scraper.register.contentType)
    res.end(await prom_scraper.register.metrics())
     }catch(err){
    res.send(err)
    }
})

const Counter = new prom_scraper.Counter({
    name:'Testing',
    help:'number of Requests REST API'
})
const Histogram = new prom_scraper.Histogram({
    name:'Durations',
    help:'Duration of Requests',
    buckets:[1,2,5,6,10]
})

module.exports = {prom:router,Counter:Counter,Histogram:Histogram}