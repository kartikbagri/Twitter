// ********** Importing Modules **********
const express = require('express');;


// ********** Using Modules **********
const router = express.Router();


// ********** Get Request: /messages/ **********
router.get('/', function(req, res) {
    const payload = {
        pageTitle: 'Inbox',
        userLoggedIn: req.session.user,
    };
    res.status(200).render('inboxPage', payload);
});

// ********** Get Request: /messages/ **********
router.get('/new', function(req, res) {
    const payload = {
        pageTitle: 'New Message',
        userLoggedIn: req.session.user,
    };
    res.status(200).render('newMessage', payload);
});


// ********** Get Request: /messages/_chatId_ **********
router.get('/:chatId', function(req, res) {
    const payload = {
        pageTitle: 'Chat',
        userLoggedIn: req.session.user,
    };
    res.status(200).render('chatPage', payload);
});


module.exports = router;