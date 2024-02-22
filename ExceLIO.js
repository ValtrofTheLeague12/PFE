
const Loggers = require('./Loggers')
const encrypt = require('./Encryption')
const excel = require('xlsx');
const workbook = excel.readFile('./Crypto Base/data.xlsx')

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
    console.log(Error)
}
}

function CREATE_NEW_USER_SHEET(input){
    const new_sheet = excel.utils.aoa_to_sheet([])
    excel.utils.book_append_sheet(workbook,new_sheet,`UUID${input.cin}`);
    excel.writeFile(workbook,"./Crypto Base/data.xlsx");    
}

function WRITE_TO_USER_SHEET(userCredentials,new_data){
   const data = {}
    for(const sheet_name of workbook.SheetNames){
        data[sheet_name] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name]);
    }
   data[`UUID${userCredentials.cin}`].push(new_data);
   console.log(data)
   excel.utils.sheet_add_json(workbook.Sheets[`UUID${userCredentials.userCredentials}`],data[`UUID${userCredentials.cin}`])
   excel.writeFile(workbook,'./Crypto Base/data.xlsx');
}

function READ_ALL_APPLICATION_IN_EXCEL_FILE(){
    const data = {}
    for(const sheet_name of workbook.SheetNames){
        data[sheet_name] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name]);
    }
    return data;

}

function READ_USER_APPLICATIONS(input){
    const data = {}
    for(const sheet_name of workbook.SheetNames){
        data[sheet_name] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name]);
    }
    return data[`UUID${input.cin}`]
}

module.exports = {
READ_ALL_APPLICATION_IN_EXCEL_FILE,
READ_USER_APPLICATIONS,
WRITE_TO_APPLICATION_FILE,
WRITE_TO_USER_SHEET,
CREATE_NEW_USER_SHEET
}