require('dotenv').config({path:"config/Mailer.env"});
const Mailer = require('nodemailer');
const loggers = require('./Loggers');
const RANDOM = require('./Encryption');
const KEY = RANDOM.RANDOM_STRING().substring(0,8);

function SEND_RESET_EMAIL(emailAddress,callback){
    
    const Output = `
    Secret Code : ${KEY}
    <h1>Note : </h1>
    <p>Use this Code To Reset Your Password</p>
    <p>Link : http://localhost:3000/ResetPasswordEtape2</p>
     `
    const Sender = Mailer.createTransport({
    host:process.env.HOST,
    port:process.env.PORT,
    service:process.env.SERVICE,
    secure:process.env.SECURE,
    auth:{
        user:process.env.USER,
        pass:process.env.PASS
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
callback(KEY);
}
SEND_RESET_EMAIL("jjj544754@gmail.com",(data) => {
    console.log(data);
})

function RETURNKEY(){
    return KEY;
}
module.exports = {
    SEND_RESET_EMAIL,
    RETURNKEY
}