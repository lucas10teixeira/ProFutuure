const connection = require('../config/db');
const path = require('path');

async function addVideo(req, res) {
    console.log("Requisição recebida para adicionar vídeo:", req.body);
    const { videoUrl } = req.body;
    const thumbnail = req.file; // Obtemos a thumbnail através do Multer

    if (!thumbnail) {
        return res.status(400).json({
            success: false,
            message: "Thumbnail é obrigatória"
        });
    }

    // O caminho da thumbnail será o nome do arquivo
    const thumbnailPath = path.join('/uploads', thumbnail.filename);

    const query = "INSERT INTO videos (thumbnail, url) VALUES (?, ?)";
    connection.query(query, [thumbnailPath, videoUrl], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Erro ao adicionar vídeo",
                data: err
            });
        }
        res.status(201).json({
            success: true,
            message: "Vídeo adicionado com sucesso",
            data: results
        });
    });
}

async function getVideos(req, res) {
    const query = "SELECT * FROM videos";
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Erro ao buscar vídeos",
                data: err
            });
        }
        res.status(200).json({
            success: true,
            data: results
        });
    });
}


async function deleteVideo(req, res) {
    const videoId = req.params.id;

    const query = "DELETE FROM videos WHERE id = ?";
    connection.query(query, [videoId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Erro ao excluir vídeo",
                data: err
            });
        }
        res.status(200).json({
            success: true,
            message: "Vídeo excluído com sucesso"
        });
    });
}



module.exports = {
    addVideo,
    getVideos,
    deleteVideo
};
