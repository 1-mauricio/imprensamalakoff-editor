
document.getElementById('loginButton').addEventListener('click', function () {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const loginData = {
        "username": username.toString(),
        "password": password.toString()
    };

    console.log(loginData);

    // Usando superagent para fazer a requisição POST
    superagent.post('https://imprensamalakoff-backend.onrender.com/auth/login')
        .send(loginData)  // Envia os dados do login
        .set('Content-Type', 'application/json') // Define o cabeçalho para JSON
        .then(response => {
            console.log(response);
            // Caso a resposta seja bem-sucedida
            if (response.status === 200) {
                localStorage.setItem('authToken', response.body.token); // Salva o token
                alert('Login bem-sucedido!');
                toggleView();
                fetchPosts();
            }
        })
        .catch(error => {
            console.log(error);
            alert('Falha no login.');
        });
});
/**
 * Função para alternar entre as telas de login e editor.
 */
function toggleView() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'block';
    //fetchPosts(); // Carrega os posts ao abrir o editor
}

/**
 * Função para logout.
 */
document.getElementById('logoutButton').addEventListener('click', function () {
    console.log('ent')
    localStorage.removeItem('authToken'); // Remove o token do localStorage
    alert('Você saiu com sucesso!');
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('mainContainer').style.display = 'none'; // Mostra novamente a tela de login
});