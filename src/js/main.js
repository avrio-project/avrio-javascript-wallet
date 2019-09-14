// Copywrite 2019-2020 The Avrio Project Devs

let nodeip;

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

let balfiat = 0; // set defult balance to 0
let balaio = 0; 
let aioprice = 0.80; // static price of £0.80 untill we get a exchange (as this is around the target value)

const currencyCodes= [
    'gbp',
    'usd',
    'eur'
];
let currencyCode = 'gbp' //The current currency code
const currencySymbols = {
    gbp: '£',
    usd: '$',
    eur: '€'
};

const refreshInterval = 60 * 2.5; // refresh every 2 and a half mins
let username = '';

balaio = Math.floor(((Math.random() * 50) /403) *403.23435) + 1 ; // getBalance(publicKey);

//let keys = getKeys();
//let publicKey = keys[0];
//let privateKey = keys[1];/

//function refresh() {
    //let keysT = getKeys();
    //getBalance(keysT[0]);
    //let txns = getTxns(keysT[0]);
    //for (let i = 0; i <= txns.lenght(); i++) {
        //addTransaction(txns[i]);
    //}
//}

balfiat = aioprice * balaio;
document.getElementById('aiobal').innerHTML = balaio;
document.getElementById('fiatbal').innerHTML = (Math.round(balfiat*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);


function setNode(node) {
    nodeip = node;
    //refresh()
}



//Adds transaction to list    
//type: 'sent' or 'received', party (str) = username of recipient, time (str) = time description, amountio(float) = amount in AIO
//amountgbp = amountio * aioprice; 

function addTransaction(type, party, timestamp, amountio) {
    amountfiat = amountio * aioprice;
    let a = new Date(timestamp * 1000);

    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;

    if (type == 'sent') {
        document.getElementById('transactionList').innerHTML = '<div class="transaction"> <div class="transaction-icon"> <i class="fixicon" data-feather="arrow-up-right"></i> </div><div> <h4><b>' + party + '</b></h4> <h5 class="grey">' + time + '</h5> </div><div class="transaction-right"> <h4 class="danger nobottom"><b>-' + amountio + ' AIO</b></h4> <h5 class="grey transaction-label">-' + currencySymbols[currencyCode] + (Math.round(amountfiat*Math.pow(10,2))/Math.pow(10,2)).toFixed(2) + ' ' + currencyCode.toUpperCase() + '</h5> </div></div>' + document.getElementById('transactionList').innerHTML;
    } else {
        document.getElementById('transactionList').innerHTML = '<div class="transaction"> <div class="transaction-icon green"> <i class="fixicon" data-feather="arrow-down-left"></i> </div><div> <h4><b>' + party + '</b></h4> <h5 class="grey">' + time + '</h5> </div><div class="transaction-right"> <h4 class="success"><b>+' + amountio + ' AIO</b></h4> <h5 class="grey transaction-label">+' + currencySymbols[currencyCode] + (Math.round(amountfiat*Math.pow(10,2))/Math.pow(10,2)).toFixed(2) + ' ' + currencyCode.toUpperCase() + '</h5> </div></div></div>' + document.getElementById('transactionList').innerHTML;
    }

    feather.replace();
}


// Displays fiat currency code anywhere with class 'currencyCodeDisplay'
currencyCodeDisplay = document.getElementsByClassName('currencyCodeDisplay');
for (let i = 0; i < currencyCodeDisplay.length; i++) {
    currencyCodeDisplay[i].innerHTML = currencyCode.toUpperCase();
}

// Displays fiat currency code anywhere with class 'currencySymbolDisplay'
currencySymbolDisplay = document.getElementsByClassName('currencySymbolDisplay');
for (let i = 0; i < currencySymbolDisplay.length; i++) {
    currencySymbolDisplay[i].innerHTML = currencySymbols[currencyCode];
}

document.getElementById('address').innerHTML = username;
