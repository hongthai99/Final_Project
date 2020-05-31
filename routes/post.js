const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const identifyUserLogin = require('../middleware/identifyUserLogin');
const Post = mongoose.model("Post")

//make create post schema and post route
//@route POST /createnewsfeed
//@desc post picture, title, body newsfeed
//access Private
router.post('/createnewsfeed',identifyUserLogin,(req, res, next) => {
    const { title, body, pic} = req.body
    
    if(!title || !body || !pic ){
        return res.status(400).json({error: 'Please add into fileds'});
    }
    //make no have password respone
    req.user.password=undefined
    const post = new Post({
        title,
        body,
        picture:pic,
        postedBy:req.user
    })
    post.save()
        .then(result => {
            res.json({post:result})
        })
        .catch(err => {
            console.log(err)
        })
})

//make create get all newsfeed route
//@route GET /createnewsfeed
//@desc GET newsfeed
//access Private

router.get('/newsfeed',identifyUserLogin, (req, res, next) => {
    Post.find()
        // populate use for get user id and user name post newfeed
        .populate("postedBy","_id name") 
        .then(posts => {
            res.json({posts})
        })
        .catch(err => {
            console.log(err)
        })
})

//make create get my newsfeed route
//@route GET /mynewsfeed
//@desc GET my newsfeed
//access Private

router.get('/mynewsfeed',identifyUserLogin, (req, res, next) => {
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .then(mynewsfeed => {
        res.json({mynewsfeed})
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router;