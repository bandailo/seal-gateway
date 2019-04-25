const Ont = require('ontology-ts-sdk');
const fs = require('fs');
const path = require('path')
var Buildin= require('./ontBuildin.js');

ont = new Buildin();


//var wallet = Ont.Wallet.create('seal');
//var privkey = Ont.Crypto.PrivateKey.random();
//var account = Ont.Account.create(privkey, '123456', 'seal');
// wallet.addAccount(account);
//
//var identity = Ont.Identity.create(privkey, '123456', 'seal');
//wallet.addIdentity(identity);
//console.log(Ont);

//var w = fs.readFileSync("./test.dat", 'utf-8')
//var wallet=Ont.Wallet.parseJson(w)
//var sk=wallet.accounts[0].exportPrivateKey('password');
//var address = wallet.accounts[0].address;

//
//var idContractAvmCode = ont.GetTokenBytecode("AAA", "AAA", "8", "ASmeT1g77zj9XnWZ6J8kWYaBVfsuRoCnya", "1000000000")
////console.log(idContractAvmCode)
////构建交易	
//var tx = Ont.TransactionBuilder.makeDeployCodeTransaction(idContractAvmCode, 
//	'name', '1.0', 'alice', 'testmail', 'desc', true, '500', '30000000');
//////发送交易
//tx.payer = address;
//Ont.TransactionBuilder.signTransaction(tx, sk);
////console.log(tx)
//const url = 'http://polaris1.ont.io:20334';
//const restClient = new Ont.RestClient(url);
////restClient.sendRawTransaction(tx.serialize()).then(console.log);
//console.log(address, sk)
//
//const contract = Ont.Crypto.Address.fromVmCode(idContractAvmCode);
//const codeHash = contract.toHexString();
//console.log('contract address: ' + contract.serialize());
//console.log('codeHash: ' + codeHash);
////restClient.getContract(codeHash).then(console.log);
//
////init
//const contractAddr = new Ont.Crypto.Address(Ont.utils.reverseHex(codeHash));
//const oep4 = new Ont.Oep4.Oep4TxBuilder(contractAddr);
//const gasPrice = '500';
//const gasLimit = '200000';
//var tx = oep4.init(gasPrice, gasLimit, address);
//Ont.TransactionBuilder.signTransaction(tx, sk);
////restClient.sendRawTransaction(tx.serialize()).then(console.log);
//
//// query
//var tx = oep4.queryBalanceOf(address);
//restClient.sendRawTransaction(tx.serialize(), true).then(res => {
//        console.log('res: ' + JSON.stringify(res));
//		const val = res.Result.Result ? parseInt(Ont.utils.reverseHex(res.Result.Result), 16) : 0;
//		console.log("balance:",val)
//})
//
//var tx = oep4.queryTotalSupply();
//restClient.sendRawTransaction(tx.serialize(), true).then(res => {
//        console.log('res: ' + JSON.stringify(res));
//		const val = res.Result.Result ? parseInt(Ont.utils.reverseHex(res.Result.Result), 16) : 0;
//		console.log("balance:",val)
//})
//
//var tx = oep4.queryName();
//restClient.sendRawTransaction(tx.serialize(), true).then(res => {
//        console.log('res: ' + JSON.stringify(res));
//        const val = Ont.utils.hexstr2str(res.Result.Result);
//        console.log(val);
//})
//
//var tx = oep4.queryDecimals();
//restClient.sendRawTransaction(tx.serialize(), true).then(res => {
//        console.log('res: ' + JSON.stringify(res));
//        const val = res.Result;
//        console.log(val);
//		if (val.Result) {
//				console.log('decimal:' + parseInt(val.Result, 16));
//		}
//})
//
//var tx = oep4.querySymbol(); 
//restClient.sendRawTransaction(tx.serialize(), true).then(res=>{
//        console.log('res: ' + JSON.stringify(res));
//        const val = Ont.utils.hexstr2str(res.Result.Result);
//        console.log(val);
//})
//
//var to = new Ont.Crypto.Address("AQf4Mzu1YJrhz9f3aRkkwSm9n3qhXGSh4p")
//var tx = oep4.makeTransferTx(address, to, '10000', gasPrice, gasLimit, address);
//Ont.TransactionBuilder.signTransaction(tx, sk);
//restClient.sendRawTransaction(tx.serialize(), false).then(res => {
//         console.log(JSON.stringify(res));
//})
//
//
//var tx = oep4.queryBalanceOf(to);
//restClient.sendRawTransaction(tx.serialize(), true).then(res => {
//        console.log('res: ' + JSON.stringify(res));
//		const val = res.Result.Result ? parseInt(Ont.utils.reverseHex(res.Result.Result), 16) : 0;
//		console.log("balance:",val)
//})

//restClient.getRawTransactionJson("db97fadf8dcc1fc34952df2ecb6b5856d2b2af81db3dff5259d2857ae40848f9").then(console.log);

console.log(ont.setByteCode("\x7f\x81", '\x01\x00\x00\x00\x00\x01',"8","AQf4Mzu1YJrhz9f3aRkkwSm9n3qhXGSh4p", '1000000000'))
