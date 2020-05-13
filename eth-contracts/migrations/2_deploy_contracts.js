// migrating the appropriate contracts
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var Verifier = artifacts.require("Verifier");
var BN256G2 = artifacts.require("BN256G2") 
var RealStateToken = artifacts.require("RealStateToken")

var fs = require("fs")
module.exports = function (deployer) {
  deployer.deploy(RealStateToken);
  deployer.deploy(BN256G2,Verifier)
  deployer.link(BN256G2,Verifier)
  deployer.deploy(Verifier).then(() => {
      return deployer.deploy(SolnSquareVerifier, Verifier.address).then(() => {
          let config = {
              deployedAddress: {
                  Verifier: Verifier.address,
                  SolnSquareVerifier: SolnSquareVerifier.address
              }
          };
          fs.writeFileSync(__dirname + '/../config.json', JSON.stringify(config, null, '\t'), 'utf-8');
      });
  });
};
