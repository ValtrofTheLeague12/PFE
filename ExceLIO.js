require('dotenv').config({path:"./.config/Pointer.env"})
const Loggers = require('./Loggers')
const encrypt = require('./Encryption')
const excel = require('xlsx');
const workbook = excel.readFile('./Crypto Base/data.xlsx')
const Backup = require('./Backup')


function GET_DEMAND_DESCRIPTION(hash,cin,callback){
    const data = {}
    for(const sheet_name of workbook.SheetNames){
        data[sheet_name] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name]);
    }
    data[`UUID${cin}`].forEach(element => {
        if(element.Hash == hash){
            callback(encrypt.DECRYPT_DATA(element.Description))
        }
    });
    
}
function WRITE_TO_APPLICATION_FILE(input){
     try{
    const data = {}
    for(const sheet_name of workbook.SheetNames){
        data[sheet_name] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name]);
    }
    data.Applications.push(input)
    excel.utils.sheet_add_json(workbook.Sheets["Applications"],data.Applications)
    excel.writeFile(workbook,'./Crypto Base/data.xlsx');
    Loggers.logs.info("New Inserted To Application Sheet !!! in "+new Date())
    console.log("Inserted !!! ")
    }catch(error){
    Loggers.failedlogs.error("Error : "+error)
    console.log(error)
}
}
function GET_DECRYPTED_USER_DATA(cin,callback){
    const data = {}
    for(const sheet_name of workbook.SheetNames){
        data[sheet_name] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name]);
    }
    array = []

    data[`UUID${cin}`].forEach(ele =>{
             array.push({CIN:encrypt.DECRYPT_DATA(ele.CIN)
            ,Name:encrypt.DECRYPT_DATA(ele.Name),
            "Last Name":encrypt.DECRYPT_DATA(ele['Last Name']),
             Demande:encrypt.DECRYPT_DATA(ele.Demande),
             Etat:encrypt.DECRYPT_DATA(ele.Status),
            "Submitting Date":encrypt.DECRYPT_DATA(ele.Date),
            "Date of Starting":encrypt.DECRYPT_DATA(ele['Starting Date']),
            "Date of Ending":encrypt.DECRYPT_DATA(ele['Ending Date '])})
    })
    callback(array)
}
    function CREATE_NEW_USER_SHEET(input){
    const new_sheet = excel.utils.aoa_to_sheet([])
    excel.utils.book_append_sheet(workbook,new_sheet,`UUID${input.cin}`);
    excel.writeFile(workbook,"./Crypto Base/data.xlsx"); 
    Backup.UPDATE_FILE('./Crypto Base/data.xlsx')
    }  


function WRITE_TO_USER_SHEET(userCredentials,new_data){
   const data = {}
    for(const sheet_name of workbook.SheetNames){
        data[sheet_name] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name]);
    }
    console.log(userCredentials.cin)
    WRITE_TO_APPLICATION_FILE(new_data)
    data[`UUID${userCredentials.cin}`].push(new_data)
    excel.utils.sheet_add_json(workbook.Sheets[`UUID${userCredentials.cin}`],data[`UUID${userCredentials.cin}`])
    process.env.END_POINT = process.env.START_POINT 
    process.env.START_POINT = encrypt.RANDOM_STRING()
    excel.writeFile(workbook,'./Crypto Base/data.xlsx');
    Backup.UPDATE_FILE('./Crypto Base/data.xlsx')
}


function GET_APPLICATION_HTML(callback){
    const data = {}
    for(const sheet_name of workbook.SheetNames){
        data[sheet_name] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name]);
    }
    var html = ``
    data[`Applications`].forEach(element => {
         html += `<tr><td>${element.Hash.substring(0,8)}</td>`+ 
         `<td>${element.CIN.substring(0,8)}</td>`+
         `<td>${element.Name.substring(0,8)}</td>`+
         `<td>${element['Last Name'].substring(0,8)}</td>`+
         `<td>${element.Demande.substring(0,8)}</td>`+
         `<td>${encrypt.DECRYPT_DATA(element.Status)}</td>`+
         `<td>${element.Date.substring(0,8)}</td>`+
         `<td>${element['Starting Date'].substring(0,8)}</td>`+
         `<td>${element['Ending Date '].substring(0,8)}</td>
         </tr>`
    });
       callback(html)
}

function GET_USER_APPLICATIONS_HTML(cin,callback){
    const data = {}
    for(const sheet_name of workbook.SheetNames){
        data[sheet_name] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name]);
    }
    var html = ``
    console.log(data[`UUID${cin}`])
        data[`UUID${cin}`].forEach(element => {
        if(encrypt.DECRYPT_DATA(element.Status) == "en Cours"){
         html += `<tr><td>${element.Hash}</td>`+ 
         `<td id ="cin">${encrypt.DECRYPT_DATA(element.CIN)}</td>`+
         `<td>${encrypt.DECRYPT_DATA(element.Name)}</td>`+
         `<td>${encrypt.DECRYPT_DATA(element['Last Name'])}</td>`+
         `<td>${encrypt.DECRYPT_DATA(element.Demande)}</td>`+
         `<td class ="text-primary">${encrypt.DECRYPT_DATA(element.Status)}</td>`+
         `<td>${encrypt.DECRYPT_DATA(element.Date)}</td>`+
         `<td>${encrypt.DECRYPT_DATA(element['Starting Date'])}</td>`+
         `<td>${encrypt.DECRYPT_DATA(element['Ending Date '])}</td>
         <td><center><button id ="actionReadDescription" class ="btn btn-outline-primary getData" onclick ="READ_DESCRIPTION(this)">Read Description</button></center></td>
         </tr>`
          }else if(encrypt.DECRYPT_DATA(element.Status) == "Accepted"){
            html += `<tr><td>${element.Hash}</td>`+ 
            `<td>${encrypt.DECRYPT_DATA(element.CIN)}</td>`+
            `<td>${encrypt.DECRYPT_DATA(element.Name)}</td>`+
            `<td>${encrypt.DECRYPT_DATA(element['Last Name'])}</td>`+
            `<td>${encrypt.DECRYPT_DATA(element.Demande)}</td>`+
            `<td class = "text-success">${encrypt.DECRYPT_DATA(element.Status)}</td>`+
            `<td>${encrypt.DECRYPT_DATA(element.Date)}</td>`+
            `<td>${encrypt.DECRYPT_DATA(element['Starting Date'])}</td>`+
            `<td>${encrypt.DECRYPT_DATA(element['Ending Date '])}</td>
            <td><center><button name ="printCert" class ="btn btn-outline-success" onclick = "PRINT_CERT(this)">Print Certificate</button></center></td>
            </tr>`
            }else{
            html += `<tr><td>${element.Hash}</td>`+ 
            `<td>${encrypt.DECRYPT_DATA(element.CIN)}</td>`+
            `<td>${encrypt.DECRYPT_DATA(element.Name)}</td>`+
            `<td>${encrypt.DECRYPT_DATA(element['Last Name'])}</td>`+
            `<td>${encrypt.DECRYPT_DATA(element.Demande)}</td>`+
            `<td class ="text-danger">${encrypt.DECRYPT_DATA(element.Status)}</td>`+
            `<td>${encrypt.DECRYPT_DATA(element.Date)}</td>`+
            `<td>${encrypt.DECRYPT_DATA(element['Starting Date'])}</td>`+
            `<td>${encrypt.DECRYPT_DATA(element['Ending Date '])}</td>
            <td><center><button name ="ReplayService" class ="btn btn-outline-danger " onclick ="document.location = '/recours'
            ">Reapply for Service</button></center></td>
            </tr>`
          }
    });
callback(html)
}

function READ_ALL_APPLICATION_IN_EXCEL_FILE(callback){
    const data = {}
    for(const sheet_name of workbook.SheetNames){
        data[sheet_name] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name]);
    }
    callback(data.Applications)
}

function READ_USER_APPLICATIONS(input,callback){
    const data = {}
    for(const sheet_name of workbook.SheetNames){
        data[sheet_name] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name]);
    }
    callback(data[`UUID${input.cin}`])
}

module.exports = {
READ_ALL_APPLICATION_IN_EXCEL_FILE,
READ_USER_APPLICATIONS,
WRITE_TO_APPLICATION_FILE,
WRITE_TO_USER_SHEET,
CREATE_NEW_USER_SHEET,
GET_APPLICATION_HTML,
GET_USER_APPLICATIONS_HTML,
GET_DECRYPTED_USER_DATA,
GET_DEMAND_DESCRIPTION
}