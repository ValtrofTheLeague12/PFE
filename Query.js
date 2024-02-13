const QUERY = {
    SELECT_API_ALL_RECORDS:`SELECT * FROM "citoyens"`,
    SELECT_CREDENTIALS_ALL_RECORDS:`SELECT * FROM "Credentials"`,
    INSERT_CREDENTIALS_NEW_RECORDS:`INSERT INTO "Credentials"("UUID","Nom","Prenom","Username","Password","Email") VALUES ($1,$2,$3,$4,$5,$6)`,
    UPDATE_CREDENTIALS_RESET_PASSWORD_WITH_UUID:'UPDATE "Credentials" SET "Password" = $1 WHERE "UUID" = $2',
    SELECT_USER_FROM_UUID:`SELECT * FROM "Credentials" WHERE "UUID" = $1`,
    LOGIN_QUERY:`SELECT * FROM "Credentials" WHERE "Username" = $1 AND "Password" = $2`,
    API1_QUERY:`SELECT "idsocial","prenom",
    "nom","genre"
    ,"date_naissance","communeCode",
    "communeLib","consulatCode",
    "consulatLib","nomPere","nomMere"
    ,"nationalitePereCode","nationalitePereLib"
    ,"nationaliteMereCode","nationaliteMereLib",
    "dateDecesMention","dateDecesAct" FROM "citoyen"
     WHERE "cin" = $1 and date_naissance = $2`,
    API2_QUERY:`SELECT "idsocial","prenom",
    "nom","genre"
    ,"date_naissance","communeCode",
    "communeLib","consulatCode",
    "consulatLib","nomPere","nomMere"
    ,"nationalitePereCode","nationalitePereLib"
    ,"nationaliteMereCode","nationaliteMereLib",
    "dateDecesMention","dateDecesAct" FROM "citoyen" WHERE
    "nom" = $1 AND
    "prenom" = $2 AND
    "nomPere" = $3 AND
    "nomMere" = $4
     `
}
module.exports = {
    QUERY
}