var Ballot = artifacts.require("./Ballot.sol");

module.exports = function(deployer) {
  deployer.deploy(Ballot, ["Candidato 1", "Candidato 2", "Candidato 3"]);
};
