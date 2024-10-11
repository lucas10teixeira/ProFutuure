let button = document.getElementById("postButton");

button.onclick = async function() {
    let descricao = document.getElementById("posttexto").value;
    let userId = localStorage.getItem('userId'); // Obter o ID do usuário de alguma forma
    let data = { descricao, userId };

    if (!descricao) {
        Swal.fire('Preencha todos os campos!', '', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/store/feed', {
            method: "POST",
            headers: { "Content-type": "application/json;charset=UTF-8" },
            body: JSON.stringify(data)
        });

        let content = await response.json();
        console.log(content);

        if (content.sucess) {
            Swal.fire('Postado!', '', 'success');
            document.getElementById("posttexto").value = ''; // Limpa o campo de texto após o post

            // Chama a função para carregar posts após um novo post ser criado
            loadPosts(); // Certifique-se de que loadPosts() é acessível aqui
        }
    } catch (error) {
        console.error('Erro ao enviar o post:', error);
        Swal.fire('Erro ao postar!', '', 'error');
    }
};
