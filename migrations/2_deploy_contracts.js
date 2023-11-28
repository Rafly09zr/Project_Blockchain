var NotesList = artifacts.require("./NotesList.sol");

module.exports = function(deployer) {
  deployer.deploy(NotesList);
};
