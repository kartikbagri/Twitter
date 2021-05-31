$(document).ready(function() {
    $.get(`/api/chats/${JSON.parse(chat)._id}`, function(resultChat) {
        document.getElementById('chatName').innerText = getChatName(resultChat);
    });
});

// Chat Name Modal
function openModal(modalName) {
    document.querySelector('.backdrop').classList.add('modal-show');
    document.getElementById(`${modalName}Modal`).classList.add('modal-show');
    document.getElementById('chatNameSubmitButton').setAttribute('data-chatid', JSON.parse(chat)._id);
}

// Modals Closing
function closeModal(modalName) {
    document.getElementById(`${modalName}Modal`).classList.add('slide-up');
    setTimeout(function() {
        document.querySelector('.backdrop').classList.remove('modal-show');
        document.getElementById(`${modalName}Modal`).classList.remove('modal-show');
        document.getElementById(`${modalName}Modal`).classList.remove('slide-up');
    }, 150);
}

// Closing all the modals
document.querySelector('.backdrop').addEventListener('click', function() {
    document.querySelectorAll('.modal').forEach(function(modal) {
        document.querySelector('.backdrop').classList.remove('modal-show');
        modal.classList.remove('modal-show');
    })
})

// Changing the chat Name
$(document).on('click', '#chatName', function(event) {
    openModal('chatName');
});

// Handling the clicking of chat Name
const chatNameSubmitBtn = document.getElementById('chatNameSubmitButton')
chatNameSubmitBtn.addEventListener('click', function () {
    console.log(chatNameSubmitBtn.dataset);
    const chatId = chatNameSubmitBtn.dataset.chatid;
    const newName = document.getElementById('chatNameTextbox').value;
    console.log(newName);
    $.ajax({
        url: `/api/chats/${chatId}`,
        type: 'PATCH',
        data: {
            chatName: newName
        },
        success: function () {
            location.reload();
        }
    });
});

// Closing the change Name Modal
document.getElementById('chatNameCloseModal').addEventListener('click', function() {
    closeModal('chatName');
})

const users = JSON.parse(chat).users;

function getChatImageElement(chat) {
    let groupChatClass = '';
    let chatImage = getUserChatImageElement(chat.users[0]);
    if(chat.isGroupChat) {
        groupChatClass = 'chat-group-chat-img';
        if(chat.users.length > 3) {
            chatImage = `<span class="other-users-num">+ ${chat.users.length - 3}</span>` + chatImage;
        }
        for(let i = 1; i < chat.users.length; i++) {
            if(i >= 3) {
                break;
            }
            chatImage += getUserChatImageElement(chat.users[i]);
        }
    }
    return `<div class="chat-results-image-container ${groupChatClass}">${chatImage}</div> `
}

function getOtherChatUsers(users) {
    if(users.length === 1) {
        return users;
    }
    return users.filter(function(user) {
        return (user._id != JSON.parse(userLoggedIn)._id);
    });
}

function getUserChatImageElement(user) {
    if(!user || !user.profilePic) {
        return console.log('User passed into function is invalid');
    }
    return `<img src="${user.profilePic}" alt="User's Profile Picture">`;
}

function getChatName(chat) {
    const chatName = chat.chatName;
    if(!chatName) {
        const otherChatUsers = getOtherChatUsers(chat.users);
        const namesArray = otherChatUsers.map(user => `${user.firstName} ${user.lastName}`);
        return namesArray.join(', ');
    } else {
        return chatName;
    }
}

document.querySelector('.chat-titlebar-container').insertAdjacentHTML('afterbegin', getChatImageElement(JSON.parse(chat)))