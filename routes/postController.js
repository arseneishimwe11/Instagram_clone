const express = require("express");
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Post = require('../models/postSchema');
const Middleware = require('../middleware/checkLogging');

// Configuring Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post('/createpost', Middleware, upload.single('image'), async (req, res) => {
    try {
        const { caption } = req.body;
        const { path } = req.file;

        if (!caption || !path) {
            res.status(422).send({ error: "Fill in all the fields!" });
        }
        console.log(req.user);

        // Upload image to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(path);

        const newPost = new Post({
            imageUrl: cloudinaryResponse.secure_url,
            caption,
            postedBy: req.user._id,
        });

        await newPost.save();

        res.json({ newPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create a new post' });
    }
});

router.get('/allpost', async (req, res) => {
    try {
        const allposts = await Post.find().populate("postedBy", "_id name");
        const postsWithImageURLs = allposts.map(post => {
            return {
                ...post.toObject(),
                imageUrl: cloudinary.url(post.imageUrl)
            }
        });
        res.status(200).json(postsWithImageURLs);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Can't retrieve all posts" });
    }
});

router.get('/mypost', async (req, res) => {
    try {
        const myposts = await Post.find({ postedBy: req.user._id }).populate("postedBy", "_id name");
        const personalPostsUrl = myposts.map(post => {
            return {
                ...post.toObject(),
                imageUrl: cloudinary.url(post.imageUrl)
            }
        })
        res.status(200).json(personalPostsUrl);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Can't find your posts" });
    }
});

module.exports = router;
