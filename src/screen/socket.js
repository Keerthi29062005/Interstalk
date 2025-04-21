// socket.js
import { io } from "socket.io-client";

// Initialize the socket connection
const socket = io("http://localhost:5000", {
    transports: ["websocket"], // Use websocket as the primary transport
    withCredentials: true,    // Allow credentials if needed
});

socket.on("connect", () => {
    console.log("Frontend connected to Socket.IO:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Socket disconnected.");
});

export default socket;
