const welcome = document.querySelector('#welcome');
const loginSection = document.querySelector('#login-section');
const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');
const logoutButton = document.querySelector('#logout-button');

// Asks the server who is logged in, and shows the right section
async function checkAuthState() {
    try {
        const response = await fetch('/api/whoami');
        const data = await response.json();
        console.log('Auth state:', data.loggedIn);
        if (data.loggedIn) {
            welcome.textContent = `Welcome back, ${data.username}!`;
            loginSection.hidden = true;
            logoutButton.hidden = false;

        } else {
            console.log('User is not logged in');
            welcome.textContent = 'Welcome!';
            loginSection.hidden = false;

        }
    } catch (err) {
        welcome.textContent = 'Welcome!';
        loginSection.hidden = false;

    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginMessage.textContent = '';

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: document.querySelector('#username').value,
                password: document.querySelector('#password').value,
                rememberMe: e.target.rememberMe.checked
            })
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            loginMessage.textContent = data.error || 'Login failed. Please try again.';
            return;
        }

        loginForm.reset();
        checkAuthState();
    } catch (err) {
        loginMessage.textContent = 'Could not reach the server. Check your connection.';
    }
});

document.querySelector('#logout-button').addEventListener('click', async () => {
    try {
        await fetch('/logout', { method: 'POST' });
    } catch (err) {
        // Even if this fails, reloading the page shows the real state
    }
    window.location.href = '/';
});

checkAuthState();
