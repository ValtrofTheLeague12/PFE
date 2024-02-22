const ALGORITHM = require('ncrypt-js');
function RANDOM_STRING(){
    return crypto.randomUUID();
}

function ENCRYPT_PASSWORD(Password){
let ENCRYPTION_DECRYPTION = new ALGORITHM(Password);
return ENCRYPTION_DECRYPTION.encrypt(Password,RANDOM_STRING()).substring(0,8);
}


module.exports = {
    ENCRYPT_PASSWORD,
    RANDOM_STRING,

}