
require('dotenv').config({path:".config/Database.env"});
const pg = require('pg');
const security = require('./Encryption');
const logs = require('./Loggers');
const {QUERY} = require('./Query');
const { randomUUID } = require('crypto');

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
function INSERT_DEMANDE(input,callback){
    const underaged = input.age >= 18 ? false : true;
    const FatherCIN = input.age >= 18 ? 'Above 18':input.guardianPereCIN
    const MotherCIN = input.age >= 18 ? 'Above 18':input.guardianMereCIN
    const jobType = input.age >= 18 ? input.jobType:'Under 18'
    const SpouseName  = input.age >= 18 ? input.spouseName : 'Under 18'
    const spouseLastName = input.age >=18 ? input.spouseLastName : 'Under 18'
    const ID = input.age >= 18 ? input.cin : input.Social_id
    const KIDS = input.age >= 18 ? input.numberOfKids : 0

    connection.query(QUERY.INSERT_NEW_DEMAND,[input.nom,input.prenom,ID,input.dateNaissance,input.age,input.Handicap,input.HandicapSelected,input.annualIncome
    ,input.category,input.consultat,input.disabilities,input.disabilitiesSelected,input.fatherLastName,input.fatherName,input.governorate,jobType,input.motherLastName,input.motherName,
     KIDS,SpouseName,spouseLastName,input.files,underaged,"Pending...",randomUUID().substring(0,10),"Pending...","Pending...",FatherCIN,MotherCIN,"On Hold...","On Hold..."],(err,data) =>{
        if(err){
            callback(err,null)
        }else{
            callback(null,data.rows[0])
        }
     })
}
function INSERT_ACCOUNTS_NEW_RECORD(input,callback){
        console.log(security.RANDOM_STRING(),input.name,input.lastname,input.Password,input.Email,input.Phone)
        connection.query(QUERY.INSERT_CREDENTIALS_NEW_RECORDS,[randomUUID().substring(0,6),input.name,input.lastname,input.username,input.Password,input.Email,input.Phone],(err,data) =>{
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

function GET_SPOUSE_DATA(input,callback){
     connection.query(QUERY.SELECT_SOCIAL_CREDENTIALS_FROM_FAMILLY,[input.last,input.name],(err,data) =>{
        if(err){
            callback(err,null)
        }else{
            callback(null,data.rows[0])
        }
     })
}

function GENERATE_HTML_RECORDS(start,limit,callback){
const startIndex = (start - 1) * limit
const endIndex = start * limit
var results = {}
connection.query(QUERY.ADMIN_SELECT_ALL_DEMANDS,(err,data) =>{
   if(err){
    callback(err,null)
   }else{
    var html = ``
    const totalPages = Math.ceil(data.rows.length / 10);
    const currentPageData = data.rows.slice(startIndex, endIndex);
    for(let Demand of data.rows){
        console.log(Demand)
        if(Demand.results === 'Pending...'){
          let cin = Demand.cin.substring(0,3)+"*****";
           html += (
         `<tr><td>${Demand.hash}</td>`+
        `<td>${cin}</td>`+`<td>${Demand.nom}</td>`+
          `<td>${Demand.prenom}</td>`+
          `<td>${Demand.age}</td>`+
          `<td>${Demand.category}</td>`+`
           <td onclick ="OpenFile(this)" class ="text-primary"><u>${Demand.files}</u></td>
           <td class="text-muted">${Demand.results}</td>`+
          `<td>${new Date(Date.parse(Demand.date_submitted)).toISOString()}</td>`+
          `<td class ="text-muted">${Demand.date_of_starting}</td>`
          +`<td class ="text-muted">${Demand.date_of_finishing}</td>`+
          `<td><button id = "actionAccept" class ="btn btn-outline-success" onclick = "ACC_DEMANDE(this)">Accept</button><button id = "actionRefuse" class ="btn btn-outline-danger" onclick = "REF_DEMANDE(this)">Refuse</button></td></tr>`)
        }else if(Demand.results === 'Accepted'){
            let cin = Demand.cin.substring(0,3)+"*****" 
            html += (`<tr><td>${Demand.hash}</td>`+`<td>${cin}</td>`+`<td>${Demand.nom}</td>`+
            `<td>${Demand.prenom}</td>`+
            `<td>${Demand.age}</td>`+
            `<td>${Demand.category}</td>`+`
            <td onclick = "OpenFile(this)" class ="text-primary"><u>${Demand.files}</u></td>
             <td class="text-success">${Demand.results}</td>`+
            `<td>${new Date(Date.parse(Demand.date_submitted)).toISOString()}</td>`+
            `<td class ="text-success">${Demand.date_of_starting}</td>`
            +`<td class="text-success">${Demand.date_of_finishing}</td>`+
            `<td><button class = 'btn btn-outline-success'>Send Him Notification SMS !!!</button></td></tr>`)
        }else{
            let cin = Demand.cin.substring(0,3)+"*****"
            html += (`<tr><td>${Demand.hash}</td>`+`<td>${cin}</td>`+`<td>${Demand.nom}</td>`+
            `<td>${Demand.prenom}</td>`+
            `<td>${Demand.age}</td>`+
            `<td>${Demand.category}</td>`+`
             <td onclick ="OpenFile(this)" class ="text-primary"><u>${Demand.files}</u></td>
             <td class="text-danger">${Demand.results}</td>`+
            `<td>${new Date(Date.parse(Demand.date_submitted)).toISOString()}</td>`+
            `<td class = "text-danger">${Demand.date_of_starting}</td>`
            +`<td class ="text-danger">${Demand.date_of_finishing}</td>`+
            `<td><center><button class = "btn btn-outline-danger" onclick = "alert('${Demand.Description_en_cas_refus}')">Check Description</button></center></td></tr>
            `)
        }
    }
    nav_html = generatePageNumbers(startIndex,totalPages)
    results.html = html
    callback(null,{html:results.html,nav:nav_html})
   }
})
}
//chat GPT Paginateur
function generatePageNumbers(currentPage, totalPages) {
    let pageNumbersHTML = '<ul class="pagination">';
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            pageNumbersHTML += `<li class="page-item">${i}</li>`;
        } else {
            pageNumbersHTML += `<li class ="">${i}</li>`;
        }
    }
    pageNumbersHTML += '</ul>';
    return pageNumbersHTML;
}

function REFUSE_DEMANDE_DB(input,callback){
   connection.query(QUERY.MODIFY_DEMANDE_REFUS,[input.description,input.hash],(err,data) =>{
    if(err){
        callback(err,null)
    }else{
        callback(null,data)
    }
   })
}
function GET_ALL_USER_DEMANDS_FROM_DB_WITH_ID(input,callback){
  connection.query(QUERY.GET_DEMANDS_WITH_CIN_OR_SOCIAL_ID,[input.cin],(err,data) =>{
    if(err){
        callback(err,null)
    }else{
        var html = ``
        for(let Demand of data.rows){
            console.log(Demand)
            if(Demand.results === 'Pending...'){
               html += (
              `<tr><td>${Demand.hash}</td>`+
              `<td>${Demand.cin}</td>`+
              `<td>${Demand.date_submitted}</td>`+
              `<td onclick ="OpenFile(this)" class ="text-primary"><u>${Demand.files}</u></td>`+
              `<td>${Demand.category}</td>`+
              `<td class ="text-primary">${Demand.results}</td>`+
              `<td class ="text-primary">${Demand.date_of_starting}</td>`
              +`<td class ="text-primary">${Demand.date_of_finishing}</td>`+
              `<td><button id = "checkDetails" class ="btn btn-outline-primary" onclick = "
              localStorage.setItem('Spouse_Name','${Demand.spouse_last_name}')
              localStorage.setItem('Spouse_Last','${Demand.spouse_name}')
              localStorage.setItem('id','${Demand.id}')
              localStorage.setItem('Job','${Demand.job_type}');
              localStorage.setItem('Father_CIN','${Demand.GardianFatherCIN}');
              localStorage.setItem('Mother_CIN','${Demand.GardianMotherCIN}');
              DETAILS(this);
              ">Check Submitted Details</button></td></tr>`)
            }else if(Demand.results === 'Refused'){
                html += (
                    `<tr><td>${Demand.hash}</td>`+
                    `<td>${Demand.cin}</td>`+
                    `<td>${Demand.date_submitted}</td>`+
                    `<td onclick ="OpenFile(this)" class ="text-primary"><u>${Demand.files}</u></td>`+
                    `<td>${Demand.category}</td>`+
                    `<td class = 'text-danger'>${Demand.results}</td>`+
                    `<td class ="text-danger">${Demand.date_of_starting}</td>`
                    +`<td class ="text-danger">${Demand.date_of_finishing}</td>`+
                    `<td><button id = "Recours" class ="btn btn-outline-danger" onclick =
                     "localStorage.setItem('ID','${Demand.id}');
                     $('#exampleModal').find('#reason').val('${Demand.Description_en_cas_refus}');
                      RECOURS(this)">Resend Demande</button></td></tr>`)
            }else{
                html += (
                    `<tr><td>${Demand.hash}</td>`+
                    `<td>${Demand.cin}</td>`+
                    `<td>${Demand.date_submitted}</td>`+
                    `<td onclick ="OpenFile(this)" class ="text-primary"><u>${Demand.files}</u></td>`+
                    `<td>${Demand.category}</td>`+
                    `<td class ="text-success">${Demand.results}</td>`+
                    `<td class ="text-success">${Demand.date_of_starting}</td>`
                    +`<td class ="text-success">${Demand.date_of_finishing}</td>`+
                    `<td><button id = "PrintRecus" class ="btn btn-outline-success" onclick = "PRINT_RECIETE(this)">Print Receipt</button></td></tr>`)
            }
        }
    }
    callback(null,html)
  })
}

function ACCEPT_DEMANDE(input,callback){
connection.query(QUERY.MOODIFY_DEMANDE_ACCEPT,[input.date_of_starting,input.date_of_ending,input.hash],(err,data) =>{
    if(err){
        callback(err,null)
    }else{
        callback(null,"Accepted !!!")
    }
})
}

function GET_ALL_RECOURS_DEMANDS_FOR_ADMIN(callback){
connection.query(QUERY.GET_RECOURS,(err,data) =>{
    var html = ""
  if(err){
    callback(err,null)
  }else{
    for(let Demand of data.rows){
        console.log(Demand)
        if(Demand.Resultat === "on Hold..."){
        html += `<tr>
         <td>${Demand.Hash}</td>
         <td>${Demand.Nom}</td>`+
        `<td>${Demand.Prenom}</td>`+
        `<td>${Demand.ID}</td>`+
        `<td class ="text-primary" style ="text-decoration:underline" onclick ="localStorage.setItem('Description','${Demand.Description}');
         DEMANDE(this)">${Demand.id_demande}</td>`+
        `<td>${Demand.additional_files}</td>`+
        `<td>${Demand.Recours_Service}</td>`+
        `<td class = "text-muted">${Demand.Resultat}</td>`+
        `<td>${Demand.Date_of_submission}</td>`+
        `<td><button class ="btn btn-outline-success" onclick ="
        ACCEPT_RECOURS_BY_ADMIN(this)
        ">Accept</button> <button class ="btn btn-outline-danger" onclick = "
        console.log('clicked')
        REFUSE_RECOURS_BY_ADMIN(this)
        ">Refuser</button></td></tr>`;
        }else if(Demand.Resultat === "Accepted"){
        html += `<tr>
        <td>${Demand.Hash}</td>
        <td>${Demand.Nom}</td>`+
        `<td>${Demand.Prenom}</td>`+
        `<td>${Demand.ID}</td>`+
        `<td class ="text-primary" style ="text-decoration:underline" onclick ="localStorage.setItem('Description','${Demand.Description}');
        DEMANDE(this)>${Demand.id_demande}</td>`+
        `<td>${Demand.additional_files}</td>`+
        `<td>${Demand.Recours_Service}</td>`+
        `<td>${Demand.Resultat}</td>`+
        `<td>${Demand.Date_of_submission}</td>`+
        `<td><button class ="btn btn-success">Accept</button> <button class ="btn btn-success">Refuser</button></td></tr>`;
        }else{
       html += `<tr>
       <td>${Demand.Hash}</td>
       <td>${Demand.Nom}</td>`+
      `<td>${Demand.Prenom}</td>`+
      `<td>${Demand.ID}</td>`+
      `<td class ="text-primary" style ="text-decoration:underline" onclick ="localStorage.setItem('Description','${Demand.Description}');
      DEMANDE(this)>${Demand.id_demande}</td>`+
      `<td>${Demand.additional_files}</td>`+
      `<td>${Demand.Recours_Service}</td>`+
      `<td>${Demand.Resultat}</td>`+
      `<td>${Demand.Date_of_submission}</td>`+
      `<td><button class ="btn btn-success">Accept</button> <button class ="btn btn-danger">Refuser</button></td></tr>`;
        }
    }
    callback(null,html)
  }
})

}
function REFUSE_RECOURS(input,callback){
connection.query(QUERY.REFUSE_RECOURS,[input.description,input.hash],(err,data) =>{
    if(err){
        callback(err,null)
    }else{
        REFUSE_DEMANDE_DB(input,(err,data) =>{
            if(err){
                callback(err,null)
            }else{
                callback(null,data)
            }
        })
    }
})
}
function ACCEPT_RECOURS(input,callback){
connection.query(QUERY.ACCEPT_RECOURS,[input.date_of_starting,input.date_of_ending,input.hash],(err,data) =>{
    if(err){
        callback(err,null)
    }else{
        ACCEPT_DEMANDE(input,(err,data) =>{
            if(err){
                callback(err,null);
            }else{
                callback(null,data)
            }
        })
    }
})
}
function GET_DEMANDE_BY_ID(input,callback){
    connection.query(QUERY.GET_DEMANDE_BY_ID,[input.id],(err,data)=>{
        if(err){
            callback(null,err)
        }else{
            callback(null,data)
        }
    })

}

function INSERT_NEW_RECOURS(input,callback){
connection.query(QUERY.INSERT_NEW_RECOURS,[input.id_demande,input.name,input.lastname,input.id,input.description,input.a_file,'on Hold...','on Hold...',new Date().toISOString(),input.service,"On Hold...","On Hold...",input.Hash,"On Hold..."],(err,data) =>{
    if(err){
        callback(err,null)
    }else{
        callback(null,data.rowCount)
    }
})
}

function GET_PARENTS_CIN(input,callback){

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
    SEARCH_DATA_FROM_SOCIAL,
    GET_SPOUSE_DATA,
    INSERT_DEMANDE,
    GENERATE_HTML_RECORDS,
    REFUSE_DEMANDE_DB,
    GET_PARENTS_CIN,
    GET_ALL_USER_DEMANDS_FROM_DB_WITH_ID,
    INSERT_NEW_RECOURS,
    ACCEPT_DEMANDE,
    GET_ALL_RECOURS_DEMANDS_FOR_ADMIN,
    GET_DEMANDE_BY_ID,
    ACCEPT_RECOURS,
    REFUSE_RECOURS
    
}



