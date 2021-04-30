//chat.js
module.exports = (io, socket, onlineUsers) => {
    // Listen for "new user" socket emits

    //io.emit sends data to all clients on the connection.
    //socket.emit sends data to the client that sent the original data to the server.
    socket.on('new user', (username) => {
        //Save the username as key to access the user's socket id
        onlineUsers[username] = socket.id;
        //Save the username to socket as well. This is important for later.
        socket["username"] = username;
        //Send the username to all clients currently connected
        console.log(`✋ ${username} has joined the chat! ✋`);
        io.emit("new user", username);
    })

    //triggers index.js socket.emit('new msg')
    socket.on('new msg', (data) => {
        // Send that data back to ALL clients
        console.log(`🎤 ${data.sender}: ${data.message} 🎤`)
        io.emit('new msg', data);
    })
  
    socket.on('get online users', () => {
        //Send over the onlineUsers
        socket.emit('get online users', onlineUsers);
    })

    // This fires when a user closes out of the application
    // socket.on("disconnect") is a special listener that fires when a user exits out of the application.
    socket.on('disconnect', () => {
        //This deletes the user by using the username we saved to the socket
        delete onlineUsers[socket.username];
        socket.emit('user has left', onlineUsers);
    })
}