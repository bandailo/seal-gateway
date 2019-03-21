var web3 = require('web3');
var fs = require('fs');
var erc20 = require('./erc20Generation.js');

class Web3js {
	constructor(){
	    this.web3js = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/f1bd467f49704dfe819279cca31d4ac7"));
	    this.owner= this.web3js.eth.accounts.privateKeyToAccount('0x1F9167AD9D4B9B42D7127F4693F9DA225666BD1B7F126A5FF2FE766F4416BE91');
	    this.sc = new erc20();
	}
   
    getABI() {
	var abi = this.sc.GetABI();
	return abi;
    }
   

    fromWeiToEther(v) {
        return this.web3js.utils.fromWei(v, 'ether');
    }

    fromEtherToWei(v) {
        return this.web3js.utils.toWei(v, 'ether');
    }

    async getBalance(addr) {
        var ba = await  this.web3js.eth.getBalance(addr);
        return ba;
    }

    createAccount() {
        return  this.web3js.eth.accounts.create();
    }

    async getEthFee(_issuer, _name, _symbol, _totalSupplyCap, _decimal) {
        var abi = JSON.parse(fs.readFileSync("./code.abi"));
        var codes= this.sc.GenerateFullBytecode(_issuer, _name, _symbol, _totalSupplyCap, _decimal);
        var used = await this.web3js.eth.estimateGas({ data: codes });
        var price = await this.web3js.eth.getGasPrice();
        var fee=this.web3js.utils.toBN(price).mul(this.web3js.utils.toBN(used+21000));
        var totalFee = fee.add(this.web3js.utils.toBN(100000000000000000)).toString();
        var feeInEther = this.web3js.utils.fromWei(totalFee, 'ether');
        var feeFixed= Number(feeInEther).toFixed(3).toString();

        return feeFixed;
    }

    async deployEthContract(uuid, _issuer, _name, _symbol, _totalSupplyCap, _decimal, callback) {
        var codes= this.sc.GenerateFullBytecode(_issuer, _name, _symbol, _totalSupplyCap, _decimal);
        var used = await this.web3js.eth.estimateGas({ data: codes })
        var price = await this.web3js.eth.getGasPrice()

        let rawTransaction = {
            "from":this.owner.address,
            "gasLimit":this.web3js.utils.toHex(used+21000),
            "gasPrice":this.web3js.utils.toDecimal(price),
            "value":this.web3js.utils.toWei('0', 'ether'),
            "data":codes
        };


        console.log('-------------------')
        this.owner.signTransaction(rawTransaction).then(sTx => {
            this.web3js.eth.sendSignedTransaction(sTx.rawTransaction).on('receipt', receipt => {
                console.log('blockhash', receipt.blockHash);
                callback(receipt.transactionHash, receipt.contractAddress);
            });
            //TODO error handler
        });

        return
    }
}

module.exports = Web3js;
