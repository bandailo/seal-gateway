// bytecode generation v0.1 
// by SEALSC

"use strict";

const fs = require('fs');

class OntBuildin {
	repeatStringNumTimes(string, times) {
		var repeatedString = "";
		while (times > 0) {
			repeatedString += string;
			times--;
		}
		return repeatedString;
	}

	ascii2Hexa(str) {
		var arr1 = [];
		for (var n = 0, l = str.length; n < l; n++) {
			var hex = Number(str.charCodeAt(n)).toString(16);
			var hexPadding = this.repeatStringNumTimes('0', 2 - hex.length) + hex;
			arr1.push(hexPadding);
		}
		return arr1.join('');
	}

	trimString(str) {
		while (str.length > 2) {
			if (str.slice(-2) === "00") {
				str = str.substr(0, str.length - 2)
				continue
			}
			break
		}
		return str
	}

	setName(str) {
		var prefix = "6a51527ac4";
		var name = this.ascii2Hexa(str);
		var len = str.length.toString(16);
		var lenPadding = this.repeatStringNumTimes('0', 2 - len.length) + len;
		return prefix + lenPadding + name;
	}

	setSymbol(str) {
		var prefix = "6a52527ac4";
		var symbol = this.ascii2Hexa(str);
		var len = str.length.toString(16);
		var lenPadding = this.repeatStringNumTimes('0', 2 - len.length) + len;
		return prefix + lenPadding + symbol;
	}

	setDecimal(str) {
		var decimalPrefix = "6a53527ac4";
		var factorPrefix = "6a54527ac4";
		var decimal = parseInt(str);
		var decimalCode = 0x50 + decimal;
		var decimalStr = decimalCode.toString(16);

		if (decimal === 1) {
			var factorStr = '015a';
		} else {
			const buf = Buffer.alloc(4);
			var factor = parseInt('1' + this.repeatStringNumTimes('0', decimal));
			buf.writeUInt32LE(factor, 0);
			var factorHex = this.trimString(buf.toString('hex'));
			var len = (factorHex.length / 2).toString(16);
			var lenPadding = this.repeatStringNumTimes('0', 2 - len.length) + len;
			var factorStr = lenPadding + factorHex;
		}
		return decimalPrefix + decimalStr + factorPrefix + factorStr;
	}

	setOwner(str) {
		var prefix = "6a55527ac4";
		var suffix = "68204f6e746f6c6f67792e52756e74696d652e426173653538546f41646472657373";
		var owner = this.ascii2Hexa(str);
		var len = str.length.toString(16);
		var lenPadding = this.repeatStringNumTimes('0', 2 - len.length) + len;
		return prefix + lenPadding + owner + suffix;
	}

	setToalSupply(str) {
		var prefix = '6a56527ac4';
		const buf = Buffer.alloc(4);
		var totalSupply = parseInt(str);
		buf.writeUInt32LE(totalSupply, 0);
		var totalSupplyStr = this.trimString(buf.toString('hex'));
		var len = (totalSupplyStr.length / 2).toString(16);
		var lenPadding = this.repeatStringNumTimes('0', 2 - len.length) + len;

		return prefix + lenPadding + totalSupplyStr;
	}

	setByteCode(name, symbol, decimal, owner, totalSupply) {
		var nameStr = this.setName(name);
		var symbolStr = this.setSymbol(symbol);
		var decimalStr = this.setDecimal(decimal);
		var ownerStr = this.setOwner(owner);
		var totalSupplyStr = this.setToalSupply(totalSupply);

		var lines = require('fs').readFileSync('./buildintemplates/oep-4.bytecode', 'utf-8').split('\n');

		return lines[0] + nameStr + symbolStr + decimalStr + ownerStr + totalSupplyStr + lines[1];
	}

	GetTokenBytecode(name, symbol, decimal, owner, totalSupply) {
		return this.setByteCode(name, symbol, decimal, owner, totalSupply);
	}

	GetTokenABI() {
		let f= JSON.parse(fs.readFileSync("./buildintemplates/oep-4.abi", 'utf-8'));
		return f
	}
}
module.exports = OntBuildin;
