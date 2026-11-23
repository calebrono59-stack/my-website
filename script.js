
// LOAD SAVED TRANSACTIONS
let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

// GIVE OLD TRANSACTIONS IDs
transactions = transactions.map(function(item) {
    return {
        ...item,
        id: item.id || (Date.now() + Math.random()),
        date: item.date || new Date().toISOString()
    };
});

// SAVE UPDATED TRANSACTIONS
localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
);

const form = document.getElementById("transactionForm");

let editingId = null;

// ADD OR UPDATE TRANSACTION
form.addEventListener("submit", function(event) {

    event.preventDefault();

    let description = document.getElementById("description").value.trim();
    let amount = Number(document.getElementById("amount").value);
    let type = document.getElementById("type").value;

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter valid transaction details.");
        return;
    }

    if (editingId !== null) {

        let transaction = transactions.find(
            item => item.id === editingId
        );

        transaction.description = description;
        transaction.amount = amount;
        transaction.type = type;

        editingId = null;

        form.querySelector("button").textContent = "Add Transaction";

    } else {

        let transaction = {
            id: Date.now(),
            description: description,
            amount: amount,
            type: type,
            date: new Date().toISOString()
        };

        transactions.unshift(transaction);

    }

    saveTransactions();
    form.reset();

});

// SAVE DATA
function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    updateDashboard();

}

// EDIT TRANSACTION
function editTransaction(id) {

    let transaction = transactions.find(
        item => item.id === id
    );

    if (!transaction) return;

    document.getElementById("description").value =
        transaction.description;

    document.getElementById("amount").value =
        transaction.amount;

    document.getElementById("type").value =
        transaction.type;

    editingId = id;

    form.querySelector("button").textContent = "Update Transaction";

    form.scrollIntoView({ behavior: "smooth" });

}

// DELETE TRANSACTION
function deleteTransaction(id) {

    let confirmDelete = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    transactions = transactions.filter(
        item => item.id !== id
    );

    saveTransactions();

}

// UPDATE DASHBOARD
function updateDashboard() {

    let income = 0;
    let expense = 0;

    transactions.forEach(function(item) {

        if (item.type === "income") {
            income += item.amount;
        } else {
            expense += item.amount;
        }

    });

    let balance = income - expense;

    document.getElementById("balance").textContent =
        "KSh " + balance.toLocaleString("en-KE");

    document.getElementById("income").textContent =
        "KSh " + income.toLocaleString("en-KE");

    document.getElementById("expense").textContent =
        "KSh " + expense.toLocaleString("en-KE");

    let list = document.getElementById("transactionList");

    list.innerHTML = "";

    if (transactions.length === 0) {
        list.textContent = "No transactions yet.";
    }

    transactions.forEach(function(item) {

        let row = document.createElement("div");
        row.className = "transaction";

        let details = document.createElement("div");

        let title = document.createElement("strong");
        title.textContent = item.description;

        let date = document.createElement("p");

        date.textContent = item.type + " | " +
            new Date(item.date).toLocaleDateString("en-KE");

        details.appendChild(title);
        details.appendChild(date);

        let actions = document.createElement("div");

        actions.style.display = "flex";
        actions.style.alignItems = "center";
        actions.style.gap = "10px";

        let value = document.createElement("strong");

        value.className = item.type;

        let sign = item.type === "income" ? "+" : "-";

        value.textContent = sign + " KSh " +
            item.amount.toLocaleString("en-KE");

        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function() {
            editTransaction(item.id);
        });

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteTransaction(item.id);
        });

        actions.appendChild(value);
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        row.appendChild(details);
        row.appendChild(actions);

        list.appendChild(row);

    });

}

// LOAD DASHBOARD
updateDashboard();
