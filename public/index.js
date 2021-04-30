$(document).ready( () => {
  //Connect to the socket.io server
  const socket = io.connect();

  //Keep track of the current user
  let currentUser;
  // Get the online users from the server
  socket.emit('get online users');

  $('#create-user-btn').click((e)=>{
    e.preventDefault();
    if($('#username-input').val().length > 0){
      socket.emit('new user', $('#username-input').val());
      // Save the current user when created
      currentUser = $('#username-input').val();
      //removing the form will remove its data, so we capture it above first
      $('.username-form').remove();
      // Have the main page visible
      $('.main-container').css('display', 'flex');
    }
  });

  $('#send-chat-btn').click((e)=>{
    e.preventDefault();
    if($('#chat-input').val().length > 0){
      let msg = $('#chat-input').val();
      socket.emit('new msg', {
        sender: currentUser,
        message: msg
      });
      //make the text box empty
      $('#chat-input').val("");
    }
  });

  $('#new-channel-btn').click( () => {
    let newChannel = $('#new-channel-input').val();
  
    if(newChannel.length > 0){
      // Emit the new channel to the server
      socket.emit('new channel', newChannel);
      $('#new-channel-input').val("");
    }
  });

  //socket listeners

  socket.on('new user', (username) => {
    console.log(`${username} has joined the chat`);
    // Add the new user to the online users div
    $('.users-online').append(`<div class="user-online">${username}</div>`);
  })

  socket.on('new msg', (data) => {
    $('.message-container').append(`
    <div class="message">
      <p class="message-user">${data.sender}: </p>
      <p class="message-text">${data.message}</p>
    </div>
    `);
  })

  socket.on('get online users', (onlineUsers) => {
    //You may have not have seen this for loop before. It's syntax is for(key in obj)
    //Our usernames are keys in the object of onlineUsers.
    for(username in onlineUsers){
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    }
  })

  socket.on('user has left', (onlineUsers) => {
    console.log(`user has left the chat`);
    $('.users-online').empty();
    for(username in onlineUsers){
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    }
  })

})