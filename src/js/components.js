//Prevent non-numerical inputs
function validate(ev,that) {
    
    if (!ev)
        ev = window.event;

    if ((that.value + '').split('.')[1].length > 3)
        return ev.preventDefault();
    
    if(that.value.match(/[a-z]/i)) {
        return ev.preventDefault();    
    }

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




