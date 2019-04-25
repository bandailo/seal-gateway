/**
 * @file TronAdapter.js
 * @auther xxx <xxx@gmail.com>
 * @date 03/25/2019
 */

var fs = require('fs');
var buildin = require('./tronBuildin.js');
const TronWeb = require('tronweb');

const HttpProvider = TronWeb.providers.HttpProvider;

class TronAdapter {
	constructor(api, privateKey) {
		this.fullNode = new HttpProvider(api);
		this.solidityNode = new HttpProvider(api);
		this.eventServer = api + '/';
		this.owner= privateKey;
		this.tronWeb = new TronWeb( this.fullNode, this.solidityNode, this.eventServer, this.owner)
		this.scTemplate = new buildin();
	}

	async generateAddress() {
		let account = await this.tronWeb.createAccount()
		return {
			address: account.address.base58,
			private_key: account.privateKey
		}
	}

	async queryBalance(address) {
		let amount = await this.tronWeb.trx.getBalance(address);
		let balance = this.tronWeb.fromSun(amount)
		return balance.toString();
	}

	async getContractAddress(txHash) {
		let receipt = await this.tronWeb.trx.getTransaction(txHash);
		return this.tronWeb.address.fromHex(receipt.contract_address)
	}

	getTokenAbi() {
		var abi = this.scTemplate.GetTokenABI();
		return abi;
	}

	getAirdropAbi() {
		var abi = this.scTemplate.GetAirDropABI();
		return abi;
	}

	getLocktimeAbi() {
		var abi = this.scTemplate.GetLocktimeABI();
		return abi;
	}

	async deployTokenContract(_issuer, _name, _symbol, _totalSupplyCap, _decimal, callback) {
		let codes= this.scTemplate.GetTokenBytecode();
		let abi = this.scTemplate.GetTokenABI();

		const tx = await this.tronWeb.transactionBuilder.createSmartContract({
				abi: abi,
				bytecode:codes,
			    parameters: [_issuer,_name,_symbol, _totalSupplyCap, _decimal]
		})
		const signedTransaction = await this.tronWeb.trx.sign(tx, this.owner);
		const receipt = await this.tronWeb.trx.sendRawTransaction(signedTransaction);

		return receipt.transaction.txID
	}

	async deployAirdropContract(_tokenAddress, _owner) {
		let codes= this.scTemplate.GetAirDropBytecode();
		let abi = this.scTemplate.GetAirDropABI();

		const tx = await this.tronWeb.transactionBuilder.createSmartContract({
				abi: abi,
				bytecode:codes,
			    parameters: [_tokenAddress, _owner]
		})
		const signedTransaction = await this.tronWeb.trx.sign(tx, this.owner);
		const receipt = await this.tronWeb.trx.sendRawTransaction(signedTransaction);

		return receipt.transaction.txID
	}

	async deployLocktimeContract(_withdrawAddress, _locktime, _tokenAddress) {
		let codes= this.scTemplate.GetLocktimeBytecode();
		let abi = this.scTemplate.GetLocktimeABI();

		const tx = await this.tronWeb.transactionBuilder.createSmartContract({
				abi: abi,
				bytecode:codes,
			    parameters: [_withdrawAddress, _locktime, _tokenAddress]
		})
		const signedTransaction = await this.tronWeb.trx.sign(tx, this.owner);
		const receipt = await this.tronWeb.trx.sendRawTransaction(signedTransaction);

		return receipt.transaction.txID
	}
}

module.exports = TronAdapter;
