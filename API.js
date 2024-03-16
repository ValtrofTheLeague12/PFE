const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const {API} = require('./routes/API')
const {Emailer} = require('./routes/Emailer')
const {Inscription} = require('./routes/inscription')
const {Logs} = require('./routes/Logs')
const {OTP} = require('./routes/OTP')
const {Login} = require('./routes/login')
const {Reset} = require('./routes/Reset')
const {prom} = require('./DataCollector')

app.use('/stats',prom)
app.use('/Login',Login);
app.use('/Reset',Reset)
app.use('/OTP',OTP)
app.use('/Logs',Logs)
app.use('/inscription',Inscription)
app.use('/Emailing',Emailer)
app.use('/API',API)


app.listen(2020, () => {
    console.log("Connected to Port 2020");
});