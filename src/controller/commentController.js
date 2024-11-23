const connection = require('../config/db');

// Função para obter os comentários de uma postagem
async function getComentarios(request, response) {
  const postId = request.params.postId;
  const query = "SELECT c.id, c.content, t.nome AS username FROM comments c INNER JOIN task t ON c.user_id = t.id WHERE c.post_id = ?";
  
  connection.query(query, [postId], (err, results) => {
    if (err) {
      return response.status(500).json({
        success: false,
        message: "Erro ao buscar comentários",
        data: err
      });
    }
    return response.status(200).json({
      success: true,
      data: results
    });
  });
}

// Função para criar um comentário
async function criarComentario(request, response) {
  const { texto, userId } = request.body;
  const postId = request.params.postId;

  const query = "INSERT INTO comments (content, user_id, post_id) VALUES (?, ?, ?)";
  connection.query(query, [texto, userId, postId], (err, result) => {
    if (err) {
      return response.status(500).json({
        success: false,
        message: "Erro ao criar comentário",
        data: err
      });
    }
    return response.status(201).json({
      success: true,
      message: "Comentário adicionado com sucesso"
    });
  });
}

module.exports = {
  getComentarios,
  criarComentario
};
