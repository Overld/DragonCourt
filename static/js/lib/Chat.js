var Chat = {
	room: 0,
	init: () => {
		$(document).on('click', '#chatMessageSubmit', function(e){
			e.preventDefault();
		
			var text = $('#chatMessageText').val();
			Socket.emit('chat-message', {message : text});
			$('#chatMessageText').val('');
		});
		
		$(document).on('click', '.chatRoomSelect', function(e){
			e.preventDefault();
		
			var thisId = $(this).attr('id'),
				id = thisId.split('-');
			
			$('.chatRoomSelect').removeClass('active');
			$(this).addClass('active');
			
			$('#chatDiv #history').html('');
			Chat.room = id[1];
			Socket.emit('chat-room-change', {destination: Chat.room});
		});
		
		//Listen on new_message
		Socket.on("chat-incoming", (data) => {
			$('#chatDiv #history').append("<p class='message'>" + data.username + ": " + data.message + "</p>");
		});
		
		Socket.on("chat-bulk-incoming", (data) => {
			for(var i = 0; i < data.length; i++){
				$('#chatDiv #history').append("<p class='message'>"+data[i].u_name + ": "+data[i].c_message+ "</p>");
			}
		});
	}
};