document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error('ID do usuário não encontrado.');
        return;
    }

    async function fetchUserData() {
        try {
            const response = await fetch(`http://localhost:3001/api/user/${userId}`);
            if (!response.ok) {
                throw new Error('Erro ao obter dados do usuário');
            }

            const userData = await response.json();
            console.log(userData); // Confirme se os dados estão vindo corretamente.

            if (userData.success && userData.data) {
                if (userData.data.nome) {
                    document.getElementById('nome').value = userData.data.nome;
                } else {
                    console.error('Nome do usuário não encontrado nos dados recebidos:', userData);
                }

                if (userData.data.sobre) {
                    document.getElementById('sobre').value = userData.data.sobre;
                } else {
                    console.error('Descrição sobre o usuário não encontrada nos dados recebidos:', userData);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        }
    }

    async function updateUserData(event) {
        event.preventDefault(); // Para evitar o envio padrão do formulário
        let nome = document.getElementById("nome").value;
        let sobre = document.getElementById("sobre").value;

        if (!nome.trim()) {
            Swal.fire('Erro', 'Por favor, preencha o nome antes de salvar!', 'error');
            return;
        }

        let data = { nome, sobre };
        try {
            const response = await fetch(`http://localhost:3001/api/updateUserProfile/${userId}`, {
                method: "PUT",
                headers: { "Content-type": "application/json;charset=UTF-8" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar perfil');
            }
            const content = await response.json();

            if (content.success) {
                Swal.fire('Perfil atualizado com sucesso!', '', 'success');
            } else {
                Swal.fire('Erro', 'Não foi possível atualizar o perfil!', 'error');
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
        }
    }

    let button = document.getElementById("saveButton");
    button.onclick = updateUserData;  // Ao clicar no botão, chama a função de update

    await fetchUserData();
});
