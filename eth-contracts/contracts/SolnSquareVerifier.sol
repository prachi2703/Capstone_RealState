pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import './Verifier.sol';
import './ERC721Mintable.sol';


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is RealStateToken {

    Verifier verifier;

    constructor(address verifierAddress) public {
        verifier = Verifier(verifierAddress);
    }
// TODO define a solutions struct that can hold an index & an address
struct Solution{
    bytes32 index;
    address solverAddress;
    bool isMinted;
}

// TODO define an array of the above struct
bytes32[] private solutions;

// TODO define a mapping to store unique solutions submitted
mapping(uint256 => Solution) private solutionSubmissions;


// TODO Create an event to emit when a solution is added
event solutionAdded(uint256 indexed tokenId, bytes32 indexed key, address indexed to);


// TODO Create a function to add the solutions to the array and emit the event
function addSolution(uint[2] memory a, uint[2][2] memory b,  uint[2] memory c, uint[2] memory input, address to,uint256 tokenId) public{
        bytes32 solutionKey = keccak256(abi.encodePacked(a,b,c,input));
        bool isSolutionUnique = true;
        for(uint i = 0; i < solutions.length; i++) {
            if(solutionKey == solutions[i]) {
                isSolutionUnique = false;
            }
        }
        require(isSolutionUnique, "Solution is not unique");
        require(verifier.verifyTx(a, b, c, input), "Unable to verify the solution");
        solutionSubmissions[tokenId] = Solution({
            index: solutionKey,
            solverAddress: to,
            isMinted: false
            });
        solutions.push(solutionKey);
        emit solutionAdded(tokenId, solutionKey, to);
}


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
 function mintNFT(address to, uint256 tokenId) public returns (bool) {
        bytes32 solutionKey = solutionSubmissions[tokenId].index;
        require(solutionKey!=bytes32(0),"Solution does not exist");
        require(solutionSubmissions[tokenId].solverAddress == to,"Solver address does not matched");
        require(solutionSubmissions[tokenId].isMinted == false,"Solution already used minted, not unique");
        solutionSubmissions[tokenId].isMinted = true;
        return super.mint(to, tokenId);
    }
}























