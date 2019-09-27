// Copywrite 2019-2020 The Avrio Project Devs

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


var wallet = new Vue({
    el: '#wallet',
    data: {
        balfiat: 0, // set defult balance to 0
        balaio: 0,
        aioprice: 0.80, // static price of £0.80 untill we get a exchange
        address: "",
        username: "",
        currencyCode: "gbp",
        nodeip: "",
        currencyCodes: [
            'gbp',
            'usd',
            'eur'
        ],
        currencySymbols: {
            gbp: '£',
            usd: '$',
            eur: '€'
        },
        
        showSettings: false
        
    }
})

Vue.component('settings-modal',{
    props: ['username','nodeip','currency'],
    template: `<div id="settings">
                <div class="card">
                    <div class="top-right">
                        <a id="settingsClose" @click="$emit('close')" class="discreet-button"><ion-icon class="fixicon" name="close"></ion-icon></a>
                    </div>

                    <br><br>

                    <div class="idbox" v-if="username.length > 0">
                        <div class="flex-col">
                            <ion-icon name="contact" class="fixicon"></ion-icon>
                        </div>

                        <div class="flex-col">
                            <h4>You've registered the username <b id="displayUsername">{{username}}</b></h4>
                        </div>
                    </div>

                    <div class="regUsername" v-else>
                        <div class="flex-col">
                            <i data-feather="user"></i>
                        </div>

                        <div class="flex-col">
                            <h4>
                                <b style="padding-left: 7px;">You haven't registered a username yet!</b>
                                <a class="discreet-button" v-if="!showRegUsername" @click="showRegUsername = true" style="color: #fff; text-decoration: underline;">Register now</a>
                            </h4>
                        </div>
                    </div>

                    <div v-if="showRegUsername">
                        <br>

                        <div class="inputGroup">
                            <input id="chooseUsername" @input="usernameStatus=0; regFailed=false" type="text" class="amount" autocomplete="off" placeholder="Choose username">

                            <div class="amountSuffix" onclick="chooseUsername()">
                                <ion-icon @click="chooseUsername()" v-if="usernameStatus==0" name="arrow-round-forward"></ion-icon>
                                <ion-icon style="color: rgb(var(--danger))" v-else-if="usernameStatus==1" name="close"></ion-icon>
                                <ion-icon style="color: rgb(var(--success))" v-else name="checkmark"></ion-icon>
                            </div> 
                        </div>

                        <h5 style="color: rgb(var(--danger))" v-if="regFailed">Uh oh! Could not register username.</h5>

                        <br>

                        <a class="button primary" v-if="usernameStatus==2" @click="registerUsername()">Register (Fee: 0.5AIO)</a>
                    </div>

                    <br>

                    <h5 class="grey">Choose alternative currency</h5>
                    <select id="pickCurrency" class="options" @change="changeCurrency()">
                        <option v-for="cc in currencies()" v-bind:selected="isCurrent(cc)" v-bind:value="cc">{{currencySymbol(cc) + " " + cc.toUpperCase()}}</option>
                    </select>

                    <br><br>

                    <h5 class="grey">Choose node</h5>
                    <div class="inputGroup">
                        <input id="chooseNode" @input="nodeChanged = true" type="text" class="amount" autocomplete="off" placeholder="Choose node" v-bind:value="nodeip">

                        <div class="amountSuffix">
                            <ion-icon @click="changeNode()" v-if="nodeChanged" name="arrow-round-forward"></ion-icon>
                        </div> 
                    </div>
                    <h5 style="color: rgb(var(--danger))" v-if="nodeChangeFail">Uh oh! Could not use this node.</h5>


                </div>
            </div>`,
    data: function(){
        return{
            showRegUsername: false,
            usernameStatus: 0, // 0-Username not checked, 1-Username not available 2-Username available
            regFailed: false,
            nodeChanged: false,
            nodeChangeFail: false
        }
    },
    methods:{
        chooseUsername: function(){
            if(checkUsernameAvailability(document.getElementById('chooseUsername').value)){
                this.usernameStatus = 2;
            }
            else{
                this.usernameStatus = 1;
            }
        },
        currencies: function(){
            return wallet.currencyCodes;
        },
        currencySymbol: function(code){
            return wallet.currencySymbols[code];  
        },
        changeCurrency: function(){
            changeCurrency(document.getElementById('pickCurrency').value);
        },
        isCurrent: function(code){
            if(wallet.currencyCode == code){
                return "selected";
            }
            else{
                return "";
            }
        },
        registerUsername: function(){
            if(!registerUsername(document.getElementById('chooseUsername').value)){
                this.regFailed = true;    
            }
        },
        changeNode: function(){
            if(!changeNode(document.getElementById('chooseNode').value)){
                this.nodeChangeFail = true;
            }
            else{
                this.nodeChanged = false;
            }
        }
    }

})

const refreshInterval = 60 * 2.5; // refresh every 2 and a half mins

wallet.balaio = Math.floor(((Math.random() * 50) /403) *403.23435) + 1 ; 
// getBalance(publicKey);

//let keys = getKeys();
//let publicKey = keys[0];
//let privateKey = keys[1];/

//function refresh() {
//let keysT = getKeys();
//getBalance(keysT[0]);
//let txns = getTxns(keysT[0]);
//for (let i = 0; i <= txns.length; i++) {
//addTransaction(txns[i]);
//}
//}

wallet.balfiat = wallet.aioprice * wallet.balaio;
wallet.balfiat = (Math.round(wallet.balfiat*Math.pow(10,2))/Math.pow(10,2)).toFixed(2)


//Adds transaction to list    
//type: 'sent' or 'received', party (str) = username of recipient, time (str) = time description, amountio(float) = amount in AIO
//amountgbp = amountio * aioprice; 

function addTransaction(type, party, timestamp, amountio) {
    wallet.amountfiat = wallet.amountio * wallet.aioprice;
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


//Settings page

function hasUsername(){
    //Returns boolean (whether user has registered a usernme)
    if (localStorage.hasOwnProperty("username")) {
        return 1;
    } else {
        return 0;
    }

}
// TODO :
function checkUsernameAvailability(username){
    //Returns true if the username username is available to register
    return Math.random() >= 0.5; //Random bool
}

function registerUsername(username){
    //Registers the username
    //Return true on success
    return false;
}

function changeCurrency(code){
    //Changes the user's fiat currency to code
    if(wallet.currencyCodes.includes(code)){
        //Change user's currency
        wallet.currencyCode = code;
        wallet.aioprice = 0.87; //Price of new currency
    }
}
// END TODO;

function changeNode(newNode){
    //Changes to the user's preferred node
    wallet.nodeip = newNode;
    return true; //Return true if successfully changed
}

function getCurrentNode(){
    //Returns the node the user has currently chosen
    return wallet.nodeip;
}

// END TODO;

