class Response {
	constructor(_version, _namespace, _action, _id, _code){
		this.response = {
			version: _version, 
			namespace: _namespace,
			action: _action,
			id: _id,
			code: _code,
			payload: '',
		};
		this.accounts = {
		};
	}

	deployContractResponse(_code, _txhash) {
		let payload = {
				transaction: _txhash
			};
		this.response.code = _code;
		this.response.payload = payload;

		return JSON.stringify(this.response);
	}

	deployBuiltInContractResponse(_contract_type, _code, _abi, _txhash) {
		let payload = {
				contract_type: _contract_type,
				abi: _abi,
				transaction: _txhash
		};

		this.response.code = _code;
		this.response.payload = payload;

		return JSON.stringify(this.response);
	}

	addAccount(type, account) {
		if (this.accounts[type] === undefined) {
		this.accounts[type] = Array();
		} 
		this.accounts[type].splice(0,0,account);
		console.log(this.accounts);
	}

	generateAddressResponse(_iv, _encrypedKey, _code) {
		this.response.code = _code;
		this.response.payload = {
			iv: _iv,
		    encrypted_key: _encrypedKey,
		    addresses: this.accounts
		};

		return JSON.stringify(this.response);
	}

	getContractAddressResponse(_code, _addr) {
		this.response.code = _code;
		this.response.payload = _addr;

		return JSON.stringify(this.response);
	}

	getContractInvokeResultResponse() {
		return JSON.stringify(this.response);
	}

	queryBalanceResponse(_code, _assetID, _balance) {
		this.response.code = _code;
		this.response.payload = {
			 asset_id: _assetID,
			 balance: _balance
		};

		return JSON.stringify(this.response);
	}

	invokeContract() {
		return JSON.stringify(this.response);
	}

	sendRawTransactionResponse(_code, _txhash) {
		this.response.code = _code;
		this.response.payload = {
			 transaction: _txhash
		};

		return JSON.stringify(this.response);
	}

	error(_code, _msg) {
		this.response.code = _code;
		this.response.payload = {
			 message: _msg
		};
	}
}

module.exports = Response
