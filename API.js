const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const Batch = require('./Batch')
Batch.AUTOMATE()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const  {Blockchain} = require('./routes/cryptojs')
const {API} = require('./routes/API')
const {Emailer} = require('./routes/Emailer')
const {Inscription} = require('./routes/inscription')
const {Logs} = require('./routes/Logs')
const {OTP} = require('./routes/OTP')
const {Login} = require('./routes/login')
const {Reset} = require('./routes/Reset')
const {prom} = require('./DataCollector')
const {Demand} = require('./routes/Demande')

app.use('/stats',prom)
app.use('/Login',Login)
app.use('/Reset',Reset)
app.use('/OTP',OTP)
app.use('/Logs',Logs)
app.use('/inscription',Inscription)
app.use('/Emailing',Emailer)
app.use('/API',API)
app.use('/Demande',Demand)
app.use('/Blockchain',Blockchain)

app.listen(2020, () => {
    console.log("Connected to Port 2020");
});