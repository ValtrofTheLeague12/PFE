// GOOGLE DRIVE
require('dotenv').config({path:"./.config/GoogleApi.env"})
const file = require('fs');
const google = require('googleapis');
const shell = require('shelljs')

const jwtAuthentification = new google.Auth.JWT({
    email:process.env.CLIENT_EMAIL,
    clientId:process.env.CLIENT_ID,
    key:process.env.CLIENT_PRIVATE_KEY,
    scopes:['https://www.googleapis.com/auth/drive']

})
jwtAuthentification.authorize((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Connected !!!")
    }
});
 const googleDrive = google.google.drive({version:'v3',auth:jwtAuthentification})



async function SAVE_FILES(input){
 return await new Promise((reject,resolve) =>{
    googleDrive.files.create({
        resource:{
            name:"Backup.xlsx",
            parents:[process.env.PARENT_ID]
        },
        media:{
            body:file.createReadStream(input),
            mimeType:'application/*'
        }
    },(err,fs) =>{
        if(err){
            reject(err)
        }else{
            resolve(fs)
        }
    } 
    )

 })
}
function UPDATE_FILE(input){
    googleDrive.files.update({
        fileId:process.env.FILE_ID,
        resource:{
            name:"Backup.xlsx",
            removeParents:'1zRn2ajeofCdhf96bWtaatDB9BqSTRIR0',
        },
        media:{
            mimeType:'application/*',
            body:file.createReadStream(input)
        }
    }).then(results =>{
        return results.data
    })
}

module.exports ={
    SAVE_FILES,
    UPDATE_FILE
}