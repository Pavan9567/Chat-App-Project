let chatSocket = null;
let selectedUser = null;

function startChat(username) {
    chatSocket = new WebSocket('ws://${window.location.host}/ws/chat/${username}/');
    chatSocket.onmessage = function(event){
        const data = JSON.parse(event.data);
        const chatBox = document.getElementById("chat-messages");
        chatBox.innerHTML += `<div>${data.sender}: ${data.message}</div>`;
    };
}

function sendMessage() {
    const input = document.getElementById("message-input");
    chatSocket.send(JSON.stringify({message: input.value}));
    input.value = '';
}

function displayMessage(message, type) {
    const chatMessages = document.getElementById("chat-messages");
    const newMessage = document.createElement("div");
    newMessage.textContent = message;
    newMessage.className = `message ${type}`;
    chatMessages.appendChild(newMessage);
}

// Attach event listener to Send button
document.getElementById("send-button").addEventListener("click", sendMessage);

// Send message on Enter key
document.getElementById("message-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
