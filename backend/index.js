const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const mongoDB = require('./db');
const socket = require('socket.io');

// Connect to MongoDB before starting the server
mongoDB();
app.use(cors()); 
app.use(express.json());

app.use('/api', require("./Routes/CreateUser"));
app.use('/api/msg', require("./Routes/messageroute"));
app.use('/api/group', require('./Routes/grpmsg'));
app.use('/api/interestsgrp', require('./Routes/addinterest'));
const server = app.listen(port, () => {
    console.log('Server is listening on port', port);
});

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    },
});

// Use a Map to store online users. The value now includes socketId.
global.onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Automatically join the common community room for group chat
    socket.join("community");

    socket.on("add-user", (userId, username) => {
        console.log("User added:", userId);
        onlineUsers.set(userId, { username, socketId: socket.id });
        io.emit("connected-users", Array.from(onlineUsers.values()));
        console.log("Current connected users:", Array.from(onlineUsers.values()));
    });

    socket.on("send-msg", (data) => {
        console.log("Message sent:", data);
        const sendUser = onlineUsers.get(data.to);
        if (sendUser) {
            socket.to(sendUser.socketId).emit("msg-receive", data.message);
        }
    });

    // Handle group messages
    socket.on("send-group-msg", (data) => {
        console.log("Group message sent:", data);
        // Broadcast group message to everyone in the "community" room
        socket.to("community").emit("group-msg-receive", data);
    });
});
