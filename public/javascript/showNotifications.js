$(document).ready(function() {
    refreshMessagesBadge();
    refreshNotificationsBadge();
});

function messageReceived(newMessage) {
    if($('.chat-container').length == 0) {
        // Show Popup
    }
    else {
        addChatMessageHTML(newMessage);
        scrollToBottom(true);
    }
    refreshMessagesBadge();
}

function refreshMessagesBadge() {
    $.get('/api/chats', {unreadOnly: true}, function(data) {
        const numResults = data.length;
        if(numResults > 0) {
            $('#messagesBadge').text(numResults).addClass('active');
        } else {
            $('#messagesBadge').text('').removeClass('active');
        }
    }) 
}

function refreshNotificationsBadge() {
    $.get('/api/notifications', {unreadOnly: true}, function(data) {
        const numResults = data.length;
        console.log(data.length);
        if(numResults > 0) {
            $('#notificationsBadge').text(numResults).addClass('active');
        } else {
            $('#notificationsBadge').text('').removeClass('active');
        }
    }) 
}