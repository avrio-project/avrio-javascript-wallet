window.onload = function() {
    document.getElementById("sendAmount").addEventListener("input", sendAmountChange);
    document.getElementById("sendCurrency").addEventListener("change", sendCurrencyChange);
    document.getElementById("sendBtn").addEventListener("click", sendModal);
    document.getElementById("sendFundsClose").addEventListener("click", closeSendModal);
    document.getElementById("receiveFundsClose").addEventListener("click", closeReceiveModal);
    document.getElementById("receiveBtn").addEventListener("click", receiveModal);
    document.getElementById("toggleAdvancedOptions").addEventListener("click", toggleAdvanced);
    document.getElementById("gasPrice").addEventListener("input", updateEstimate);
    document.getElementById("maxGas").addEventListener("input", updateEstimate);
    document.getElementById("message").addEventListener("input", updateEstimate);
    sendCurrencyChange();
    updateEstimate();
}

//Called whenever user changes amount to send in 'send funds'
function sendAmountChange() {
    document.getElementById("sendAmount").value = document.getElementById("sendAmount").value.replace(/[^0-9\.]+/g, '');
    if (document.getElementById("sendCurrency").options[document.getElementById("sendCurrency").selectedIndex].value == "io") {
        document.getElementById("sendAmountEquiv").innerHTML = "(" + currencySymbols[currencyCode] + ((document.getElementById("sendAmount").value) * aioprice) + ")";
    } else {
        document.getElementById("sendAmountEquiv").innerHTML = "(" + ((document.getElementById("sendAmount").value) * aioprice) + " AIO)";
    }
}

//Called whenever user changes the sending currency in 'send funds'
function sendCurrencyChange() {
    if (document.getElementById("sendCurrency").options[document.getElementById("sendCurrency").selectedIndex].value == "io") {
        temp = document.getElementById("sendAmount").value;
        document.getElementById("sendAmount").value = (document.getElementById("sendAmount").value) / aioprice;
        document.getElementById("sendAmountEquiv").innerHTML = "(" + currencySymbols[currencyCode] + temp + ")";
    } else {
        document.getElementById("sendAmountEquiv").innerHTML = "(" + ((document.getElementById("sendAmount").value) * aioprice) + " AIO)";
        temp = document.getElementById("sendAmount").value;
        document.getElementById("sendAmount").value = (document.getElementById("sendAmount").value) * aioprice;
        document.getElementById("sendAmountEquiv").innerHTML = "(" + temp + " AIO)";
    }
}

//Update estimate fee in 'send transaction'
function updateEstimate(){
    document.getElementById("gasPrice").value = document.getElementById("gasPrice").value.replace(/[^0-9\.]+/g, '');
    document.getElementById("maxGas").value = document.getElementById("maxGas").value.replace(/[^0-9\.]+/g, '');
    gasPrice = document.getElementById('gasPrice').value;
    maxGas = document.getElementById('maxGas').value;
    message = document.getElementById('message').value;
    
    if(message.length > 30){
        message = message.substring(0,30);
        document.getElementById('message').value = message;
    }
    
    estimation = (30 + message.length)*gasPrice;
    
    if(maxGas < estimation){
        document.getElementById('sendWarning').style.display = 'block'; 
        document.getElementById('sendTransactionButton').disabled = true;
    }
    else{
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

//Open modal to receive transactions
function receiveModal() {
    document.getElementById('receiveFunds').classList.remove('hide');
}

//Close modal to receive transactions
function closeReceiveModal() {
    document.getElementById('receiveFunds').classList.add('hide');
}

//Show or hide advanced options in 'send transaction'
advancedEnabled = false;
function toggleAdvanced(){
    if(advancedEnabled == false){
        advancedEnabled = true;
        document.getElementById('advancedOptions').style.display = 'flex';
    }
    else{
        advancedEnabled = false;
        document.getElementById('advancedOptions').style.display = 'none';    
    }
}

//Prevent non-numerical inputs
function validate(ev,that) {
    
    if (!ev) {
        ev = window.event;
    }
    
    if((that.value + "").split(".")[1].length > 3){
        return ev.preventDefault();    
    }
    
    if((countCharacters('.', that.value) > 0) && (ev.key == ".")){
        return ev.preventDefault();    
    }

    if (!ev.ctrlKey && ev.key.length === 1 && ((isNaN(+ev.key) && ev.key !== ".") || ev.key === " ")) {
        return ev.preventDefault();
    }
}

//Counts occurences of specific character in a string
function countCharacters(char, string) {
  return string.split('').reduce((acc, ch) => ch === char ? acc + 1: acc, 0);
}
