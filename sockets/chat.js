//chat.js
module.exports = (io, socket) => {
    // Listen for "new user" socket emits
    
    //io.emit sends data to all clients on the connection.
    //socket.emit sends data to the client that sent the original data to the server.
    socket.on('new user', (username) => {
        console.log(`✋ ${username} has joined the chat! ✋`);
        //Send the username to all clients currently connected
        io.emit("new user", username);
    })
  
}