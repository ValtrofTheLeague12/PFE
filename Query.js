const QUERY = {
    SELECT_API_ALL_RECORDS: `SELECT * FROM "citoyens"`,
    SELECT_CREDENTIALS_FROM_NAME_LAST_DAD_GRANDPARENTS: `SELECT "nom","prenom","date_naissance","nomPere","nomMere","cin","idsocial","genre" from "citoyen" where "nom" = $1 and "prenom" = $2`,
    SELECT_CREDENTIALS_ALL_RECORDS: `SELECT * FROM "Credentials"`,
    INSERT_CREDENTIALS_NEW_RECORDS: `INSERT INTO "Credentials"("UUID","Nom","Prenom","Username","Password","Email","Phone") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    UPDATE_CREDENTIALS_RESET_PASSWORD_WITH_UUID: 'UPDATE "Credentials" SET "Password" = $1 WHERE "UUID" = $2 RETURNING *',
    SELECT_USER_FROM_UUID: `SELECT * FROM "Credentials" WHERE "UUID" = $1`,
    LOGIN_QUERY: `SELECT * FROM "Credentials" WHERE "Username" = $1 AND "Password" = $2`,
    API1_QUERY: `SELECT "idsocial","prenom",
    "nom","genre"
    ,"date_naissance","communeCode",
    "communeLib","consulatCode",
    "consulatLib","nomPere","nomMere"
    ,"nationalitePereCode","nationalitePereLib"
    ,"nationaliteMereCode","nationaliteMereLib",
    "dateDecesMention","dateDecesAct" FROM "citoyen"
     WHERE "cin" = $1 and "date_naissance" = $2`,
    API2_QUERY: `SELECT "idsocial","prenom",
    "nom","genre"
    ,"date_naissance","communeCode",
    "communeLib","consulatCode",
    "consulatLib","nomPere","nomMere"
    ,"nationalitePereCode","nationalitePereLib"
    ,"nationaliteMereCode","nationaliteMereLib",
    "dateDecesMention","dateDecesAct" FROM "citoyen" WHERE
    "date_naissance" = $1 AND
    "genre" = $2 AND
    "nom" = $3 AND
    "prenom" = $4 AND
    "nomPere" = $5 AND
    "nomMere" = $6
     `,
    GET_SOCIAL_CREDENTIALS: `SELECT * FROM "Social" WHERE "cin" = $1`,
    SELECT_SOCIAL_CREDENTIALS_FROM_FAMILLY:'SELECT COUNT(*) OVER() AS num_kids , * FROM "Familly" WHERE "nom_dem" = $1 and "prenom_dem" = $2',
     INSERT_NEW_DEMAND: `INSERT INTO "Demande" ("nom", "prenom", "cin", "date_naissance", "age", "handicap", "handicap_selected", "income", "category", "consultat", "disabilities", "disabilities_selected", "father_last_name", "father_name", "governorate", "job_type", "mother_last_name", "mother_name","number_of_kids", "spouse_last_name", "spouse_name", "files", "underaged","results","hash","date_of_starting","date_of_finishing","GardianFatherCIN","GardianMotherCIN","Description_en_cas_refus","Treated_By") 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24,$25,$26,$27,$28,$29,$30,$31) RETURNING *`,
    ADMIN_SELECT_ALL_DEMANDS:`SELECT  * FROM "Demande"`,
    SELECT_GARDIANS_CIN : `SELECT "cin" from "citoyen" where "nom" = $1 and "prenom" = $2`,
    MODIFY_DEMANDE_REFUS:`UPDATE "Demande" SET "date_of_starting" = 'Refused' , "date_of_finishing" = 'Refused' , "results" = 'Refused' , "Description_en_cas_refus" = $1 where "hash" = $2 RETURNING *`,
    MOODIFY_DEMANDE_ACCEPT:`UPDATE "Demande" SET "date_of_starting" = $1, "date_of_finishing" = $2 , "results" = 'Accepted', "Description_en_cas_refus" = 'Demande at The Moment Accepted not Refused' where "hash" = $3 RETURNING *`,
    GET_DEMANDS_WITH_CIN_OR_SOCIAL_ID:'SELECT * from "Demande" where "cin" = $1',
    INSERT_NEW_RECOURS: `INSERT INTO "Recours" ("id_demande", "Nom", "Prenom", "ID", "Description", "additional_files", "Resultat","Treated_by","Date_of_submission","Recours_Service","Date_of_Starting","Date_of_finishing","Hash","Description_en_cas_refus") 
                        VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    GET_RECOURS:`SELECT * FROM "Recours"`,
    GET_DEMANDE_BY_ID:`SELECT * FROM "Demande" where "id" = $1`,
    ACCEPT_RECOURS:`UPDATE "Recours" SET "Resultat" = 'Accepted' , "Date_of_Starting" = $1 , "Date_of_finishing" = $2 where "Hash" = $3 RETURNING *`,
    REFUSE_RECOURS:`UPDATE "Recours" SET "Resultat" = 'Refused' ,"Description_en_cas_refus" = $1, "Date_of_Starting" = 'Refused' , "Date_of_finishing" = 'Refused' where "Hash" = $2 RETURNING *`,
    STATISTICS_RECOURS:`SELECT * FROM "Recours"`,
    STATISTICS_DEMANDE:`SELECT * FROM "Demande"`,
    STATISTICS_USERS:`SELECT "date_naissance" from "citoyen"`,
    LOGIN_ADMIN:'SELECT * FROM "Admin" WHERE "username" = $1 and "apitoken" = $2',
    GET_ACCEPTED_REQUESTS_WITH_ID:`SELECT * FROM "Demande" WHERE "cin" = $1 AND "results" = 'Accepted'`,
    SAVE_HASH:'INSERT INTO "hash_transactions"("id_cit","hash") VALUES($1,$2) RETURNING *',
    GET_ADMINS:'SELECT "nom_admin","prenom_admin","Email" from "Admin"'
};

module.exports = {
    QUERY
};
