const chatForm = document.getElementById("chat-form");
const chatDiv = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
// const qs = require('qs');
// const goFullscreen = document.querySelector(".fullscreen");


// goFullscreen.addEventListener("click", () => document.documentElement.webkitRequestFullScreen());

// Get username and room from URL (destructuring):
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// console.log(username, room);

const socket = io();

// Join chatroom:
socket.emit("joinRoom", { 
    username: username,
    room: room 
});

// Get room and users:
socket.on("roomUsers", ({ room, users }) => {
    console.log("room");
    console.log(room);
    console.log("users");
    console.log(users);
    
    outputRoomName(room);
    outputUsers(users);
});

// Message from server:
socket.on("message", message => {
    console.log(`Msg: username: ${message.username}, time: ${message.time}, text: ${message.text}`);
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

// Add room name to DOM:
function outputRoomName(room) {
    roomName.innerText = room;
};

// Add user list to DOM:
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join("")}
    `;
    // console.log(users);
};