$(document).ready( () => {
  //Connect to the socket.io server
  const socket = io.connect();
  //Keep track of the current user
  let currentUser;
  // Get the online users from the server
  socket.emit('get online users');
  //Each user should be in the general channel by default.
  socket.emit('user changed channel', "General");

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
    // Get the client's channel
    if($('#chat-input').val().length > 0){
      let chan = $('.channel-current').text();
      let msg = $('#chat-input').val();
      socket.emit('new msg', {
        sender: currentUser,
        message: msg,
        channel: chan
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

  //Users can change the channel by clicking on its name.
  $(document).on('click', '.channel', (e)=>{
    let newChannel = e.target.textContent;
    socket.emit('user changed channel', newChannel);
  });

  //socket listeners

  socket.on('new user', (username) => {
    console.log(`${username} has joined the chat`);
    // Add the new user to the online users div
    $('.users-online').append(`<div class="user-online">${username}</div>`);
  })

  socket.on('new msg', (data) => {
    //append to all channels (or only one)
    // $('.message-container').append(`
    // <div class="message">
    //   <p class="message-user">${data.sender}: </p>
    //   <p class="message-text">${data.message}</p>
    // </div>
    // `);

    //Only append the message if the user is currently in that channel
    let currentChannel = $('.channel-current').text();
    if(currentChannel == data.channel) {
      $('.message-container').append(`
        <div class="message">
          <p class="message-user">${data.sender}: </p>
          <p class="message-text">${data.message}</p>
        </div>
      `);
    }
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

    // Add the new channel to the channels list (Fires for all clients)
  socket.on('new channel', (newChannel) => {
    $('.channels').append(`<div class="channel">${newChannel}</div>`);
  });

  // Make the channel joined the current channel. Then load the messages.
  // This only fires for the client who made the channel.
  socket.on('user changed channel', (data) => {
    $('.channel-current').addClass('channel');
    $('.channel-current').removeClass('channel-current');
    $(`.channel:contains('${data.channel}')`).addClass('channel-current');
    $('.channel-current').removeClass('channel');
    $('.message').remove();
    data.messages.forEach((message) => {
      $('.message-container').append(`
        <div class="message">
          <p class="message-user">${message.sender}: </p>
          <p class="message-text">${message.message}</p>
        </div>
      `);
    });
  });

})