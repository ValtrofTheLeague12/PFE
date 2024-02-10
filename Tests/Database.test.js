
const DATABASE = require("../Database.js");
test("Select Data From Credentials of a Random User",() =>{
DATABASE.FIND_USER_CREDENTIALS("Yassine","Loussaief",(err,data) => {
if(err){
    fail(err);
}else{
    expect(data).not.toBeNull();
}
});
})


test("Select Credentials in case a user doesn't exist",() =>{

})

test("getting Data From API1 With User having Cin Card",() =>{

})

test("getting Data From API2 with User not Having cin card",() => {

})
test("incase user does not exist ",() =>{

})

test("Adding a new User !!!",() => {

})