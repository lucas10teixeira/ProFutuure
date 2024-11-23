const express = require('express');
const router = express.Router();
const { storefeed, getposts, deletepost } = require('../controller/feedController');
const commentsController = require('../controller/commentController');


/**
 * Rota para criar uma nova postagem no feed.
 */
router.post('/store/feed', storefeed);

/**
 * Rota para obter todas as postagens do feed.
 */
router.get('/feed/getposts', getposts);

/**
 * Rota para excluir uma postagem.
 */
router.delete('/feed/deletepost/:id', deletepost);



// Rota para buscar comentários
router.get('/:postId', commentsController.getComentarios);

// Rota para criar comentário
router.post('/:postId', commentsController.criarComentario);

module.exports = router;





