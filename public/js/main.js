const chatForm = document.getElementById("chat-form");
const chatDiv = document.querySelector(".chat-messages");

const socket = io();

// Message from server:
socket.on("message", message => {
    console.log(`Msg: ${message}`);
    outputMsg(message);

    // Auto-scroll down:
    chatDiv.scrollTop = chatDiv.scrollHeight;
});

// Message submit:
chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get message text:
    const msg = event.target.elements.msg.value;
    // console.log("msg:");
    // console.log(msg);
    
    // Emit message to server:
    socket.emit("chatMessage", msg);

    // Clear input field:
    event.target.elements.msg.value = "";
    event.target.elements.msg.focus();
});

// Output message to DOM:
function outputMsg (message) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("message");
    newDiv.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    chatDiv.appendChild(newDiv);
};