var EstateToken = artifacts.require("./EstateToken.sol");

module.exports = function(deployer) {
  deployer.deploy(EstateToken);
};
