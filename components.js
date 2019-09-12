window.onload = function() {
    document.getElementById("sendAmount").addEventListener("input", sendAmountChange);
    document.getElementById("sendCurrency").addEventListener("change", sendCurrencyChange);
    document.getElementById("sendBtn").addEventListener("click", sendModal);
    document.getElementById("sendFundsClose").addEventListener("click", closeSendModal);
    document.getElementById("receiveFundsClose").addEventListener("click", closeReceiveModal);
    document.getElementById("receiveBtn").addEventListener("click", receiveModal);
    sendCurrencyChange();
}

//Called whenever user changes amount to send in 'send funds'
function sendAmountChange() {
    document.getElementById("sendAmount").value = document.getElementById("sendAmount").value.replace(/[^0-9\.]+/g, '');
    if (document.getElementById("sendCurrency").options[document.getElementById("sendCurrency").selectedIndex].value == "io") {
        document.getElementById("sendAmountEquiv").innerHTML = "(&pound; " + ((document.getElementById("sendAmount").value) * 0.88) + ")";
    } else {
        document.getElementById("sendAmountEquiv").innerHTML = "(" + ((document.getElementById("sendAmount").value) * 0.88) + " AIO)";
    }
}

//Called whenever user changes the sending currency in 'send funds'
function sendCurrencyChange() {
    if (document.getElementById("sendCurrency").options[document.getElementById("sendCurrency").selectedIndex].value == "io") {
        temp = document.getElementById("sendAmount").value;
        document.getElementById("sendAmount").value = (document.getElementById("sendAmount").value) / 0.88;
        document.getElementById("sendAmountEquiv").innerHTML = "(&pound; " + temp + ")";
    } else {
        document.getElementById("sendAmountEquiv").innerHTML = "(" + ((document.getElementById("sendAmount").value) * 0.88) + " AIO)";
        temp = document.getElementById("sendAmount").value;
        document.getElementById("sendAmount").value = (document.getElementById("sendAmount").value) * 0.88;
        document.getElementById("sendAmountEquiv").innerHTML = "(" + temp + " AIO)";
    }
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
