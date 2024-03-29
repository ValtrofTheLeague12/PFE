// Help Truffle find `TruffleTutorial.sol` in the `/contracts` directory
const Demande = artifacts.require("Demande");

module.exports = function(deployer) {
    deployer.deploy(Demande);
};