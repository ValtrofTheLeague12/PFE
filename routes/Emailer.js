const express = require('express');
const app = express.Router();
const Emailer = require('../Mailer');
const cors = require('cors')
require('dotenv').config({path:"../.config/Pointer.env"})
app.use(cors())

app.post('/EMAIL/CORDS', (req, res) => {
  try {
    const { Username, Password, UUID, Email } = req.body;
    const output = `Your Username: ${Username} \n
                    Your Password: ${Password} \n
                    Your UUID: ${UUID} \n`;
    Emailer.SEND_EMAIL('Account Coordinates', output, Email);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});
app.post('/Email/SendR',(req,res) => {
  Emailer.SEND_EMAIL(`Reporting issue ${req.body.issue}`,`Description : <br> ${req.body.Description}`,req.body.Email)

})
app.post('/SMS/CORDS', (req, res) => {
  try {
    const { Username, Password, UUID, Email, Phone } = req.body;
    const input = ` Your Username is: ${Username} \n Password: ${Password} \n Your UUID For Reset Password: ${UUID} \n Your Email For Reporting: ${Email} \n
                   `;
    Emailer.SEND_SMS(input, Phone);
    res.json({ message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});


module.exports = {Emailer:app}