/**
 * @file OntAdapter.js
 * @auther xxx <xxx@gmail.com>
 * @date 03/25/2019
 */

var fs = require('fs');
var buildin = require('./ontBuildin.js');
const Ont = require('ontology-ts-sdk');
var sleep = require('sleep');

class OntAdapter {
	constructor(api, privateKey) {
		this.restClient = new Ont.RestClient(api);
		this.account = Ont.Account.create(new Ont.Crypto.PrivateKey(privateKey), "123456", 'seal');
		this.address = this.account.address;
		this.privateKey = this.account.exportPrivateKey('123456');
		this.scTemplate = new buildin();
	}

	async generateAddress() {
		var privkey = Ont.Crypto.PrivateKey.random();
		var account = Ont.Account.create(privkey, '123456', 'seal');

		return {
			address: account.address.toBase58(),
			private_key: account.exportPrivateKey('123456').key,
		}
	}

	async queryBalance(address) {
		let amount = await this.restClient.getBalance(new Ont.Crypto.Address(address));
		return amount.Result.ont;
	}

	async getContractAddress(txHash) {
		let receipt = await this.restClient.getRawTransactionJson(txHash);
		return Ont.utils.reverseHex(receipt.Result.Payload.Code.slice(-40));
	}

	getTokenAbi() {
		var abi = this.scTemplate.GetTokenABI();
		return abi;
	}

	async deployTokenContract(_issuer, _name, _symbol, _totalSupplyCap, _decimal, callback) {
		var code = this.scTemplate.GetTokenBytecode(_name, _symbol, _decimal, _issuer,_totalSupplyCap);
		var tx = Ont.TransactionBuilder.makeDeployCodeTransaction(code, 'name', '1.0', 'alice', 'testmail', 'desc', true, '500', '30000000');
		tx.payer = this.address;
		Ont.TransactionBuilder.signTransaction(tx, this.privateKey);
		await this.restClient.sendRawTransaction(tx.serialize())
	
		sleep.sleep(5);

		const contract = Ont.Crypto.Address.fromVmCode(code);
		const codeHash = contract.toHexString();
		console.log("codehash:", codeHash)	
		const contractAddr = new Ont.Crypto.Address(Ont.utils.reverseHex(codeHash));
		const oep4 = new Ont.Oep4.Oep4TxBuilder(contractAddr);
		const gasPrice = '500';
		const gasLimit = '200000';
		var tx = oep4.init(gasPrice, gasLimit, this.address);
		Ont.TransactionBuilder.signTransaction(tx, this.privateKey);
		let receipt2 = await this.restClient.sendRawTransaction(tx.serialize())
		console.log(receipt2)
		
		return receipt2.Result;
	}
}

module.exports = OntAdapter;
