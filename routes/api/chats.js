// ********** Importing Modules **********
const express = require('express');
const Chat = require('../../schema/chatSchema');


// ********** Using Modules **********
const router = express.Router();


// ********** Post Request: /api/posts/ **********
router.get('/', function(req, res) {
    Chat.find({users: {$elemMatch: {$eq: req.session.user._id}}})
    .populate('users')
    .then(function(chats) {
        res.status(200).send(chats);
    }).catch(function() {
        res.sendStatus(400);
    })
});


// ********** Post Request: /api/posts/ **********
router.post('/', function(req, res) {
    if(!req.body.users) {
        console.log('Users params not sent with the request');
        return res.sendStatus(400);
    }
    const users = JSON.parse(req.body.users);
    if(users.length === 0) {
        console.log('User array empty');
        return res.sendStatus(400);
    }
    users.push(req.session.user);
    const chatData = new Chat({
        users: users,
        isGroupChat: true
    });
    chatData.save().then(function(chat) {
        res.status(200).send(chat)
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(400);
    });
});

module.exports = router;