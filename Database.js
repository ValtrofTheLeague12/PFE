
require('dotenv').config({path:".config/Database.env"});
const pg = require('pg');
const security = require('./Encryption');
const logs = require('./Loggers');
const {QUERY} = require('./Query');
const Encryption = require("./Encryption")

const connection = new pg.Pool({
    host:"localhost",
    user:"postgres",
    password:"root", 
    database:"PFE"
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
        callback(null,data.rows[0]);
        logs.logs.info("Data Selected From Database !!!")
    });
}

function GET_CREDENTIALS_AFTER_LOGIN(input,callback){
    connection.query(QUERY.SELECT_CREDENTIALS_FROM_NAME_LAST_DAD_GRANDPARENTS,[input.name,input.Last_name],(err,data) =>{
        if(err){
            callback(err,null)
        }else{
            console.log(data)
            callback(data.rows[0],null)
        }
    })
}
function INSERT_ACCOUNTS_NEW_RECORD(input,callback){
        console.log(security.RANDOM_STRING(),input.name,input.lastname,input.Password,input.Email,input.Phone)
        connection.query(QUERY.INSERT_CREDENTIALS_NEW_RECORDS,[security.RANDOM_STRING().substring(0,5),input.name,input.lastname,input.username,security.ENCRYPT_PASSWORD(input.Password),input.Email,input.Phone],(err,data) =>{
        if(err) {
            console.log("Something Went Wrong : "+err);
            logs.failedlogs.error(err)
            callback(err,null);
        };
        console.log("inserted !!!");
        logs.logs.info("Success !!! new User has Been Inserted !!!");
        callback(null,data.rows[0]);
    });
    
}

function FIND_USER_CREDENTIALS(Username,Password,callback){
    connection.query(QUERY.LOGIN_QUERY,[Username,Password],(err,data) =>{
        if(err){
            console.log(err);
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
            console.log(results)
            console.log(results.fields)
            console.log(results.rowCount)
            logs.logs.info("Sucess !!! Data Selected From First API");
            callback(null,results);
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
        callback(err,null,null);
      }else{
        let Message = `Password Updated for User with UUID : ${input.UUID}`
        console.log(Message);
        logs.logs.info(Message);
        callback(null,Message,data);
      }

    })

}

function SELECT_DATA_FROM_UUID(input,callback){
    connection.query(QUERY.SELECT_USER_FROM_UUID,[input],(err,data) =>{
        if(err){
            logs.failedlogs.error(err);
            callback(err,null);
        }else{
            logs.logs.info("Sucess !!! Selected Data With UUID Rows Affected : "+data.rowCount);
            callback(null,data);
        }
    });
}
function SEARCH_DATA_FROM_SOCIAL(input,callback){
    connection.query(QUERY.GET_SOCIAL_CREDENTIALS,[input.cin],(err,data) =>{
        if(err){
            callback(err,null)
        }else{
            callback(null,data.rows[0])
        }
    })
}

module.exports = {
    FIND_USER_CREDENTIALS,
    INSERT_ACCOUNTS_NEW_RECORD,
    PRINT_ACCOUNTS_DATABASE,
    SEARCH_CITIZEN_API1,
    SEARCH_CITIZEN_API2,
    MODIFY_DATABASE_CREDENTIALS,
    SELECT_DATA_FROM_UUID,
    GET_CREDENTIALS_AFTER_LOGIN,
    SEARCH_DATA_FROM_SOCIAL
}


