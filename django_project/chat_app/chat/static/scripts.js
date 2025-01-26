document.addEventListener('DOMContentLoaded', () => {
    // Handle the collapsible menu for users
    const leftMenu = document.querySelector('.left-menu');
    const chatBox = document.querySelector('.chat-box');
    const chatMessages = document.querySelector('#chat-messages');
    const messageInput = document.querySelector('#message-input');
    const sendButton = document.querySelector('#send-button');
    let chatSocket = null;
    let activeUser = null;

    // Function to start chat with a selected user
    window.startChat = function (username) {
        if (chatSocket) {
            chatSocket.close();
        }
        activeUser = username;

        // Display selected user's name in the chat box
        chatMessages.innerHTML = `<p>Chatting with <strong>${username}</strong></p>`;

        // Open a new WebSocket connection
        chatSocket = new WebSocket(
            'ws://' + window.location.host + '/ws/chat/' + username + '/'
        );

        chatSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            const newMessage = `<p><strong>${data.sender}:</strong> ${data.message}</p>`;
            chatMessages.innerHTML += newMessage;
            chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
        };

        chatSocket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };

        console.log(`Chat started with ${username}`);
    };

    // Function to send a message
    window.sendMessage = function () {
        const message = messageInput.value.trim();
        if (!chatSocket || !activeUser) {
            alert('Please select a user to start chatting!');
            return;
        }

        if (message) {
            chatSocket.send(JSON.stringify({ message: message }));
            const sentMessage = `<p><strong>You:</strong> ${message}</p>`;
            chatMessages.innerHTML += sentMessage;
            chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
            messageInput.value = ''; // Clear the input
        }
    };
});
