const { Router } = require('express');
const router = Router();
 
const { storeTask, loginUser } = require('../controller/taskController');
 
router.post('/store/task', storeTask);
/**
* @swagger
* /store/task:
*   post:
*     summary: cadastro
*     responses:
*       200:
*         description: cadastrar usuario e inserir no banco
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*/
router.post('/login', loginUser);
/**
* @swagger
* /login/user:
*   post:
*     summary: testar se o usuario ta no banco para o login
*     responses:
*       200:
*         description: login
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*/
router.get('get/user/profile')
/**
* @swagger
* /user/profile:
*   get:
*     summary: puxar dados para o perfil
*     responses:
*       200:
*         description: editar perfil
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*/
 
module.exports = router;
 