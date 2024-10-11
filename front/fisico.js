document.addEventListener('DOMContentLoaded', () => {
    const videoBtns = document.querySelectorAll('.video-btn');
    const modal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close');
    const videoFrame = document.getElementById('video-frame');

    videoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const videoUrl = btn.getAttribute('data-video');
            videoFrame.src = videoUrl;
            modal.style.display = 'flex';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        videoFrame.src = '';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            videoFrame.src = '';
        }
    });
});


