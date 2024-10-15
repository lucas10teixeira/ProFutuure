function excluirPostagem(id) {
    const userId = localStorage.getItem('userId');
    const postId = id;
  
    fetch(`http://localhost:3001/api/feed/deletepost/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Resposta do servidor:', data);
      if (data.success) {
        // Se a postagem foi excluída com sucesso, remova-a da página
        const postElement = document.getElementById(`post-${postId}`);
        postElement.remove();
      } else {
        // Se houve um erro, exiba uma mensagem de erro
        Swal.fire('Erro ao excluir postagem!', '', 'error');
      }
    })
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const feedContainer = document.getElementById('feed');
    const userId = localStorage.getItem('userId'); // Obter o ID do usuário
  
    loadPosts(); // Carregar os posts ao inicializar a página
    if (!userId) {
      console.error('ID do usuário não encontrado.');
      return;
    }
  
    async function loadPosts() {
      try {
        const response = await fetch('http://localhost:3001/api/feed/getposts');
        const data = await response.json();
    
        if (data.success) {
          for (const post of data.data) {
            addPost({
              descricao: post.descricao,
              username: post.username,
              id: post.id,
              userId: post.user_id.toString() // Convertendo para string para garantir a comparação correta
            });
          }
        } else {
          console.error('Erro ao carregar postagens:', data.message);
        }
      } catch (error) {
        console.error('Erro ao carregar postagens:', error);
      }
    }
  
    function addPost(post) {
      if (!document.getElementById(`post-${post.id}`)) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.id = `post-${post.id}`;
        
        const loggedInUserId = localStorage.getItem('userId');
        
        let postContent = `
          <p class="post-username"><strong>${post.username}</strong></p>
          <p class="post-content">${post.descricao}</p>
        `;
        
        if (post.userId === loggedInUserId) {
          postContent += `
            <button class="delete-btn" onclick="excluirPostagem(${post.id})">
              <i class="bi bi-trash3-fill"></i>
            </button>
          `;
        }
        
        postElement.innerHTML = postContent;
        feedContainer.prepend(postElement);
      }
    }
  });