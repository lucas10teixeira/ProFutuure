const connection = require('../config/db');
const dotenv = require('dotenv').config();

async function storefeed(request, response) {
  const { descricao } = request.body;

  const query = "INSERT INTO feed (descricao) VALUES (?)";
  connection.query(query, [descricao], (err, results) => {
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
  const query = "SELECT id, descricao FROM feed";

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