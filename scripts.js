// Banking System Script File
// userdata storage 
let storeduser = JSON.parse(localStorage.getItem('regaccountdetails')) || [];
document.getElementById("totalaccounts").innerText = storeduser.length;
let founduser = null;
// user data registration inputs
let userregname = document.getElementById("userregname");
let userregactype = document.getElementById("userregactype");
let userregpin = document.getElementById("userregpin");
let userregconfpin = document.getElementById("userregconfpin");
let userreginitialdpamount = document.getElementById("userreginitialdpamount");
let userregacnumber = document.getElementById("userregacnumber");
let addamountinput = document.getElementById("addamountinput");
let deductamountinput = document.getElementById("deductamountinput");
let userregprofilepic = document.getElementById("userregprofilepic");
let userregimagedisplay = document.getElementById("userregimagedisplay");
function convertToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result); // Base64 string
    };
    reader.readAsDataURL(file);
}
// Dashboard Function
function dashboard() {
    document.getElementById("loginedusername").innerText = founduser.name;
    document.getElementById("dbacholdername").value = founduser.name;
    document.getElementById("dbacnumber").value = founduser.accountnumber;
    document.getElementById("dbactype").value = founduser.accounttype;
    document.getElementById("dbbalance").value = founduser.initialamount;
    if (founduser.imageFile !== null && storeduser.some(u => u.accountnumber === founduser.accountnumber) && founduser.imageFile !== undefined) {
        userregimagedisplay.src = founduser.imageFile;
        userregimagedisplay.style.display = "block";
    }
    document.getElementById("dashboardsec").style.display = "block";
    document.getElementById("registration").style.display = "none";
    document.getElementById("login").style.display = "none";
}

// Input Error  Msg
addamountinput.addEventListener('input', () => {
    if (addamountinput.value < 0) {
        document.getElementById("modalboxerror").style.color = "red";
        document.getElementById("modalboxerror").innerText = "Pls Enter the Valid Number";
    }
    else {

        document.getElementById("modalboxerror").innerText = null;

    }
})

// Add Money Modal Box  

function opendepositmodal() {
    let closedepositmodal = document.getElementById("depositmodalbox");
    closedepositmodal.style.display = "block";

}
function Closedeposit() {
    let closedepositmodal = document.getElementById("depositmodalbox");
    closedepositmodal.style.display = "none";
}


// Withdraw Money Modal Box  

function openwithdrawmodel() {
    let withdrawmodal = document.getElementById("withdrawmodalbox");
    withdrawmodal.style.display = "block";

}
function Closewithdraw() {
    let withdrawmodal = document.getElementById("withdrawmodalbox");
    withdrawmodal.style.display = "none";
}

// transfer money logic
function opentranferamountmodal() {
    let transferwmodalbox = document.getElementById("transferwmodalbox");
    transferwmodalbox.style.display = "block";
}

function CloseTransfer() {
    let transferwmodalbox = document.getElementById("transferwmodalbox");
    transferwmodalbox.style.display = "none";
}

function transfermoney() {
    let founduserindex = storeduser.findIndex(u => u.accountnumber === founduser.accountnumber);
    let recipientaccountnumber = document.getElementById("recipientaccountnumber").value;
    let transferamountinput = document.getElementById("transferamountinput").value;
    let recipientindex = storeduser.findIndex(u => u.accountnumber === Number(recipientaccountnumber));

    if (recipientindex === -1) {
        document.getElementById("transfermodalboxerror").style.color = "red";
        document.getElementById("transfermodalboxerror").innerText = "Recipient Account Not Found";
        return;
    }
    if (transferamountinput <= 0 || transferamountinput > storeduser[founduserindex].initialamount) {
        document.getElementById("transfermodalboxerror").style.color = "red";
        document.getElementById("transfermodalboxerror").innerText = "Invalid Transfer Amount";
        return;
    }
    if (founduser.accountnumber === Number(recipientaccountnumber)) {
        document.getElementById("transfermodalboxerror").style.color = "red";
        document.getElementById("transfermodalboxerror").innerText = "You cannot transfer to your own account";
        return;
    }
    // Deduct from sender
    storeduser[founduserindex].initialamount -= Number(transferamountinput);
    storeduser[founduserindex].transactionhistory.push(-Number(transferamountinput));
    const date = new Date();
    const localFormatted = date.toLocaleString("en-IN");
    storeduser[founduserindex].transactiondate.push(localFormatted);
    // Add to recipient
    storeduser[recipientindex].initialamount += Number(transferamountinput);
    storeduser[recipientindex].transactionhistory.push(Number(transferamountinput));
    storeduser[recipientindex].transactiondate.push(localFormatted);
    localStorage.setItem('regaccountdetails', JSON.stringify(storeduser));
    document.getElementById("dbbalance").value = storeduser[founduserindex].initialamount;
    document.getElementById("transfermodalboxerror").style.color = "green";
    document.getElementById("transfermodalboxerror").innerText = "Transfer Successful";
    setTimeout(() => {
        document.getElementById("transfermodalboxerror").style.display = "none";
    }, 2000);
}

// Account Registration Logic Starts Here
function registerpage() {
    document.getElementById("registration").style.display = "block"
    document.getElementById("login").style.display = "none"

}

function registeraccount() {
     if (userregprofilepic.files[0]) {
        convertToBase64(userregprofilepic.files[0], function (base64Image) {
            regaccountdetails.imageFile = base64Image;

            storeduser.push(regaccountdetails);
            localStorage.setItem("regaccountdetails", JSON.stringify(storeduser));

        });
    } else {
        storeduser.push(regaccountdetails);
        localStorage.setItem("regaccountdetails", JSON.stringify(storeduser));
    }
    if (userregpin.value !== userregconfpin.value) {
        alert("PIN not matched");
        return;
    }

    if (storeduser.some(u => u.name.toLowerCase() === userregname.value.toLowerCase())) {
        alert("User Already Registered")
        return;
    }
    if (userregname.value === "" || userregname.value === null) {
        alert("Pls enter the Name !");
        return;
    }
    let max = 100000000000;
    let generateaccountnumber;


    do {
        generateaccountnumber = Math.floor(Math.random() * max);
    } while (storeduser.some(u => u.accountnumber === generateaccountnumber));

    let regaccountdetails = {
        name: userregname.value,
        accounttype: userregactype.value,
        pin: Number(userregpin.value),
        initialamount: Number(userreginitialdpamount.value),
        accountnumber: generateaccountnumber,
        registerationstatus: true,
        transactionhistory: [],
        transactiondate: [],
        imageFile: null
    };

    storeduser.push(regaccountdetails);
    localStorage.setItem('regaccountdetails', JSON.stringify(storeduser));

    userregacnumber.value = generateaccountnumber;
    document.getElementById("totalaccounts").innerText = storeduser.length;
    document.getElementById("acnumbershow").style.display = "block"
    console.log("Registered:", regaccountdetails);
}

// Account login Logic Starts Here

let userloginname = document.getElementById("userloginname");
let userloginpin = document.getElementById("userloginpin");
let userloginattempt = 3;
let seconds = 60;
const btn = document.getElementById("loginsubmit");
function loginpage() {

    document.getElementById("transactions").style.display = "none";
    document.getElementById("dashboardsec").style.display = "none";
    document.getElementById("registration").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("transactions").style.display = "none";

}

function accountlogin() {
    founduser = storeduser.find(u => u.name.toLowerCase() === userloginname.value.toLowerCase() && u.pin === Number(userloginpin.value));
    if (userloginname.value === "" || userloginname.value === null) {
        document.getElementById("loginerror").style.color = " red";
        document.getElementById("loginerror").innerText = "Please enter a valid name";
        return;
    }
    else if (storeduser.length <= 0 || !storeduser.some(u => u.name.toLowerCase() === userloginname.value.toLowerCase())) {
        document.getElementById("loginerror").style.display = "block";
        document.getElementById("loginerror").style.color = " red";
        document.getElementById("loginerror").innerText = "No Registered Users Available Please Register First";
        setTimeout(() => {
            
        document.getElementById("loginerror").style.display = "none";
        }, 2000);
        return;
    }
    else {
        if (founduser) {
            alert("Login Successfull");
            localStorage.setItem('isLoggedIn', JSON.stringify(true));
            localStorage.setItem('LoggedUserAccount', JSON.stringify(founduser.accountnumber));
            setTimeout(() => dashboard(), 100);

        }
        else {
            userloginattempt--;
            document.getElementById("loginerror").style.color = " red";
            document.getElementById("loginerror").innerText = userloginattempt + " Login attempts Left  ";

        }
        if (userloginattempt <= 0) {
            btn.disabled = true;
            document.getElementById("loginerror").style.color = " red";
            document.getElementById("loginerror").innerText = userloginname.value + " Account Locked pls try again later !";
            let timer = setInterval(() => {
                seconds--;
                btn.innerText = `Try again in ${seconds}s`;

                if (seconds <= 0) {
                    clearInterval(timer);
                    btn.disabled = false;
                    btn.innerText = "Submit";
                    userloginattempt = 3;
                }
            }, 1000); // 1 second

        }
    }


}


function depositmoney() {
    if (addamountinput.value <= 0) {
        document.getElementById("modalboxerror").innerText = "Please enter a valid amount";
        return;
    }
    else {

        document.getElementById('modalboxerror').style.display = "block"
        document.getElementById('modalboxerror').style.color = "green"
        document.getElementById('modalboxerror').innerText = "Amount Deposit Success"
        setTimeout(() => {
            document.getElementById('modalboxerror').style.display = "none"

        }, 2000);

        let storeduserindex = storeduser.findIndex(u => u.accountnumber === founduser.accountnumber);
        storeduser[storeduserindex].initialamount += Number(addamountinput.value);
        storeduser[storeduserindex].transactionhistory.push(Number(addamountinput.value));
        const date = new Date();
        const localFormatted = date.toLocaleString("en-IN");
        storeduser[storeduserindex].transactiondate.push(localFormatted)
        document.getElementById("dbbalance").value = storeduser[storeduserindex].initialamount;
        localStorage.setItem('regaccountdetails', JSON.stringify(storeduser));
        addamountinput.value = null;;

    }
}

function deductmoney() {

    if (deductamountinput.value <= 0) {
        document.getElementById('deductmodalboxerror').style.display = "block"
        document.getElementById("deductmodalboxerror").innerText = "Please enter a valid amount";
        return;
    }
    if (deductamountinput.value > founduser.initialamount) {
        document.getElementById('deductmodalboxerror').style.display = "block"
        document.getElementById('deductmodalboxerror').style.color = "red"
        document.getElementById("deductmodalboxerror").innerText = "Insufficient Balance";
        return;
    }
    else {

        document.getElementById('deductmodalboxerror').style.display = "block"
        document.getElementById('deductmodalboxerror').style.color = "green"
        document.getElementById('deductmodalboxerror').innerText = "Amount Deduct Success"
        setTimeout(() => {
            document.getElementById('deductmodalboxerror').style.display = "none"

        }, 2000);

        let storeduserindex = storeduser.findIndex(u => u.accountnumber === founduser.accountnumber);
        storeduser[storeduserindex].initialamount -= Number(deductamountinput.value);
        storeduser[storeduserindex].transactionhistory.push(-Number(deductamountinput.value));
        const date = new Date();
        const localFormatted = date.toLocaleString("en-IN");
        storeduser[storeduserindex].transactiondate.push(localFormatted)
        document.getElementById("dbbalance").value = storeduser[storeduserindex].initialamount;
        localStorage.setItem('regaccountdetails', JSON.stringify(storeduser));
        addamountinput.value = null;;

    }
}

function transanctionhistory() {
    document.getElementById("transactions").style.display = "block";
    let storeduserindex = storeduser.findIndex(u => u.accountnumber === founduser.accountnumber);
    const tablebody = document.getElementById("tablebody");
    console.log(storeduser[storeduserindex].transactionhistory);
    console.log(storeduser[storeduserindex].transactiondate);

    let transactions = storeduser[storeduserindex].transactionhistory;
    let dates = storeduser[storeduserindex].transactiondate;

    tablebody.innerHTML = "";
    if (transactions.length <= 0) {
        document.getElementById("transactionsstatus").innerText = "No Transaction History Available";
        return;
    }
    else {
        document.getElementById("transactionsstatus").innerText = "Transaction History";
    }
    for (let i = transactions.length - 1; i >= 0; i--) {

        let tablerow = document.createElement("tr");
        let tablecell1 = document.createElement("td");
        let tablecell2 = document.createElement("td");
        let tablecell3 = document.createElement("td");

        tablecell1.innerText = dates[i];
        tablecell2.innerText = transactions[i];

        if (transactions[i] < 0) {
            tablecell3.innerText = "Debit";
            tablecell3.style.color = "red";
        } else {
            tablecell3.innerText = "Credit";
            tablecell3.style.color = "green";
        }

        tablerow.appendChild(tablecell1);
        tablerow.appendChild(tablecell2);
        tablerow.appendChild(tablecell3);

        tablebody.appendChild(tablerow);
    }
}
function deleteaccount() {
    let userdeletepin = Number(prompt("Pls Enter your PIN to Delete your Account: "));
    if (userdeletepin !== founduser.pin) {
        alert("Invalid PIN");
        return;
    }
    if (founduser.pin === Number(userdeletepin)) {
        if (confirm("Are your sure to delete your account ?")) {

            let storeduserindex = storeduser.findIndex(u => u.accountnumber === founduser.accountnumber);
            storeduser.splice(storeduserindex, 1);
            localStorage.setItem('regaccountdetails', JSON.stringify(storeduser));
            document.getElementById("totalaccounts").innerText = storeduser.length;
            alert("Account Deleted Successfully");
            loginpage();
        }
    }
}
