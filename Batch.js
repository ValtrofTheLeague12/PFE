const shelljs = require('shelljs')
const cron = require('node-cron')

function AUTOMATE(){
 const cronJob =  cron.schedule('*/15 * * * *',() => {
    shelljs.exec('cd bash && git.bat',{async:true});
    console.log("Pushed to Github")
    shelljs.exec('pg_dump "postgres://postgres:root@localhost:5432/PFE" > ./backup/PFE.sql',{async:true})
    console.log("Database Backed !!!")
 })
 return cronJob
}
module.exports = {
    AUTOMATE
}