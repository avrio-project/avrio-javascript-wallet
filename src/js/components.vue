Vue.component('settingsModal',{
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