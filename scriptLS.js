// Function to show only the selected page and hide others
function showpage(pageid) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active"); // Hide all pages
    });

    document.getElementById(pageid).classList.add("active"); // Show the selected page
}

// Run this when the document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    
    // Navigation event listeners for each sidebar link
    document.getElementById("homebtn").addEventListener("click", function () {
    showpage("description");
    });

    document.getElementById("addTrans").addEventListener("click", function () {
        showpage("transacpage");
    });

    document.getElementById("allTrans").addEventListener("click", function () {
        loadFromLocalStorage();
        renderalltransactions();
        showpage("alltranspage");
        hideaddingbtn();
    });

    document.getElementById("exp").addEventListener("click", function () {
        loadFromLocalStorage();
        renderallexptransactions();
        showpage("exppage");
        hideaddingbtn();
    });

    document.getElementById("inc").addEventListener("click", function () {
        loadFromLocalStorage();
        renderallinctransactions();
        showpage("incpage");
        hideaddingbtn();
    });

    document.getElementById("breakdown").addEventListener("click", function () {
        renderBreakdown();
        showpage("brkdwnpage");
        hideaddingbtn();
    });

    document.getElementById("about").addEventListener("click", function () {
        showpage("aboutpage");
        hideaddingbtn();
    });

    document.getElementById("support").addEventListener("click", function () {
        showpage("supportpage");
        hideaddingbtn();
    });

    // Show the main page (description) by default
    showpage("description");

    // Form setup and data initialization
    handleclearform();
    loadFromLocalStorage();
    renderalltransactions();
});

// Variables for income/expense tracking
let netincome = 0;
let totalexp = 0;
let totalinc = 0;
let transactions = [];  // Array to store all transaction data
let balance = 0;

// Local categorization logic based on description keywords
function categorisedesc(description) {
    const desc = description.toLowerCase();
    const categories = {
        'Food': ['food', 'meal', 'restaurant', 'lunch', 'dinner', 'breakfast', 'cafe', 'coffee', 'burger', 'pizza', 'snack', 'eat', 'dining'],
        'Entertainment': ['movie', 'cinema', 'concert', 'netflix', 'show', 'theater', 'party', 'event', 'museum', 'spotify', 'music', 'streaming', 'series', 'hulu', 'disney+', 'amazon prime', 'ticket'],
        'Shopping': ['shopping', 'clothes', 'shoes', 'purchase', 'bought', 'mall', 'online', 'amazon', 'flipkart', 'snapdeal', 'retail', 'apparel', 'accessory', 'electronics', 'gadget', 'device'],
        'Travel': ['travel', 'flight', 'hotel', 'vacation', 'trip', 'taxi', 'uber', 'lyft', 'bus', 'train', 'car rental', 'gas', 'fuel', 'metro', 'subway', 'toll', 'parking'],
        'Groceries': ['grocery', 'groceries', 'supermarket', 'market', 'fruit', 'vegetable', 'meat', 'bakery', 'dairy', 'walmart', 'target', 'costco', 'trader joe', 'aldi', 'safeway'],
        'Bills': ['bill', 'utility', 'phone', 'internet', 'subscription', 'insurance', 'due', 'monthly', 'annual', 'fee', 'renewal'],
        'Education': ['tuition', 'course', 'class', 'book', 'education', 'school', 'college', 'university', 'degree', 'study', 'textbook', 'learning', 'lecture', 'workshop', 'training', 'certification'],
        'Rent': ['rent', 'housing', 'apartment', 'lease', 'landlord', 'tenant', 'property', 'accommodation', 'mortgage', 'down payment', 'real estate'],
        'Salary': ['salary', 'paycheck', 'income', 'wage', 'paid', 'deposit', 'compensation', 'bonus', 'commission', 'revenue', 'earnings', 'payday', 'stipend', 'allowance'],
        'Utilities': ['electric', 'electricity', 'water', 'gas', 'power', 'sewage', 'garbage', 'trash', 'heat', 'cooling', 'energy', 'hydro', 'cable', 'internet bill']
    };

    for (let category in categories) {
        if (categories[category].some(keyword => desc.includes(keyword))) {
            return category;
        }
    }

    return "Others"; // Default category
}

// Async wrapper for categorization (simulated delay)
async function categorisedescAsync(description) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(categorisedesc(description));
        }, 100);
    });
}

// Handle new transaction submission
document.getElementById("newtrans").addEventListener("click", async function (event) {
    if (event.target.id === "newtrans") {
        event.preventDefault();
    }

    let transType = document.querySelector("select").value;
    let transamt = Number(document.querySelector("#amtbox").value);
    let transdesc = document.querySelector("#transdesc").value;
    let transdate = new Date().toLocaleString();

    if (isNaN(transamt) || transamt <= 0) {
        alert("Enter the transaction amount!!!");
        return;
    }

    if (transdesc === "") {
        alert("Enter the transaction description!!!");
        return;
    }

    if (transType === "Expense") {
        balance -= transamt;
        if (balance < 0) {
            alert("You do not have sufficient balance");
            handleclearform();
            return;
        }
    } else if (transType === "Income") {
        balance += Number(transamt);
    }

    let category = await categorisedescAsync(transdesc);

    let transaction = {
        id: Date.now(),
        transdate,
        transdesc,
        transamt,
        transType,
        balance,
        category
    };

    transactions.push(transaction);
    alert("Submitted");
    saveToLocalStorage();
    handleclearform();
    renderalltransactions();
    showpage("description");
    transtypetotals();
});

// Clear the form fields
function handleclearform() {
    document.querySelector("select").value = "Income";
    document.querySelector("#amtbox").value = "";
    document.querySelector("#transdesc").value = "";
    document.querySelector("#transType").value = "";
}

// Save transactions to local storage
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Load transactions from local storage
function loadFromLocalStorage() {
    let trans = localStorage.getItem('transactions');
    if (trans) {
        transactions = JSON.parse(trans);
        transtypetotals();
    }
}

// Render a single transaction row to the table
function renderLocalStorageData(transaction) {
    let alltranspage = document.getElementById('alltranstable');
    let item = document.createElement('tr');

    if (transaction.transType === "Expense") {
        item.classList.add("negative");
    } else {
        item.classList.add("positive");
    }

    item.classList.add('trans-item');
    item.innerHTML = `<td>${transaction.transdate}</td>
                      <td>${transaction.transdesc}</td>
                      <td>${transaction.transamt}</td>
                      <td>${transaction.transType}</td>
                      <td class="balance-color">${transaction.balance}</td>
                      <td><button class="delbtn" onclick="deletetransaction(${transaction.id})">X</button></td>`;
    alltranspage.appendChild(item);
}

// Render all transactions to the table
function renderalltransactions() {
    let alltranspage = document.getElementById('alltranstable');
    alltranspage.innerHTML = `<tr class="tableheadings">
        <th>DATE & TIME</th><th>DESCRIPTION</th><th>AMOUNT</th>
        <th>TYPE</th><th>BALANCE</th><th>REMOVE</th></tr>`;
    transactions.forEach(renderLocalStorageData);
}

// Filter and render only expense transactions
function renderallexptransactions() {
    let exppage = document.getElementById('exptable');
    exppage.innerHTML = `<tr class="tableheadings">
        <th>DATE & TIME</th><th>DESCRIPTION</th><th>AMOUNT</th>
        <th>TYPE</th><th>BALANCE</th><th>REMOVE</th></tr>`;

    let exptransactions = transactions.filter(tx => tx.transType === "Expense");
    exptransactions.forEach(transaction => {
        let newrow = document.createElement("tr");
        newrow.className = 'exptrans-item';
        newrow.innerHTML = `<td>${transaction.transdate}</td>
                            <td>${transaction.transdesc}</td>
                            <td>${transaction.transamt}</td>
                            <td>${transaction.transType}</td>
                            <td class="balance-color">${transaction.balance}</td>
                            <td><button class="delbtn" onclick="deleteexptransaction(${transaction.id})">X</button></td>`;
        exppage.appendChild(newrow);
    });
}

// Filter and render only income transactions
function renderallinctransactions() {
    let incpage = document.getElementById('inctable');
    incpage.innerHTML = `<tr class="tableheadings">
        <th>DATE & TIME</th><th>DESCRIPTION</th><th>AMOUNT</th>
        <th>TYPE</th><th>BALANCE</th><th>REMOVE</th></tr>`;

    let inctransactions = transactions.filter(tx => tx.transType === "Income");
    inctransactions.forEach(transaction => {
        let newrow = document.createElement("tr");
        newrow.className = 'exptrans-item';
        newrow.innerHTML = `<td>${transaction.transdate}</td>
                            <td>${transaction.transdesc}</td>
                            <td>${transaction.transamt}</td>
                            <td>${transaction.transType}</td>
                            <td class="balance-color">${transaction.balance}</td>
                            <td><button class="delbtn" onclick="deleteinctransaction(${transaction.id})">X</button></td>`;
        incpage.appendChild(newrow);
    });
}

// Generate category-wise breakdown summary
function renderBreakdown() {
    const breakdownDiv = document.getElementById("breakdownlist");
    breakdownDiv.innerHTML = "";
    const categoryTotals = {};

    transactions.forEach(tx => {
        if (!categoryTotals[tx.category]) {
            categoryTotals[tx.category] = 0;
        }
        categoryTotals[tx.category] += tx.transamt;
    });

    if (Object.keys(categoryTotals).length === 0) {
        breakdownDiv.innerHTML = "<p>No expenses to show.</p>";
        return;
    }

    let html = `<table border="1" id="brkdwntable" cellpadding="10">
                    <tr><th>Category</th><th>Total Spent</th></tr>`;
    for (let category in categoryTotals) {
        html += `<tr><td>${category}</td><td>₹${categoryTotals[category].toFixed(2)}</td></tr>`;
    }
    html += `</table>`;
    breakdownDiv.innerHTML = html;
}

// Delete a transaction and update balance
function deletetransaction(id) {
    let removedTx = transactions.find(tx => tx.id === id);
    if (!removedTx) return;

    transactions = transactions.filter(tx => tx.id !== id);
    balance = 0;

    transactions.forEach(tx => {
        balance += (tx.transType === "Income") ? tx.transamt : -tx.transamt;
        tx.balance = balance;
    });

    saveToLocalStorage();
    renderalltransactions();
    transtypetotals();
}

// Delete from specific views
function deleteexptransaction(id) {
    deletetransaction(id);
    renderallexptransactions();
}

function deleteinctransaction(id) {
    deletetransaction(id);
    renderallinctransactions();
}

// Calculate and display totals
function transtypetotals() {
    totalexp = 0;
    totalinc = 0;

    transactions.forEach(tx => {
        if (tx.transType === "Expense") totalexp += tx.transamt;
        else totalinc += tx.transamt;
    });

    netincome = totalinc - totalexp;
    let netinc = document.getElementById("netinc");

    if (netincome < 0) {
        netinc.classList.remove("positive");
        netinc.classList.add("negative");
        netinc.innerHTML = `<u>${netincome}</u>`;
    } else if (netincome === 0) {
        netinc.innerHTML = `0`;
    } else {
        netinc.classList.add("positive");
        netinc.classList.remove("negative");
        netinc.innerHTML = `<u>+${netincome}</u>`;
    }
}

// Reset app data
document.getElementById('reset').addEventListener('click', function () {
    localStorage.clear();
    location.reload();
});

// Handle sidebar toggle (mobile-friendly)
let hamburger = document.getElementById('hamburger');
let sidebar = document.querySelector(".sidebar");

hamburger.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    hamburger.classList.toggle("active");
});

// Close sidebar when clicking anywhere on main body
document.getElementById("mainBody").addEventListener("click", function (event) {
    if (event.target.id !== "hamburger") {
        sidebar.classList.remove("active");
        hamburger.classList.remove("active");
    }
});

// deactivate sidebar on clicking the links
function deactsidebar() {
        sidebar.classList.remove("active");
        hamburger.classList.remove("active");
}

// Move Add Transaction button based on screen width
function moveElement() {
    const width = window.innerWidth;
    const addTrans = document.getElementById("addTrans");
    const sidebar = document.getElementById("sidebar");
    const description = document.getElementById("description");

    if (width < 1200) {
        if (!description.contains(addTrans)) {
            description.appendChild(addTrans);
        }
    } else {
        if (!sidebar.contains(addTrans)) {
            sidebar.appendChild(addTrans);
        }
    }
}

window.addEventListener("DOMContentLoaded", moveElement);
window.addEventListener("resize", moveElement);

