// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Demande {
    struct DEMANDE_CHANGE {
        string Admin;
        string NOM;
        string PRENOM;
        string TYPE_DEMANDE;
        string RESULTAT;
        string DATE_SUBMISSION;
        string DATE_START;
        string DATE_FINISH;
        uint CIN;
    }

    mapping(uint => DEMANDE_CHANGE) public REG_64_BIT;
    uint public nextRequestId;

    event REQUESTS_ADD_LOGGERS(uint indexed requestId, string nom, string prenom, string typeDemande, string resultat, string dateSubmission, string dateStart, string dateFinish, uint cin);

    constructor() {
        nextRequestId = 1; // Initialize nextRequestId to 1
    }

    function SUBMIT_REQUEST(string memory nom, string memory Admin, string memory prenom, string memory typeDemande, string memory resultat, string memory dateSubmission, string memory dateStart, string memory dateFinish, uint cin) public {
        DEMANDE_CHANGE memory NEW_REQUEST_SUBMITTED = DEMANDE_CHANGE(Admin, nom, prenom, typeDemande, resultat, dateSubmission, dateStart, dateFinish, cin);
        REG_64_BIT[nextRequestId] = NEW_REQUEST_SUBMITTED;
        emit REQUESTS_ADD_LOGGERS(nextRequestId, nom, prenom, typeDemande, resultat, dateSubmission, dateStart, dateFinish, cin);
        nextRequestId++;
    }

}
