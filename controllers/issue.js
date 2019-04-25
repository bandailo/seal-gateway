var fs= require('fs');
var uuidv1 = require('uuid/v1');
var Web3js = require('../model/web3Adapter.js');
var TronWeb = require('../model/tronAdapter.js');
var OntSdk = require('../model/ontAdapter.js');
var Response = require('./response.js');

const web3Api = "https://ropsten.infura.io/v3/f1bd467f49704dfe819279cca31d4ac7";
const ethPrivateKey = "0x1F9167AD9D4B9B42D7127F4693F9DA225666BD1B7F126A5FF2FE766F4416BE91";
const tronApi = "https://api.shasta.trongrid.io";
const tronPrivateKey = "0608A04BD9174FC06661F436926EAD91671B6A0AE82F8C754406247268320961";
const ontApi = "http://polaris1.ont.io:20334";
const ontPrivateKey = "8c9e8b1d601c601effba6f697f4e0ff573c10ad7226c7df18106cc378b75ecac";


var web3js = new Web3js(web3Api, ethPrivateKey);
var tronWeb = new TronWeb(tronApi, tronPrivateKey);
var ontSdk = new OntSdk(ontApi,ontPrivateKey);

var fn_genAddresses= async (ctx, next) => {
	console.log(ctx.request.body);
	let version = ctx.request.body.version;
	let namespace = ctx.request.body.namespace;
	let action = ctx.request.body.action;
	let id= ctx.request.body.id;
	let count = ctx.request.body.param.count;
	let chain = ctx.request.body.param.target_chain;
	let code = 0;
	ctx.response.type = 'application/json';
	
	switch (chain) {
	case "Ethereum":
		let res = new Response(version, namespace, action, id, code);
		for (var i=0; i < count; i++) {
			let account = web3js.generateAddress();
			res.addAccount('Ethereum', account);
		}
		var ret = res.generateAddressResponse('', '', code);
		break;
	case "Tron":
		let resTrx = new Response(version, namespace, action, id, code);
		for (var i=0; i < count; i++) {
			let account = await tronWeb.generateAddress();
			resTrx.addAccount('Tron', account);
		}
		var ret = resTrx.generateAddressResponse('', '', code);
		break;
	case "Ontology":
		let resOnt = new Response(version, namespace, action, id, code);
		for (var i=0; i < count; i++) {
			let account = await ontSdk.generateAddress();
			resOnt.addAccount('Ontology', account);
		}
		var ret = resOnt.generateAddressResponse('', '', code);
		break;
	}
	ctx.response.body = ret;
}	

var fn_issue = async (ctx, next) => {
	console.log(ctx.request.body);
	ctx.response.type = 'application/json';

	let version = ctx.request.body.version;
	let namespace = ctx.request.body.namespace;
	let action = ctx.request.body.action;
	let id= ctx.request.body.id;
	let code = 0;
	let res = new Response(version, namespace, action, id, code);

	let owner= ctx.request.body.param.owner;
	let type = ctx.request.body.param.contract_type;
	let args = ctx.request.body.param.input;
	let chain = ctx.request.body.param.target_chain;

	switch (type) {
	case "TOKEN_ISSUE":
		switch (chain) {
		case "Ethereum":
			let abi = web3js.getTokenAbi();
			let txhash = await web3js.deployTokenContract(owner, args.basic.name, args.basic.symbol, args.basic.caps, args.basic.decimal);
			var ret = res.deployBuiltInContractResponse(type, code, abi, txhash);
			break;
		case "Tron":
			let abiTrx = tronWeb.getTokenAbi();
			let txhashTrx = await tronWeb.deployTokenContract(owner, args.basic.name, args.basic.symbol, args.basic.caps, args.basic.decimal);
			var ret = res.deployBuiltInContractResponse(type, code, abiTrx, txhashTrx);
			break;
		case "Ontology":
			let abiOnt = ontSdk.getTokenAbi();
			let txhashOnt = await ontSdk.deployTokenContract(owner, args.basic.name, args.basic.symbol, args.basic.caps, args.basic.decimal);
			var ret = res.deployBuiltInContractResponse(type, code, abiOnt, txhashOnt);
			break;
		}
		break;
	case "AIRDROP":
		switch (chain) {
		case "Ethereum":
			let airdropAbi = web3js.getAirdropAbi();
			let hash = await web3js.deployAirdropContract(args.basic.token_address,owner);
			var ret = res.deployBuiltInContractResponse(type, code, airdropAbi, hash);
			break;
		case "Tron":
			let airdropAbiTron = tronWeb.getAirdropAbi();
			let hashTron = await tronWeb.deployAirdropContract(args.basic.token_address,owner);
			var ret = res.deployBuiltInContractResponse(type, code, airdropAbiTron, hashTron);
		}
		break;
	case "TOKEN_LOCK":
		switch (chain) {
		case "Ethereum":
			let locktimeAbi = web3js.getLocktimeAbi();
			let locktimeHash = await web3js.deployLocktimeContract(args.basic.withdraw_address,args.basic.locktime, args.basic.token_address);
			var ret = res.deployBuiltInContractResponse(type, code, locktimeAbi, locktimeHash);
			break;
		case "Tron":
			let locktimeAbiTron = tronWeb.getLocktimeAbi();
			let locktimeHashTron = await tronWeb.deployLocktimeContract(args.basic.withdraw_address,args.basic.locktime, args.basic.token_address);
			var ret = res.deployBuiltInContractResponse(type, code, locktimeAbiTron, locktimeHashTron);
			break;
		}
		break;
	default:
		var ret = res.error(-32600, "invalid request")
	}

	ctx.response.body = ret;
}

var fn_getScAddr= async (ctx, next) => {
	console.log(ctx.request.body);
	ctx.response.type = 'application/json';

	let version = ctx.request.body.version;
	let namespace = ctx.request.body.namespace;
	let action = ctx.request.body.action;
	let id= ctx.request.body.id;
	let count = ctx.request.body.param.count;
	let code = 0;
	let chain = ctx.request.body.param.target_chain;

	switch (chain) {
	case "Ethereum":
		let res = new Response(version, namespace, action, id, code);
		let addr = await web3js.getContractAddress(ctx.request.body.param.transaction);
		var ret = res.getContractAddressResponse(code, addr);
		break;
	case "Tron":
		let resTrx = new Response(version, namespace, action, id, code);
		let addrTrx = await tronWeb.getContractAddress(ctx.request.body.param.transaction);
		var ret = resTrx.getContractAddressResponse(code, addrTrx);
		break;
	case "Ontology":
		let resOnt = new Response(version, namespace, action, id, code);
		let addrOnt = await ontSdk.getContractAddress(ctx.request.body.param.transaction);
		var ret = resOnt.getContractAddressResponse(code, addrOnt);
		break;
	}

	ctx.response.body = ret;
}

var fn_queryBalance= async (ctx, next) => {
	console.log(ctx.request.body);
	ctx.response.type = 'application/json';

	let version = ctx.request.body.version;
	let namespace = ctx.request.body.namespace;
	let action = ctx.request.body.action;
	let id= ctx.request.body.id;
	let count = ctx.request.body.param.count;
	let chain = ctx.request.body.param.target_chain;
	let code = 0;

	switch (chain) {
	case "Ethereum":
		let res = new Response(version, namespace, action, id, code);
		let amount = await web3js.queryBalance(ctx.request.body.param.address);
		var ret = res.queryBalanceResponse(code, ctx.request.body.param.asset_id, amount);
		break;
	case "Tron":
		let resTrx = new Response(version, namespace, action, id, code);
		console.log(resTrx)
		let amountTrx = await tronWeb.queryBalance(ctx.request.body.param.address);
		console.log(amountTrx)
		var ret = resTrx.queryBalanceResponse(code, ctx.request.body.param.asset_id, amountTrx);
		break;
	case "Ontology":
		let resOnt = new Response(version, namespace, action, id, code);
		console.log(resOnt)
		let amountOnt = await ontSdk.queryBalance(ctx.request.body.param.address);
		console.log(amountOnt)
		var ret = resOnt.queryBalanceResponse(code, ctx.request.body.param.asset_id, amountOnt);
		break;
	}

	ctx.response.body = ret;
}

module.exports = {
	'POST /generateAddresses': fn_genAddresses,
	'POST /queryBalance': fn_queryBalance,
	'POST /tokenIssue/deployBuiltInContract': fn_issue,
	'POST /tokenIssue/getContractAddress': fn_getScAddr
};
