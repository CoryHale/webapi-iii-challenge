const express = require('express');
const db = require('./postDb');

const router = express.Router();

router.get('/', async (req, res) => {       // Working
    try {
        const posts = await 
        db.get()
            if (posts) {
                res.status(200).json({ success: true, posts });
            } else {
                res.status(404).json({ success: false, error: 'The posts could not be found.' });
            }
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while retrieving the posts.', err });
    }
});

router.get('/:id', validatePostId, async (req, res) => {        // Working
    const {id} = req.params;

    try {
        const post = await
        db.getById(id);
            if (post) {
                res.status(200).json({ success: true, post });
            } else {
                res.status(404).json({ success: false, error: 'The post with the specified ID does not exist.' });
            }
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while retrieving the post.', err });
    }
});

router.delete('/:id', validatePostId, async (req, res) => {     // Working
    const {id} = req.params;

    try {
        const deleted = await
        db.remove(id);
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({ success: false, error: 'The post with the specified ID does not exist.' });
            }
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while deleting this post.', err });
    }
});

router.put('/:id', validatePostId, async (req, res) => {
    const {id} = req.params;
    const updatedPost = req.body;

    try {
        const updated = await
        db.update(id, updatedPost);
            if (updated) {
                res.status(200).json({ success: true, updated });
            } else {
                res.status(404).json({ success: false, error: 'The post with the specified ID does not exist.' });
            }
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while updating this post.' });
    }
});

// custom middleware

async function validatePostId(req, res, next) {
    try {
        const {id} = req.params;
        const post = await 
        
        db.getById(id);
            if (post) {
                req.post = post;
                next();
            } else {
                res.status(404).json({ message: 'ID not found' });
            }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = router;