// Bank 🏦 Dashboard Application
// Pure HTML, CSS, JavaScript with localStorage

// Initialize demo data if not exists
function initializeData() {
    if (!localStorage.getItem('bankUser')) {
        const defaultUser = {
            username: 'user',
            password: 'pass',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main Street, City, State 12345'
        };
        localStorage.setItem('bankUser', JSON.stringify(defaultUser));
    }
    
    if (!localStorage.getItem('checkingAccount')) {
        const checkingAccount = {
            balance: 5432.50,
            accountNumber: '****1234',
            fullAccountNumber: '1234567891234',
            transactions: [
                {
                    id: 1,
                    type: 'income',
                    description: 'Salary Deposit',
                    amount: 3500.00,
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'Income'
                },
                {
                    id: 2,
                    type: 'expense',
                    description: 'Grocery Store',
                    amount: -127.45,
                    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'Shopping'
                },
                {
                    id: 3,
                    type: 'expense',
                    description: 'Electric Bill',
                    amount: -89.99,
                    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'Utilities'
                }
            ]
        };
        localStorage.setItem('checkingAccount', JSON.stringify(checkingAccount));
    }
    
    if (!localStorage.getItem('savingsAccount')) {
        const savingsAccount = {
            balance: 12750.80,
            accountNumber: '****5678',
            fullAccountNumber: '5678901235678',
            transactions: [
                {
                    id: 1,
                    type: 'income',
                    description: 'Initial Deposit',
                    amount: 10000.00,
                    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'Deposit'
                },
                {
                    id: 2,
                    type: 'income',
                    description: 'Interest Payment',
                    amount: 45.30,
                    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'Interest'
                },
                {
                    id: 3,
                    type: 'income',
                    description: 'Monthly Savings',
                    amount: 500.00,
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    category: 'Savings'
                }
            ]
        };
        localStorage.setItem('savingsAccount', JSON.stringify(savingsAccount));
    }
}

// Login Page Logic
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '/index.html') {
    initializeData();
    
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const user = JSON.parse(localStorage.getItem('bankUser'));
            
            if (username === user.username && password === user.password) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            } else {
                errorMessage.textContent = 'Invalid username or password';
                errorMessage.classList.add('show');
                
                setTimeout(() => {
                    errorMessage.classList.remove('show');
                }, 3000);
            }
        });
    }
}

// Dashboard Logic
if (window.location.pathname.includes('dashboard.html')) {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
    }
    
    const user = JSON.parse(localStorage.getItem('bankUser'));
    const checkingAccount = JSON.parse(localStorage.getItem('checkingAccount'));
    const savingsAccount = JSON.parse(localStorage.getItem('savingsAccount'));
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Navigation
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const contentArea = document.getElementById('contentArea');
    const pageTitle = document.getElementById('pageTitle');
    const userGreeting = document.getElementById('userGreeting');
    
    userGreeting.textContent = `Welcome back, ${user.name}!`;
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu
            sidebar.classList.remove('active');
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Load page content
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    });
    
    // Load different pages
    function loadPage(page) {
        switch(page) {
            case 'overview':
                loadOverview();
                break;
            case 'checking':
                loadAccountDetails('checking');
                break;
            case 'savings':
                loadAccountDetails('savings');
                break;
            case 'transfer':
                loadTransferPage();
                break;
            case 'profile':
                loadProfilePage();
                break;
        }
    }
    
    function loadOverview() {
        pageTitle.textContent = 'Dashboard Overview';
        
        const totalBalance = checkingAccount.balance + savingsAccount.balance;
        const allTransactions = [...checkingAccount.transactions, ...savingsAccount.transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        contentArea.innerHTML = `
            <div class="accounts-grid">
                <div class="account-card" onclick="navigateToAccount('checking')">
                    <div class="account-type">Checking Account</div>
                    <div class="account-balance">$${checkingAccount.balance.toFixed(2)}</div>
                    <div class="account-number">${checkingAccount.accountNumber}</div>
                </div>
                
                <div class="account-card savings" onclick="navigateToAccount('savings')">
                    <div class="account-type">Savings Account</div>
                    <div class="account-balance">$${savingsAccount.balance.toFixed(2)}</div>
                    <div class="account-number">${savingsAccount.accountNumber}</div>
                </div>
            </div>
            
            <div class="transaction-section">
                <div class="section-header">
                    <h2>Recent Transactions</h2>
                </div>
                <div class="transaction-list">
                    ${allTransactions.length > 0 ? allTransactions.map(t => `
                        <div class="transaction-item">
                            <div class="transaction-info">
                                <div class="transaction-icon ${t.type}">
                                    ${t.type === 'income' ? '💰' : '💳'}
                                </div>
                                <div class="transaction-details">
                                    <h4>${t.description}</h4>
                                    <p>${new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div class="transaction-amount ${t.amount >= 0 ? 'positive' : 'negative'}">
                                ${t.amount >= 0 ? '+' : ''}$${Math.abs(t.amount).toFixed(2)}
                            </div>
                        </div>
                    `).join('') : '<div class="empty-state"><div class="empty-state-icon">📋</div><h3>No transactions yet</h3><p>Your transaction history will appear here</p></div>'}
                </div>
            </div>
        `;
    }
    
    function loadAccountDetails(accountType) {
        const account = accountType === 'checking' ? checkingAccount : savingsAccount;
        const accountName = accountType === 'checking' ? 'Checking Account' : 'Savings Account';
        pageTitle.textContent = accountName;
        
        contentArea.innerHTML = `
            <div class="accounts-grid">
                <div class="account-card ${accountType === 'savings' ? 'savings' : ''}">
                    <div class="account-type">${accountName}</div>
                    <div class="account-balance">$${account.balance.toFixed(2)}</div>
                    <div class="account-number">Account: ${account.fullAccountNumber || account.accountNumber}</div>
                    <div style="margin-top: 10px; font-size: 12px; opacity: 0.8;">Use this number when contacting Bank 🏦</div>
                </div>
            </div>
            
            <div class="transaction-section">
                <div class="section-header">
                    <h2>Transaction History</h2>
                    <button class="btn-secondary" onclick="showAddTransaction('${accountType}')">
                        Add Transaction
                    </button>
                </div>
                <div class="transaction-list">
                    ${account.transactions.length > 0 ? account.transactions
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map(t => `
                        <div class="transaction-item">
                            <div class="transaction-info">
                                <div class="transaction-icon ${t.type}">
                                    ${t.type === 'income' ? '💰' : '💳'}
                                </div>
                                <div class="transaction-details">
                                    <h4>${t.description}</h4>
                                    <p>${new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${t.category}</p>
                                </div>
                            </div>
                            <div class="transaction-amount ${t.amount >= 0 ? 'positive' : 'negative'}">
                                ${t.amount >= 0 ? '+' : ''}$${Math.abs(t.amount).toFixed(2)}
                            </div>
                        </div>
                    `).join('') : '<div class="empty-state"><div class="empty-state-icon">📋</div><h3>No transactions yet</h3><p>Your transaction history will appear here</p></div>'}
                </div>
            </div>
        `;
    }
    
    function loadTransferPage() {
        pageTitle.textContent = 'Transfer Money';
        
        contentArea.innerHTML = `
            <div class="form-container">
                <h2>Transfer Between Accounts</h2>
                <div id="transferSuccess" class="success-message"></div>
                <form id="transferForm">
                    <div class="form-row">
                        <label>From Account</label>
                        <select id="fromAccount" required>
                            <option value="">Select account</option>
                            <option value="checking">Checking Account - $${checkingAccount.balance.toFixed(2)}</option>
                            <option value="savings">Savings Account - $${savingsAccount.balance.toFixed(2)}</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <label>To Account</label>
                        <select id="toAccount" required>
                            <option value="">Select account</option>
                            <option value="checking">Checking Account</option>
                            <option value="savings">Savings Account</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <label>Amount</label>
                        <input type="number" id="transferAmount" step="0.01" min="0.01" placeholder="0.00" required>
                    </div>
                    
                    <div class="form-row">
                        <label>Description (Optional)</label>
                        <input type="text" id="transferDescription" placeholder="Enter description">
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Transfer Now</button>
                        <button type="button" class="btn-cancel" onclick="loadPage('overview')">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        const transferForm = document.getElementById('transferForm');
        transferForm.addEventListener('submit', handleTransfer);
    }
    
    function handleTransfer(e) {
        e.preventDefault();
        
        const fromAccount = document.getElementById('fromAccount').value;
        const toAccount = document.getElementById('toAccount').value;
        const amount = parseFloat(document.getElementById('transferAmount').value);
        const description = document.getElementById('transferDescription').value || 'Account Transfer';
        
        if (fromAccount === toAccount) {
            alert('Cannot transfer to the same account!');
            return;
        }
        
        const fromData = JSON.parse(localStorage.getItem(fromAccount + 'Account'));
        const toData = JSON.parse(localStorage.getItem(toAccount + 'Account'));
        
        if (amount > fromData.balance) {
            alert('Insufficient funds!');
            return;
        }
        
        // Update balances
        fromData.balance -= amount;
        toData.balance += amount;
        
        // Add transactions to BOTH accounts
        const timestamp = new Date().toISOString();
        
        fromData.transactions.push({
            id: Date.now(),
            type: 'expense',
            description: `Transfer to ${toAccount === 'checking' ? 'Checking' : 'Savings'}`,
            amount: -amount,
            date: timestamp,
            category: 'Transfer'
        });
        
        toData.transactions.push({
            id: Date.now() + 1,
            type: 'income',
            description: `Transfer from ${fromAccount === 'checking' ? 'Checking' : 'Savings'}`,
            amount: amount,
            date: timestamp,
            category: 'Transfer'
        });
        
        // Save to localStorage
        localStorage.setItem(fromAccount + 'Account', JSON.stringify(fromData));
        localStorage.setItem(toAccount + 'Account', JSON.stringify(toData));
        
        // Update global variables
        if (fromAccount === 'checking') Object.assign(checkingAccount, fromData);
        else Object.assign(savingsAccount, fromData);
        
        if (toAccount === 'checking') Object.assign(checkingAccount, toData);
        else Object.assign(savingsAccount, toData);
        
        // Show success message
        const successMsg = document.getElementById('transferSuccess');
        successMsg.textContent = `Successfully transferred $${amount.toFixed(2)} from ${fromAccount} to ${toAccount}!`;
        successMsg.classList.add('show');
        
        // Reset form
        document.getElementById('transferForm').reset();
        
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 3000);
    }
    
    function loadProfilePage() {
        pageTitle.textContent = 'My Profile';
        
        contentArea.innerHTML = `
            <div class="profile-container">
                <div class="profile-header">
                    <div class="profile-avatar">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="profile-info">
                        <h2>${user.name}</h2>
                        <p>Member since January 2024</p>
                    </div>
                </div>
                
                <div class="form-container">
                    <h2>Edit Profile</h2>
                    <div id="profileSuccess" class="success-message"></div>
                    <form id="profileForm">
                        <div class="form-row">
                            <label>Full Name</label>
                            <input type="text" id="profileName" value="${user.name}" required>
                        </div>
                        
                        <div class="form-row">
                            <label>Email Address</label>
                            <input type="email" id="profileEmail" value="${user.email}" required>
                        </div>
                        
                        <div class="form-row">
                            <label>Phone Number</label>
                            <input type="tel" id="profilePhone" value="${user.phone}" required>
                        </div>
                        
                        <div class="form-row">
                            <label>Address</label>
                            <textarea id="profileAddress" required>${user.address}</textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">Save Changes</button>
                            <button type="button" class="btn-cancel" onclick="loadPage('overview')">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        const profileForm = document.getElementById('profileForm');
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    function handleProfileUpdate(e) {
        e.preventDefault();
        
        const updatedUser = {
            ...user,
            name: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            phone: document.getElementById('profilePhone').value,
            address: document.getElementById('profileAddress').value
        };
        
        localStorage.setItem('bankUser', JSON.stringify(updatedUser));
        Object.assign(user, updatedUser);
        
        // Update greeting
        userGreeting.textContent = `Welcome back, ${user.name}!`;
        
        // Show success message
        const successMsg = document.getElementById('profileSuccess');
        successMsg.textContent = 'Profile updated successfully!';
        successMsg.classList.add('show');
        
        // Update profile header
        document.querySelector('.profile-info h2').textContent = user.name;
        document.querySelector('.profile-avatar').textContent = user.name.charAt(0).toUpperCase();
        
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 3000);
    }
    
    // Global functions for onclick handlers
    window.navigateToAccount = function(accountType) {
        document.querySelector(`.nav-item[data-page="${accountType}"]`).click();
    };
    
    window.showAddTransaction = function(accountType) {
        const accountName = accountType === 'checking' ? 'Checking Account' : 'Savings Account';
        
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;';
        
        modal.innerHTML = `
            <div class="form-container" style="max-width: 500px; margin: 0;">
                <h2>Add Transaction to ${accountName}</h2>
                <form id="addTransactionForm">
                    <div class="form-row">
                        <label>Type</label>
                        <select id="transactionType" required>
                            <option value="income">Income (+)</option>
                            <option value="expense">Expense (-)</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <label>Description</label>
                        <input type="text" id="transactionDescription" placeholder="Enter description" required>
                    </div>
                    
                    <div class="form-row">
                        <label>Amount</label>
                        <input type="number" id="transactionAmount" step="0.01" min="0.01" placeholder="0.00" required>
                    </div>
                    
                    <div class="form-row">
                        <label>Category</label>
                        <input type="text" id="transactionCategory" placeholder="Enter category" required>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Add Transaction</button>
                        <button type="button" class="btn-cancel" onclick="this.closest('div[style*=\"position: fixed\"]').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#addTransactionForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = document.getElementById('transactionType').value;
            const description = document.getElementById('transactionDescription').value;
            let amount = parseFloat(document.getElementById('transactionAmount').value);
            const category = document.getElementById('transactionCategory').value;
            
            if (type === 'expense') {
                amount = -amount;
            }
            
            const account = JSON.parse(localStorage.getItem(accountType + 'Account'));
            account.balance += amount;
            
            account.transactions.push({
                id: Date.now(),
                type: type,
                description: description,
                amount: amount,
                date: new Date().toISOString(),
                category: category
            });
            
            localStorage.setItem(accountType + 'Account', JSON.stringify(account));
            
            if (accountType === 'checking') {
                Object.assign(checkingAccount, account);
            } else {
                Object.assign(savingsAccount, account);
            }
            
            modal.remove();
            loadAccountDetails(accountType);
        });
    };
    
    window.loadPage = loadPage;
    
    // Load overview by default
    loadOverview();
}
