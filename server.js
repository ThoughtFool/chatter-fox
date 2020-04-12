const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMsg = require("./utils/messages");
const {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomUsers
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder:
app.use(express.static(path.join(__dirname, "public")));

const botName = "FoxBot";

// Run when client connects:
io.on("connection", (socket) => {
    // console.log("New client connected...");
    socket.on("joinRoom", ({
        username,
        room
    }) => {
        const user = userJoin(socket.id, username, room);

        // Join to room:
        socket.join(user.room);

        // Welcome current user/clent:
        socket.emit("message", formatMsg(botName, `Hey ${user.username}, welcome to Chatter-Fox.`));

        // Broadcast when users/clents connect (to everyone except current user/client):
        socket.broadcast.to(user.room).emit("message", formatMsg(botName, `There's another fox in the hen house! ${user.username} has joined the chat.`));
        // (to everyone including current client):
        // io.emit();

        // Send users and room info to sidebar:
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage:
    socket.on("chatMessage", (msg) => {

        const user = getCurrentUser(socket.id);

        // console.log(msg);
        io.to(user.room).emit("message", formatMsg(user.username, msg));
    });

    // Runs when user/client disconnets:
    socket.on("disconnect", () => {

        const user = userLeaves(socket.id);

        if (user) {

            io.to(user.room).emit("message", formatMsg(botName, `One less fox is in the hen house. ${user.username} has left the chat.`));

            // Remove users and room info from sidebar:
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        };
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}.`));