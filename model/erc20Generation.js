// erc20base bytecode generation v0.1 
// by SEALSC

"use strict";

const fs = require('fs');
const web3 = require('web3');

class Erc20Generation {
    repeatStringNumTimes(string, times) {
    var repeatedString = "";
    while (times > 0) {
        repeatedString += string;
        times--;
    }
    return repeatedString;
    }

    converseStringParams(str) {
        let lenOfStr = str.length;
        let lenOfStrHex = lenOfStr.toString(16);
        let prefix = this.repeatStringNumTimes('0', 64 - lenOfStrHex.length);
        let lenOfStrHexPadding = prefix + lenOfStrHex;
        // console.log(lenOfStr, lenOfStrHex, lenOfStrHexPadding);

        let strHex = new Buffer(str, 'ascii').toString('hex');
        let suffix = this.repeatStringNumTimes('0', 64 - strHex.length);
        let strHexPadding = strHex + suffix;
        // console.log(str, strHex, strHexPadding);

        return lenOfStrHexPadding + strHexPadding;
    }

    converseUintParams(n) {
        //let numberHex = n.toString(16);
        let numberHex = web3.utils.toBN(n).toString(16);
        let prefix = this.repeatStringNumTimes('0', 64 - numberHex.length);
        let numberHexPadding = prefix + numberHex;
        // console.log(numberHex, n, numberHexPadding);

        return numberHexPadding;
    }

    converseAddressParams(addr) {
        let addrWithoutOx = addr.substr(2);
        // console.log(addr, addrWithoutOx);
        let prefix = this.repeatStringNumTimes('0', 64 - addrWithoutOx.length);
        let addrPadding= prefix + addrWithoutOx;

        return addrPadding.toLowerCase();
    }

    converseErc20BaseParams(_issuer, _name, _symbol, _totalSupplyCap, _decimal) {
        let issuer = this.converseAddressParams(_issuer);
        let name = this.converseStringParams(_name);
        let symbol = this.converseStringParams(_symbol);
        let totalSupplyCap = this.converseUintParams(_totalSupplyCap);
        let decimal = this.converseUintParams(_decimal);
        let nameOffset = "00000000000000000000000000000000000000000000000000000000000000a0";
        let symbolOffset = "00000000000000000000000000000000000000000000000000000000000000e0";

        let paramsEncoded = issuer + nameOffset + symbolOffset + totalSupplyCap + decimal + name + symbol;

        return paramsEncoded;
    }

    GenerateFullBytecode(_issuer, _name, _symbol, _totalSupplyCap, _decimal) {
        let f= fs.readFileSync("./erc20base_without_params.bytecode", 'utf-8');
        let code = f.slice(0,-1);
        let params = this.converseErc20BaseParams(_issuer, _name, _symbol, _totalSupplyCap, _decimal);
        let fullcode = code + params;
        return fullcode;
    }

    GetBytecodeWithoutParams() {
        let f= fs.readFileSync("./erc20base_without_params.bytecode", 'utf-8');
        let code = f.slice(0,-1);
	return code
    }

    GetABI() {
        let f= JSON.parse(fs.readFileSync("./code.abi", 'utf-8'));
	return f
    }
}
module.exports = Erc20Generation;
