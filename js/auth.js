document.getElementById('loginButton').addEventListener('click', function () {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const loginData = {
        "username": username.toString(),
        "password": password.toString()
    };

    console.log(loginData)

    fetch('https://imprensamalakoff-backend.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        console.log(response)
        if (!response.ok) throw new Error('Login falhou');
        return response.json();
    })
    .then(data => {
        localStorage.setItem('authToken', data.token); // Salva o token
        alert('Login bem-sucedido!');
        toggleView();
        fetchPosts();
    })
    .catch(err => {
        console.log(err);
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