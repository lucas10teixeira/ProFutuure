document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado e analisado");

    const userEmail = localStorage.getItem('email'); 
    console.log("Email do usuário:", userEmail); 

    const addVideoBtn = document.getElementById('add-video-btn'); 
    const addVideoModal = document.getElementById('add-video-modal');
    const closeBtns = document.querySelectorAll('.close');
    const videoFrame = document.getElementById('video-frame');
    const videoModal = document.getElementById('video-modal');
    const videoGrid = document.getElementById('video-grid');

    // Mostrar botão "Adicionar Vídeo" apenas para admin
    if (userEmail === 'admin@gmail.com') {
        addVideoBtn.style.display = 'block'; 
        console.log("Botão 'Adicionar Vídeo' exibido"); 
    }

    // Função para carregar vídeos do servidor
    const loadVideos = () => {
        fetch('http://localhost:3001/api/videos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar vídeos');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    videoGrid.innerHTML = ''; // Limpa a grid antes de recarregar
                    data.data.forEach(video => {
                        const videoItem = document.createElement('div');
                        videoItem.className = 'video-item';

                        // Criação da estrutura
                        videoItem.innerHTML = `
                            <div class="video-thumbnail">
                                <img src="${video.thumbnail}" alt="Vídeo" class="thumbnail-img">
                                <button class="video-btn" data-video="${video.url}">Assistir</button>
                            </div>
                        `;

                        // Adicionar o botão de exclusão
                        if (userEmail === 'admin@gmail.com') {
                            const deleteButton = document.createElement('button');
                            deleteButton.className = 'delete-video-btn';
                            deleteButton.setAttribute('data-id', video.id);
                            deleteButton.innerText = 'Excluir';
                            deleteButton.style.display = 'block'; // Mudar para 'block' para ocupar toda a largura
                            deleteButton.style.marginTop = '5px'; // Margem para espaçamento
                            deleteButton.style.width = '100%'; // Garantir que o botão ocupe a largura total
                            deleteButton.style.padding = '10px'; // Adicionar padding para tornar o botão maior
                            videoItem.appendChild(deleteButton); // Adiciona o botão ao videoItem

                            // Adicionar evento de exclusão ao botão
                            deleteButton.addEventListener('click', (event) => {
                                const videoId = event.target.getAttribute('data-id');
                                deleteVideo(videoId);
                            });
                        }

                        videoGrid.appendChild(videoItem); // Adiciona o videoItem à grid
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao carregar vídeos:', error);
            });
    };

    // Função para excluir vídeo
    const deleteVideo = (videoId) => {
        fetch(`http://localhost:3001/api/videos/${videoId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir vídeo');
            }
            return response.json();
        })
        .then(data => {
            alert('Vídeo excluído com sucesso!');
            loadVideos(); // Recarrega a lista de vídeos após a exclusão
        })
        .catch(error => {
            console.error('Erro ao excluir vídeo:', error);
        });
    };

    loadVideos(); // Carrega os vídeos assim que a página é carregada

    // Abrir modal de formulário ao clicar no botão "Adicionar Vídeo"
    addVideoBtn.addEventListener('click', () => {
        addVideoModal.style.display = 'flex';
        console.log("Modal de adicionar vídeo aberto");
    });

    // Fechar modais
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            videoModal.style.display = 'none';
            addVideoModal.style.display = 'none';
            videoFrame.src = '';
            console.log("Modal fechado");
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === videoModal || event.target === addVideoModal) {
            videoModal.style.display = 'none';
            addVideoModal.style.display = 'none';
            videoFrame.src = '';
            console.log("Modal fechado ao clicar fora");
        }
    });

    // Abertura do modal de vídeo ao clicar em "Assistir"
    videoGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('video-btn')) {
            const videoUrl = event.target.getAttribute('data-video');
            videoFrame.src = videoUrl;
            videoModal.style.display = 'flex';
            console.log("Modal de vídeo aberto com URL:", videoUrl);
        }
    });

    // Enviar formulário de adicionar vídeo
    const addVideoForm = document.getElementById('add-video-form');
    addVideoForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        const thumbnailInput = document.getElementById('thumbnail');
        const videoUrlInput = document.getElementById('video-url');

        const formData = new FormData();
        formData.append('thumbnail', thumbnailInput.files[0]);
        formData.append('videoUrl', videoUrlInput.value);

        fetch('http://localhost:3001/api/videos', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar vídeo');
            }
            return response.json();
        })
        .then(data => {
            alert('Vídeo adicionado com sucesso!');
            loadVideos(); // Recarrega a lista de vídeos após a adição
            addVideoModal.style.display = 'none'; // Fecha o modal
            thumbnailInput.value = ''; // Limpa o campo de thumbnail
            videoUrlInput.value = ''; // Limpa o campo de URL
        })
        .catch(error => {
            console.error('Erro ao adicionar vídeo:', error);
        });
    });
});
