
const mainfile = require('winston');
// Logs Save Results of Important Events !!!
const logs = mainfile.createLogger({
    transports:[
         new mainfile.transports.File({
            filename:"Logs/Success.logs",
            level:"info",
            format:mainfile.format.combine(mainfile.format.timestamp())
         })
    ]
})
const failedlogs = mainfile.createLogger({
    transports:new mainfile.transports.File({
        filename:"Logs/Failed.logs",
        level:"error",
        format:mainfile.format.combine(mainfile.format.timestamp())
    })
})
module.exports = {
    logs,
    failedlogs
}
