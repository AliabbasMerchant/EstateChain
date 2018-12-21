var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  compilers: {
      solc: {
        version: "^0.4.22"
      }
    }
};
module.exports = {
  compilers: {
    solc: {
      version: <string>, // A version or constraint - Ex. "^0.5.0"
                         // Can also be set to "native" to use a native solc
      docker: <boolean>, // Use a version obtained through docker
      settings: {
        optimizer: {
          enabled: <boolean>,
          runs: <number>   // Optimize for how many times you intend to run the code
        }
        evmVersion: <string> // Default: "byzantium"
      }
    }
  }
}
