require('dotenv').config({path:".config/Mailer.env"});
const Mailer = require('nodemailer');
const loggers = require('./Loggers');
const RANDOM = require('./Encryption');

function SEND_EMAIL(subject,Output,emailAddress){
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
    from:process.env.USER,
    to:emailAddress,
    subject:subject,
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
loggers.logs.info(`Sucess !!! Email Sended to ${results}`);;
}

function SEND_SMS(input,phoneNumber){

    fetch("https://2vnvmp.api.infobip.com/sms/2/text/advanced",{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Accept':'application/json',
            "Authorization":`App 76abbdc16792dd29e2dac58d467a9e94-09eacc42-c976-439a-9a5f-6af579c5486a`
        },
        body:JSON.stringify({
            "messages":[{
                "destinations":[{"to":`+216${phoneNumber}`}],
                "from":'Minister des Affaires Social',
                "text":input
            }]
        })
    }).then((response) =>{
        console.log(response.json());
    }).catch(err =>{
        console.log(err);
    })
}

function SEND_SECRET_OTP_SMS(PhoneNumber,SecretCode,callback){
// code from info bib API implementation
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "App 76abbdc16792dd29e2dac58d467a9e94-09eacc42-c976-439a-9a5f-6af579c5486a");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    
    const raw = JSON.stringify({
        "messages": [
            {
                "destinations": [{"to":`+216${PhoneNumber}`}],
                "from": "Minister Des Affaires Social (Yassine Loussaief)",
                "text": "OTP Code is : "+SecretCode
            }
        ]
    });
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://2vnvmp.api.infobip.com/sms/2/text/advanced", requestOptions)
        .then((response) => console.log(response.text()))
        .then((result) => callback(null,result))
        .catch((error) => {callback(error,null);
        console.log(error)});
        
}
module.exports = {
    SEND_EMAIL,
    SEND_SECRET_OTP_SMS,
    SEND_SMS
}