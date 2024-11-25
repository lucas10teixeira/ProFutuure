// Função para carregar postagens
async function carregarPostagens() {
  const response = await fetch('http://localhost:3001/api/feed/getposts');
  
  if (response.ok) {
    const dados = await response.json();
    
    if (dados.success) {
      dados.data.forEach(postagem => adicionarPostagem(postagem));
    } else {
      console.error('Erro ao carregar postagens:', dados.message);
    }
  } else {
    console.error('Erro na requisição:', response.status);
  }
}



function adicionarPostagem(postagem) {
  const containerFeed = document.getElementById('feed');
  const usuarioLogadoId = localStorage.getItem('userId');
  
  if (!document.getElementById(`post-${postagem.id}`)) {
    const elementoPostagem = document.createElement('div');
    elementoPostagem.classList.add('post');
    elementoPostagem.id = `post-${postagem.id}`; 
    
    // Validar se username existe, caso contrário exibir 'Usuário desconhecido'
    const username = postagem.username || 'Usuário desconhecido';

    let conteudoPostagem = `
      <p class="post-username" onclick="exibirInformacoesUsuario(${postagem.user_id})"><strong>${postagem.username}</strong></p>
      <p class="post-content">${postagem.descricao}</p>
    `;
    
    // Botão de exclusão apenas para o dono da postagem
    if (postagem.user_id.toString() === usuarioLogadoId) {
      conteudoPostagem += `
        <button class="delete-btn" onclick="excluirPostagem(${postagem.id})">
          <i class="bi bi-trash3-fill"></i> 
        </button>
      `;
    }

    // Ícone de comentário
    conteudoPostagem += `
      <button class="comment-btn" onclick="abrirModalComentarios(${postagem.id})">
        <i class="bi bi-chat-square-text"></i>
      </button>
    `;

    elementoPostagem.innerHTML = conteudoPostagem;
    containerFeed.prepend(elementoPostagem);
  }
}

async function exibirInformacoesUsuario(userId) {
  const response = await fetch(`http://localhost:3001/api/user/${userId}`);
  
  if (response.ok) {
    const dados = await response.json();
    
    if (dados.success && dados.data) {
      const sobreTexto = dados.data.sobre || ""; // se nao houver "sobre" retonar valor vazio
      
      Swal.fire({
        title: `<strong>${dados.data.nome}</strong>`,
        html: `<p><strong>Sobre:</strong> ${sobreTexto}</p>`,
        icon: 'info',
        confirmButtonText: 'Fechar'
      });
    } else {
      console.error('Erro ao buscar dados do usuário:', dados);
    }
  } else {
    console.error('Erro na requisição para buscar dados do usuário:', response.status);
  }
}



// Função para carregar comentários de uma postagem
async function carregarComentarios(postId) {
  const response = await fetch(`http://localhost:3001/api/comments/${postId}`);

  if (response.ok) {
    const dados = await response.json();
    if (dados.success) {
      const comentarios = dados.data;
      comentarios.forEach(comentario => adicionarComentario(postId, comentario));
    }
  } else {
    console.error('Erro ao carregar comentários:', response.status);
  }
}

// Função para abrir o modal de comentários
function abrirModalComentarios(postId) {
  const modal = document.getElementById('comentariosModal');
  modal.style.display = 'block';
  carregarComentariosModal(postId);
  document.getElementById('comentariosPostId').value = postId;
}

// Função para carregar comentários dentro do modal
async function carregarComentariosModal(postId) {
  const response = await fetch(`http://localhost:3001/api/comments/${postId}`);

  if (response.ok) {
    const dados = await response.json();
    if (dados.success) {
      const comentarios = dados.data;
      const comentariosContainer = document.getElementById('modalComentariosContainer');
      comentariosContainer.innerHTML = '';
      comentarios.forEach(comentario => {
        const divComentario = document.createElement('div');
        divComentario.classList.add('modal-comentario');
        divComentario.innerHTML = `<p><strong>${comentario.username}:</strong> ${comentario.content}</p>`;
        comentariosContainer.appendChild(divComentario);
      });
    }
  } else {
    console.error('Erro ao carregar comentários do modal:', response.status);
  }
}

// Função para fechar o modal
function fecharModalComentarios() {
  const modal = document.getElementById('comentariosModal');
  modal.style.display = 'none';
}

// Evento de clique no botão de fechar modal
document.getElementById('fecharModalBtn').addEventListener('click', fecharModalComentarios);

// Evento de enviar comentário do modal
document.getElementById('enviarComentarioBtn').addEventListener('click', enviarComentarioModal);

// Evento de clique no botão de postar
document.getElementById('postButton').addEventListener('click', enviarPost);

// Carregar postagens ao inicializar a página
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('userId')) {
    carregarPostagens();
  } else {
    console.error('ID do usuário não encontrado.');
  }
});


// Função para enviar um novo comentário
async function enviarComentarioModal(event) {
  event.preventDefault();
  const texto = document.getElementById('comentarioTexto').value.trim();
  const postId = document.getElementById('comentariosPostId').value;
  const userId = localStorage.getItem('userId');

  if (texto) {
    const response = await fetch(`http://localhost:3001/api/comments/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto, userId })
    });

    if (response.ok) {
      const dados = await response.json();
      if (dados.success) {
        carregarComentariosModal(postId);
        document.getElementById('comentarioTexto').value = '';
      }
    } else {
      console.error('Erro ao enviar comentário:', response.status);
    }
  }
}

// Fechar modal
function fecharModalComentarios() {
  const modal = document.getElementById('comentariosModal');
  modal.style.display = 'none';
}

// Evento de enviar comentário do modal
document.getElementById('enviarComentarioBtn').addEventListener('click', enviarComentarioModal);
document.getElementById('fecharModalBtn').addEventListener('click', fecharModalComentarios);




// Função para excluir uma postagem
async function excluirPostagem(postId) {
  const usuarioId = localStorage.getItem('userId');
  
  const response = await fetch(`http://localhost:3001/api/feed/deletepost/${postId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: usuarioId })
  });
  
  if (response.ok) {
    const dados = await response.json();
    
    if (dados.success) {
      document.getElementById(`post-${postId}`).remove();
    } else {
      Swal.fire('Erro ao excluir postagem!', '', 'error');
    }
  } else {
    console.error('Erro na requisição para excluir postagem:', response.status);
  }
}


// Função para enviar um novo post
async function enviarPost(event) {
  event.preventDefault();
  const descricao = document.getElementById('posttexto').value;
  const userId = localStorage.getItem('userId');

  if (!descricao) {
    Swal.fire('Preencha todos os campos!', '', 'error');
    return;
  }

  const response = await fetch('http://localhost:3001/api/store/feed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descricao, userId })
  });

  if (response.ok) {
    const dados = await response.json();

    if (dados.success) {
      Swal.fire('Postado com sucesso!', '', 'success');
      document.getElementById('posttexto').value = '';
      carregarPostagens();
    }
  } else {
    console.error('Erro na requisição para enviar post:', response.status);
    Swal.fire('Erro ao postar!', '', 'error');
  }
}

// Evento de clique para enviar uma postagem
document.getElementById('postButton').onclick = enviarPost;

// Carregar as postagens ao inicializar a página
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('userId')) {
    carregarPostagens();
  } else {
    console.error('ID do usuário não encontrado.');
  }
});