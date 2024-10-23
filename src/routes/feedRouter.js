const express = require('express');
const router = express.Router();
const { storefeed } = require('../controller/feedController');
 
// Rota para criar um novo post no feed
router.post('/store/feed', storefeed);
/**
* @swagger
* /feed/feed:
*   post:
*     summary: postagens do feed
*     responses:
*       200:
*         description: postagens do feed
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*/
 
module.exports = router;