const chatForm = document.getElementById("chat-form");
const socket = io();

// Message from server:
socket.on("message", message => {
    console.log(`Msg: ${message}`);
    outputMsg(message);
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
});

// Output message to DOM:
function outputMsg (message) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("message");
    newDiv.innerHTML = `<p class="meta">clientName <span>12:00pm</span></p>
    <p class="text">
        ${message}
    </p>`;
    const chatDiv = document.querySelector(".chat-messages")
    chatDiv.appendChild(newDiv);
};