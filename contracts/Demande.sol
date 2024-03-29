// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract Demande {
   string private NOM ;
   string private PRENOM;
   string private TYPE_DEMANDE;
   string private RESULTAT;
   string private DATE_SUBMISSION;
   string private DATE_START;
   string private DATE_FINISH;
   uint   private CIN;
   
   function SET_NOM(string memory n) public {
           NOM = n;
   }
   function SET_PRENOM(string memory n) public {
           PRENOM = n;
   }
   function SET_TYPE_DEMANDE(string memory n) public {
           TYPE_DEMANDE = n;
   }
   function SET_RESULTS(string memory n) public {
           RESULTAT = n;
   }
   function SET_DATE_SUB(string memory n) public {
           DATE_SUBMISSION = n;
   }
   function SET_DATE_FINISH(string memory n) public {
            DATE_FINISH = n;
   }
   function SET_CIN(uint n) public {
           CIN = n;
   }
   function GET_NOM() public view returns (string memory){
         return NOM;
   }
   function GET_PRENOM() public view returns (string memory) {
            return PRENOM;
   }
   function GET_TYPE_DEMANDE() public view returns (string memory) {
     return TYPE_DEMANDE;
   }
   function GET_RESULTS() public view returns (string memory) {
    return RESULTAT;
   }
   function GET_DATE_SUB() public view returns (string memory) {
    return DATE_SUBMISSION;
   }
   function GET_DATE_FINISH() public view returns (string memory) {
    return DATE_FINISH;
   }
   function GET_CIN() public view returns (uint){
    return CIN;
   }
}