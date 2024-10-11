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
              addPost({ descricao: post.descricao, username: post.username, id: post.id });
            }
          } else {
            console.error('Erro ao carregar postagens:', data.message);
          }
        } catch (error) {
          console.error('Erro ao carregar postagens:', error);
        }
      }
      

    async function fetchUserNameById(userId) {
        try {
            const response = await fetch(`http://localhost:3001/api/user/${userId}`);
            const userData = await response.json();
            return userData.success ? userData.data.nome : 'Usuário Desconhecido';
        } catch (error) {
            console.error('Erro ao buscar nome do usuário:', error);
            return 'Usuário Desconhecido';
        }
    }

    function addPost(post) {
        // Verificar se o post já está no feed para evitar duplicações
        if (!document.getElementById(`post-${post.id}`)) {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.id = `post-${post.id}`; // Atribuir um ID único ao post
            postElement.innerHTML = `<p><strong>${post.username}</strong></p><p>${post.descricao}</p>`;
            feedContainer.prepend(postElement); // Adiciona o novo post ao início do feed
        }
    }
});
