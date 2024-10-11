const express = require('express');
const router = express.Router();
const { storefeed } = require('../controller/feedController');
const { getposts } = require('../controller/feedController');
const { deletepost } = require('../controller/feedController');
// Rota para criar um novo post no feed
router.post('/store/feed', storefeed);
router.get('/feed/getposts', getposts)

router.delete('/feed/deletepost/:id', deletepost);

module.exports = router;
