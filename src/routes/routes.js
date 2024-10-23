const express = require('express');
const router = express.Router();
const profileController = require('../controller/profileController');
 
router.get('/user/:id', profileController.getUserProfile);
/**
* @swagger
* /user/:id:
*   get:
*     summary: Retorna o id do usuario para editar perfil
*     responses:
*       200:
*         description: Retorna o id do usuario para editar perfil
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*/
router.put('/updateUserProfile/:id', profileController.updateUserProfile);
/**
* @swagger
* /updateUserProfile/:id:
*   put:
*     summary: atualizar perfil ao editar
*     responses:
*       200:
*         description: atualizar perfil
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*/
 
module.exports = router;