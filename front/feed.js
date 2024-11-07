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

// Função para adicionar uma postagem
function adicionarPostagem(postagem) {
  const containerFeed = document.getElementById('feed');
  const usuarioLogadoId = localStorage.getItem('userId');
  
  if (!document.getElementById(`post-${postagem.id}`)) {
    const elementoPostagem = document.createElement('div');
    elementoPostagem.classList.add('post');
    elementoPostagem.id = `post-${postagem.id}`;

    let conteudoPostagem = `
      <p class="post-username" onclick="exibirInformacoesUsuario(${postagem.user_id})"><strong>${postagem.username}</strong></p>
      <p class="post-content">${postagem.descricao}</p>
    `;
    
    // Verificar se o usuário logado é o dono da postagem
    if (postagem.user_id.toString() === usuarioLogadoId) {
      conteudoPostagem += `
        <button class="delete-btn" onclick="excluirPostagem(${postagem.id})">
          <i class="bi bi-trash3-fill"></i> 
        </button>
      `;
    }

    elementoPostagem.innerHTML = conteudoPostagem;
    containerFeed.prepend(elementoPostagem);
  }
}

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

// Função para exibir informações do usuário
async function exibirInformacoesUsuario(userId) {
  const response = await fetch(`http://localhost:3001/api/user/${userId}`);
  
  if (response.ok) {
    const dados = await response.json();
    
    if (dados.success && dados.data) {
      Swal.fire({
        title: `<strong>${dados.data.nome}</strong>`,
        html: `<p><strong>Sobre:</strong> ${dados.data.sobre}</p>`,
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
