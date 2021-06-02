// ********** Importing Modules **********
const express = require('express');
const Message = require('../../schema/messageSchema');
const User = require('../../schema/userSchema');
const Chat = require('../../schema/chatSchema');


// ********** Using Modules **********
const router = express.Router();


// ********** Post Request: /api/messages/ **********
router.post('/', function(req, res) {
    if(!req.body.content || !req.body.chatId) {
        console.log('Invalid data passed into request');
        return res.sendStatus(400);
    }
    const newMessage = new Message({
        sender: req.session.user._id,
        content: req.body.content,
        chat: req.body.chatId
    });
    newMessage.save()
    .then(async function(newMessage) {
        newMessage = await newMessage.populate('sender').execPopulate();
        newMessage = await newMessage.populate('chat').execPopulate();
        newMessage = await User.populate(newMessage, {path: 'chat.users'});
        const chatLatest = await Chat.findByIdAndUpdate(req.body.chatId, {latestMessage: newMessage._id})
        res.status(201).send(newMessage);
    })
    .catch(function(err) {
        console.log(err);
        res.sendStatus(400);
    });
});

module.exports = router;