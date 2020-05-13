// migrating the appropriate contracts
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var Verifier = artifacts.require("Verifier");
var BN256G2 = artifacts.require("BN256G2") 

var fs = require("fs")
module.exports = function (deployer) {
  let propertyName = "Udacity Group";
  let propertySymbol = "*";
  let propertyBaseURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
//   deployer.deploy(RealStateToken, propertyName, propertySymbol, propertyBaseURI);
  deployer.deploy(BN256G2,Verifier)
  deployer.link(BN256G2,Verifier)
  deployer.deploy(Verifier).then(() => {
      return deployer.deploy(SolnSquareVerifier, Verifier.address, propertyName, propertySymbol, propertyBaseURI).then(() => {
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
