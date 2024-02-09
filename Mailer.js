const Mailer = require('nodemailer');
const loggers = require('./Loggers');
const RANDOM = require('./Encryption');
const KEY = RANDOM.RANDOM_STRING().substring(0,8);

function SEND_EMAIL(emailAddress){
    
    const Output = `
    Secret Code : ${KEY}
    <h1>Note : </h1>
    <p>Use this Code To Reset Your Password</p>
    <p>Link : http://localhost:3000/ResetPasswordEtape2</p>
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
for(const element of s){
results += element;
}
loggers.logs.info(`Sucess !!! Email Sended to ${results}`);
}

function RETURNKEY(){
    return KEY;
}
module.exports = {
    SEND_EMAIL,
    RETURNKEY
}