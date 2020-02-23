// Copywrite 2019-2020 The Avrio Project Devs
// Copywrite 2019 Turlecoin devs (some of the js was adapted from https://github.com/turtlecoin/turtlecoin-wallet-backend-js/blob/master/examples/example1/index.js)
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
function getBalance(publicKey) {
    return 10; // todo
}
function getWallet() {
    return localstorage.getItem("Wallet");
}
function getKeys(wallet) {
    let keys = ["",""];
    keys[0] = localStorage.getItem("publicKey");
    keys[1] = localStorage.getItem("privateKey");
}
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
        
        showSettings: false,
        showSend: false,
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

                            <div class="amountSuffix">
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

Vue.component('send-modal',{
    props: ['currency'],
    template: `            
        <div id="sendFunds">
                <div class="card">
                    <h3>Send funds</h3>

                    <div class="top-right">
                        <a @click="$emit('close')" class="discreet-button"><ion-icon name="close" class="fixicon"></ion-icon></a>
                    </div>

                    <br>

                    <h5 class="grey"><b id="amountLabel">Amount</b> <span v-if="insufficient" style="color:rgb(var(--danger))">(Insufficient funds!)</span></h5>

                    <div class="inputGroup">
                        <input @input="updateEstimate()" type="text" onkeypress="validate(event,this)" class="amount" id="sendAmount" autocomplete="off" value="0" v-model:value="sendAmount">
                        <select @change="updateEstimate()" class="amountSuffix" id="sendCurrency" autocomplete="off" v-model:value="sendCurrency">
                            <option value="aio" selected="selected">AIO</option>
                            <option value="fiat">{{currency.toUpperCase()}}</option>
                        </select> 
                    </div>

                    <h5 class="grey" v-if="sendCurrency == 'fiat'">{{(sendAmount/aioprice()) + ' AIO'}}</h5>
                    <h5 class="grey" v-else>{{ currencySymbol(currency)+num2dp(sendAmount*aioprice()) + ' ' + currency.toUpperCase()}}</h5>

                    <br>

                    <h5 class="grey"><b>Recipient Address</b></h5>

                    <div class="inputGroup">
                        <input id="sendRecipient" type="text" class="amount" autocomplete="off" v-model="recipient">
                        <div class="amountSuffix" @click="recipient = ''">
                            <ion-icon v-if="recipient.length > 0" name="close-circle-outline"></ion-icon>
                        </div> 
                    </div>

                    <br>

                    <h5 class="grey"><b>Estimated Fee (<i>{{estimate}}</i> AIO)<a class="discreet-button" @click="advancedOptions=!advancedOptions" style="float: right;"><i class="fixicon" data-feather="settings"></i> Advanced options</a></b></h5>

                    <div v-if="advancedOptions" class="advancedOptions">
                        <div>
                            <h5 class="grey">Gas price</h5>
                            <input v-model:value="gasPrice" @input="updateEstimate()" onkeypress="validate(event,this)" placeholder="Gas price" type="text" class="advanced" autocomplete="off" value="0.001">
                        </div>
                        <div>
                            <h5 class="grey">Max gas</h5>
                            <input v-model:value="maxGas" @input="updateEstimate()" onkeypress="validate(event,this)" placeholder="Max gas" type="text" class="advanced" autocomplete="off" >
                        </div>
                        <div>
                            <h5 class="grey">Message</h5>
                            <input v-model:value="message" @input="updateEstimate()" placeholder="Message" maxlength="100" type="text" class="advanced" autocomplete="off">
                        </div>
                    </div>

                    <br>

                    <!--  FOR THE FUTURE: 'Verified user' box 
<div class="idbox">
<div class="flex-col">
<i data-feather="user-check"></i>
</div>
<div class="flex-col">
<h4><b>Verified user</b> &nbsp;&nbsp;Signed by <i>https://google.co.uk</i></h4>
</div>
</div>
-->

                    <br><br>

                    <button v-if="!sendWarning && !insufficient" class="button big-btn" id="sendTransactionButton" href="#">Send</button>
                    <h5 style="color: rgb(var(--danger)); margin-top: 20px;"><b v-if="sendWarning">Warning, estimated gas exceeds max gas!</b></h5>
                </div>
            </div>`,
    data: function(){
        return{
            advancedOptions: false,
            recipient: "",
            sendCurrency: "aio",
            sendAmount: "0.00",
            sendWarning: false,
            insufficient: false,
            gasPrice: 0.001,
            maxGas: 50,
            message: "",
            estimate: 0
        }
    },
    methods: {
        currencies: function(){
            return wallet.currencyCodes;
        },
        currencySymbol: function(code){
            return wallet.currencySymbols[code];  
        },
        aioprice: function(){
            return wallet.aioprice;
        },
        num2dp: function(num){
            return num2dp(num);
        },
        updateEstimate: function(){
             
            if((this.sendAmount > wallet.balaio * wallet.aioprice) && (this.sendCurrency == "fiat")){
                this.insufficient = true;   
            }
            else if((this.sendAmount > wallet.balaio) && (this.sendCurrency == "aio")){
                this.insufficient = true;   
            }
            else{
                this.insufficient = false;
            }
        
            if (this.message.length > 100) {
                this.message = this.message.substring(0,100);
            }
            let gasEstimation = ((2000 + (this.message.length * 60)) / 100);
            this.estimate = gasEstimation * this.gasPrice;
            if (this.maxGas < gasEstimation) {
                this.sendWarning = true;
            } else {
                this.sendWarning = false;
            } 
        }
    },
    beforeMount(){
        this.updateEstimate();
    }
})

const refreshInterval = 60 * 2.5; // refresh every 2 and a half mins

wallet.balaio = getBalance(publicKey);
 let keys = getKeys();
let publicKey = keys[0];
let privateKey = keys[1];

function refresh() {
    let keysT = getKeys();
    getBalance(keysT[0]);
    let txns = getTxns(keysT[0]);
    for (let i = 0; i <= txns.length; i++) {
        addTransaction(txns[i]);
    }
}

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

//Converts number to 2dp
function num2dp(num){
    return (Math.round(num*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
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

