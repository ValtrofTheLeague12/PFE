
require('dotenv').config({path:".config/Database.env"});
const pg = require('pg');
const security = require('./Encryption');
const logs = require('./Loggers');
const {QUERY} = require('./Query');
const Encryption = require("./Encryption")

const connection = new pg.Client({
    host:process.env.DATABASE_DOMAIN,
    user:process.env.DATABASE_USERNAME,
    password:process.env.DATABASE_PASSWORD, 
    database:process.env.DATABASE_DATA_SOURCE,
})

connection.connect((err) =>{
    console.log(err);
});
// this is for debugging Purposes !!!
function PRINT_ACCOUNTS_DATABASE(callback){

connection.query(QUERY.SELECT_CREDENTIALS_ALL_RECORDS,(err,data) =>{
    if(err){
        callback(err,null); //chat gpt function
        logs.failedlogs.error("Something went Wrong : "+err);
        
    }
        callback(null,data.rows); // chat gpt function
        logs.logs.info("Data Selected From Database !!!")
    });

}
function INSERT_ACCOUNTS_NEW_RECORD(input){
        console.log(security.RANDOM_STRING(),input.name,input.lastname,input.Password,input.Email)
        connection.query(QUERY.INSERT_CREDENTIALS_NEW_RECORDS,[security.RANDOM_STRING().substring(0,20),input.name,input.lastname,input.Username,security.ENCRYPT_PASSWORD(input.Password),input.Email,input.cin],(err =>{
        if(err) {console.log("Something Went Wrong : "+err);logs.failedlogs.error(err)};
        console.log("inserted !!!");
        logs.logs.info("Success !!! new User has Been Inserted !!!");
    }));
    
}

function FIND_USER_CREDENTIALS(Username,Password,callback){
    connection.query(QUERY.LOGIN_QUERY,[Username,Password],(err,data) =>{
        if(err){console.log(err);
        logs.failedlogs.error("Something Went Wrong : "+err);
         callback(err,null);
         }else{
         logs.logs.info("Success !!! Data from Credentials Table Has been Selected !!!");
         callback(null,data.rows);
        }
    });
    
}
function SEARCH_CITIZEN_API1(input,callback){
    connection.query(QUERY.API1_QUERY,[input.cin,input.date_naiss],(err,results) =>{
        if(err){
            callback(err,null);
            logs.failedlogs.error("Something Went Wrong !!! : "+err);
        }else{
            callback(null,results);
            logs.logs.info("Sucess !!! Data Selected From First API");
        }
    })

}
function SEARCH_CITIZEN_API2(input,callback){
   connection.query(QUERY.API2_QUERY,[input.date_naiss,input.gender,input.name,input.lastname,input.fathername,input.mothername],(err,data) =>{
    if(err){
        callback(err,null);
        logs.failedlogs.error(err);
    }else{
         callback(null,data);
         logs.logs.info("Sucess Data Selected !!! From API2 ");
    }
   })

}
function MODIFY_DATABASE_CREDENTIALS(input,callback){
    connection.query(QUERY.UPDATE_CREDENTIALS_RESET_PASSWORD_WITH_UUID,[Encryption.ENCRYPT_PASSWORD(input.NP),input.UUID],(err,data) =>{
      if(err){
        logs.failedlogs.error(err);
        console.log(err)
        callback(err,null);
      }else{
        let Message = `Password Updated for User with UUID : ${input.UUID}`
        console.log(Message);
        logs.logs.info(Message);
        callback(null,Message);
      }

    })

}

function SELECT_DATA_FROM_UUID(input,callback){
    connection.query(QUERY.SELECT_USER_FROM_UUID,[input],(err,data) =>{
        if(err){
            connection.end()
            logs.failedlogs.error(err);
            callback(err,null);
        }else{
            logs.logs.info("Sucess !!! Selected Data With UUID Rows Affected : "+data.rowCount);
            callback(null,data);
        }
    });
    
}

module.exports = {
    FIND_USER_CREDENTIALS,
    INSERT_ACCOUNTS_NEW_RECORD,
    PRINT_ACCOUNTS_DATABASE,
    SEARCH_CITIZEN_API1,
    SEARCH_CITIZEN_API2,
    MODIFY_DATABASE_CREDENTIALS,
    SELECT_DATA_FROM_UUID
}


