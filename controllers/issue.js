var fs= require('fs');
var uuidv1 = require('uuid/v1');
var Web3js = require('../model/web3js.js');
var dbHelper = require('../model/dbHelper.js');

var web3js = new Web3js();
var ordererDB = new dbHelper();

const successResponse = {
	code: 0,
	data: {
		message : "success"
	}
}

const invalidRequest= {
	code: -32600,
	data: {
		message: "invalid request"
	}
}
const invalidUUID = {
	code: -32601,
	data: {
		message: "invalid uuid"
	}
}

const invalidOrderStatus= {
	code: -32602,
	data: {
		message: "invalid order status"
	}
}
const invalidFee= {
	code: -32603,
	data: {
		message: "fee to low"
	}
}
function responseCreater(_version, _namespace, _action, _id, _response){
	var ret = {
		version: _version, 
		namespace: _namespace,
		action: _action,
		id: _id,
		response: _response
	}

	return ret;
}


async function handleCreate(ctx) {
	console.log("------handleCreate");
	var args = ctx.request.body.param;
	var fee = await web3js.getEthFee(args.basic.owner, args.basic.name, args.basic.symbol, args.basic.caps, args.basic.decimal);
	var id = uuidv1();
	var acc = web3js.createAccount();
	ordererDB.insert(id , {
		"owner": args.basic.owner,
		"payment_address":acc.address,
		"name": args.basic.name,
		"symbol": args.basic.symbol,
		"caps": args.basic.caps,
		"decimal": args.basic.decimal,
		"fee": fee,
		"status": "payment",
		"txhash":"",
		"contract_address":"",
		"income":"",
		"privatekey":acc.privateKey,
	})
	console.log(ordererDB.get(id))

	var repsonse = {
		code : 0,
		data : {
			business_id: id,
			payment_address: acc.address,
			payment_token: ctx.request.body.param.target_chain,
			payment_amount: fee,
		}
	}
	var ret = responseCreater("0.0.1", "TOKEN_ISSUE", ctx.request.body.action, ctx.request.body.id, data);

	return ret;
}

function handlePaid(ctx) {
	var uuid = ctx.request.body.param.business_id;
	var res = successResponse;
	console.log("uuid:", uuid);
	if (ordererDB.size() ==0 || !ordererDB.find(uuid)) {
		res = invalidUUID;
	} else {
		var o = ordererDB.get(uuid)	
		if (o.status != "payment") {
			res = invalidOrderStatus;
		} else {
			o.status = "pre_deploying";
			ordererDB.update(uuid, o);
			var interval = setInterval(async ()=>{
				console.log("--> deploying");
				if (o.status === "deploying" ){
					return
				}

				var ba = await web3js.getBalance(o.payment_address)
console.log(">>>>>>>>>>>>>", ba);
				if (ba > 0) {
					clearInterval(interval);
					o.income = web3js.fromWeiToEther(ba)
					if (ba >= web3js.fromEtherToWei(o.fee)) {
						web3js.deployEthContract(uuid,o.owner, o.name, o.symbol, o.caps, o.decimal, (txHash,contractAddr)=>{
							console.log("=================");
							var o = ordererDB.get(uuid);
							o.txhash=txHash;
							o.contract_address=contractAddr;
							o.status= "deployed"
							ordererDB.update(uuid, o)
						})
						var status = "deploying"
					} else {
						console.log("-----fee too low")
						var status = "failed"
					}
					o.status = status;
					ordererDB.update(uuid, o)
				}
			}, 10000);

			setTimeout(()=>{
				clearInterval(interval);
			},1800000);
		}
	}

	var ret = responseCreater("0.0.1", "TOKEN_ISSUE", ctx.request.body.action, ctx.request.body.id, res);

	return ret
}

function handleQuery(ctx) {
	var uuid = ctx.request.body.param.business_id
	var codes= web3js.getABI();

	if (ordererDB.size() ==0 || ! ordererDB.find(uuid)) {
		var res = invalidUUID;	
	} else {
		var o = ordererDB.get(uuid)
		switch (o.status) {
		case 'payment':
			var res = {
				code: 0,
				data: {
					"status": o.status,
					"business_data": {
						business_id: uuid,
						chain: "ETH",
						payment_token:"ETH",
						payment_amount: o.fee
					}
				}
			}
			break;
		case 'pre_deploying':
		case 'deploying':
			var res = {
					code: 0,
					data: {
						status: 'deploying',
						deploying_data: {
							business_id: uuid,
							chain: "ETH",
							owner: o.owner,
							payment_token:"ETH",
							payment_amount: o.fee
						}
					}
			}
			break;
		case 'deployed':
			var res = {
					code: 0,
					data: {
						status: o.status,
						contract_data: {
							business_id: uuid,
							chain: "ETH",
							deploy_transaction: o.txhash,
							contract_address: o.contract_address,
							abi: codes,
							owner: o.owner,
							payment_token:"ETH",
							payment_amount: o.income
						}
					}
				}
			
			break;
		default:
			var res = invalidFee;	
		}
	
	}

	var ret = responseCreater("0.0.1", "TOKEN_ISSUE", ctx.request.body.action, ctx.request.body.id, res);
	return ret;
}


var fn_issue = async (ctx, next) => {
	console.log(ctx.request.body);
	ctx.response.type = 'application/json';
	switch(ctx.request.body.action) {
	case "CREATE":
		var ret = await handleCreate(ctx);
		break;
	case "PAID":
		var ret = await handlePaid(ctx);
		break;
	case "QUERY_STATUS":
		var ret = await handleQuery(ctx);
		break;
	default:
		var ret = responseCreater("0.0.1", "TOKEN_ISSUE", ctx.request.body.action, ctx.request.body.id, invalidRequest);
	}

	console.log(ret);
	ctx.response.body = JSON.stringify(ret);
}

module.exports = {
	'POST /token_issue': fn_issue
};
