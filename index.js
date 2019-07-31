const express = require('express');

const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();

server.use(express.json());
server.use(logger);
server.use('/users', userRouter);
server.use('/users/posts', postRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`)
});

server.listen(4000, () => {
    console.log('server listening on port 4000');
});

// custom middleware

function logger(req, res, next) {
    const timestamp = new Date();
  
    console.log(req.method);
    console.log(req.url);
    console.log(timestamp);
    next();
};