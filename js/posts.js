// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveButton').addEventListener('click', savePost);
    document.getElementById('clearFormButton').addEventListener('click', clearPostForm);
    fetchPosts();
});

const urlBack = "https://imprensamalakoff-backend.onrender.com";
const urlFront = "https://imprensamalakoff-frontend.onrender.com";

// Funções principais
async function savePost() {
    const postId = document.getElementById('postIdHidden').value;
    const title = document.getElementById('postTitle').value;
    const subTitle = document.getElementById('postSubTitle').value;
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('myEditor').value;
    const readTime = document.getElementById('postReadTime').value;  // Tempo de leitura (pode ser preenchido manualmente ou calculado)
 
    const token = localStorage.getItem('authToken');

    if (!token) {
        alert('Você não está autenticado. Faça login novamente.');
        return;
    }

    const method = postId ? 'PUT' : 'POST';
    const url = postId ? `${urlBack}/api/posts/${postId}` : `${urlBack}/api/posts`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "title": title,
                "subTitle":subTitle,
                "category": category,
                "content": content,
                "readTime": parseInt(readTime) || 0  // Garantindo que o readTime seja um número
            })
        });

        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
        
        alert(postId ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!');
        clearPostForm();
        fetchPosts();
    } catch (error) {
        console.error('Erro ao salvar o post:', error);
        alert('Erro ao salvar o post.');
    }
}

async function fetchPosts() {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${urlBack}/api/posts`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Falha ao carregar posts');
        
        const posts = await response.json();
        const postsList = document.getElementById('postList');
        postsList.innerHTML = '';
        
        if (!posts.length) {
            postsList.innerHTML = '<p>Nenhum post encontrado</p>';
            return;
        }

        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.classList.add('post-card');
            
            postElement.innerHTML = `
                <div class="post-content">
                    <a href="${urlFront}/posts/${post.slug || post.id}" class="post-link">
                        <div class="post-meta">
                            <span class="post-date">${formatDate(post.date)}</span>
                            <span class="post-category">${post.category || 'Sem categoria'}</span>
                        </div>
                        <h3 class="post-title">${post.title || 'Sem título'}</h3>
                        <p class="post-subtitle">${post.subTitle || ''}</p>
                        <span class="read-time">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            ${post.readTime || 0} min de leitura
                        </span>
                    </a>
                    <div class="post-actions">
                        <button onclick="editPost('${post.id}')" class="action-btn edit-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Editar
                        </button>
                        <button onclick="deletePost('${post.id}')" class="action-btn delete-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Deletar
                        </button>
                    </div>
                </div>
            `;
            
            postsList.appendChild(postElement);
        });
        
    
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar posts.');
    }
}

async function editPost(postId) {
    try {
        const response = await fetch(`${urlBack}/api/posts/${postId}`);
        if (!response.ok) throw new Error('Falha ao carregar post');
        
        const post = await response.json();
        document.getElementById('postIdHidden').value = post.id;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postSubTitle').value = post.subTitle || '';
        document.getElementById('postCategory').value = post.category || '';
        document.getElementById('postReadTime').value = post.readTime || '';  // Carregar o tempo de leitura
        document.getElementById('myEditor').value = post.content || '';
    } catch (error) {
        console.error('Erro ao carregar post:', error);
        alert('Erro ao carregar post para edição.');
    }
}

async function deletePost(postId) {
    if (!confirm('Tem certeza que deseja deletar este post?')) return;

    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${urlBack}/api/posts/${postId}`, {
            method: 'DELETE',
            headers: {
            }
        });

        if (!response.ok) throw new Error('Falha ao deletar o post');
        
        alert('Post deletado com sucesso!');
        fetchPosts();
    } catch (error) {
        console.error('Erro ao deletar post:', error);
        alert('Erro ao deletar o post.');
    }
}

function clearPostForm() {
    document.getElementById('postIdHidden').value = '';
    document.getElementById('postTitle').value = '';
    document.getElementById('postSubTitle').value = '';
    document.getElementById('postCategory').value = '';
    document.getElementById('postReadTime').value = '';  // Limpar o tempo de leitura
    document.getElementById('myEditor').value = '';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}
