const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Run when client connects:
io.on("connection", (socket) => {
    // console.log("New client connected...");
    
    // Welcome current user/clent:
    socket.emit("message", "Hey Foxy, welcome to Chatter-Fox.");

    // Broadcast when users/clents connect (to everyone except current user/client):
    socket.broadcast.emit("message", "There's another fox in the hen house!");
    // (to everyone including current client):
    // io.emit();

    // Runs when user/client disconnets:
    socket.on("disconnect", () => {
        io.emit("message", "One less fox is in the hen house.");
    });

    // Listen for chatMessage:
    socket.on("chatMessage", (msg) => {
    // console.log(msg);
    io.emit("message", msg);
    });
});

// Set static folder:
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}.`));