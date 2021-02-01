/*************************************************/
/*        Avion School Coding Worksheet          */
/*      Build a Pseudo Banking App with UI       */
/*       Coded by: Macariola Ace - Batch V       */
/*     Github: https://github.com/amacariola     */
/*                                               */
/*************************************************/

let account = [];
let accounts_json;


/*********************************************************/
/*                SCRIPT JS DOM HANDLERS                 */
/*                                                       */
/*********************************************************/


if (document.getElementById('createUser') != null) {
    document.getElementById('createUser').onsubmit = function () {
        let user = document.getElementById("Name").value;
        let balance = document.getElementById("balance").value;
        let email = document.getElementById("email" ).value;
        createUser(user, balance, email);
        document.getElementById("Name").value = "";
        document.getElementById("balance").value = "";
        return false; //important to prevent default behaviour at the end of your submit handler
    };
}

if (document.getElementById('getBalance') != null) {
    document.getElementById('getBalance').onsubmit = function () {
        let user = document.getElementById("Name").value;
        let transactions = document.getElementById("transactions");
        let trans_hist_body = document.getElementById("table-body");
        getBalance(user);
        transactions.style.display = "table";
        listTransHistory(user);
        document.getElementById("Name").value = "";
        return false; //important to prevent default behaviour at the end of your submit handler
    };

    document.getElementById('clear').onclick = function () {
        document.getElementById("transactions").style.display = "none";
        document.getElementById("balance").innerHTML = "";
        document.getElementById("bal_name").innerHTML = "";
    }

}

if (document.getElementById('deposit_form') != null) {
    document.getElementById('deposit_form').onsubmit = function () {
        let user = document.getElementById("depositor").value;
        let amount = parseInt(document.getElementById("deposit").value);
        deposit(user, amount);
        document.getElementById("depositor").value = "";
 nb          document.getElementById("deposit").value = "";
        return false; //important to prevent default behaviour at the end of your submit handler
    };
}

if (document.getElementById('withdraw_form') != null) {
    document.getElementById('withdraw_form').onsubmit = function () {
        let user = document.getElementById("withdraw_name").value;
        let amount = parseInt(document.getElementById("withdraw").value);
        withdraw(user, amount);
        document.getElementById("withdraw_name").value = "";
        document.getElementById("withdraw").value = "";
        return false; //important to prevent default behaviour at the end of your submit handler
    };
}

if (document.getElementById('transfer') != null) {
    document.getElementById('transfer').onsubmit = function () {
        let sender = document.getElementById("trans_sender").value;
        let receiver = document.getElementById("trans_receiver").value;
        let amount = parseInt(document.getElementById("transfer_amt").value);
        transfer(sender, receiver, amount);
        document.getElementById("trans_sender").value = "";
        document.getElementById("trans_receiver").value = "";
        document.getElementById("transfer_amt").value = "";
        return false; //important to prevent default behaviour at the end of your submit handler
    };
}



/**************************************************/
/*              FUNCTION SECTION                  */
/*                                                */
/**************************************************/
function initialize() {
    if (localStorage.getItem("account") !== null) {
        account = JSON.parse(localStorage.getItem("account"));
    }
}

function update() {
    accounts_json = JSON.stringify(account);
    localStorage.setItem("account", accounts_json);
}

function nameFormat(name) {
    if (name.match(/^\d/)) {
        alert("Account name shouldnt have a number string");
        return false;
    } else {
        return true;
    }
}

//return true if the amount is positive or 0
function formatAmount(amount) {
    if (amount < 0 && typeof (amount) !== "number") {
        alert("Please input a positive value");
        return false;
    } else {
        return true;
    }
}

//return array index if user exists in account Array else return -1
function ConfirmUser(name) {
    for (i = 0; i < account.length; i++) {
        if (account[i].name === name) {
            return i;
        }
    }
    return -1;
}

function dateTime() {
    return new Date().toLocaleString().replace(",", "").replace(/:.. /, " ");
}

function User(name, balance, email = "Not Provided") {
    this.name = name;
    this.balance = parseInt(balance);
    this.email = email;
    this.transaction_history = [];
}

function Transaction(operation, amount, balance, datetime) {
    this.operation = operation;
    this.amount = amount;
    this.balance = balance;
    this.datetime = datetime;
}

/***************************************************************/
/*   SCRIPT MAIN FUNCTIONS(CREATE/DEPOSIT/WITHDRAW/TRANSFER)   */    
/*                                                             */
/***************************************************************/

function createUser(user, balance = 0, email = "") {
    initialize();
    if (nameFormat(user) && formatAmount(balance)) {
        account.push(new User(user, balance, email));
    }
    update();
    alert(`${user} added, proceed to Main Menu`);
}

function deposit(user, amount) {
    initialize();
    let index = ConfirmUser(user);
    if (index >= 0 && formatAmount(amount)) {
        let transferAmount = parseInt(amount);
        currentDatetime = dateTime();
        account[index].balance += transferAmount;
        account[index].transaction_history.push(new Transaction("+", transferAmount, account[index].balance, currentDatetime));
        update();
        let addedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(amount);
        alert(`${addedAmount} added to ${user}'s account`);
    } else {
        alert("Deposit action invalid!");
    }

}

function withdraw(user, amount) {
    initialize();
    let index = ConfirmUser(user);

    //check if balance is sufficient for withdrawal
    if (index >= 0 && formatAmount(amount) && account[index].balance >= amount) {
        let transferAmount = parseInt(amount);
        currentDatetime = dateTime();
        account[index].balance -= transferAmount;
        account[index].transaction_history.push(new Transaction("-", transferAmount, account[index].balance, currentDatetime));

        update();

        let deductedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(amount);
        alert(`Transaction complete! ${deductedAmount} deducted from ${user}'s account`);
    } else {
        alert(`${user} account balance insufficient`);
    }

}

function transfer(sender, receiver, amount) {
    initialize();
    let a = ConfirmUser(sender);
    let b = ConfirmUser(receiver);

    if (a >= 0 && b >= 0 && formatAmount(amount) && account[a].balance >= amount) {
        let transferAmount = parseInt(amount);
        currentDatetime = dateTime();

        account[a].balance -= transferAmount;
        account[a].transaction_history.push(new Transaction("-", transferAmount, account[a].balance, currentDatetime, "Transfer =>", account[b].name));

        account[b].balance += transferAmount;
        account[b].transaction_history.push(new Transaction("+", transferAmount, account[b].balance, currentDatetime, "Transfer <=", account[a].name));

        update();

        let transferredAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(amount);
        alert(`Transaction complete! ${transferredAmount} transferred from ${sender} to ${receiver}'s account`);
    } else {
        alert(`Transfer Failed due to insufficient balance or non-existing account`);
    }

}

function getBalance(user) {
    initialize();
    let balance = document.getElementById("balance");
    let bal_name = document.getElementById("bal_name");
    let index = ConfirmUser(user);
    if (index >= 0) {
        bal_name.innerHTML = user   
        balance.innerHTML = "Balance:" + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(account[index].balance);

    } else {
        alert("Get balance action invalid as user can't be found on the system");
    }

}

function listTransHistory(user) {
    initialize();
    let index = ConfirmUser(user);
    document.getElementById("table-body").innerHTML = "";
    if (index >= 0) {
        account[index].transaction_history.forEach(function (item, index) {
            let tr = document.createElement("tr");
            let amt_td = document.createElement("td");
            let bal_td = document.createElement("td");
            let dt_td = document.createElement("td");

            amt_td.innerHTML = item.operation + item.amount;
            bal_td.innerHTML = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(item.balance);
            dt_td.innerHTML = item.datetime;

            tr.appendChild(amt_td);
            tr.appendChild(bal_td);
            tr.appendChild(dt_td);

            document.getElementById("table-body").appendChild(tr);
        });
        update();
    }
}

initialize();