document.getElementById('saveButton').addEventListener('click', savePost);
document.getElementById('clearFormButton').addEventListener('click', clearPostForm);

function savePost() {
    console.log("Entrou na função de salvar.");

    const postId = document.getElementById('postIdHidden').value;
    const title = document.getElementById('postTitle').value;
    const subTitle = document.getElementById('postSubTitle').value;
    const category = document.getElementById('postCategory').value;
    const content = quill.getText();
    const token = localStorage.getItem('authToken');

    // Verifica se o token de autenticação está presente
    if (!token) {
        alert('Você não está autenticado. Faça login novamente.');
        return;
    }

    const method = postId ? 'PUT' : 'POST'; // Define o método conforme a existência do postId
    const url = postId ? `http://localhost:8080/api/posts/${postId}` : 'http://localhost:8080/api/posts';

    // Realiza a requisição para salvar o post
    console.log(postId, method)
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "title": title,
            "subTitle": subTitle,
            "category": category,
            "content": content
        })
    })
    .then(response => {
        console.log(response);
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log('Post salvo com sucesso:', data);
        alert(postId ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!');
        clearPostForm(); // Limpa o formulário após salvar
        fetchPosts(); // Recarrega os posts
    })
    .catch(err => {
        console.error('Erro ao salvar o post:', err);
        alert('Erro ao salvar o post. Verifique o console para mais detalhes.');
    });
}

function clearPostForm() {
    // Limpa os campos do formulário
    document.getElementById('postIdHidden').value = '';
    document.getElementById('postTitle').value = '';
    document.getElementById('postSubTitle').value = '';
    document.getElementById('postCategory').value = '';
    quill.setText('');
}

function editPost(postId) {
    // Preenche o formulário com os dados do post para edição
    console.log(postId);
    fetch(`http://localhost:8080/api/posts/${postId}`)
        .then(response => {
            if (!response.ok) throw new Error('Falha ao carregar posts');
            return response.json();
        })
        .then(post => {
            console.log(post)
            document.getElementById('postIdHidden').value = post.id;
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postSubTitle').value = post.subTitle || '';
            document.getElementById('postCategory').value = post.category || '';
            quill.setText(post.content);
        })
        .catch(error => console.error('Erro ao carregar post:', error));
}

function fetchPosts() {
    const token = localStorage.getItem('authToken');

    // Realiza a requisição para buscar os posts
    fetch('http://localhost:8080/api/posts', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        console.log(response)
        if (!response.ok) throw new Error('Falha ao carregar posts');
        return response.json();
    })
    .then(posts => {
        const postsList = document.getElementById('postList');
        postsList.innerHTML = ''; // Limpa a lista de posts antes de adicionar os novos
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post-item'); // Adiciona uma classe para estilização (opcional)
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${formatDate(post.createdAt)}</p>
                <button onclick="editPost(${post.id})">Editar</button>
                <button onclick="deletePost(${post.id})" class="delete-btn">Deletar</button>
            `;
            postsList.appendChild(postElement);
        });
    })
    .catch(err => {
        console.error(err);
        alert('Erro ao carregar posts.');
    });
}

function deletePost(postId) {
    console.log("entrou")
    if (!confirm('Tem certeza que deseja deletar este post?')) return;

    const token = localStorage.getItem('authToken');

    // Realiza a requisição para deletar o post
    fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Falha ao deletar o post');
        alert('Post deletado com sucesso!');
        fetchPosts(); // Recarrega os posts após deletar
    })
    .catch(err => {
        console.error(err);
        alert('Erro ao deletar o post.');
    });
}

function loadPostForEditing(post) {
    // Preenche o formulário de edição com os dados do post
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postSubTitle').value = post.subTitle;
    document.getElementById('postCategory').value = post.category;
    quill.root.innerHTML = post.content; // Se estiver usando o Quill como editor
    document.getElementById('saveButton').setAttribute('data-id', post.id);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
  
    return date.toLocaleString('pt-BR', options);
}
