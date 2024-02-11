require('dotenv').config({path:".config/Mailer.env"});
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

function SEND_SMS(newPassword,PhoneNumber){
// code from info bib API implementation
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "App 00f46d64b691b705b41c311513d2b59c-c9f95492-5a07-4d84-8b40-872bc15d420f");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    
    const raw = JSON.stringify({
        "messages": [
            {
                "destinations": [{"to":"21622495131"}],
                "from": "ServiceSMS",
                "text": "Sucess !!! Your new Password is "+newPassword
            }
        ]
    });
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://6g65l8.api.infobip.com/sms/2/text/advanced", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

}
module.exports = {
    SEND_RESET_EMAIL,
}