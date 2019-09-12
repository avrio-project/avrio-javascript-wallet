// Copywrite 2019-2020 The Avrio Project Devs
var balgbp = 0; // set defult balance to 0
var balaio = 0;
var nodeip;
var aioprice = 0.80; // static price of £0.80 untill we get a exchange (as this is arround the target value)
  
var keys = getKeys();
var publicKey = keys[0];
var privateKey = keys[1];
var refreshInterval = 60 * 2.5; // refresh every 2 and a half mins
function refresh() {
    var keysT = getKeys();
    getBalance(keysT[0]);
    var txns = getTxns(keysT[0]);
    for (let i = 0; i <= txns.lenght(); i++) {
        addTransaction(txns[i]);  
    }
}
balaio = getBalance(publicKey);
balgbp = aioprice * balaio;

function setNode(node) {
    nodeip = node;
    refresh()
}





    //Adds transaction to list    //type: 'sent' or 'received', party (str) = username of recipient, time (str) = time description, amountio(float) = amount in AIO
    //amountgbp = amountio * aioprice; 
