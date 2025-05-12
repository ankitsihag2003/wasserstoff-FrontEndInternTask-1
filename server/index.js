import express from 'express';
import http from 'http'; 
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();    // Create an Express app
app.use(cors());        // Using CORS middleware to allow cross-origin requests(frontend<->backend)

//integrating socket.io with express
const server = http.createServer(app);   // Create an HTTP server
const io = new Server(server, {       // creating a socket.io server over the http server
  cors: {
    origin: "http://localhost:5173", // Frontend URL as origin
    methods: ["GET", "POST"],
  },
});

let content = ""; // Variable to store the content of the text area
let users = new Map(); // Map to store active users

const broadcastUsers = ()=>{
    io.emit("active-users", Array.from(users.values())); // Broadcast the list of active users to all connected clients
}

// Socket.io connection event
io.on("connection", (socket) => {
    console.log("A user connected",socket.id); // Log when a user connects
    // Send the current content to the newly connected user
    socket.emit("load-content", content);

    // when client joins with username
    socket.on("join", ({username,color}) => {
        //Removing the user from the users map if it already exists
        for (const [key, value] of users.entries()) {
            if(value.username.toLowerCase() === username.toLowerCase()) {
                users.delete(key); // Remove the user from the users map
                break; // Exit the loop after removing the user
            }
        }
        users.set(socket.id, {username,color}); // Add the user to the users map
        broadcastUsers(); // Broadcast the updated list of active users
        socket.emit("load-content", content); // Send the current content to the newly connected user
    });

    // content change event
    socket.on("send-changes", ({html,username}) => {
        content = html; // Update the content variable
        socket.broadcast.emit("receive-changes",{html,username} ); // Broadcast the updated content to all other users
    });
    // typing event
    socket.on("typing", (user) => {
        socket.broadcast.emit("typing", user); // Broadcast the typing event to all other users
    });

    // Disconnection event
    socket.on("disconnect", () => {
        console.log("A user disconnected",socket.id); // Log when a user disconnects
        users.delete(socket.id); // Remove the user from the users map
        broadcastUsers(); // Broadcast the updated list of active users
    });
})

server.listen(3000, () => {
    console.log("Server is running on port 3000");
})


