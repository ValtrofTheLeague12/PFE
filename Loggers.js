require('dotenv').config({path:".config/Files.env"})
const mainfile = require('winston');
// Logs Save Results of Important Events !!!
const logs = mainfile.createLogger({
    transports:[
         new mainfile.transports.File({
            filename:process.env.LOGS_PATH_SUCCESS,
            level:"info",
            format:mainfile.format.combine(mainfile.format.timestamp())
         })
    ]
})
const failedlogs = mainfile.createLogger({
    transports:new mainfile.transports.File({
        filename:process.env.LOGS_PATH_FAILED,
        level:"error",
        format:mainfile.format.combine(mainfile.format.timestamp())
    })
})
module.exports = {
    logs,
    failedlogs
}

