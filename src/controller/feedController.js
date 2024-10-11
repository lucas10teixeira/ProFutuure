const connection = require('../config/db');
const dotenv = require('dotenv').config();


async function storefeed(request, response) {
  const { descricao, userId } = request.body;

  const query = "INSERT INTO feed (descricao, user_id) VALUES (?, ?)";
  connection.query(query, [descricao, userId], (err, results) => {
    if (err) {
      return response.status(400).json({
        success: false,
        message: "Ops, deu problema ao salvar o post!",
        data: err
      });
    }
    response.status(201).json({
      success: true,
      message: "Post salvo com sucesso!",
      data: results
    });
  });
}

async function getposts(request, response) {
  const query = "SELECT f.id, f.descricao, t.nome AS username FROM feed f INNER JOIN task t ON f.user_id = t.id";

  connection.query(query, (err, results) => {
    if (err) {
      return response.status(500).json({
        success: false,
        message: "Erro ao buscar posts",
        data: err
      });
    }
    return response.status(200).json({
      success: true,
      data: results
    });
  });
}

async function deletepost(request, response) {
  const { id } = request.params;

  const query = "DELETE FROM feed WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      return response.status(400).json({
        success: false,
        message: "Ops, deu problema ao excluir o post!",
        data: err
      });
    }
    response.status(200).json({
      success: true,
      message: "Post excluído com sucesso!",
      data: results
    });
  });
}

module.exports = {
  storefeed,
  getposts,
  deletepost
};