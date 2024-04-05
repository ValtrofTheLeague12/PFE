
const {Web3} = require('web3')
const fs = require('fs')
const web3 = new Web3('http://localhost:8545');
const shell = require('shelljs')

const contractABI = JSON.parse(fs.readFileSync('./build/contracts/Demande.json', 'utf8'));

async function SET_CHANGES_INTO_BLOCKCHAIN(Account,contractAddress,ABI,data,callback){
    
const contract = new web3.eth.Contract(ABI.abi,contractAddress)
    try{
    contract.methods.SUBMIT_REQUEST(data.name,data.Admin,data.prenom,data.category,data.resultat,data.dateSubmission,data.dateStart,data.dateFinish,data.cin)
    .send({
        from: Account,
        gas: 6721975,
        gasPrice: '20000000000'
    })
    .then((receipt) => {
        callback(null,receipt.transactionHash)
    })
    .catch((error) => {
        console.log(error)
        console.error('Error:', error);
    });
    }catch(error){
        callback(error,null)
    }
}

async function VERIFY_CONNECTION(Account,callback){
    const accounts = await web3.eth.getAccounts(); 
    console.log(accounts)
    if(accounts.includes(Account)){
        callback({Found:"Found"})
    }else{
        callback({Found:"Not found"})
    }
}

async function GET_DATA_BY_TRANSACTION(transactionHash,callback){
    const transaction =  await web3.eth.getTransaction(transactionHash)
    console.log(transaction.input)
const data = web3.utils.hexToAscii(transaction.input).split(" ");
console.log(data)
let gas = Number(transaction.gas)
    callback(null,{data:data,
                   gas:gas})
}

function START_BLOCKCHAIN(callback){
    shell.exec('npx ganache-cli > ganache.txt',{async:true});
    
    const DEPLOY_CONTRACT = shell.exec('npx truffle deploy > truffle.txt',{async:true});

    DEPLOY_CONTRACT.stdout.on('data', (data) => {
        console.log(`truffle deploy stdout: ${data}`);
    });

    DEPLOY_CONTRACT.stderr.on('data', (data) => {
        console.error(`truffle deploy stderr: ${data}`);
    });

    DEPLOY_CONTRACT.on('close', (code) => {
        console.log(`truffle deploy process exited with code ${code}`);
        callback("Ganashe Deployed && Truffle Deployed true")
    }); 
}

module.exports = {
    CONTRACT_ABI:contractABI,
    SET_CHANGES_INTO_BLOCKCHAIN,
    START_BLOCKCHAIN,
    VERIFY_CONNECTION,
    GET_DATA_BY_TRANSACTION
}