var ERC721MintableComplete = artifacts.require('RealStateToken');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    var propertyName = "Udacity Group";
    var properSymbol = "Udacity Stone Park"
    var propertyURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/"

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(propertyName,properSymbol,propertyURI,{from: account_one});
            
            // TODO: mint multiple tokens
           await this.contract.mint(account_one,1,{from: account_one});
           await this.contract.mint(account_one,2,{from: account_one});
           await this.contract.mint(account_one,3,{from: account_one});
           await this.contract.mint(account_two,4,{from: account_one});
           await this.contract.mint(account_two,5,{from: account_one});
        })

        it('should return total supply', async function () { 
            assert.equal(await this.contract.totalSupply(),5,"Incorrect Suppy")
            
        })

        it('should get token balance', async function () { 
            assert.equal(await this.contract.balanceOf(account_one),3,"Incorrect Balance")
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            assert.equal(await this.contract.tokenURI(1),"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1","URI mismatched");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, 3,{from: account_one});
            let newOwner = await this.contract.ownerOf(3);
            assert.equal(newOwner, account_two, "Token not transferred successfully");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(propertyName,properSymbol,propertyURI,{from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            isFailed = false
            try{
                await this.contract.mint(account_one,7,{from: account_two})
            }catch(err){
                isFailed =true
            }
            assert(isFailed,true,"Anyone can mint")
            
        })

        it('should return contract owner', async function () { 
            assert.equal(await this.contract.getContractOwner({from: account_two}),account_one,"Cannot get valid owner")
        })

    });
})