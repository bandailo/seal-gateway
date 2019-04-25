/**
 * @file Web3Adapter.js
 * @auther xxx <xxx@gmail.com>
 * @date 03/25/2019
 */

var web3 = require('web3');
var fs = require('fs');
var Buildin= require('./ethereumBuildin.js');


class Web3Adapter {
	/**
	 * @ constructor
	 * @ param {api} a web3js ethereum api.
	 * @ param {privateKey} a privateKey of ethereum with prefix '0x' in front of privateKey.
	 * @ param {template} a collect of contract templates.
	 * @ param {logger} a log server.
	 */
	constructor(api, privateKey) {
		this.web3js = new web3(new web3.providers.HttpProvider(api));
		this.owner= this.web3js.eth.accounts.privateKeyToAccount(privateKey);
		this.scTemplate = new Buildin();
	}

	/**
	 * @ generateAddresses
	 */
	generateAddress() {
		let account = this.web3js.eth.accounts.create();
		return {
		    address: account.address,
		    private_key: account.privateKey
		}
	}

	/**
	 * @ queryBalance
	 * @ param {address} address
	 */
	async queryBalance(address) {
		let amount = await this.web3js.eth.getBalance(address)
			//.catch(err => {
			//this.logger.error("get balance error.");
			//throw new Error("get balance error.");
			//});

		let balance = this.web3js.utils.fromWei(amount, 'ether');
		console.log(address, amount, balance)

		return balance;
	}


	/**
	 * @ getContractAddress
	 * @ param {txHash} transaction hash
	 */
	async getContractAddress(txHash) {
		let receipt = await this.web3js.eth.getTransactionReceipt(txHash)
		return receipt.contractAddress;
	}


	/**
	 * @ sendRawTransaction
	 * @ param {rawTx} a raw transaction.
	 */
	sendRawTransaction(rawTx) {
		this.web3js.eth.sendSignedTransaction(rawTx).then(receipt => {
			this.logger.error(receipt.transactionHash);
		}).catch(err => {
			this.logger.error("send raw transaction error.");
		});

		return;
	}

	getTokenAbi() {
		var abi = this.scTemplate.GetTokenABI();
		return abi;
	}

	getAirdropAbi() {
		var abi = this.scTemplate.GetAirdropABI();
		return abi;
	}

	getLocktimeAbi() {
		var abi = this.scTemplate.GetLocktimeABI();
		return abi;
	}

	/**
	 * @ deployBuiltInContract
	 * @ {_issuer}
	 * @ {_name}
	 * @ {_symbol}
	 * @ {_totalSupplyCap}
	 * @ {_decimal}
	 */
	async deployTokenContract(_issuer, _name, _symbol, _totalSupplyCap, _decimal, callback) {
		let codes= this.scTemplate.GetTokenFullBytecode(_issuer, _name, _symbol, _totalSupplyCap, _decimal);
		let used = await this.web3js.eth.estimateGas({ data: codes })
		let price = await this.web3js.eth.getGasPrice()
		
		let rawTransaction = {
			"from":this.owner.address,
			"gasLimit":this.web3js.utils.toHex(used+21000),
			"gasPrice":this.web3js.utils.toDecimal(price),
			"value":this.web3js.utils.toWei('0', 'ether'),
			"data":codes
		};

		let sTx = await this.owner.signTransaction(rawTransaction);

		this.web3js.eth.sendSignedTransaction(sTx.rawTransaction).then(receipt => {
			console.log(receipt.transactionHash);
		});

		return this.web3js.utils.soliditySha3(sTx.rawTransaction);
	}

	async deployAirdropContract(_tokenAddress, _owner) {
		let codes= this.scTemplate.GetAirdropFullBytecode(_tokenAddress, _owner);
		let used = await this.web3js.eth.estimateGas({ data: codes })
		let price = await this.web3js.eth.getGasPrice()
		
		let rawTransaction = {
			"from":this.owner.address,
			"gasLimit":this.web3js.utils.toHex(used+21000),
			"gasPrice":this.web3js.utils.toDecimal(price),
			"value":this.web3js.utils.toWei('0', 'ether'),
			"data":codes
		};

		let sTx = await this.owner.signTransaction(rawTransaction);

		this.web3js.eth.sendSignedTransaction(sTx.rawTransaction).then(receipt => {
			console.log(receipt.transactionHash);
		});

		return this.web3js.utils.soliditySha3(sTx.rawTransaction);
	}

	async deployLocktimeContract(_withdrawAddress, _locktime, _tokenAddress) {
		let codes= this.scTemplate.GetLocktimeFullBytecode(_withdrawAddress, _locktime, _tokenAddress);
		let used = await this.web3js.eth.estimateGas({ data: codes })
		let price = await this.web3js.eth.getGasPrice()
		
		let rawTransaction = {
			"from":this.owner.address,
			"gasLimit":this.web3js.utils.toHex(used+21000),
			"gasPrice":this.web3js.utils.toDecimal(price),
			"value":this.web3js.utils.toWei('0', 'ether'),
			"data":codes
		};

		let sTx = await this.owner.signTransaction(rawTransaction);

		this.web3js.eth.sendSignedTransaction(sTx.rawTransaction).then(receipt => {
			console.log(receipt.transactionHash);
		});

		return this.web3js.utils.soliditySha3(sTx.rawTransaction);
	}
}

module.exports = Web3Adapter;
