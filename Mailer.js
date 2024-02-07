const Mailer = require('nodemailer');
const loggers = require('./Loggers');
const RANDOM = require('./Encryption');
const KEY = RANDOM.RANDOM_STRING().substring(0,8);

function SEND_EMAIL(emailAddress){
    
    const Output = `
    Secret Code : ${KEY}
    <h1 class ="text-primary">Note : </h1>
    <p>Use this Code To Reset Your Password</p>
     `
    const Sender = Mailer.createTransport({
    host:"localhost",
    port:465,
    service:"Gmail",
    secure:true,
    auth:{
        user:"jjj544754@gmail.com",
        pass:"tmmc yqnm kxfm bryy"
    }
});
Sender.sendMail({
    from:"jjj544754@gmail.com",
    to:emailAddress,
    subject:"Reseting Password",
    html:Output
},(err) =>{
    console.log(err);
    loggers.failedlogs.error(err);
})


let s = Array.from(emailAddress);
for(let i = s.indexOf(0);i< s.indexOf('@');i = i + 1){
    s[i] = '*';
}
let results = "";
for(let j = 0 ; j< s.length ; j++){
results += s[j];
}
loggers.logs.info(`Sucess !!! Email Sended to ${results}`);

}
module.exports = {
    SEND_EMAIL,
    KEY
}