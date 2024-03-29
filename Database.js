
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
            `<td><center><button class = "btn btn-outline-danger" onclick = "alert('${Demand.Description_en_cas_refus}')">Send Him SMS Notification</button></center></td></tr>
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
        callback(null,data.rows[0])
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
            DEMANDE(this)">${Demand.id_demande}</td>`+
           `<td>${Demand.additional_files}</td>`+
           `<td>${Demand.Recours_Service}</td>`+
           `<td class = "text-muted">${Demand.Resultat}</td>`+
           `<td>${Demand.Date_of_submission}</td>`+
           `<td><button class ="btn btn-outline-success" onclick ="SEND_SMS(this)">Send SMS Notifications</button></td></tr>`; 
        }else{
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
           `<td><button class ="btn btn-outline-danger" onclick ="SEND_SMS(this)">Send SMS Notifications</button></td></tr>`;
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
                callback(null,data.rows[0])
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
    connection.query(QUERY.SELECT_GARDIANS_CIN,[input.nom,input.prenom],(err,data) =>{
        if(err){
            callback(err,null)
        }else{
             console.log(data)
            callback(null,data.rows[0])
        }
    })
}

function STATISTICS_PER_REQUEST_TYPE(callback){
    DATA_DEMANDE_CAT = [{TMP:0},{AMG1:0},{AMG2:0},{CARTE_HANDICAPE:0}],
    DATA_PER_DEMANDE_CAT = []
    STATISTICS_DEMANDE_CATEGORY = []
    AMG1  = []
    AMG2 = []
    TMP = []
    CARTE_HANDICAPE = []

    connection.query(QUERY.STATISTICS_DEMANDE,(err,data) =>{
        if(err){
            callback(err,null);
        }else{
            for(let Demande of data.rows){
               if(Demande.category == 'AMG1'){
                AMG1.push(Demande)
               }else if(Demande.category == 'AMG2'){
                AMG2.push(Demande)
               }else if(Demande.category == 'TMP'){
                TMP.push(Demande)
               }else{
                CARTE_HANDICAPE.push(Demande)
               }
            }
            DATA_DEMANDE_CAT[0].TMP = TMP.length
            DATA_DEMANDE_CAT[1].AMG1 = AMG1.length
            DATA_DEMANDE_CAT[2].AMG2 = AMG2.length
            DATA_DEMANDE_CAT[3].CARTE_HANDICAPE = CARTE_HANDICAPE.length
            PER_AMG1 = data.rows.length == 0  ? 0:(DATA_DEMANDE_CAT[1].AMG1 / data.rows.length) * 100
            PER_TMP = data.rows.length == 0  ? 0:(DATA_DEMANDE_CAT[0].TMP / data.rows.length) * 100
            PER_CARTE_HANDICAPE = data.rows.length == 0  ? 0:(DATA_DEMANDE_CAT[3].CARTE_HANDICAPE / data.rows.length) * 100
            PER_AMG2 = data.rows.length == 0  ? 0:(DATA_DEMANDE_CAT[2].AMG2 / data.rows.length) * 100
            DATA_PER_DEMANDE_CAT.push({TMP:PER_TMP})       
            DATA_PER_DEMANDE_CAT.push({AMG1:PER_AMG1}) 
            DATA_PER_DEMANDE_CAT.push({AMG2:PER_AMG2}) 
            DATA_PER_DEMANDE_CAT.push({CARTE_HANDICAPE:PER_CARTE_HANDICAPE})   
            STATISTICS_DEMANDE_CATEGORY.push(DATA_PER_DEMANDE_CAT)
            STATISTICS_DEMANDE_CATEGORY.push(DATA_DEMANDE_CAT)
            console.log(STATISTICS_DEMANDE_CATEGORY)
            callback(null,STATISTICS_DEMANDE_CATEGORY)
        }
    })
}

function STATISTICS_PER_RECOURS_TYPE(callback){
    DATA_DEMANDE_CAT = [{TMP:0},{AMG1:0},{AMG2:0},{CARTE_HANDICAPE:0}],
    DATA_PER_DEMANDE_CAT = []
    STATISTICS_DEMANDE_CATEGORY = []
    AMG1  = []
    AMG2 = []
    TMP = []
    CARTE_HANDICAPE = []

    connection.query(QUERY.STATISTICS_RECOURS,(err,data) =>{
        if(err){
            callback(err,null);
        }else{
            for(let Demande of data.rows){
               if(Demande.Recours_Service == 'AMG1'){
                AMG1.push(Demande)
               }else if(Demande.Recours_Service == 'AMG2'){
                AMG2.push(Demande)
               }else if(Demande.Recours_Service == 'TMP'){
                TMP.push(Demande)
               }else{
                CARTE_HANDICAPE.push(Demande)
               }
            }
            DATA_DEMANDE_CAT[0].TMP = TMP.length
            DATA_DEMANDE_CAT[1].AMG1 = AMG1.length
            DATA_DEMANDE_CAT[2].AMG2 = AMG2.length
            DATA_DEMANDE_CAT[3].CARTE_HANDICAPE = CARTE_HANDICAPE.length
            console.log(DATA_DEMANDE_CAT)
            PER_AMG1 = data.rows.length == 0  ? 0:(DATA_DEMANDE_CAT[1].AMG1 / data.rows.length) * 100
            PER_TMP = data.rows.length == 0  ? 0:(DATA_DEMANDE_CAT[0].TMP / data.rows.length) * 100
            PER_CARTE_HANDICAPE = data.rows.length == 0  ? 0:(DATA_DEMANDE_CAT[3].CARTE_HANDICAPE / data.rows.length) * 100
            PER_AMG2 = data.rows.length == 0  ? 0:(DATA_DEMANDE_CAT[2].AMG2 / data.rows.length) * 100
            DATA_PER_DEMANDE_CAT.push({TMP:PER_TMP})       
            DATA_PER_DEMANDE_CAT.push({AMG1:PER_AMG1}) 
            DATA_PER_DEMANDE_CAT.push({AMG2:PER_AMG2}) 
            DATA_PER_DEMANDE_CAT.push({CARTE_HANDICAPE:PER_CARTE_HANDICAPE})   
            STATISTICS_DEMANDE_CATEGORY.push(DATA_PER_DEMANDE_CAT)
            STATISTICS_DEMANDE_CATEGORY.push(DATA_DEMANDE_CAT)
            callback(null,STATISTICS_DEMANDE_CATEGORY)
        }
    })
}


function STATISTICS(callback){
   const ALL_DATA = {
        DATA_RECOUR:[],
        DATA_PER_RECOURS:[],
        DATA_PER_DEMANDE:[],
        DATA_DEMANDE:[],
        DATA_USER:[],
        DATA_PER_USER:[]
    }

    RECOURS_ACCEPTED = []
    RECOURS_REFUSED = []
    RECOURS_ON_HOLD = []

    connection.query(QUERY.STATISTICS_RECOURS,(err,data) =>{
        if(err){
            callback(err,null)
        }else{
            for(let Recours of data.rows){
                if(Recours.Resultat == "Accepted"){
                    RECOURS_ACCEPTED.push(Recours)
                }else if(Recours.Resultat == "Refused"){
                    RECOURS_REFUSED.push(Recours)
                }else{
                    RECOURS_ON_HOLD.push(Recours)
                }
            }
            const perRefuse = data.rows.length === 0 ? 0 : (RECOURS_REFUSED.length / data.rows.length) * 100
            const perAccept = data.rows.length === 0 ? 0 : (RECOURS_ACCEPTED.length / data.rows.length) * 100
            const perHold = data.rows.length === 0 ? 0 : (RECOURS_ON_HOLD.length / data.rows.length) * 100
            const N_REQUEST_RECOURS_ACCEPTED = RECOURS_ACCEPTED.length
            const N_REQUEST_RECOURS_REFUS = RECOURS_REFUSED.length
            const N_REQUEST_RECOURS_HOLD = RECOURS_ON_HOLD.length

            console.log("----------------------STATISTICS RECOURS-----------------")
            console.log('Percentage Des Demande Recours Accepter : '+perAccept)
            console.log('Percentage Des Demande Recours Refuser'+perRefuse)
            console.log('Percentage Des Demande Recours On Hold'+perHold)
            console.log('n Accepter : '+N_REQUEST_RECOURS_ACCEPTED)
            console.log('n Refuser : '+N_REQUEST_RECOURS_REFUS)
            console.log('n on Hold : '+N_REQUEST_RECOURS_HOLD)
            ALL_DATA.DATA_PER_RECOURS.push(perAccept)
            ALL_DATA.DATA_PER_RECOURS.push(perRefuse)
            ALL_DATA.DATA_PER_RECOURS.push(perHold)
            ALL_DATA.DATA_RECOUR.push(N_REQUEST_RECOURS_ACCEPTED);
            ALL_DATA.DATA_RECOUR.push(N_REQUEST_RECOURS_REFUS);
            ALL_DATA.DATA_RECOUR.push(N_REQUEST_RECOURS_HOLD);
            console.log('-----------------------------------------------------')

            DEMANDE_ACCEPTER = []
            DEMANDE_REFUSER = []
            DEMAND_ON_HOLD = []

            connection.query(QUERY.STATISTICS_DEMANDE,(err,data) =>{
                if(err){
                    callback(err,null)
                }else{
                    for(let Demande of data.rows){
                        if(Demande.results == 'Refused'){
                              DEMANDE_REFUSER.push(data.rows)
                        }else if(Demande.results == 'Accepted'){
                            DEMANDE_ACCEPTER.push(data.rows)
                        }else{
                            DEMAND_ON_HOLD.push(data.rows)
                        }
                    }
                     const PER_DEMAND_ACCEPTER = data.rows.length === 0 ? 0 : (DEMANDE_ACCEPTER.length / data.rows.length) * 100
                     const PER_DEMAND_REFUSER = data.rows.length === 0 ? 0 : (DEMANDE_REFUSER.length / data.rows.length) * 100
                     const PER_DEMAND_ON_HOLD = data.rows.length === 0 ? 0 : (DEMAND_ON_HOLD.length / data.rows.length) * 100
                     const NUMBER_DEMANDE_ACCEPTER = DEMANDE_ACCEPTER.length ;
                     const NUMBER_DEMANDE_REFUSER =  DEMANDE_REFUSER.length;
                     const NUMBER_DEMANDE_ON_HOLD = DEMAND_ON_HOLD.length;
                     console.log('--------------STATISTIQUES DEMANDE------------------')
                     console.log('Percentage Des Demande  Accepter : '+PER_DEMAND_ACCEPTER)
                     console.log('Percentage Des Demande Refuser'+PER_DEMAND_REFUSER)
                     console.log('Percentage Des Demande On Hold'+PER_DEMAND_ON_HOLD)
                     console.log('n Accepter : '+NUMBER_DEMANDE_ACCEPTER)
                     console.log('n Refuser : '+NUMBER_DEMANDE_REFUSER)
                     console.log('n on Hold : '+NUMBER_DEMANDE_ON_HOLD)

                     ALL_DATA.DATA_PER_DEMANDE.push(PER_DEMAND_ACCEPTER)
                     ALL_DATA.DATA_PER_DEMANDE.push(PER_DEMAND_REFUSER)
                     ALL_DATA.DATA_PER_DEMANDE.push(PER_DEMAND_ON_HOLD)
                     ALL_DATA.DATA_DEMANDE.push(NUMBER_DEMANDE_ACCEPTER);
                     ALL_DATA.DATA_DEMANDE.push(NUMBER_DEMANDE_REFUSER);
                     ALL_DATA.DATA_DEMANDE.push(NUMBER_DEMANDE_ON_HOLD);

                     connection.query(QUERY.STATISTICS_USERS,(err,data) => {
                        if(err){
                            callback(err,null)
                        }else{
                            arrayUnder18 = []
                            arrayAbove18 = []
                           for(const element of data.rows){
                               if(new Date().getFullYear() - new Date(Date.parse(element.date_naissance)).getFullYear() <= 18){
                                   arrayUnder18.push(element.date_naissance)
                               }else{
                                   arrayAbove18.push(element.date_naissance)
                               }
                           }
                           console.log("----------------------STATISTICS USER-----------------")
                           console.log(arrayAbove18.length)
                           const perUnder18 = data.rows.length === 0 ? 0 : (arrayUnder18.length / data.rows.length) * 100 
                           console.log('Per moins 18  : '+perUnder18)
                           const perAbove18 = data.rows.length === 0 ? 0:(arrayAbove18.length / data.rows.length) * 100 
                           console.log('per + 18'+perAbove18)

                           ALL_DATA.DATA_PER_USER.push(perAbove18)
                           ALL_DATA.DATA_PER_USER.push(perUnder18)
                           ALL_DATA.DATA_USER.push(arrayAbove18.length);
                           ALL_DATA.DATA_USER.push(arrayUnder18.length);
                           console.log(ALL_DATA)
                           callback(null,ALL_DATA)
                       }
                       })
                }
               
            })
        }
        
    })
}

function LOGIN_ADMIN(input,callback){
connection.query(QUERY.LOGIN_ADMIN,[input.username,input.apiToken],(err,data) =>{
    if(err){
        console.log(err)
         callback(err,null);
    }else{
        console.log(typeof callback)
        callback(null,data.rows[0])
    }
})
}
function GET_ACCEPTED_REQUESTS_WITH_ID(input,callback){
connection.query(QUERY.GET_ACCEPTED_REQUESTS_WITH_ID,[input.id],(err,data) =>{
    if(err){
        callback(err,null)
    }else{
        console.log(data.rows.category)
        callback(null,data.rows)
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
    REFUSE_RECOURS,
    LOGIN_ADMIN,
    STATISTICS,
    STATISTICS_PER_RECOURS_TYPE,
    STATISTICS_PER_REQUEST_TYPE,
    GET_ACCEPTED_REQUESTS_WITH_ID
    
}



