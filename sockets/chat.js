//chat.js
module.exports = (io, socket, onlineUsers, channels) => {
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
        io.emit('user has left', onlineUsers);
    })

    socket.on('new channel', (newChannel) => {
        console.log(newChannel);
        //Save the new channel to our channels object. The array will hold the messages.
        channels[newChannel] = [];
        //Have the socket join the new channel room.
        //Socket.io has this fancy thing called rooms in which different sockets(clients) can .join().
        //socket.join(newChannel) is telling the socket to join the new channel room.
        socket.join(newChannel);
        //Inform all clients of the new channel.
        io.emit('new channel', newChannel);
        //Emit to the client that made the new channel, to change their channel to the one they made.
        socket.emit('user changed channel', {
        channel : newChannel,
        messages : channels[newChannel]
        });
    });
}