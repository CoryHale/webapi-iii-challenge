const express = require('express');
const db = require('./userDb');
const postDB = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {      // Working
    const user = req.user;

    db.insert(user)
        .then(users => {
            res.status(201).json({ success: true, users });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: 'There was an error while posting the user', err });
        })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {     // Working
    const post = {text: req.body.text, user_id: req.params.id}

    postDB.insert(post)
        .then(posts => {
            res.status(201).json({ success: true, posts });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: 'There was an error while posting the post.', err });
        })
});

router.get('/', async (req, res) => {       // Working
    try {
        const users = await
        db.get();
            res.status(200).json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while retrieving the users', err });
    }
});

router.get('/:id', validateUserId, async (req, res) => {        // Working
    const {id} = req.params;

    try {
        const user = await
        db.getById(id)
            res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while retrieving the user', err });
    }
});

router.get('/:id/posts', validateUserId, async (req, res) => {      // Working
    const {id} = req.params;

    try {
        const posts = await
        db.getUserPosts(id)
            res.status(200).json({ success: true, posts });
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while retrieving the posts', err });
    }
});

router.delete('/:id', validateUserId, async (req, res) => {     // Working
    const {id} = req.params;

    try {
        const deleted = await
        db.remove(id)
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({ success: false, error: 'ID not found' });
            }
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while deleting the user', err });
    }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {      // Working
    const {id} = req.params;
    const updated = req.body;

    db.update(id, updated)
        .then(users => {
            res.status(200).json({ success: true, users })
        })
        .catch(err => {
            res.status(500).json({ success: false, error: 'There was an error while updating the user', err });
        })
});

//custom middleware

async function validateUserId(req, res, next) {
    try {
        const {id} = req.params;
        const user = await

        db.getById(id)
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(400).json({ message: 'invalid user id' })
            }
    } catch (err) {
        res.status(500).json({ error: 'There was a problem while retrieving the user.', err });
    }
};

function validateUser(req, res, next) {
    const user = req.body;
        
    if (!user) {
        res.status(400).json({ message: 'missing user data' });
    } else {
        if (user.name) {
            req.user = user;
            next();
        } else {
            res.status(400).json({ message: 'missing required text field' });
        }
    }
};

function validatePost(req, res, next) {
    const post = req.body;

    if (!post) {
        res.status(400).json({ message: 'missing post data' });
    } else {
        if (post.text) {
            req.post = post;
            next();
        } else {
            res.status(400).json({ message: 'missing required text field' });
        }
    }
};

module.exports = router;
