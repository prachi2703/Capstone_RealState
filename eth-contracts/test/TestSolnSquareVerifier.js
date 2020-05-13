const Verifier = artifacts.require('Verifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const proof = require('../../zokrates/code/square/proof.json');


contract('SolnSquareVerifier', accounts => {
    const account_one = accounts[0];
    const A = proof["proof"]["a"];
    const B = proof["proof"]["b"];
    const C = proof["proof"]["c"];
    const proofInput = proof["inputs"];
    let propertyName = "Udacity Group";
    let propertySymbol = "Udacity Stone Park";
    let propertyBaseURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

    describe('match SolnSquareVerifier spec', function () {
        beforeEach(async function () {
            this.VerifierContract = await Verifier.new({from: account_one});
            this.SolnSquareVerifierContract = await SolnSquareVerifier.new(this.VerifierContract.address, propertyName, propertySymbol, propertyBaseURI, {from: account_one});
        });

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('Test if a new solution can be added for contract', async function () {
            let txObj = await this.SolnSquareVerifierContract.addSolution(A, B, C, proofInput, account_one);
            let event = txObj.logs[0].event;
            assert.equal("solutionAdded", event, "Unable to add new solution");
        });

        it('Test if only unique solutions can be added for contract', async function () {
            await this.SolnSquareVerifierContract.addSolution(A, B, C, proofInput, account_one);
            let isSolutionUnique = true;
            try {
                await this.SolnSquareVerifierContract.addSolution(A, B, C, proofInput, account_one);
            } catch (error) {
                isSolutionUnique = false;
            }
            assert.equal(isSolutionUnique, false, "Only unique solutions can be added");
        });

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted for contract', async function () {
            await this.SolnSquareVerifierContract.addSolution(A, B, C, proofInput, account_one);
            let txObj= await this.SolnSquareVerifierContract.mintNFT(A, B, C, proofInput, account_one, 1,{from:account_one}); 
            assert.equal("MintToken", txObj.logs[0].event, "Unable to mint a new token");
        });

    });
})

