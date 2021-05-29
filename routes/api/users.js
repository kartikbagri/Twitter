// ********** Importing Modules **********
const express = require('express');
const User = require('../../schema/userSchema');


// ********** Using Modules **********
const router = express.Router();


// ********** Patch Request: /api/users/_id_/follow **********
router.patch('/:id/follow', async function(req, res) {
    const userId = req.params.id;
    const userLoggedIn = req.session.user._id;
    const user = await User.findById(userId);
    if(!user) {
        return res.sendStatus(404);
    }
    const isFollowing = user.followers?.includes(userLoggedIn);
    const option = isFollowing? '$pull' : '$addToSet';
    req.session.user = await User.findByIdAndUpdate(userLoggedIn,
        {[option]: {following: userId}},
        {new: true}).catch(function(err) {
            console.log(err);
            res.sendStatus(400);
    });
    User.findByIdAndUpdate(userId, {[option]: {followers: userLoggedIn}})
    .catch(function(err) {
        console.log(err);
        res.sendStatus(400);
    });
    res.status(200).send(req.session.user);
})


// ********** Get Request: /api/users/_id_/following **********
router.get('/:id/following', function(req, res) {
    User.findById(req.params.id)
    .populate('following')
    .then(function(users) {
        res.status(200);
        res.send(users);
    })
    .catch(function(err) {
        console.log(err);
        res.sendStatus(400);
    })
});


// ********** Get Request: /api/users/_id_/followers **********
router.get('/:id/followers', function(req, res) {
    User.findById(req.params.id)
    .populate('followers')
    .then(function(users) {
        res.status(200);
        res.send(users);
    })
    .catch(function(err) {
        console.log(err);
        res.sendStatus(400);
    })
});


module.exports = router;