document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado e analisado");

    // Elementos da página
    const userEmail = localStorage.getItem('email');
    const addVideoBtn = document.getElementById('add-video-btn');
    const addVideoModal = document.getElementById('add-video-modal');
    const closeBtns = document.querySelectorAll('.close');
    const videoFrame = document.getElementById('video-frame');
    const videoModal = document.getElementById('video-modal');
    const videoGrid = document.getElementById('video-grid');
    const addVideoForm = document.getElementById('add-video-form');

    // Mostrar botão "Adicionar Vídeo" apenas para admin
    if (userEmail === 'admin@gmail.com') {
        addVideoBtn.style.display = 'block';
        console.log("Botão 'Adicionar Vídeo' exibido");
    }

    // Função para carregar vídeos do servidor
    const loadVideos = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/videos');
            if (!response.ok) throw new Error('Erro ao buscar vídeos');
            const data = await response.json();

            if (data.success) {
                videoGrid.innerHTML = ''; // Limpa a grid antes de recarregar
                data.data.forEach(video => renderVideo(video));
            }
        } catch (error) {
            console.error('Erro ao carregar vídeos:', error);
        }
    };

    // Função para renderizar um vídeo na grid
    const renderVideo = (video) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';

        videoItem.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="Vídeo" class="thumbnail-img">
                <button class="video-btn" data-video="${video.url}">Assistir</button>
            </div>
        `;

        // Adicionar o botão de exclusão se for admin
        if (userEmail === 'admin@gmail.com') {
            addDeleteButton(videoItem, video.id);
        }

        videoGrid.appendChild(videoItem);
    };

    // Função para adicionar o botão de excluir vídeo
    const addDeleteButton = (videoItem, videoId) => {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-video-btn';
        deleteButton.setAttribute('data-id', videoId);
        deleteButton.innerText = 'Excluir';
        deleteButton.style.display = 'block';
        deleteButton.style.marginTop = '5px';
        deleteButton.style.width = '100%';
        deleteButton.style.padding = '10px';
        videoItem.appendChild(deleteButton);

        // Adicionar evento de exclusão ao botão
        deleteButton.addEventListener('click', (event) => {
            const videoId = event.target.getAttribute('data-id');
            deleteVideo(videoId);
        });
    };

    // Função para excluir vídeo
    const deleteVideo = async (videoId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/videos/${videoId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao excluir vídeo');
            const data = await response.json();
            alert('Vídeo excluído com sucesso!');
            loadVideos(); // Recarrega a lista de vídeos após a exclusão
        } catch (error) {
            console.error('Erro ao excluir vídeo:', error);
        }
    };

    // Abrir modal de formulário ao clicar no botão "Adicionar Vídeo"
    addVideoBtn.addEventListener('click', () => {
        addVideoModal.style.display = 'flex';
        console.log("Modal de adicionar vídeo aberto");
    });

    // Fechar modais
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => closeModals());
    });

    window.addEventListener('click', (event) => {
        if (event.target === videoModal || event.target === addVideoModal) {
            closeModals();
        }
    });

    // Função para fechar modais
    const closeModals = () => {
        videoModal.style.display = 'none';
        addVideoModal.style.display = 'none';
        videoFrame.src = '';
        console.log("Modal fechado");
    };

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
    addVideoForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        const thumbnailInput = document.getElementById('thumbnail');
        const videoUrlInput = document.getElementById('video-url');
        const formData = new FormData();
        formData.append('thumbnail', thumbnailInput.files[0]);
        formData.append('videoUrl', videoUrlInput.value);

        try {
            const response = await fetch('http://localhost:3001/api/videos', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Erro ao adicionar vídeo');
            const data = await response.json();
            alert('Vídeo adicionado com sucesso!');
            loadVideos(); // Recarrega a lista de vídeos após a adição
            addVideoModal.style.display = 'none'; // Fecha o modal
            thumbnailInput.value = ''; // Limpa o campo de thumbnail
            videoUrlInput.value = ''; // Limpa o campo de URL
        } catch (error) {
            console.error('Erro ao adicionar vídeo:', error);
        }
    });

    loadVideos(); // Carrega os vídeos assim que a página é carregada
});
