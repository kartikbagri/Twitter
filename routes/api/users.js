// ********** Importing Modules **********
const express = require('express');
const User = require('../../schema/userSchema');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})
const path = require('path');
const fs = require('fs');


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


// ********** Get Request: /api/users/search/_value_ **********
router.get('/search/:value', async function(req, res) {
    const posts = await User.find({ $or: [
        {firstName: {$regex: req.params.value, $options: 'i' }},
        {lastName: {$regex: req.params.value, $options: 'i' }},
        {username: {$regex: req.params.value, $options: 'i' }},
    ]});
    if(posts === null) {
        res.sendStatus(400);
    }
    else {
        posts.sort(function(a, b) {
            return a.createdAt - b.createdAt;
        });
        res.status(201).send(posts);
    }
});



// ********** Post Request: /api/users/profilePicture/ **********
router.post('/profilePicture', upload.single('croppedImage'), function(req, res) {
    if(!req.file) {
        console.log('No file uploaded with the ajax request');
        return res.sendStatus(400);
    }
    const filePath = `/uploads/images/${req.file.filename}.png`;
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `../../${filePath}`);
    fs.rename(tempPath, targetPath, async function(err) {
        if(err){
            console.log(err);
            return res.sendStatus(400);
        }
        req.session.user = await User.findByIdAndUpdate(req.session.user._id,{profilePic: filePath}, {new: true});
        res.sendStatus(204);
    });
});


// ********** Post Request: /api/users/coverPhoto/ **********
router.post('/coverPhoto', upload.single('croppedImage'), function(req, res) {
    if(!req.file) {
        console.log('No file uploaded with the ajax request');
        return res.sendStatus(400);
    }
    const filePath = `/uploads/images/${req.file.filename}.png`;
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `../../${filePath}`);
    fs.rename(tempPath, targetPath, async function(err) {
        if(err){
            console.log(err);
            return res.sendStatus(400);
        }
        req.session.user = await User.findByIdAndUpdate(req.session.user._id,{coverPhoto: filePath}, {new: true});
        res.sendStatus(204);
    });
});


module.exports = router;