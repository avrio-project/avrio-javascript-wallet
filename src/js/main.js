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
balaio = Math.floor(Math.random() * 500) + 1 ; // getBalance(publicKey);

balgbp = aioprice * balaio;

function setNode(node) {
    nodeip = node;
    refresh()
}


//Adds transaction to list    
//type: 'sent' or 'received', party (str) = username of recipient, time (str) = time description, amountio(float) = amount in AIO
//amountgbp = amountio * aioprice; 

transactionList = document.getElementById("transactionList").innerHTML;

function addTransaction(type, party, time, amountio) {
    amountgbp = amountio * aioprice;
    if (type == "sent") {
        transactionList += '<div class="transaction"> <div class="transaction-icon"> <i class="fixicon" data-feather="arrow-up-right"></i> </div><div> <h4><b>' + party + '</b></h4> <h5 class="grey">' + time + '</h5> </div><div class="transaction-right"> <h4 class="danger nobottom"><b>-' + amountio + ' AIO</b></h4> <h5 class="grey transaction-label">-&pound;' + amountgbp + '</h5> </div></div>';
    } else {
        transactionList += '<div class="transaction"> <div class="transaction-icon green"> <i class="fixicon" data-feather="arrow-down-left"></i> </div><div> <h4><b>' + party + '</b></h4> <h5 class="grey">' + time + '</h5> </div><div class="transaction-right"> <h4 class="success"><b>+' + amountio + ' AIO</b></h4> <h5 class="grey transaction-label">&pound;4' + amountgbp + '</h5> </div></div></div>';
    }
}
