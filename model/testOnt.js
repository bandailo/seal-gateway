const ont = require('./ontAdapter.js');

var sc = new ont('http://polaris1.ont.io:20334', '8c9e8b1d601c601effba6f697f4e0ff573c10ad7226c7df18106cc378b75ecac');
//sc.generateAddress().then(console.log);
////sc.queryBalance("ASmeT1g77zj9XnWZ6J8kWYaBVfsuRoCnya").then(console.log);
//sc.getContractAddress("db97fadf8dcc1fc34952df2ecb6b5856d2b2af81db3dff5259d2857ae40848f9").then(console.log);
//console.log(sc.getTokenAbi())
sc.deployTokenContract("ASmeT1g77zj9XnWZ6J8kWYaBVfsuRoCnya", "ABA", "ABA", "1000000000","8").then(console.log)

