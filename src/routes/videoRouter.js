// routes/videoRouter.js
const express = require('express');
const { addVideo, getVideos, deleteVideo } = require('../controller/videoController');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/videos', upload.single('thumbnail'), addVideo);
router.get('/videos', getVideos);
router.delete('/videos/:id', deleteVideo); // Rota para excluir vídeo

module.exports = router;
