let advancedEnabled = false;

function loadDashboard() {
    document.getElementById('sendAmount').addEventListener('input', sendAmountChange);
    document.getElementById('sendCurrency').addEventListener('change', sendCurrencyChange);
    document.getElementById('sendBtn').addEventListener('click', sendModal);
    document.getElementById('sendFundsClose').addEventListener('click', closeSendModal);
    document.getElementById('settingsBtn').addEventListener('click', settingsModal);
    document.getElementById('settingsClose').addEventListener('click', closeSettingsModal);
    document.getElementById('receiveFundsClose').addEventListener('click', closeReceiveModal);
    document.getElementById('receiveBtn').addEventListener('click', receiveModal);
    document.getElementById('toggleAdvancedOptions').addEventListener('click', toggleAdvanced);
    document.getElementById('gasPrice').addEventListener('input', updateEstimate);
    document.getElementById('maxGas').addEventListener('input', updateEstimate);
    document.getElementById('message').addEventListener('input', updateEstimate);
    sendCurrencyChange();
    updateEstimate();
    loadSettings();
}

//Called whenever user changes amount to send in 'send funds'
function sendAmountChange() {
    document.getElementById('sendAmount').value = document.getElementById('sendAmount').value.replace(/[^0-9\.]+/g, '');

    if (document.getElementById('sendCurrency').options[document.getElementById('sendCurrency').selectedIndex].value == 'io') {
        document.getElementById('sendAmountEquiv').innerHTML = `(${currencySymbols[currencyCode] + ((document.getElementById('sendAmount').value) * aioprice)})`;

        if (balaio < document.getElementById('sendAmount').value) {
            document.getElementById('sendTransactionButton').disabled = true;
            document.getElementById('sendAmount').classList.add('error');
            document.getElementById('amountLabel').innerHTML = 'Amount <span style="color:rgb(var(--danger))">(Insufficient funds!)</span>';
        } else {
            document.getElementById('sendTransactionButton').disabled = false;
            document.getElementById('sendAmount').classList.remove('error');
            document.getElementById('amountLabel').innerHTML = 'Amount';
        }
    } else {
        document.getElementById('sendAmountEquiv').innerHTML = `(${((document.getElementById('sendAmount').value) * aioprice)} AIO)`;

        if (balfiat < document.getElementById('sendAmount').value) {
            document.getElementById('sendTransactionButton').disabled = true;
            document.getElementById('sendAmount').classList.add('error');
            document.getElementById('amountLabel').innerHTML = 'Amount <span style="color:rgb(var(--danger))">(Insufficient funds!)</span>';
        } else {
            document.getElementById('sendTransactionButton').disabled = false;
            document.getElementById('sendAmount').classList.remove('error');
            document.getElementById('amountLabel').innerHTML = 'Amount';
        }
    }
}

// Called whenever user changes the sending currency in 'send funds'
function sendCurrencyChange() {
    if (document.getElementById('sendCurrency').options[document.getElementById('sendCurrency').selectedIndex].value == 'io') {
        let temp = document.getElementById('sendAmount').value;
        document.getElementById('sendAmount').value = (document.getElementById('sendAmount').value) / aioprice;
        document.getElementById('sendAmountEquiv').innerHTML = `(${currencySymbols[currencyCode]}${temp})`;
    } else {
        document.getElementById('sendAmountEquiv').innerHTML = `(${((document.getElementById('sendAmount').value) * aioprice)} AIO)`;
        let temp = document.getElementById('sendAmount').value;
        document.getElementById('sendAmount').value = (document.getElementById('sendAmount').value) * aioprice;
        document.getElementById('sendAmountEquiv').innerHTML = `(${temp} AIO)`;
    }
}

// Update estimate fee in 'send transaction'
function updateEstimate(){
    document.getElementById('gasPrice').value = document.getElementById('gasPrice').value.replace(/[^0-9\.]+/g, '');
    document.getElementById('maxGas').value = document.getElementById('maxGas').value.replace(/[^0-9\.]+/g, '');
    const gasPrice = document.getElementById('gasPrice').value;
    const maxGas = document.getElementById('maxGas').value;
    let message = document.getElementById('message').value;

    if (message.length > 100) {
        message = message.substring(0,100);
        document.getElementById('message').value = message;
    }
    let gasEstimation = ((2000 + (message.length * 60)) / 100);
    const estimation = gasEstimation * gasPrice;
    if (maxGas < gasEstimation) {
        document.getElementById('sendWarning').style.display = 'block'; 
        document.getElementById('sendTransactionButton').disabled = true;
    } else {
        document.getElementById('sendWarning').style.display = 'none';
        document.getElementById('sendTransactionButton').disabled = false;
    }

    document.getElementById('gaspriceaio').innerHTML = estimation;
}

//Open modal to send transactions
function sendModal() {
    document.getElementById('sendFunds').classList.remove('hide');
}

//Close modal to send transactions
function closeSendModal() {
    document.getElementById('sendFunds').classList.add('hide');
}


//Open modal to settings
function settingsModal() {
    document.getElementById('settings').classList.remove('hide');
}

//Close modal to settings
function closeSettingsModal() {
    document.getElementById('settings').classList.add('hide');
}

//Open modal to receive transactions
function receiveModal() {
    document.getElementById('receiveFunds').classList.remove('hide');
}

//Close modal to receive transactions
function closeReceiveModal() {
    document.getElementById('receiveFunds').classList.add('hide');
}

//Show or hide advanced options in 'send transaction'
function toggleAdvanced(){
    if (advancedEnabled == false) {
        advancedEnabled = true;
        document.getElementById('advancedOptions').style.display = 'flex';
    } else{
        advancedEnabled = false;
        document.getElementById('advancedOptions').style.display = 'none';
    }
}

//Prevent non-numerical inputs
function validate(ev,that) {
    if (!ev)
        ev = window.event;

    if ((that.value + '').split('.')[1].length > 3)
        return ev.preventDefault();

    if ((countCharacters('.', that.value) > 0) && (ev.key == '.'))
        return ev.preventDefault();

    if (!ev.ctrlKey && ev.key.length === 1 && ((isNaN(+ev.key) && ev.key !== '.') || ev.key === ' '))
        return ev.preventDefault();
}

//Counts occurences of specific character in a string
function countCharacters(char, str) {
    return str.split('').reduce((acc, ch) => ch === char ? acc + 1: acc, 0);
}


//Manages the pincode input on index.html
function pinCodeStart(){

    document.getElementById('pin1').addEventListener('keyup', updatePinCode);
    document.getElementById('pin2').addEventListener('keyup', updatePinCode);
    document.getElementById('pin3').addEventListener('keyup', updatePinCode);
    document.getElementById('pin4').addEventListener('keyup', updatePinCode);
    document.getElementById('pin5').addEventListener('keyup', updatePinCode);
    document.getElementById('pin6').addEventListener('keyup', updatePinCode);
    
    document.getElementById('pinc1').addEventListener('keyup', updatePinCodeC);
    document.getElementById('pinc2').addEventListener('keyup', updatePinCodeC);
    document.getElementById('pinc3').addEventListener('keyup', updatePinCodeC);
    document.getElementById('pinc4').addEventListener('keyup', updatePinCodeC);
    document.getElementById('pinc5').addEventListener('keyup', updatePinCodeC);
    document.getElementById('pinc6').addEventListener('keyup', updatePinCodeC);

}

//Runs when pincode (in load wallet) on is changed by user
function updatePinCode(){
    this.value = (this.value).replace(/[^\d]+/g,'');
    if((this.value).length > 1){
        this.value = (this.value).charAt(0);
    }
    if(this.value == ""){
        if(this.id !== "pin1"){
            newid = ("pin"+(this.id.charAt(3)-1));
            document.getElementById(newid).type = "text";
            document.getElementById(newid).value = "";
            document.getElementById(newid).focus();
            document.getElementById(newid).setSelectionRange(1, 1);
        }
    }
    else{
        if(this.id !== "pin6"){
            this.type="password";
            newid = ("pin"+(eval(this.id.charAt(3))+1));
            document.getElementById(newid).type = "text";
            document.getElementById(newid).focus();    
        }
    }
    document.getElementById('loadWalletPincode').value = ""+(document.getElementById('pin1').value)+(document.getElementById('pin2').value)+(document.getElementById('pin3').value)+(document.getElementById('pin4').value)+(document.getElementById('pin5').value)+(document.getElementById('pin6').value);
}


//Runs when pincode (in create new wallet) is changed by user
function updatePinCodeC(){
    this.value = (this.value).replace(/[^\d]+/g,'');
    if((this.value).length > 1){
        this.value = (this.value).charAt(0);
    }
    if(this.value == ""){
        if(this.id !== "pinc1"){
            newid = ("pinc"+(this.id.charAt(4)-1));
            document.getElementById(newid).type = "text";
            document.getElementById(newid).value = "";
            document.getElementById(newid).focus();
            document.getElementById(newid).setSelectionRange(1, 1);
        }
    }
    else{
        if(this.id !== "pinc6"){
            this.type="password";
            newid = ("pinc"+(eval(this.id.charAt(4))+1));
            document.getElementById(newid).type = "text";
            document.getElementById(newid).focus();    
        }
    }
    document.getElementById('createWalletPincode').value = ""+(document.getElementById('pinc1').value)+(document.getElementById('pinc2').value)+(document.getElementById('pinc3').value)+(document.getElementById('pinc4').value)+(document.getElementById('pinc5').value)+(document.getElementById('pinc6').value);
}



//Loads the settings in dashboard.html
function loadSettings(){
    document.getElementById('chooseUsername').addEventListener('input', resetPickUsername);   
    if(hasUsername()){
        document.getElementsByClassName('regUsername')[0].style.display = 'none';   
        document.getElementsByClassName('regUsernameForm')[0].style.display = 'none'; 
        document.getElementById('usernameBanner').style.display = "flex";
        document.getElementById('displayUsername').innerHTML = localStorage.getItem("username");
    }
    else{
        document.getElementsByClassName('regUsername')[0].style.display = 'flex'; 
    }
}



function resetPickUsername(){
    document.getElementById('regUsernameStatus').innerHTML = '<i data-feather="arrow-right"></i>';
    document.getElementById('usernameError').style.display = "none";
    feather.replace();
}

//Runs whenever username choose input field is edited
function chooseUsername(){
    usernameIdea = document.getElementById('chooseUsername').value;
    if(checkUsernameAvailability(usernameIdea)){
        //Username available
        document.getElementById('regUsernameStatus').innerHTML = '<i data-feather="check" style="color: rgb(var(--success))"></i>';
        document.getElementById('regUsernameBtn').style.display = 'inline-block';
        feather.replace();
    }
    else{
        //Username not available
        document.getElementById('regUsernameStatus').innerHTML = '<i data-feather="x" style="color: rgb(var(--danger))"></i>';
        document.getElementById('regUsernameBtn').style.display = 'none';
        feather.replace();    
    }
}

//Runs when user submits registration
function submitUsername(){
    usernameIdea = document.getElementById('chooseUsername').value;
    if(registerUsername(usernameIdea)){
        loadSettings();
    }
    else{
        document.getElementById('usernameError').style.display = "block";
    }
}