// bytecode generation v0.1 
// by SEALSC

"use strict";

const fs = require('fs');

class TronBuildin {
    GetTokenBytecode() {
        let f= fs.readFileSync("./buildintemplates/trc20.bytecode", 'utf-8');
        let code = f.slice(0,-1);
		return code
    }

    GetAirDropBytecode() {
        let f= fs.readFileSync("./buildintemplates/airdropTron.bytecode", 'utf-8');
        let code = f.slice(0,-1);
		return code
    }

    GetLocktimeBytecode() {
        let f= fs.readFileSync("./buildintemplates/locktimeTron.bytecode", 'utf-8');
        let code = f.slice(0,-1);
		return code
    }

    GetTokenABI() {
        let f= JSON.parse(fs.readFileSync("./buildintemplates/trc20.abi", 'utf-8'));
		return f
    }

    GetAirDropABI() {
        let f= JSON.parse(fs.readFileSync("./buildintemplates/airdropTron.abi", 'utf-8'));
		return f
    }

    GetLocktimeABI() {
        let f= JSON.parse(fs.readFileSync("./buildintemplates/locktimeTron.abi", 'utf-8'));
		return f
    }
}
module.exports = TronBuildin;
