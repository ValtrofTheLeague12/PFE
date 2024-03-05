require('dotenv').config({path:"./.config/Encryptionkey.env"})
const ALGORITHM = require('ncrypt-js');
const hash = require('crypto-js')

function RANDOM_STRING(){
    return hash.SHA256(crypto.randomUUID).toString();
}

function ENCRYPT_PASSWORD(Password){
let ENCRYPTION_DECRYPTION = new ALGORITHM(Password);
return ENCRYPTION_DECRYPTION.encrypt(Password,RANDOM_STRING()).substring(0,8);
}

function ENCRYPT_DATA(Password){
 const Encyrpt_Decrypt = new ALGORITHM(process.env.ENCRYPTION_KEY);
 return Encyrpt_Decrypt.encrypt(Password)
}

function DECRYPT_DATA(Password){
    const Encyrpt_Decrypt = new ALGORITHM(process.env.ENCRYPTION_KEY);
    return Encyrpt_Decrypt.decrypt(Password)
}

module.exports = {
    ENCRYPT_PASSWORD,
    RANDOM_STRING,
    ENCRYPT_DATA,
    DECRYPT_DATA

}