// async function loadMessages() {
//     const response = await fetch('/api/guestbook');
//     const messages = await response.json();
//     // document.querySelector('#guestbook-list').innerHTML = messages.map(msg => \`<li>${msg}</li>\`).join('');
//     const list = document.querySelector('#guestbook-list');
//     list.innerHTML = '';
//     [...messages].reverse().forEach(message => {
//         const li = document.createElement('li');
//         const msg = document.createElement('p')
//         msg.textContent = message;
//         li.appendChild(msg);
//         list.append(li)
//     });

// }

async function loadMessages() {

    const listError = document.querySelector('#list-error');
    listError.textContent = '';

    try {

        const response = await fetch('/api/guestbook');

        const entries = await response.json().catch(() => ({}));

        if (!response.ok) {
            listError.textContent = entries.error || 'Could not load messages.';
            return;
        }

        // ...your existing code that builds each entry with textContent...

        const list = document.querySelector('#guestbook-list');

        list.innerHTML = ''; // Clearing with an empty string is safe

        // Newest first: copy the array, then reverse the copy

        [...entries].reverse().forEach(entry => {

            const li = document.createElement('li');
            const name = document.createElement('strong');
            name.textContent = entry.name;
            const date = document.createElement('small');
            date.textContent = new Date(entry.createdAt).toLocaleString();
            const msg = document.createElement('p');
            msg.textContent = entry.msg;
            li.append(name, ' ', date, msg);
            list.append(li);
        });

    } catch (err) {

        listError.textContent = 'Could not reach the server. Check your connection.';
    }
}

// document.querySelector('#guestbook-form').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     await fetch('/api/guestbook', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ msg: e.target.msg.value })
//     });
//     e.target.reset();
//     loadMessages();
// });

document.querySelector('#guestbook-form').addEventListener('submit', async (e) => {

    e.preventDefault();
    const errorBox = document.querySelector('#form-error');
    errorBox.textContent = ''; // Clear any old error

    try {

        const response = await fetch('/api/guestbook', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: document.querySelector('#name').value,
                msg: document.querySelector('#msg').value
            })
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            errorBox.textContent = data.error || 'Something went wrong. Please try again.';
            return; // Stop here, and keep what the user typed
        }

    } catch (err) {
        errorBox.textContent = 'Could not reach the server. Check your connection.';
        return;
    }

    e.target.reset();
    loadMessages();
});

// document.querySelector('#guestbook-form').addEventListener('submit', async (e) => {

//     e.preventDefault();

//     await fetch('/api/guestbook', {

//         method: 'POST',

//         headers: { 'Content-Type': 'application/json' },

//         body: JSON.stringify({ msg: e.target.msg.value })

//     });

//     e.target.reset();

//     loadMessages();

// });

loadMessages();
